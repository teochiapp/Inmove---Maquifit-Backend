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

const normalizeImageOrientation = async (file) => {
  const imageManipulationService = strapi.plugin('upload').service('image-manipulation');

  if (!(await imageManipulationService.isImage(file))) {
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

  if (!metadata?.orientation || metadata.orientation === 1) {
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
    `[upload] normalizeImageOrientation rotated ${file.name || file.hash}${file.ext || ''} from EXIF orientation ${metadata.orientation}`
  );

  file.filepath = orientedFilePath;
  file.getStream = () => fse.createReadStream(orientedFilePath);
  file.size = bytesToKbytes(sizeInBytes);
  file.sizeInBytes = sizeInBytes;

  if (result.width && result.height) {
    file.width = result.width;
    file.height = result.height;
  }

  return file;
};

module.exports = (plugin) => {
  const originalUploadFileAndPersist = plugin.services.upload.uploadFileAndPersist;

  plugin.services.upload.uploadFileAndPersist = async function uploadFileAndPersist(fileData, opts) {
    const normalizedFile = await normalizeImageOrientation(fileData);
    return originalUploadFileAndPersist.call(this, normalizedFile, opts);
  };

  plugin.services.upload.normalizeImageOrientation = normalizeImageOrientation;

  return plugin;
};
