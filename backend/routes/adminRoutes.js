const express = require('express');
const router = express.Router();
const { getPendingReviews, moderateReview, getMetrics, getUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes under this router, and restrict to admins only
router.use(protect);
router.use(authorize('admin'));

router.get('/metrics', getMetrics);
router.get('/reviews/pending', getPendingReviews);
router.put('/reviews/:id', moderateReview);
router.get('/users', getUsers);

module.exports = router;
