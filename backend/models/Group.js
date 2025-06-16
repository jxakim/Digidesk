const mongoose = require('mongoose');

const Group = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: { type: [String], default: [] },
});

module.exports = mongoose.model('Group', Group);
