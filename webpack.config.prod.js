const merge = require('webpack-merge');
const webpackConfigCommon = require('./webpack.config.common');

module.exports = merge(webpackConfigCommon, {
  entry: {
    main: [
      './src/scripts/main.js'
    ]
  },
  mode: 'production'
});
