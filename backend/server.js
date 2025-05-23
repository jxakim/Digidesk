const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Case = require('./models/Case');
const User = require('./models/User')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());


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
  if (!user) return res.status(401).send('Invalid');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send('Invalid');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));