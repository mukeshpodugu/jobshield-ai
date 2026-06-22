import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, ShieldCheck, HelpCircle, Star, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CompanyVerification() {
  const { API_BASE_URL } = useApp();
  
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [company, setCompany] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError('');
    setCompany(null);

    try {
      const res = await fetch(`${API_BASE_URL}/companies/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
      const json = await res.json();
      if (json.success) {
        setCompany(json.data);
      } else {
        setError(json.message || 'Could not verify domain');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 border-emerald-500 bg-emerald-500/5';
    if (score >= 50) return 'text-amber-500 border-amber-500 bg-amber-500/5';
    return 'text-rose-500 border-rose-500 bg-rose-500/5';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Corporate Registry Audit</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Verify corporate hiring domains (e.g., apple.com) to audit legitimacy, registration indicators, and warning logs.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter company website domain (e.g., google.com, careers-microsoft.org)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40 rounded-xl text-sm font-sans transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition flex items-center justify-center gap-1.5"
          >
            {loading ? 'Verifying...' : 'Verify Domain'}
          </button>
        </form>
        {error && <p className="text-xs text-danger font-medium mt-2">{error}</p>}
      </div>

      {/* Verification Result Card */}
      {company && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Info Block */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center font-mono ${getScoreColor(company.trustScore)}`}>
                  <span className="text-2xl font-black">{company.trustScore}</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider -mt-1">Trust</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-2.5">
                    <h2 className="text-2xl font-extrabold">{company.name}</h2>
                    {company.isVerified ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/25 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Suspicious
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-slate-500">{company.domain}</p>
                  <p className="text-xs text-slate-400">Industry: {company.industry}</p>
                </div>
              </div>

              {/* Reviews Aggregator Badge */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-xl text-center min-w-36">
                <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="text-sm font-extrabold">{company.avgRating || 'N/A'}</span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {company.reviewCount} Student Reviews
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-850">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Audit Verdict</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{company.description}</p>
            </div>
          </div>

          {/* Student Reviews details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-md font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              Recent Student Testimonials for {company.name}
            </h3>

            {company.reviews.length > 0 ? (
              <div className="space-y-4 pt-2">
                {company.reviews.map((rev, index) => (
                  <div key={index} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/40 dark:border-slate-800/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500' : 'text-slate-350'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Role: {rev.jobTitle}</div>
                    <p className="text-xs text-slate-500 leading-relaxed">"{rev.reviewText}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                No reviews recorded for this company domain.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
