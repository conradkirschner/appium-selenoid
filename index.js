/**
 *
 *   MAIN STARTS THE APP
 *
 **/
const startUpAppium = require('./services/appiumDeamon');
var proxy = require('./services/proxyDeamon'),
    adbClient = require('./services/adbDeamon');


    startUpAppium.startUp();
    adbClient.run();
    proxy.run('http://localhost:4723', 4444);


