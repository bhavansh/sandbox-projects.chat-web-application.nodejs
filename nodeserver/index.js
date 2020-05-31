// node server which will handle socket io connections

const io = require('socket.io')(8000);

const users = {};
io.on('connection', socket => {

    // If any new user joins, other users get update
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message send to others
    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
    });

    // If someone leaves the chat, let others know
    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });
});
