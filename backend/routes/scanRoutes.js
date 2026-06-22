const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeJob, analyzeEmail, analyzeSalary, getScanHistory } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

// Set up multer memory storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
// We make protect optional on analysis endpoints, meaning if a user is logged in they get history logged, 
// but anonymous guests can still run scans.
const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/job', upload.single('file'), optionalProtect, analyzeJob);
router.post('/email', optionalProtect, analyzeEmail);
router.post('/salary', optionalProtect, analyzeSalary);
router.get('/history', protect, getScanHistory);

module.exports = router;
