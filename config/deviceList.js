const yaml = require('js-yaml');
const fs   = require('fs');
const axios = require('axios');

/**
 * Add here your devices and give them a name 
 * for settings use name.yml
 * 
 * @type {{"188f0833": string}}
 */

const devices = require('./mapping.json');

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
    return devices[id];
}

exports.resolveName = resolveName;
exports.resolveSettings = resolveSettings;