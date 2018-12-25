const Component1 = require('./component1');
const Store = require('./store');

// hmr前後で引き継ぎたいデータはまとめておくとよい
let store;

let isInitial = true;
// if(module.hot)で囲った部分はプロダクションビルド時に削除されるので注意
// よって初回の実行かどうかをmodule.hot.dataで見分けるのはNG
if (module.hot && module.hot.data) {
  // hmr時にはもともと持ってたデータを引き継ぐ
  store = module.hot.data.store;

  isInitial = false;
}

if (isInitial) {
  // 初回実行時のみの処理
  console.log('初回の実行');
  store = new Store();
} else {
  // 二回目以降の処理
  store.count += 1;
  console.log(store.count + '回目の実行');
}

// 毎回実行する処理
const component1 = new Component1();

if (module.hot) {
  // 特定のdependencyを指定する場合は差し替え時の処理を書く
  // この書き方だとstore.jsが書き換わったときにコールバックが呼ばれる。main.js自体は呼ばれない
  module.hot.accept('./store.js', () => {
    const NextStore = require('./store');
    store = new NextStore(store);
  });

  // dependencyを指定しない場合はエラー時のコールバックを渡すのでとりあえずconsole.error
  // この書き方だと子モジュールを書き換えた場合にmain.jsが差し替わる
  module.hot.accept(console.error);
  // hmr後に引き継ぎたいデータを保存する
  module.hot.dispose((data) => {
    console.log('dispose main');
    data.store = store;

    // リスナーの登録とかしていた場合はその破棄が必要
    component1.destroy();
  });
}
