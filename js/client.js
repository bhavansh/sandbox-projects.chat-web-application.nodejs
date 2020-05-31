const socket = io('http://localhost:8000');

// Get DOM elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Audio that will play on receiving messages
var audio = new Audio('notification.mp3')

// function which will append event info to container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){
        audio.play();
    }
};


// Ask new user for his/her name and let the server know
const name = prompt("Enter Your name to join");
socket.emit('new-user-joined', name);

// If new user joins,receive the event from server
socket.on('user-joined', name => {
    append(`${name} joined the chat`,'right')
});

// If server sends a message receive it
socket.on('recieve', data => {
    append(`${data.name}:${data.message}`,'left')
});

// If user leaves chat send update to container
socket.on('leave', data => {
    append(`${data.name} left the chat`,'right')
});

// If form gets submitted send it to sever 
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const message = messageInput.value;
    append(`You : ${message}`,'right')
    socket.emit('send',message)
    messageInput.value = ''
})
