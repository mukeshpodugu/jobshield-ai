const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for developmental flexibility
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const companyRoutes = require('./routes/companyRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to JobShield AI API - Fake Job & Phishing Detection System' });
});

// Seed Database Function
const seedDatabase = async () => {
  try {
    const User = require('./models/User');
    const Company = require('./models/Company');

    // Check if an admin exists
    const adminExists = await User.findOne({ email: 'admin@jobshield.ai' });
    if (!adminExists) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@jobshield.ai',
        password: 'adminpassword123', // Will be hashed by save hook
        role: 'admin',
        avatar: 'https://cdn-icons-png.flaticon.com/512/2206/2206368.png'
      });
      console.log('Seeded Admin account (admin@jobshield.ai / adminpassword123)');
    }

    // Seed some initial companies
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      const companiesToSeed = [
        { name: 'Google LLC', domain: 'google.com', trustScore: 99, isVerified: true, description: 'Verified technology enterprise.' },
        { name: 'Microsoft Corporation', domain: 'microsoft.com', trustScore: 98, isVerified: true, description: 'Verified cloud and operating systems provider.' },
        { name: 'Amazon Web Services', domain: 'amazon.com', trustScore: 97, isVerified: true, description: 'Verified ecommerce and cloud leader.' },
        { name: 'Telegram Job Scam Mimic', domain: 'telegram-joboffer.com', trustScore: 12, isVerified: false, description: 'Domain registered recently with suspected phishing profiles.' }
      ];
      await Company.insertMany(companiesToSeed);
      console.log('Seeded initial company registry samples');
    }
  } catch (error) {
    console.error('Database seeding failed:', error.message);
  }
};

// Run Seeder shortly after database starts
setTimeout(seedDatabase, 3000);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server encountered an unexpected error.'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
