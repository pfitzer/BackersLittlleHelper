const {ipcRenderer} = require('electron')
const remote = require('@electron/remote');
const path = require("path");
const {readConfig, saveConfig} = require("./lib/configuration");
const fs = require("fs");
const fse = require("fs-extra");
const dialog = remote.dialog
const content = document.getElementById('content');
const settings = readConfig(path.join(process.env.APPDATA, 'backerslittlehelper', 'settings.json'))
const save_path = path.join(process.env.APPDATA, 'backerslittlehelper', 'backup')


function loadSettings() {
// settingsMenu.addEventListener('click', function() {
    fs.readFile(path.join(__dirname, 'templates', 'settings.html'), 'utf-8', (err, data) => {
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

function loadTools() {
    fs.readFile(path.join(__dirname, 'templates', 'tools.html'), 'utf-8', (err, data) => {
        if (err) {
            dialog.showErrorBox('Error', err)
            return
        }
        content.innerHTML = data;
        const save_user_settings = document.getElementById('save_user_settings')
        save_user_settings.addEventListener('click', function () {
            try {
                fse.copySync(path.join(settings.appPath, 'USER', 'Client', '0', 'Controls'), path.join(save_path, 'Controls'), {overwrite: true})
                fse.copySync(path.join(settings.appPath, 'USER', 'Client', '0', 'Profiles'), path.join(save_path, 'Profiles'), {overwrite: true})
                dialog.showMessageBoxSync({
                    message: 'Einstell ungen wurden unter "' + save_path + '" gespeichert.',
                    type: 'info'
                })
            } catch (e) {
                dialog.showErrorBox('Error', e)
            }

        })
    });
}

function loadShipSearch() {
    fs.readFile(path.join(__dirname, 'templates', 'ship_search.html'), 'utf-8', (err, data) => {
        if (err) {
            dialog.showErrorBox('Error', err)
            return
        }
        content.innerHTML = data;
    });
}