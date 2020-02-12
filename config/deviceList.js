const yaml = require('js-yaml');
const fs   = require('fs');
const axios = require('axios');

const options = {
    method: 'get',
    url: 'http://localhost:4723/wd/hub/status',
    transformResponse: [(data) => {
        // transform the response
        console.log(JSON.parse(data));

        return JSON.parse(data);
    }]
};

let isRequesting = false;

function getStatuts() {
    if (isRequesting) return;
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
    }).catch(()=>{
        isRequesting = false;
    });
}

async function resolveSettings(name) {

// Get document, or throw exception on error

const result = await getStatuts().then(({sessionId, status})=>{
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
        if (!fs.existsSync('config/'+name+'.yaml')) {
            throw new Error('Unknown Device - Config File not found for name: ' + name);
            // Do something
        }
        var doc = yaml.safeLoad(fs.readFileSync('config/'+name+'.yaml', 'utf8'));
        console.log(doc);
        const obj = {};
        obj[name] = doc[0];
        const version = Object.keys(obj[name])[0];
        const user = Object.keys(obj[name][version])[0];
        obj[name][version][user].sessions = session;
        console.info('name: ', name);
        console.info('version: ', version);
        console.info('user: ', user);
        return obj;
    } catch (e) {
        console.log(e);
    }
})
    return result;
}

function resolveName(id) {
    console.log('YAML CONFIG: \n', yaml.safeLoad(fs.readFileSync('config/mapping.yaml', 'utf8')))
    return yaml.safeLoad(fs.readFileSync('config/mapping.yaml', 'utf8'))[id];
}

exports.resolveName = resolveName;
exports.resolveSettings = resolveSettings;