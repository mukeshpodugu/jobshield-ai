const express = require('express');
const router = express.Router();
const { submitReview, getReviews, getMyReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, submitReview)
  .get(getReviews);

router.get('/myreviews', protect, getMyReviews);

module.exports = router;
