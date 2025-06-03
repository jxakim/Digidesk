const mongoose = require('mongoose');

const Case = new mongoose.Schema({
  Name: String,
  Desc: String,
  Created: Date,
  Updated: Date,
  Status: { type: String, default: 'recognized', },
  Category: String,
  Subcategory: String
});

module.exports = mongoose.model('cases', Case);