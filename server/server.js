import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { initNotifyService } from './notifyService.js';

// Route Imports
import authRouter from './routes/auth.js';
import propertyRouter from './routes/properties.js';
import furnitureRouter from './routes/furnitures.js';
import notificationRouter from './routes/notifications.js';
import adminRouter from './routes/admin.js';
import emailRouter from './routes/emails.js';
import blogRouter from './routes/blogs.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const connectedClients = new Map();

// Initialize notification service with shared socket reference
initNotifyService(io, connectedClients);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('register', (userId) => {
    connectedClients.set(userId, socket.id);
    console.log(`Registered user: ${userId} to socket: ${socket.id}`);
  });

  socket.on('disconnect', () => {
    for (let [userId, socketId] of connectedClients.entries()) {
      if (socketId === socket.id) {
        connectedClients.delete(userId);
        console.log(`Disconnected user: ${userId}`);
        break;
      }
    }
  });
});

connectDB();

// Mount Modular API Routers
app.use('/api', authRouter); // Covers /api/auth/* and /api/users/*
app.use('/api/properties', propertyRouter);
app.use('/api/furnitures', furnitureRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/admin', adminRouter);
app.use('/api/emails', emailRouter);
app.use('/api/blogs', blogRouter);

const PORT = 5001;
httpServer.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
  console.log(`Socket.io server listening for connections.`);
  console.log(`=================================================`);
});
