const Review = require('../models/Review');
const Scan = require('../models/Scan');
const User = require('../models/User');
const Company = require('../models/Company');

// @desc    Get moderation queue (unapproved reviews)
// @route   GET /api/admin/reviews/pending
// @access  Private/Admin
exports.getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Moderate a review (approve, flag, or delete)
// @route   PUT /api/admin/reviews/:id
// @access  Private/Admin
exports.moderateReview = async (req, res) => {
  try {
    const { action } = req.body; // 'approve', 'flag', or 'delete'
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (action === 'approve') {
      review.isApproved = true;
      review.isFlagged = false;
      await review.save();

      // If review is approved and rated low (1 or 2), increment the flagCount of the company
      if (review.rating <= 2) {
        await Company.findOneAndUpdate(
          { domain: review.companyDomain },
          { $inc: { flagCount: 1 }, $set: { trustScore: Math.max(10, 85 - (review.rating === 1 ? 25 : 15)) } }
        );
      }
      
      res.json({ success: true, message: 'Review approved and published.', data: review });
    } else if (action === 'flag') {
      review.isFlagged = true;
      await review.save();
      res.json({ success: true, message: 'Review flagged for concern.', data: review });
    } else if (action === 'delete') {
      await Review.findByIdAndDelete(reviewId);
      res.json({ success: true, message: 'Review removed.' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid moderation action.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard metrics & analytics
// @route   GET /api/admin/metrics
// @access  Private/Admin
exports.getMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalScans = await Scan.countDocuments();
    const pendingReviews = await Review.countDocuments({ isApproved: false });
    
    // Count scans by type
    const jobScans = await Scan.countDocuments({ type: 'job' });
    const emailScans = await Scan.countDocuments({ type: 'email' });
    const salaryScans = await Scan.countDocuments({ type: 'salary' });
    const companyScans = await Scan.countDocuments({ type: 'company' });

    // Calculate critical threat count (risk score >= 75)
    const criticalThreats = await Scan.countDocuments({ riskScore: { $gte: 75 } });

    // Recent scans for dashboard activity feed
    const recentScans = await Scan.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalScans,
        pendingReviews,
        criticalThreats,
        breakdown: {
          job: jobScans,
          email: emailScans,
          salary: salaryScans,
          company: companyScans
        }
      },
      recentActivity: recentScans
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
