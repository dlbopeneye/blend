var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = [];

function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write("Error 404");
	response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200,
		{"content-type": mime.getType(path.basename(filePath))}
	);
	response.end(fileContents);
}

// serving static files
function serveStatic(response, cache, absPath) {
	if (cache[absPath]) { // check if file is cached in memory
		sendFile(response, absPath, cache[absPath][0]); // serve file from memory
	} else {
		fs.exists(absPath, function(exists) { // check if file exists
			if (exists) {
				fs.readFile(absPath, function(err, data) { // read file from disk
					if (err) {
						send404(response);
					} else {
						cache[absPath] = [data];
						sendFile(response, absPath, data); // serve file read from disk
					}
				});
			} else {
				send404(response); // send HTTP 404 response
			}
		});
	}
}

// logic to create and HTTP server
var server = http.createServer(function(request, response) {
	var filePath = false;
	
	if (request.url === '/') {
		filePath = 'public/index.html';
	} else {
		filePath = 'public' + request.url;
	}
	var absPath = './' + filePath;
	serveStatic(response, cache, absPath);
});

server.listen(3000, function() {
	console.log("Server listening on port 3000!");
});