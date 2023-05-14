const {app, BrowserWindow, dialog, shell} = require('electron')
const {execFile} = require('child_process');


function getMenu(window) {
    return [
        {
            label: "Datei",
            submenu: [
                {
                label: 'Exit',
                click: () => {
                    app.quit();
                }
            }]
        },
        {
            label: 'Launcher',
            click: () => {
                let child = execFile('C:\\Program Files\\Roberts Space Industries\\RSI Launcher\\RSI Launcher.exe', [], (err, stdout, stderr) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        },
        {
            label: 'Resourcen',
            submenu: [{
                label: 'Spectrum',
                click: () => {
                    let win =new BrowserWindow({
                        width: 1000,
                        height: 1000,
                        parent: window,
                        show: false,
                        modal: true,
                        roundedCorners: true,
                        skipTaskbar: true,
                    })
                    win.setMenu(null);
                    win.loadURL('https://robertsspaceindustries.com/spectrum/community/SC');
                    win.once('ready-to-show', () => {
                        win.show();
                    })
                    //shell.openExternal('https://robertsspaceindustries.com/spectrum/community/SC')
                }
            }]
        },
        {
            label: 'Über',
            submenu: [{
                label: 'Info',
                click: function () {
                    dialog.showMessageBoxSync(window, {
                        title: 'Über die App',
                        message: 'Backers Little Helper',
                        detail: "Version 0.1.0\nAuthor: Michael Pfister\nLicense: MIT"
                    });
                }
            }]
        }
    ]
}

module.exports = {getMenu}