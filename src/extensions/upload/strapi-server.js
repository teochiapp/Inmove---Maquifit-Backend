'use strict';

const os = require('os');
const path = require('path');
const fse = require('fs-extra');
const sharp = require('sharp');
const { file: fileUtils } = require('@strapi/utils');

const { bytesToKbytes } = fileUtils;

const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

const ensureWorkingDirectory = async (file) => {
  if (file.tmpWorkingDirectory) {
    return file.tmpWorkingDirectory;
  }

  const workingDir = await fse.mkdtemp(path.join(os.tmpdir(), 'strapi-upload-'));
  file.tmpWorkingDirectory = workingDir;
  return workingDir;
};

const shouldSkipRotation = (orientation, width, height) => {
  if (!orientation || !width || !height) {
    return false;
  }

  // Orientations 6 and 8 expect the stored pixels to be landscape (width > height).
  // If the pixels are already portrait (height >= width), skip rotation.
  if ((orientation === 6 || orientation === 8) && height >= width) {
    return true;
  }

  // Orientations 3 and 4 expect pixels to be upside-down.
  // If dimensions suggest it's already correct, skip.
  if ((orientation === 3 || orientation === 4) && width >= height) {
    return true;
  }

  return false;
};

const createOrientationNormalizer = (imageManipulationService) => {
  const { isImage } = imageManipulationService;

  return async (file) => {
    if (!(await isImage(file))) {
      return file;
    }

    const hasFilePath = Boolean(file.filepath);
    let metadata;
    let inputBuffer;

    if (hasFilePath) {
      metadata = await sharp(file.filepath).metadata();
    } else {
      inputBuffer = await streamToBuffer(file.getStream());
      metadata = await sharp(inputBuffer).metadata();
    }

    strapi.log.info(
      `[upload] Image metadata: ${file.name || file.hash}${file.ext || ''} - orientation: ${metadata?.orientation}, width: ${metadata?.width}, height: ${metadata?.height}`
    );

    if (
      !metadata?.orientation ||
      metadata.orientation === 1 ||
      shouldSkipRotation(metadata.orientation, metadata.width, metadata.height)
    ) {
      if (metadata?.orientation && shouldSkipRotation(metadata.orientation, metadata.width, metadata.height)) {
        strapi.log.info(
          `[upload] Skipped rotation for ${file.name || file.hash}${
            file.ext || ''
          } - pixels already match orientation ${metadata.orientation}`
        );
      }
      return file;
    }

    const workingDirectory = await ensureWorkingDirectory(file);
    const orientedFileName = `oriented-${file.hash}${file.ext || ''}`;
    const orientedFilePath = path.join(workingDirectory, orientedFileName);

    const transformer = hasFilePath ? sharp(file.filepath) : sharp(inputBuffer);
    const result = await transformer
      .rotate()
      .withMetadata({ orientation: 1 })
      .toFile(orientedFilePath);

    const sizeInBytes = result.size ?? 0;

    strapi.log.info(
      `[upload] Rotated ${file.name || file.hash}${file.ext || ''} from EXIF orientation ${metadata.orientation} - new dimensions: ${result.width}x${result.height}`
    );

    file.filepath = orientedFilePath;
    file.getStream = () => fse.createReadStream(orientedFilePath);
    file.buffer = await fse.readFile(orientedFilePath);
    file.size = bytesToKbytes(sizeInBytes);
    file.sizeInBytes = sizeInBytes;

    if (result.width && result.height) {
      file.width = result.width;
      file.height = result.height;
    }

    return file;
  };
};

module.exports = (plugin) => {
  const imageManipulationService = plugin.services['image-manipulation'];
  const originalOptimize = imageManipulationService.optimize;
  const normalizeImageOrientation = createOrientationNormalizer(imageManipulationService);

  imageManipulationService.optimize = async function optimizedWithOrientation(file) {
    const orientedFile = await normalizeImageOrientation(file);
    return originalOptimize.call(this, orientedFile);
  };

  imageManipulationService.normalizeImageOrientation = normalizeImageOrientation;

  return plugin;
};
