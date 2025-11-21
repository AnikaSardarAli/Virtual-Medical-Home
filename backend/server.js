require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join appointment room
  socket.on('join-appointment', (appointmentId) => {
    socket.join(appointmentId);
    console.log(`User joined appointment: ${appointmentId}`);
  });

  // Video call signaling
  socket.on('call-user', ({ appointmentId, offer, to }) => {
    socket.to(to).emit('call-made', {
      offer,
      from: socket.id,
    });
  });

  socket.on('make-answer', ({ appointmentId, answer, to }) => {
    socket.to(to).emit('answer-made', {
      answer,
      from: socket.id,
    });
  });

  socket.on('ice-candidate', ({ appointmentId, candidate, to }) => {
    socket.to(to).emit('ice-candidate', {
      candidate,
      from: socket.id,
    });
  });

  // Chat messages
  socket.on('send-message', ({ appointmentId, message, sender }) => {
    io.to(appointmentId).emit('receive-message', {
      message,
      sender,
      timestamp: new Date(),
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/medical-records', require('./routes/medicalRecordRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Virtual Medical Home API',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handler (must be last)
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = { app, server, io };
