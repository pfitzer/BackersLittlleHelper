const { ipcRenderer } = require('electron')
const remote = require('@electron/remote');
const path = require("path");
const {readConfig, saveConfig} = require("./lib/configuration");
const fs = require("fs");
const dialog = remote.dialog
const content = document.getElementById('content');
const settings = readConfig(path.join(process.env.APPDATA, 'backerslittlehelper', 'settings.json'))

function loadSettings() {
// settingsMenu.addEventListener('click', function() {
    fs.readFile(path.join(__dirname, 'templates', 'settings.html'), 'utf-8',(err, data) => {
        if (err) {
            dialog.showErrorBox('Error', err)
            return
        }
        content.innerHTML = data;
        let appPath = document.getElementById('apppath')
        let savePath = document.getElementById('savepath')
        let btn = document.getElementById('getpath')
        appPath.value = settings.appPath

        savePath.addEventListener('click', () => {
            settings.appPath = document.getElementById('apppath').value
            saveConfig(path.join(process.env.APPDATA, 'backerslittlehelper', 'settings.json'), settings)
        })

        btn.addEventListener('click', () => {
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }).then(result => {
                document.getElementById('apppath').value = result.filePaths[0]
            })
        })
    })
}

function loadNews() {
    content.innerHTML = null
    getCommLinks()
}