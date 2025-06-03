const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const Case = require('./models/Case');
const User = require('./models/User')
const Auth = require('./middleware/auth');

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Routes
const casesRouter = require('./routes/cases');
app.use('/api/cases', casesRouter);

// Connect to MongoDB
try {
  mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
} catch (err) {
  console.error(err.message);
  throw err;
}


// Define the Case schema
app.get('/api/cases', async (req, res) => {
  const allCases = await Case.find({});
  res.json(allCases);
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