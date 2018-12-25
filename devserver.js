const webpack = require('webpack');
const chokidar = require('chokidar');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.dev');

startDevServer(webpackConfig);

function startDevServer(webpackOptions) {
  const compiler = webpack(webpackOptions);
  // CSSのリロード用のsocketをクライアントjsに追加する
  Object.keys(webpackOptions.entry).forEach((entryName) => {
    webpackOptions.entry[entryName].push('./devserver.css.client.js?http://localhost:8901/sockjs-node');
  });

  const server = new WebpackDevServer(compiler, webpackOptions.devServer);
  server.listen(webpackOptions.devServer.port, webpackOptions.devServer.host, () => {
    const options = {
      ignoreInitial: true,
      persistent: true,
      followSymlinks: false,
      depth: 99,
      atomic: false,
      alwaysStat: true,
      ignorePermissionErrors: true,
      ignored: server.watchOptions.ignored,
      usePolling: server.watchOptions.poll ? true : undefined,
      interval: typeof server.watchOptions.poll === 'number' ? server.watchOptions.poll : undefined
    };

    // webpack-dev-serverのwatchContentBaseだと、一回層目しか見てくれないので(depthが0に設定されてる)
    // chokidarを使って全部見る
    chokidar.watch('./src/styles', options).on('change', (changed) => {
      if (/\.css$/.test(changed)) {
        server.sockWrite(server.sockets, 'css-changed');
      } else {
        server.sockWrite(server.sockets, 'content-changed');
      }
    });
  });
}
