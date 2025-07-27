import dotenv from 'dotenv/config.js';
import app from './app.js';
import http from 'http'
import { Server } from 'socket.io';


const server = http.createServer(app);

const io = new Server(server);
io.on('connection', socket => {
    console.log('user connected')
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`server start${port}`)
})