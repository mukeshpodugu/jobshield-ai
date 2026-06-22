const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a company name'],
    unique: true,
    trim: true
  },
  domain: {
    type: String,
    required: [true, 'Please add a domain'],
    unique: true,
    lowercase: true,
    trim: true
  },
  industry: {
    type: String,
    default: 'Technology & Services'
  },
  description: {
    type: String,
    default: ''
  },
  trustScore: {
    type: Number,
    default: 85,
    min: 0,
    max: 100
  },
  flagCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  registrationNumber: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Company', CompanySchema);
