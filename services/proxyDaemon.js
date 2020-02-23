const http = require('http'),
    httpProxy = require('http-proxy');

const response = require('./response.json'),
    status = require('./statusHandler'),
    adbDaemon = require('./adbDaemon');

async function runProxy(proxyHostname, port) {
    //
    // Create a proxy server to create status api
    //
    let device = undefined;
    const proxy = httpProxy.createProxyServer({});
    const server = http.createServer(async function(req, res) {
        // and then proxy the request.
        const devices = adbDaemon.getDevices();
        console.log('Redirecting to Appium Server');
        console.log('Got Request');
        const result = {...response, ...await status.getStatus()};
        console.info('url:: ',req.url);
        switch (req.url) {
            case '/status':
                console.warn(result);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(result,true, 100));
                res.end();
                return;
            case '/wd/hub/session':
                break;
        }

        //sendResponse(proxy, req, res, proxyHostname);
        proxy.on('proxyRes', function(proxyRes, req, res){

            proxyRes.on('data' , function(dataBuffer) {
                try {

                    const response = dataBuffer.toString();
                    const sessionId = JSON.parse(response).sessionId;
                    if (device === undefined || sessionId === undefined || sessionId === null) return;
                    console.info(`added session id (${sessionId}) to device ${device.name}`);
                    device.sessionId = sessionId;
                } catch (e) {

                }
                try {

                } catch (e) {
                    console.info('response data:', dataBuffer.toString());
                   // res.data = dataBuffer.toString().replace('"udid":"' + device.name + '"', '"udid":"' + device.id + '"');
                }
            });
        });
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            if (devices.length === 0) {
                return;
            }
            body = Buffer.concat(body).toString();
            try {
                body =  JSON.parse(body);
                console.info('body data ', body);
                console.info(req.url.indexOf('/wd/hub/session'));
                if(req.url.indexOf('/wd/hub/session') !== -1) {
                    const udid = body.desiredCapabilities.udid;
                    console.info('body.desiredCapabilities', udid);
                    if (udid === undefined ) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(
                            '{"status":13,"value":{"message":"You must include a udid capability"},"sessionId":null}'
                        );
                        res.end();
                        console.info('error appeared no udid')
                        return;
                    }
                    device =adbDaemon.getDevices(udid);
                    console.info('device found: ', device);
                    if (device === undefined) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(
                            '{"status":13,"value":{"message":"udid is not known."},"sessionId":null}'
                        );
                        res.end();
                        console.info('error appeared no udid');
                        return;
                    }
                    console.info('Set device to ' + proxyHostname, device.port);
                    sendResponse(proxy, req, res,  proxyHostname, device)

                }
                if (body.desiredCapabilities.udid && device) {
                    console.log('Converted udid', req.headers, req.eventNames(), req.method);
                    body.desiredCapabilities.udid = device.id;
                    req.eventNames();
                }

            } catch (e) {
                console.log("not JSON");
            }
           return;

        });
        const sessionId = getSessionId(req.url);
        for(let i = 0; i < devices.length; i++) {
            if (devices[i].sessionId === sessionId) {
                sendResponse(proxy, req, res,  proxyHostname, devices[i]);
                return;
            }
        }
        console.info('No device with that session found!', sessionId)

    });

    console.log(`listening on port ${port}`);
    server.listen(port);
}

function sendResponse(proxy, req, res, proxyHostname, device) {
    console.log('Redirecting to Appium Server');
    console.log('###################################################');
    console.log(`proxy to device ${device.name} with port ${device.port} with session ${device.sessionId}`);
    console.log('###################################################');
    console.log('request', req.body);

    proxy.web(req, res, { target: proxyHostname + ':' +  device.port});
}
function getSessionId(url) {
    console.info(url.split('/')[4]);
    return url.split('/')[4];

}
exports.run = runProxy;