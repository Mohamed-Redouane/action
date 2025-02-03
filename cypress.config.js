const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Set your base URL
    viewportWidth: 1280,             // Standard viewport width
    viewportHeight: 720,             // Standard viewport height
    video: true,                     // Enable video recording
    screenshotsFolder: 'cypress/screenshots', // Folder for screenshots
    videosFolder: 'cypress/videos',           // Folder for video recordings
    retries: {
      runMode: 2,                     // Retry failed tests 2 times in CLI
      openMode: 0                     // No retries when running in open mode
    },
    videoCompression: 32,             // Compress video for smaller file size
    videoUploadOnPasses: false,       // Avoid uploading videos for passing tests
    reporter: 'mochawesome',          // Use Mochawesome for professional reports
    reporterOptions: {
      reportDir: 'cypress/reports',   // Directory for reports
      overwrite: false,
      html: true,
      json: true,
    },
    env: {
      coverage: true,                 // Enable code coverage if required
    },
    chromeWebSecurity: false,         // Allow cross-origin testing (optional)
    defaultCommandTimeout: 10000,     // Increase default timeout for commands
    setupNodeEvents(on, config) {
      // Integrate @cypress/code-coverage if needed
      require('@cypress/code-coverage/task')(on, config);

      // Log failed tests with screenshots
      on('after:screenshot', (details) => {
        console.log(`Screenshot saved at: ${details.path}`);
      });

      return config;
    },
  },
});
