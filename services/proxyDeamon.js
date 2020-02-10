var http = require('http'),
    httpProxy = require('http-proxy');

var response = require('./response.json'),
    status = require('./statusHandler');

async function runProxy(host, port) {
    //
    // Create a proxy server to create status api
    //
    var proxy = httpProxy.createProxyServer({});

    var server = http.createServer(async function(req, res) {
        const result = {...response, ...await status.getStatus()}
        if (req.url === '/status') {
            console.warn(result);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(result,true, 100));
            res.end();
            return;
        }
        // and then proxy the request.
        proxy.web(req, res, { target: host });
    });

    console.log(`listening on port ${port}`)
    server.listen(port);
}

exports.run = runProxy;