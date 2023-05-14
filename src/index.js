const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const remote = require('@electron/remote/main');
remote.initialize();
const fs = require('fs')
const template = require('./menu');
const settingsPath = path.join(process.env.APPDATA, 'backerslittlehelper', 'settings.json')
const {createDefaultConfig, readConfig} = require('./lib/configuration')

if (!fs.existsSync(settingsPath)) {
  createDefaultConfig(settingsPath);
}

const config = require(settingsPath);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    },
  });

  mainWindow.webContents.executeJavaScript()

  remote.enable(mainWindow.webContents);

  const menu = Menu.buildFromTemplate(template.getMenu(mainWindow))
  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
