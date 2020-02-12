/**
 *
 *   MAIN STARTS THE APP
 *
 **/
const startUpAppium = require('./services/appiumDaemon'),
    proxy = require('./services/proxyDaemon'),
    adbClient = require('./services/adbDaemon');

    let proxyPort = 4723; // FIXME: refactor this to read ports from devices
    adbClient.run();
proxy.run('http://localhost', proxyPort);


