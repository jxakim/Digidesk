const mongoose = require('mongoose');

const Group = new mongoose.Schema({
  name: String,
  permissions: String,
});

module.exports = mongoose.model('Group', Group);
