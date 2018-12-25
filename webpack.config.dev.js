const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfigCommon = require('./webpack.config.common');

module.exports = merge(webpackConfigCommon, {
  entry: {
    main: [
      'webpack-dev-server/client?http://localhost:8901',
      'webpack/hot/dev-server',
      './src/scripts/main.js'
    ]
  },
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    publicPath: webpackConfigCommon.output.publicPath,
    contentBase: [
      './src'
    ],
    compress: true,
    hot: true,
    inline: true,
    overlay: true,
    port: 8901,
    watchContentBase: false,
    stats: {
      colors: true
    }
  }
});
