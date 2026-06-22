const Company = require('../models/Company');
const Review = require('../models/Review');

// Whitelisted highly trusted domains
const TRUSTED_DOMAINS = [
  'google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'meta.com', 'netflix.com',
  'ibm.com', 'oracle.com', 'salesforce.com', 'adobe.com', 'intel.com', 'cisco.com',
  'accenture.com', 'tcs.com', 'infosys.com', 'wipro.com', 'cognizant.com', 'capgemini.com',
  'deloitte.com', 'pwc.com', 'ey.com', 'kpmg.com', 'jpmorgan.com', 'goldmansachs.com',
  'morganstanley.com', 'citigroup.com', 'wellsfargo.com', 'bankofamerica.com', 'hsbc.com'
];

// Helper to calculate trust score based on heuristics
const calculateTrustScore = (domain) => {
  const dom = domain.toLowerCase().trim();
  
  if (TRUSTED_DOMAINS.includes(dom) || dom.endsWith('.edu') || dom.endsWith('.gov')) {
    return { score: 98, isVerified: true, details: 'Established enterprise or educational institution domain.' };
  }

  let score = 75; // Baseline
  let details = 'Standard domain. Verification pending detailed audits.';

  // Suspicious subwords in domain
  const suspiciousKeywords = ['job', 'career', 'hr', 'portal', 'recruitment', 'offer', 'verify', 'support', 'helpdesk'];
  let kwMatches = suspiciousKeywords.filter(kw => dom.includes(kw) && !TRUSTED_DOMAINS.some(td => td.includes(kw)));
  
  if (kwMatches.length > 0) {
    score -= 15;
    details = `Domain contains recruitment indicators (${kwMatches.join(', ')}) in generic TLD.`;
  }

  // Free email domain checks (mimicked as company domains)
  const freeMails = ['gmail', 'yahoo', 'hotmail', 'outlook', 'protonmail', 'mail', 'aol'];
  if (freeMails.some(fm => dom.startsWith(fm))) {
    score -= 30;
    details = 'Domain uses common webmail prefixes (high risk of phishing replication).';
  }

  // Domain structure checks
  if (dom.includes('-')) {
    score -= 10;
  }
  
  // TLD trust checks
  if (dom.endsWith('.xyz') || dom.endsWith('.club') || dom.endsWith('.top') || dom.endsWith('.online') || dom.endsWith('.site') || dom.endsWith('.tech')) {
    score -= 15;
    details += ' Domain uses high-risk, low-cost TLD extension.';
  }

  return {
    score: Math.max(score, 10),
    isVerified: score >= 80,
    details
  };
};

// @desc    Verify Company by Domain
// @route   POST /api/companies/verify
// @access  Public
exports.verifyCompany = async (req, res) => {
  try {
    const { name, domain } = req.body;

    if (!domain) {
      return res.status(400).json({ success: false, message: 'Please provide a company domain name.' });
    }

    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase().trim();
    
    // Find or create company
    let company = await Company.findOne({ domain: cleanDomain });

    if (!company) {
      const heuristics = calculateTrustScore(cleanDomain);
      company = await Company.create({
        name: name || cleanDomain.split('.')[0].toUpperCase(),
        domain: cleanDomain,
        trustScore: heuristics.score,
        isVerified: heuristics.isVerified,
        description: heuristics.details
      });
    }

    // Get aggregated reviews statistics
    const reviews = await Review.find({ companyDomain: cleanDomain, isApproved: true });
    
    let avgRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
      avgRating = parseFloat((sum / reviews.length).toFixed(1));
    }

    res.json({
      success: true,
      data: {
        _id: company._id,
        name: company.name,
        domain: company.domain,
        industry: company.industry,
        description: company.description,
        trustScore: company.trustScore,
        flagCount: company.flagCount,
        isVerified: company.isVerified,
        avgRating,
        reviewCount: reviews.length,
        reviews: reviews.slice(0, 5) // Return top 5 reviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all companies list (for directories)
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ trustScore: -1 }).limit(100);
    res.json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
