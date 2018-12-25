const Component2 = require('./component2');

module.exports = class Component1 {
  constructor() {
    console.log('constructor Component1');

    this.component2 = new Component2();

    this.$dom = document.createElement('div');
    this.$dom.innerHTML = 'component1';
    document.body.appendChild(this.$dom);
  }
  destroy() {
    console.log('destroy Component1');
    document.body.removeChild(this.$dom);
  }
};

if (module.hot) {
  module.hot.dispose(() => {
    console.log('dispose component1');
  });
}