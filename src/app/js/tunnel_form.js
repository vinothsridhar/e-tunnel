const { ipcRenderer } = require('electron');
const Store = require('./store');

const tunnelStore = new Store('tunnel-store');

const REQUIRED_FIELDS = [
  "name",
  "host",
  "username",
  "dstHost",
  "dstPort",
  "localHost",
  "localPort",
  "privateKey"
];

const tunnelFormCancelClick = (e) => {
  ipcRenderer.sendSync('tunnel-form-window', 'cancel');
}

const tunnelFormSaveClick = (e) => {
  const data = {};
  REQUIRED_FIELDS.forEach((entry) => {
    const value = document.getElementById(entry).value.trim();
    document.getElementById(entry).parentElement.classList.remove("has-error");
    if (value.length > 0) {
      data[entry] = value;
    } else {
      document.getElementById(entry).parentElement.classList.add("has-error");
    }
  });
  var uuid = document.getElementById("uuid").value.trim();
  if (!uuid) {
    uuid = require('./utils').uuid();
  }
  data.uuid = uuid;
  console.log(data);
  tunnelStore.set(uuid, data);
  ipcRenderer.send('tunnel-form-window', 'save');
}

ipcRenderer.on('tunnel-form-data', (event, arg) => {
  console.log(arg);
  const data = tunnelStore.get(arg);
  REQUIRED_FIELDS.forEach((entry) => {
    document.getElementById(entry).value = data[entry];
  })
  document.getElementById("uuid").value = arg;
});
