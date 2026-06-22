const express = require('express');
const router = express.Router();
const { verifyCompany, getCompanies } = require('../controllers/companyController');

router.post('/verify', verifyCompany);
router.get('/', getCompanies);

module.exports = router;
