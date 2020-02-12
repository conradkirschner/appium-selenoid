const adbDeamon = require('./adbDeamon');
const config = require('../config/deviceList');

function getDevices(){
    return adbDeamon.getDevices();
}

async function getStatus() {
    console.log(getDevices());
    const devices = getDevices();
    return await buildBrowserObject(devices)
}
async function buildBrowserObject(devices) {
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };


    let resolvedDevice = {};
    for (let key in devices) {
        if(devices[key] === undefined) {
            console.warn('Unknown device detected');
            continue;
        }

        resolvedDevice = {...resolvedDevice,...await config.resolveSettings(devices[key])}
    }
    console.log('test',Object.size(devices));
    return {
        total: Object.size(devices),
        browsers: {
            "android":
    {...resolvedDevice, ...{"XIAOMI MI 9": {
            "user1": {
                "isMobile":"true",
                "count":1,
                "uuid":'sdfsdfsdfsd-fsdf-sdfsdfsdfsdf-sdffdsfsdf',
                    "sessions":[
                    {
                        "id": "a7a2b801-21db-4dae-a99b-4cbc0b81de96",
                        "vnc": false,
                        "screen": "1920x1080x24",
                        "caps":{'browserName':'test'}
                    }
                ]
            },
        }}
        },
            "iOS": {
        "iPhone X": {
            "user1": {
                "count":4,
                    "sessions":[
                ]
            }
        }
    } //{'firefox':{'test':{count:0,sessions:null}}}//resolvedDevice,
    } //{'firefox':{'test':{count:0,sessions:null}}}//resolvedDevice,

}
}

exports.getStatus = getStatus;