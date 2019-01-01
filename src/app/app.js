const electron = require('electron');
const nunjucks = require('nunjucks');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 300,
    'min-width': 500,
    'min-height': 200,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden'
  });

  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

var tunnelFormWindow = null;

const showTunnelFormWindow = (id = false) => {
  if (tunnelFormWindow) {
    tunnelFormWindow.focus();
    return;
  }

  tunnelFormWindow = new BrowserWindow({
    height: 600,
    width: 400,
    modal: true,
  });

  // tunnelFormWindow.webContents.openDevTools();

  tunnelFormWindow.loadURL('file://' + __dirname + '/tunnel_form.html');

  tunnelFormWindow.webContents.on('did-finish-load', () => {
    if (id) {
      tunnelFormWindow.webContents.send('tunnel-form-data', id);
    }
  });

  tunnelFormWindow.on('closed', function() {
    tunnelFormWindow = null;
  });
}

ipcMain.on('tunnel-edit-form-window', (event, arg) => {
  showTunnelFormWindow(arg);
});

ipcMain.on('tunnel-form-window', (event, arg) => {
  if (arg == 'show') {
    showTunnelFormWindow();
  }
  if (arg === 'cancel') {
    tunnelFormWindow.close();
    mainWindow.focus();
  }
  if (arg === 'save') {
    tunnelFormWindow.close();
    mainWindow.focus();
    mainWindow.webContents.send('refresh', true);
  }
});
