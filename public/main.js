// main.js for chat app

// create new instance of global io() object
var socket = io();

// get form elements from DOM
var chatForm = document.getElementById("msg-form");
var chatInput = chatForm.elements["new-msg"];

// when form is submitted, emit the 'chat message' event
chatForm.onsubmit = function(e) {
	e.preventDefault();
	socket.emit('chat message', chatInput.value);
	chatInput.value = "";
	return false;
};

// get template for new messages
var msgWrap = document.getElementById("msg-wrap");
var msgTemplate = msgWrap.querySelector("li");
msgWrap.removeChild(msgTemplate);

// when the 'chat message' event is recieved
// clone the message template, fill it in, 
// and add it to the msg-wrap element on the page
socket.on('chat message', function(msg) {
	var clone = msgTemplate.cloneNode(true);
	clone.textContent = msg;
	msgWrap.appendChild(clone);
});