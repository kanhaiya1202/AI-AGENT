import dotenv from 'dotenv/config.js';
import app from './app.js';
import http from 'http'
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'
import cors from 'cors'
import mongoose from 'mongoose';
import ProjectModel from './model/project.model.js'
import { generateResult } from './services/ai.services.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // Add your frontend URLs
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
    const projectId = socket.handshake.query.projectId

    console.log('Socket connection attempt:', { projectId, hasToken: !!token });

    if (!projectId) {
      return next(new Error("ProjectId is required"))
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid ProjectId"))
    }

    if (!token) {
      return next(new Error("Authorization token is required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error("Invalid authorization token"))
    }

    const project = await ProjectModel.findById(projectId)
    if (!project) {
      return next(new Error("Project not found"))
    }

    socket.project = project; // Fixed: consistent lowercase
    socket.user = decoded

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(error)
  }
})

io.on('connection', socket => {
  console.log('User connected:', socket.user.email, 'to project:', socket.project.name)
  console.log("socket is connected")
  // Join the project room
  socket.join(socket.project._id.toString())

  socket.on('project-message', async data => {
    const message = data.message
    const aiInPresentInMessage = message.includes('@ai')
    console.log('Message :', data)


    //@ai is present in message box 
    if (aiInPresentInMessage) {
      const prompt = message.replace('@ai', ' ')
      const result = await generateResult(prompt)

      io.to(socket.project._id.toString()).emit('project-message', {
        message: result,
        timestamp: new Date(),
       
        user: {
          _id: 'ai'
        }
      })
      return
    }


    // Broadcast to all users in the project room except sender
    socket.broadcast.to(socket.project._id.toString()).emit('project-message', {
      ...data,
      timestamp: new Date(),
      senderEmail: socket.user.email
    })
  })

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.user?.email, 'Reason:', reason);
    socket.leave(socket.project._id.toString())
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})