var adb = require('adbkit')
const { exec } = require('child_process');
var config = require('../config/deviceList')
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



function trackDevices() {
    if (client === null) {
        setTimeout(trackDevices,4000);
        return
    }
    client.trackDevices()
        .then(function(tracker) {
            tracker.on('add', function(device) {
                console.log('Device %s was plugged in', device)
                let newDevice = config.resolveName(device.id);
                devices.push(newDevice);
            })
            tracker.on('remove', function(device) {
                for (var i = 0; i < devices.length; i++) {
                    var obj = devices[i];
                    console.log(obj);
                        if (config.resolveName(device.id) === obj) {
                            devices.splice(i, 1);
                            break;
                        }

                }
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