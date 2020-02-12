const adb = require('adbkit')
const { exec } = require('child_process');
const detectPort = require('detect-port');

const appium = require('./appiumDaemon');
const config = require('../config/deviceList');
const username = require('os').userInfo().username;
const devices = [];
let client = null;


shutdown();
setTimeout(()=> {
    startup()
    setTimeout(()=>{
        client = adb.createClient();

    },2000)
}, 2000)


function addDevice(device) {
    getRandomPort((port) => {
        appium.startUp(port);
        devices.push({ ...device, port});
        console.log(devices);
    });

}

function removeDevice(device) {
    for (let i = 0; i < devices.length; i++) {
        let knownDevice = devices[i];
        console.log(knownDevice);
        if (device.id === knownDevice.id) {
            devices.splice(i, 1);
            break;
        }

    }
}
function trackDevices() {
    if (client === null) {
        setTimeout(trackDevices,4000);
        return
    }
    client.trackDevices()
        .then(function(tracker) {
            tracker.on('add', function(device) {
                console.log('Device %s was plugged in', device)
                let name = config.resolveName(device.id);
                addDevice(
                    {
                        name,
                        id: device.id
                    });
            })
            tracker.on('remove', function(device) {
                removeDevice(device);
                console.log('Device %s was unplugged', device)
                console.log(devices)
            })
            tracker.on('end', function() {
                console.log('Tracking stopped')
            })
        })
        .catch(function(err) {
            console.error('Something went wrong:', err.stack)
        })
}
function getDevices(){
    console.log('DEBV:',JSON.stringify(devices));
    return devices;
}
exports.run = trackDevices;
exports.getDevices = getDevices;

function startup() {
// startup ADB here (windows specific)
    exec('C:\\Users\\'+username+'\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe start-server', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

function shutdown() {
// kill ADB here (windows specific)
    exec('C:\\Users\\'+username+'\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe kill-server', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}


/**
 * Find free Port
 **/
function getRandomPort(returnFunction) {
    const random = Math.floor(9000 + Math.random() * (65535 - 9000));
    return detectPort(random, (err, port) => {
            if (err) {
                console.log(`get available port failed with ${err}`);
                getRandomPort();
                return ;
            }
            return returnFunction(port);
    })
}