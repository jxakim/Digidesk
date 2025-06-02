const mongoose = require('mongoose');

const Case = new mongoose.Schema({
  Name: String,
  Desc: String,
  Created: Date,
  Updated: Date,
  Status: {
    type: String,
    enum: ['recognized', 'solved', 'in-progress'],
    default: 'recognized',
  },
  Category: String,
  Subcategory: String
});

module.exports = mongoose.model('cases', Case);