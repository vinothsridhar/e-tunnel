const Store = require('./store');

const store = new Store('test-config');

console.log(store);

store.set('test', 'hello');

console.log(store.get('test'));

console.log(store.all());
