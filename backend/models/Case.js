const mongoose = require('mongoose');

const Case = new mongoose.Schema({
  Name: String,
  Desc: String,
  Created: Date,
  Updated: Date,
  Status: { type: String, default: 'recognized', },
  Category: String,
  Subcategory: String,
  Images: [{ type: String }],
  Archived: { type: Boolean, default: false },
  Trashed: { type: Boolean, default: false },
});

module.exports = mongoose.model('cases', Case);