const express = require("express");
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const bookRoutes = require('./Routes/BookRoute');
const authRoutes = require('./Routes/AuthRoute');
const borrowLogger = require('./Middleware/borrowLog.js'); // Import borrowLogger middleware

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(express.json());

// Serve static files from uploads directory
app.use(express.static('uploads'));

// Attach socket instance to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
// Apply borrowLogger only to specific routes that need it (e.g., borrow and return)
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

// Setup Socket.IO connection messages
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB and set up change streams for real-time updates
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const db = mongoose.connection;
    const bookCollection = db.collection('books');
    const changeStream = bookCollection.watch();

    changeStream.on('change', (change) => {
      switch (change.operationType) {
        case 'insert':
          io.emit('bookCreated', change.fullDocument);
          break;
        case 'update':
          bookCollection.findOne({ _id: change.documentKey._id }).then((updatedDoc) => {
            io.emit('bookUpdated', updatedDoc);
          });
          break;
        case 'delete':
          io.emit('bookDeleted', change.documentKey._id);
          break;
        default:
          break;
      }
    });

    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => {
      console.log("DB connected successfully");
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("DB Connection Error:", err));
