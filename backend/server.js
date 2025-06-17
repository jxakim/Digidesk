const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const Case = require('./models/Case');
const User = require('./models/User');
const Group = require('./models/Group');
const Auth = require('./middleware/auth');
const checkPermission = require('./middleware/checkPermission');

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const casesRouter = require('./routes/cases');
app.use('/api/cases', casesRouter);

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
app.get('/api/cases', Auth, async (req, res) => {
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
    secure: true,
    sameSite: 'Strict',
    maxAge: 3600000
  });

  res.status(200).json({ message: 'Logged in successfully' });
});

app.get('/api/verify', Auth, (req, res) => {
  res.status(200).json({ user: req.user });
});

app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));