const http = require('http'),
    httpProxy = require('http-proxy');

const response = require('./response.json'),
    status = require('./statusHandler'),
    adbDaemon = require('./adbDaemon');

async function runProxy(proxyHostname, port) {
    //
    // Create a proxy server to create status api
    //
    const proxy = httpProxy.createProxyServer({});
    const server = http.createServer(async function(req, res) {
        // and then proxy the request.
        const devices = adbDaemon.getDevices();
        console.log('Redirecting to Appium Server');
        console.log('Got Request');
        const result = {...response, ...await status.getStatus()}
        if (req.url === '/status') {
            console.warn(result);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(result,true, 100));
            res.end();
            return;
        }
        sendResponse(proxy, req, res, proxyHostname);

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
                console.log('body data ', body);

                // route to device
                if (body.desiredCapabilities.uuid) {
                    for (let i = 0; i < devices.length; i+=1 ) {
                        console.log('uuid found');
                    }
                }
                console.log('Set device to ' + proxyHostname + devices[0].port);
              //  sendResponse(proxy, req, res,  proxyHostname)
                return;
            } catch (e) {
                console.log("not JSON");
            }
            sendResponse(proxy, req, res,  proxyHostname)

        });


    });

    console.log(`listening on port ${port}`)
    server.listen(port);
}

function sendResponse(proxy, req, res, proxyHostname) {
    // and then proxy the request.
    const devices = adbDaemon.getDevices();
    console.log('Redirecting to Appium Server');

    for (let i = 0; i < devices.length; i+=1 ) {
        console.log('Set device to ' + devices[0]);
        console.log('###################################################');
        console.log('proxy to device ' + devices[0].name);
        console.log('###################################################');
        proxy.web(req, res, { target: proxyHostname + ':' +  devices[0].port });
    }
}
exports.run = runProxy;