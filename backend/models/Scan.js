const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null indicates a guest (anonymous) scan
  },
  type: {
    type: String,
    enum: ['job', 'email', 'salary', 'company'],
    required: true
  },
  inputData: {
    type: mongoose.Schema.Types.Mixed, // Stores the input object parsed (text, salary details, etc.)
    required: true
  },
  result: {
    type: mongoose.Schema.Types.Mixed, // Stores JSON response containing scores, breakdowns, red flags
    required: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Scan', ScanSchema);
