module.exports = class Component2 {
  constructor() {
    console.log('class Component2');
  }
};

if (module.hot) {
  module.hot.dispose(() => {
    console.log('dispose component2');
  });
}