// index.js for chat app!

// require modules
var express = require('express');
var app = express();

var port = process.env.PORT || 3000; // for deploying to heroku
var server = app.listen(port, function() {
	console.log("listening on *:" + port);
});

var socketMod = require('socket.io');
var io = socketMod(server);

var path = require('path');

// make all files in 
var publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// currently connected users
var usernames = {};


io.on('connection', function(socket) {

	socket.on('adduser', function(name) {
		socket.username = name; // store username in socket session
		usernames[name] = name; // add username to global list
		socket.emit('update-chat-other', 'SERVER', 'You have connected!');  // echo to client they have connected
		socket.broadcast.emit('update-chat-other', 'SERVER', name + " has connected!"); // echo globally that a person has connected
		io.sockets.emit('updateusers', usernames); // update client side list of users
	});

	socket.on('sendchat', function(msg) {
		socket.emit('update-chat-you', socket.username, msg);  // your message
		socket.broadcast.emit('update-chat-other', socket.username, msg); // other messages
		// io.sockets.emit('update-chat-other', socket.username, msg); // execute 'send' with 2 parameters
	});

	socket.on('disconnect', function() {
		delete usernames[socket.username]; // remove username from global list
		socket.broadcast.emit('update-chat-other', 'SERVER', socket.username + " has left."); // echo globally that a person has left
		io.sockets.emit('updateusers', usernames); // update client side list of users
	});

});

