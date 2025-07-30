import dotenv from 'dotenv/config.js';
import app from './app.js';
import http from 'http'
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'


const server = http.createServer(app);
const io = new Server(server);

io.on('connection', socket => {
    console.log('user connected')
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});


io.use((socket,next)=>{
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

    if(!token){
      return next(new Error("authorization error"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
      return next(new Error("authorization error"))
    }

    socket.user = decoded

    next();
  } catch (error) {
    next(error)
  }
})


const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`server start${port}`)
})