module.exports = class Store {
  constructor(initialValues = {}) {
    const {
      count = 1
    } = initialValues;

    this.count = count;
  }
};
