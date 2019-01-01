const nunjucks = require('nunjucks');
const path = require('path');
const electron = require('electron');
const Store = require('./store');
const tunnel = require('./tunnel');
const { TUNNEL_ITEM } = require('./js/template');

const ipcRenderer = electron.ipcRenderer;
const BrowserWindow = electron.remote.BrowserWindow;
const tunnelStore = new Store('tunnel-store');
const servers = {};

const refresh = () => {
  const TUNNELS = tunnelStore.all();

  var template = "";

  TUNNELS.forEach((tunnel) => {
    tunnel.connectClassName = "btn btn-default";
    if (servers[tunnel.uuid]) {
      tunnel.connectClassName = "btn btn-positive";
    }
    template += `<li class=\"list-group-item\"><div class=\"media-body\"><strong>${tunnel.name}</strong><span id=\"helperText\"></span><div class=\"btn-group pull-right\"><button class=\"${tunnel.connectClassName}\" onclick=\"connect('${tunnel.uuid}')\"><span class=\"icon icon-signal\"></span></button><button class=\"btn btn-default\" onclick=\"edit('${tunnel.uuid}')\"><span class=\"icon icon-pencil\"></span></button><button class=\"btn btn-default\" onclick=\"deleteTunnel('${tunnel.uuid}')\"><span class=\"icon icon-trash\"></span></button></div></div></li>`
  });

  document.getElementById("tunnel_list").innerHTML = template;
}

const isOpen = (id) => {
  return servers[id];
}

const connect = async (id) => {
  if (servers[id]) {
    servers[id].close();
    delete servers[id];
    refresh();
    return;
  }
  console.log('connect id: ', id);

  try {
    const server = await createServer(tunnelStore.get(id));

    server.on('error', (error) => {
      if (error.code === 'ENETUNREACH') {
        alert('check you internet connection');
      }
      else if (error.code == 'ECONNRESET') {
        alert('connection reset');
        delete servers[id];
        refresh();
      }
      else {
        alert(error);
      }
    });

    servers[id] = server;
    refresh();
  } catch (error) {
    console.error(error);
    alert('Unknown error: Please check your configuration');
  }
}

const createServer = (config) => new Promise((resolve, reject) => {
  tunnel.connect(config, (error, server) => {
    if (error) reject(error);
    resolve(server);
  })
});

const addTunnel = () => {
  ipcRenderer.send('tunnel-form-window', 'show');
}

const edit = (id) => {
  ipcRenderer.send('tunnel-edit-form-window', id);
}

const deleteTunnel = (id) => {
  if (confirm("Want to delete?")) {
    delete servers[id];
    tunnelStore.remove(id);
    refresh();
  }
}

ipcRenderer.on('refresh', (event, arg) => {
  tunnelStore.refresh();
  refresh();
});

document.addEventListener('DOMContentLoaded', function () {
  refresh();
})
