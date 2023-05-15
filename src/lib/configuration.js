const fs = require('fs')
const getDirName = require('path').dirname;

function createDefaultConfig(path)
{
    let c = {appPath: ''}
    let jsonString = JSON.stringify(c)
    fs.mkdir(getDirName(path), { recursive: true}, function (err) {
        if (err) return console.log(err);
        fs.writeFile(path, jsonString, err => {
            if (err) {
                return console.log(err);
            }
        })
    });
}

function readConfig(path)
{
    try {
        const data = fs.readFileSync(path, 'utf-8')
        return JSON.parse(data)
    } catch (e) {
        console.log(e)
    }
}

function saveConfig(path, data)
{
    fs.writeFile(path, JSON.stringify(data), err => {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {createDefaultConfig, readConfig, saveConfig}
