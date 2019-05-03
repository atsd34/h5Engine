
var fs = require('fs');
var path = require('path');
var http = require('http');
var port = process.env.PORT || 8988;
var app = http.createServer(function (request, response) {
    var filePath = request.url.toLowerCase();
    filePath = filePath.split('?')[0].split('#')[0];
    filePath = decodeURIComponent(filePath);
    if(filePath.indexOf('index.js')!=-1){        
        response.writeHead(500);
        response.end();
        return;
    }
    if (filePath == '/')
        filePath = '/export.html';
    if (fs.existsSync(__dirname + filePath))
        filePath = __dirname + filePath;

    var extname = path.extname(filePath);
    var contentType = undefined;
    switch (extname) {
        case '.html':
        case '.htm':
            contentType = 'text/html';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        default:
            contentType = 'text/plain';
            break;
    }

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(200, contentType ? { 'Content-Type': contentType } : {});
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(port);