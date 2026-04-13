const mongoose = require('mongoose');

const TrendingSchema = new mongoose.Schema({
  category: String,
  captions: [{
    text: String,
    viralScore: Number
  }],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trending', TrendingSchema);
