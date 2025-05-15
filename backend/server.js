const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Case = require('./models/Case');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
try {
  mongoose.connect(process.env.DATABASE_URL);
  console.log('MongoDB connected');
} catch (err) {
  console.error(err.message);
  throw err;
}

// Define the Case schema
app.get('/cases', async (req, res) => {
  console.log('GET /cases hit');
  const allCases = await Case.find({});
  res.json(allCases);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
