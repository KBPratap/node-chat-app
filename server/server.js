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
    socket.on('disconnect', () => {
        console.log('client was disconnected')
    })
})

server.listen(port, () => {
    console.log(`listening on port ${port}`)
})