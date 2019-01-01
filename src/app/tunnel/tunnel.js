const tunnel = require('tunnel-ssh');

const connect = (config, callback) => {
  const server = tunnel(config, callback);
};

module.exports = {
  connect
}
