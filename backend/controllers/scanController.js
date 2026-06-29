const axios = require('axios');
const pdfParse = require('pdf-parse');
const Scan = require('../models/Scan');

const FASTAPI_URL = (process.env.FASTAPI_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

// Helper to extract text from buffer based on mimetype
const extractTextFromBuffer = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (mimetype === 'text/plain') {
    return buffer.toString('utf-8');
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    mimetype === 'application/msword'
  ) {
    // Simple docx extraction fallback (strips non-ASCII or parses XML structures roughly, 
    // or falls back to text conversion since parsing zip streams requires node-zip packages)
    // For docx, we will extract readable text by filtering characters to avoid complex dependencies
    const cleanText = buffer.toString('utf-8').replace(/[^\x20-\x7E\t\r\n]/g, '');
    return cleanText || 'DOCX Content Loaded (Please paste text directly if content looks corrupted)';
  }
  return buffer.toString('utf-8');
};

// @desc    Analyze Job Description (text or file upload)
// @route   POST /api/scans/job
// @access  Public (logs to user if logged in)
exports.analyzeJob = async (req, res) => {
  try {
    let jobText = req.body.text;

    // Handle file upload
    if (req.file) {
      try {
        jobText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype);
      } catch (err) {
        return res.status(400).json({ success: false, message: `Failed to parse file: ${err.message}` });
      }
    }

    if (!jobText || jobText.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide job description text (minimum 10 characters).' });
    }

    // Call FastAPI service
    const response = await axios.post(`${FASTAPI_URL}/analyze/job`, { text: jobText });
    const nlpResult = response.data;

    // Log scan to DB
    const scanData = {
      type: 'job',
      inputData: { text: jobText.substring(0, 1000) + (jobText.length > 1000 ? '...' : '') },
      result: nlpResult,
      riskScore: nlpResult.risk_score,
      user: req.user ? req.user.id : null
    };

    const scan = await Scan.create(scanData);

    res.json({
      success: true,
      data: nlpResult,
      scanId: scan._id
    });
  } catch (error) {
    console.error(error);
    const statusCode = error.response ? error.response.status : 500;
    const msg = error.response ? error.response.data.detail : 'FastAPI NLP service is offline or unreachable';
    res.status(statusCode).json({ success: false, message: msg });
  }
};

// @desc    Analyze Recruitment Email Phishing
// @route   POST /api/scans/email
// @access  Public
exports.analyzeEmail = async (req, res) => {
  try {
    const { text, sender } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide email text (minimum 10 characters).' });
    }

    // Call FastAPI service
    const response = await axios.post(`${FASTAPI_URL}/analyze/email`, { text, sender: sender || "" });
    const nlpResult = response.data;

    // Log scan
    const scan = await Scan.create({
      type: 'email',
      inputData: { text: text.substring(0, 1000), sender: sender || "" },
      result: nlpResult,
      riskScore: nlpResult.risk_score,
      user: req.user ? req.user.id : null
    });

    res.json({
      success: true,
      data: nlpResult,
      scanId: scan._id
    });
  } catch (error) {
    console.error(error);
    const statusCode = error.response ? error.response.status : 500;
    const msg = error.response ? error.response.data.detail : 'FastAPI NLP service is offline';
    res.status(statusCode).json({ success: false, message: msg });
  }
};

// @desc    Analyze Salary Anomaly
// @route   POST /api/scans/salary
// @access  Public
exports.analyzeSalary = async (req, res) => {
  try {
    const { title, salary, experience_level } = req.body;

    if (!title || !salary || !experience_level) {
      return res.status(400).json({ success: false, message: 'Please provide job title, salary value, and experience level.' });
    }

    // Call FastAPI service
    const response = await axios.post(`${FASTAPI_URL}/analyze/salary`, {
      title,
      salary: parseFloat(salary),
      experience_level
    });
    const nlpResult = response.data;

    // Log scan
    const scan = await Scan.create({
      type: 'salary',
      inputData: { title, salary: parseFloat(salary), experience_level },
      result: nlpResult,
      riskScore: nlpResult.anomaly_score,
      user: req.user ? req.user.id : null
    });

    res.json({
      success: true,
      data: nlpResult,
      scanId: scan._id
    });
  } catch (error) {
    console.error(error);
    const statusCode = error.response ? error.response.status : 500;
    const msg = error.response ? error.response.data.detail : 'FastAPI NLP service is offline';
    res.status(statusCode).json({ success: false, message: msg });
  }
};

// @desc    Get user's scan history
// @route   GET /api/scans/history
// @access  Private
exports.getScanHistory = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({
      success: true,
      count: scans.length,
      data: scans
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
