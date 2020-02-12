/**
 *
 *   MAIN STARTS THE APP
 *
 **/
const startUpAppium = require('./services/appiumDaemon');
var proxy = require('./services/proxyDaemon'),
    adbClient = require('./services/adbDaemon');


    startUpAppium.startUp();
    adbClient.run();
    proxy.run('http://localhost:4723', 4444);


