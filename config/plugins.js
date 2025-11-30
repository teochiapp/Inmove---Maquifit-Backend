module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {},
      breakpoints: {
        large: 2048,
        medium: 1024,
        small: 512,
        thumbnail: 245,
      },
    },
  },
});
