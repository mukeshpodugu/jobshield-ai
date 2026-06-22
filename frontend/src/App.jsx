import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages Imports
import LandingPage from './pages/LandingPage';
import AnalyzeJob from './pages/AnalyzeJob';
import CompanyVerification from './pages/CompanyVerification';
import SalaryAnalysis from './pages/SalaryAnalysis';
import EmailScanner from './pages/EmailScanner';
import StudentReviews from './pages/StudentReviews';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import LoginRegister from './pages/LoginRegister';
import Contact from './pages/Contact';

// Protected Route components
const ProtectedRoute = ({ children }) => {
  const { token, authLoading } = useApp();
  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">Verifying session key...</div>;
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, token, authLoading } = useApp();
  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">Verifying admin key...</div>;
  return token && user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

function AppContent() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-bgLight dark:bg-bgDark text-primary dark:text-white transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<AnalyzeJob />} />
            <Route path="/company-verify" element={<CompanyVerification />} />
            <Route path="/salary" element={<SalaryAnalysis />} />
            <Route path="/email-scanner" element={<EmailScanner />} />
            <Route path="/reviews" element={<StudentReviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginRegister />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              } 
            />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
