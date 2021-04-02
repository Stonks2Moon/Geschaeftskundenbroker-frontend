const { setHeadlessWhen } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: "http://localhost:4200/",
      show: true,
      windowSize: '1200x900'
    },
    MockRequestHelper: {
      require: '@codeceptjs/mock-request',
    },
 
  },
  translation: './german_translation.js',
  include: {
    Ich: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'frontend',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
}