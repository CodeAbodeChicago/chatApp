// main.js for chat app

// thanks to Tamas Piros and Michael Mukhin
// http://socket.io/get-started/chat/
// http://www.tamas.io/simple-chat-application-using-node-js-and-socket-io/
// http://psitsmike.com/2011/09/node-js-and-socket-io-chat-tutorial/

// create new instance of global io() object
var socket = io();

// get form elements from DOM
var chatForm = document.getElementById("msg-form");
var chatInput = chatForm.elements["new-msg"];

// when form is submitted, emit the 'chat message' event
chatForm.onsubmit = function(e) {
	e.preventDefault();

	if (chatInput.value && chatInput.value != ""){
		socket.emit('sendchat', chatInput.value);
		chatInput.value = "";
	} else {
		console.log("no input!");
	}

	return false;
};


// get template for new messages
var msgWrap = document.getElementById("msg-wrap");
var myMsgTemplate = msgWrap.querySelector(".this-user");
var otherMsgTemplate = msgWrap.querySelector(".other-user");
msgWrap.removeChild(myMsgTemplate);
msgWrap.removeChild(otherMsgTemplate);


// listener
// when the 'join' event is recieved, inform everyone
// that a new user has joined
// socket.on('join', function(name) {
socket.on('connect', function() {
	socket.emit('adduser', prompt("what's your name?")); // call server-side function add user
});


// listener
// when the 'update-chat' event is recieved
// clone the message template, fill it in, 
// and add it to the msg-wrap element on the page
// template for your messages
socket.on('update-chat-you', function(username, msg) {
	var clone = myMsgTemplate.cloneNode(true);
	clone.querySelector('.username').textContent = username;
	clone.querySelector('.msg').textContent = msg;
	msgWrap.appendChild(clone);
	clone.scrollIntoView(false); // scroll to bottom of page
});

// template for other messages
socket.on('update-chat-other', function(username, msg) {
	var clone = otherMsgTemplate.cloneNode(true);
	clone.querySelector('.username').textContent = username;
	clone.querySelector('.msg').textContent = msg;
	msgWrap.appendChild(clone);
	clone.scrollIntoView(false); // scroll to bottom of page
});


// get users wrap from DOM
var userWrap = document.getElementById("users-wrap");
var userList = userWrap.querySelector(".user-list");


// listener
// when server emits 'updateusers', update username list
socket.on('updateusers', function(usernamesObj) {
	userList.textContent = "";
	for (key in usernamesObj) {
		var newUser = usernamesObj[key] + "<br />";
		userList.innerHTML += newUser;
	}
});

