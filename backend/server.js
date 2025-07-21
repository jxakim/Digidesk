const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const Case = require('./models/Case');
const User = require('./models/User');
const Group = require('./models/Group');
const Auth = require('./middleware/auth');
const checkPermission = require('./middleware/checkPermission');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const casesRouter = require('./routes/cases');
app.use('/api/cases', casesRouter(io));

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const groupsRouter = require('./routes/groups');
app.use('/api/groups', groupsRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });


// Define the Case schema
app.get('/api/cases', async (req, res) => {
  const allCases = await Case.find({});
  res.json(allCases);
});

// Define the User schema
app.get('/api/users', Auth, async (req, res) => {
  const allUsers = await User.find({});
  res.json(allUsers);
});

// Define the Group schema
app.get('/api/groups', Auth, async (req, res) => {
  const allGroups = await Group.find({});
  res.json(allGroups);
});

// Login post api
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).send('Invalid user');

  const match = bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send('Invalid');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 3600000
  });

  console.log(`User ${user.username} logged in successfully`);
  console.log(password);

  res.status(200).json({ message: 'Logged in successfully' });
});

// Logout post api
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/api/verify', Auth, (req, res) => {
  res.status(200).json({ user: req.user });
});

app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));