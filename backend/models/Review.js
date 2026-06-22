const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: [true, 'Please add the company name'],
    trim: true
  },
  companyDomain: {
    type: String,
    required: [true, 'Please add the company website domain'],
    lowercase: true,
    trim: true
  },
  jobTitle: {
    type: String,
    required: [true, 'Please add the job title'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: [true, 'Please add your review details'],
    minlength: 20
  },
  isApproved: {
    type: Boolean,
    default: false // Reviews must be approved by the admin before they are displayed publicly
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
