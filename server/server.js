const path = require('path');
const express = require('express');
const socketIO = require('socket.io')
const http = require('http');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New user connected')

    socket.emit('newMessage', {
        from: 'admin',
        text: 'welcome to the chat app',
        createdAt: new Date().getTime()
    })

    socket.broadcast.emit('newMessage', {
        from: 'admin',
        text: 'new user joined',
        createdAt: new Date().getTime()
    })

    socket.on('createMessage', (message) => {
        message.createdAt = new Date().getTime()
        console.log('createMessage ', message);

        // io.emit('newMessage', message)
        socket.broadcast.emit('newMessage', message)
    })

    socket.on('disconnect', () => {
        console.log('client was disconnected')
    })
})

server.listen(port, () => {
    console.log(`listening on port ${port}`)
})