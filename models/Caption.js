const mongoose = require('mongoose');

const CaptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: String,
  platform: String,
  tone: String,
  language: String,
  captions: [String],
  hashtags: [String],
  hooks: [String],
  titles: [String],
  viralScore: Number,
}, { timestamps: true });

module.exports = mongoose.model('Caption', CaptionSchema);
