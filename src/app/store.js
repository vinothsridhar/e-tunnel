const electron = require('electron');
const path = require('path');
const fs = require('fs');
const { uuid } = require('./utils');

const parseDataFile = (filePath, defaults) => {
  try {
    console.log('defaults: ', defaults);
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    return defaults;
  }
}

class Store {

  constructor(configName, defaults = {}) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    // const userDataPath = __dirname + "/userData";
    this.path = path.join(userDataPath, configName + '.json');
    this.data = parseDataFile(this.path, defaults);
  }

  refresh() {
    this.data = parseDataFile(this.path);
  }

  all() {
    const data = [];
    if (this.data) {
      for (var key in this.data) {
        data.push(this.data[key]);
      }
    }
    return data;
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2), 'utf8');
    this.refresh();
  }

  remove(key, val) {
    delete this.data[key];
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2), 'utf8');
    this.refresh();
  }
}

module.exports = Store;
