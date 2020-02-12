/**
 *
 *   MAIN STARTS THE APP
 *
 **/
const startUpAppium = require('./services/appiumDaemon'),
    proxy = require('./services/proxyDaemon'),
    adbClient = require('./services/adbDaemon');

    //let appiumPort = 4723; // FIXME: refactor this to read ports from devices
    //startUpAppium.startUp(appiumPort);
    adbClient.run();
//proxy.run('http://localhost:'+ appiumPort, appiumPort);


