const mongoose = require('mongoose');

const Group = new mongoose.Schema({
  name: String,
  permissions: Array,
});

module.exports = mongoose.model('Group', Group);
