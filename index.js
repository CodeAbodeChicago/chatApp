// index.js for chat app!

// require modules
var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

var socketMod = require('socket.io');
var io = socketMod(server);

var path = require('path');

// make all files in 
var publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

app.get('/', function(req, res) { 
	// res.send('<h1>HELLO</h1> <h2>Hello</h2> <h3>Hello</h3> <h4>hello</h4> <h5>hello</h5> <h6>hello</h6>'); // write html directly to page
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log("a new user connected!");
	socket.on('chat message', function(msg) {
		console.log("msg: " + msg);
		io.emit('chat message', msg);
	});
	socket.on('disconnect', function() {
		console.log("user disconnected");
	});
});

server.listen(3000, function() {
	console.log("listening on **:3000");
});