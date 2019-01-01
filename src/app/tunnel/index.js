const tunnel = require('./tunnel');

const connect = async (config, callback) => {
  const newConfig = Object.create(config);
  newConfig.privateKey = require('fs').readFileSync(config.privateKey);
  const server = await tunnel.connect(newConfig, callback);
  return server;
};

module.exports = {
  connect
}
