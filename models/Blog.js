const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  content: String,
  metaTitle: String,
  metaDescription: String,
  captions: [String],
  hashtags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);
