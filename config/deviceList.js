const yaml = require('js-yaml');
const fs   = require('fs');
const axios = require('axios');

const options = {
    method: 'get',
    url: 'http://localhost:$PORT$/wd/hub/status',
    transformResponse: [(data) => {
        // transform the response
        console.log(JSON.parse(data));

        return JSON.parse(data);
    }]
};

let isRequesting = false;

function getStatuts(device) {
    console.log('Status of device', device);
    options.url = options.url.replace('$PORT$', device.port);
    isRequesting = true;
    console.log('start Request');
    let result = null;
    return axios(options).then((res) =>{
        isRequesting = false;
        console.log('final: ', res.data);

        result = {
            sessionId: res.data.sessionId,
            status: res.data.status
        };
        console.log('final: ', result);
        return result;
    }).catch((e)=>{
        isRequesting = false;
        console.error(e);
        return false;
    });
}

async function resolveSettings(device) {

// Get document, or throw exception on error
return await getStatuts(device).then(({sessionId, status})=>{
    console.log({sessionId, status});
    let session = null;
    if (sessionId === null ) {
        session = [{
            id: sessionId,
            screen: "real device",
            vnc: false,
            caps: {
                "uuid": "test"
            }
        }]
    }
    try {
        const fs = require("fs"); // Or `import fs from "fs";` with ESM
        if (!fs.existsSync('config/'+device.name+'.yaml')) {
            throw new Error('Unknown Device - Config File not found for name: ' + device.name);
            // Do something
        }
        let config = yaml.safeLoad(fs.readFileSync('config/'+device.name+'.yaml', 'utf8'));
        const convertedObject = {};
        convertedObject[device.name] = config[0];
        const version = Object.keys(convertedObject[device.name])[0];
        const user = Object.keys(convertedObject[device.name][version])[0];
        convertedObject[device.name][version][user].sessions = session;
        console.info('name: ', device.name);
        console.info('version: ', version);
        console.info('user: ', user);
        return convertedObject;
    } catch (e) {
        console.log(e);
    }
})
}

function resolveName(id) {
    console.log('YAML CONFIG: \n', yaml.safeLoad(fs.readFileSync('config/mapping.yaml', 'utf8')))
    return yaml.safeLoad(fs.readFileSync('config/mapping.yaml', 'utf8'))[id];
}

exports.resolveName = resolveName;
exports.resolveSettings = resolveSettings;