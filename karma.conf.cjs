// (entiende JSX) y se ejecutan en Chrome sin ventana.
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-esbuild'],
    files: [
      { pattern: 'src/**/*.spec.js', watched: false },
    ],
    preprocessors: {
      'src/**/*.spec.js': ['esbuild'],
    },
    esbuild: {
      jsx: 'automatic',
      loader: { '.js': 'jsx' },
      target: 'es2020',
      define: { 'process.env.NODE_ENV': '"test"' },
    },
    reporters: ['progress'],
    browsers: ['ChromeHeadlessSinSandbox'],
    customLaunchers: {
      ChromeHeadlessSinSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    singleRun: true,
    restartOnFileChange: true,
  });
};
