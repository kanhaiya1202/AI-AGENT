import dotenv from 'dotenv/config.js';
import app from './app.js';
import http from 'http'
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'
import cors from 'cors';
import mongoose from 'mongoose';
import ProjectModel from './model/project.model.js'


const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:"*"
  }
});

io.on('connection', socket => {
  console.log('user connected');
  socket.join(socket.project._id)
  socket.on('project-message', data => {
    socket.broadcast.to(socket.project._id).emit('project-message', data)
  })

  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});

io.use(async(socket,next)=>{

  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

    const projectId = socket.handshake.query.projectId

    if(!mongoose.Types.ObjectId.isValid(projectId)){
      return next(new Error("ProjectId Error"))
    }

    socket.project = await ProjectModel.findById(projectId)

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