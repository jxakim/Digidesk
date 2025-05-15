const mongoose = require('mongoose');

const Case = new mongoose.Schema({
  Name: String,
  Desc: String,
});

module.exports = mongoose.model('cases', Case);