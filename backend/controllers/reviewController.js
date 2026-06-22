const Review = require('../models/Review');
const Company = require('../models/Company');

// @desc    Submit a student review
// @route   POST /api/reviews
// @access  Private (Registered students/users only)
exports.submitReview = async (req, res) => {
  try {
    const { companyName, companyDomain, jobTitle, rating, reviewText } = req.body;

    if (!companyName || !companyDomain || !jobTitle || !rating || !reviewText) {
      return res.status(400).json({ success: false, message: 'Please provide all review parameters.' });
    }

    const cleanDomain = companyDomain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase().trim();

    // Create review (defaults to unapproved)
    const review = await Review.create({
      user: req.user.id,
      companyName,
      companyDomain: cleanDomain,
      jobTitle,
      rating: parseInt(rating),
      reviewText,
    });

    // Populate user name and details for response
    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. It is pending moderation review.',
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all approved reviews or filter by company domain
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const { domain } = req.query;
    let query = { isApproved: true };

    if (domain) {
      const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase().trim();
      query.companyDomain = cleanDomain;
    }

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
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

// @desc    Get current user's submitted reviews
// @route   GET /api/reviews/myreviews
// @access  Private
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
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
