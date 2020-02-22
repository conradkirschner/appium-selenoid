/**
 *
 *   MAIN STARTS THE APP
 *
 **/
//console.log = ()=>{};
console.warn = ()=>{};
console.debug = ()=>{};
console.error = ()=>{};

const startUpAppium = require('./services/appiumDaemon'),
    proxy = require('./services/proxyDaemon'),
    adbClient = require('./services/adbDaemon');

    let proxyPort = 4444;
    adbClient.run();
proxy.run('http://localhost', proxyPort);


