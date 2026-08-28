const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 30 },
  stars: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true, trim: true, maxlength: 300 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
