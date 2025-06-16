require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Group = require('./models/Group'); // Import the Group model

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Connected to MongoDB");

  // Fetch the Admin group
  const adminGroup = await Group.findOne({ name: 'Admin' });
  if (!adminGroup) {
    console.error('Admin group does not exist. Please create it first.');
    return process.exit(1);
  }

  const existingUser = await User.findOne({ username: 'admin' });
  if (existingUser) {
    console.log('Admin user already exists');
    return process.exit();
  }

  const password = await bcrypt.hash('admin', 10);
  const adminUser = new User({
    username: 'admin',
    password,
    group: adminGroup._id, // Associate the user with the Admin group
  });

  await adminUser.save();
  console.log('Admin user seeded');
  process.exit();
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});