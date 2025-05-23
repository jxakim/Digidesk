require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Connected to MongoDB");

  const existing = await User.findOne({ username: 'admin' });
  if (existing) {
    console.log('User already exists');
    return process.exit();
  }

  const password = await bcrypt.hash('admin', 10);
  const user = new User({
    username: 'admin',
    password
  });

  await user.save();
  console.log('Admin user seeded');
  process.exit();
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
