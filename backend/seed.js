const mongoose = require('mongoose');
const Case = require('./models/Case');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL)
  .then(async () => {
    console.log("Connected to MongoDB");

    await Case.insertMany([
      { Name: "Test", Desc: "This is a test" },
    ]);

    console.log("Test cases inserted");
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
