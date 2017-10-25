var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use('/api/phantom', require('./api/phantom'));
app.use('/api/images', require('./api/images'));

const HTTP_PORT = 80;
const HTTPS_PORT = 443;

var server = https.createServer({ 
    key: fs.readFileSync('./priv.key', 'utf8'), 
    cert: fs.readFileSync('./pub.cert', 'utf8')
}, app);

server.listen(HTTPS_PORT, () => {
    console.log(`HTTPS running at port ${HTTPS_PORT}.`);
});
http.createServer((req, res) => {
    var indexOfColon = req.headers.host.lastIndexOf(':');
    var hostWithoutPort = indexOfColon > 0 ? req.headers.host.substring(0, indexOfColon) : req.headers.host;
    var newUrl = `https://${hostWithoutPort}:${HTTPS_PORT}${req.url}`;
    res.writeHead(302, { 'Location': newUrl });
    res.end();
}).listen(HTTP_PORT, function() {
    console.log(`HTTP running at port ${HTTP_PORT}.`);
});
