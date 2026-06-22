import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { MessageSquare, Star, Search, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentReviews() {
  const { user, token, API_BASE_URL } = useApp();
  
  const [reviews, setReviews] = useState([]);
  const [filterDomain, setFilterDomain] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Submit Form States
  const [showForm, setShowForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyDomain, setCompanyDomain] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async (domainSearch = '') => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/reviews`;
      if (domainSearch) {
        url += `?domain=${encodeURIComponent(domainSearch)}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setReviews(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReviews(filterDomain);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !companyDomain.trim() || !jobTitle.trim() || !reviewText.trim()) {
      setSubmitError('Please complete all form fields.');
      return;
    }
    if (reviewText.trim().length < 20) {
      setSubmitError('Review details must be at least 20 characters.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName,
          companyDomain,
          jobTitle,
          rating,
          reviewText
        })
      });

      const json = await res.json();
      if (json.success) {
        setSubmitSuccess(json.message);
        setCompanyName('');
        setCompanyDomain('');
        setJobTitle('');
        setRating(5);
        setReviewText('');
        // Hide form shortly after
        setTimeout(() => {
          setShowForm(false);
          setSubmitSuccess('');
        }, 3000);
      } else {
        setSubmitError(json.message || 'Submission failed.');
      }
    } catch (err) {
      setSubmitError('Server connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Student Review Portal</h1>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            Share feedback about internships, workplaces, or toxic contracts to alert your fellow students.
          </p>
        </div>
        
        {user ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-accent hover:bg-accent/90 text-white text-sm font-bold rounded-xl shadow-lg shadow-accent/20 transition"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            Write Warning Review
          </button>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 border border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition"
          >
            Login to Review
          </Link>
        )}
      </div>

      {/* Review Submission Form Overlay/Block */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8 overflow-hidden"
        >
          <h3 className="text-md font-bold mb-4">Post a Student Advisory Review</h3>
          
          {submitError && (
            <div className="mb-4 p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg text-xs font-semibold text-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {submitSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Tech Startup Inc."
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-accent rounded-lg text-xs transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">Company Website Domain</label>
                <input
                  type="text"
                  required
                  value={companyDomain}
                  onChange={(e) => setCompanyDomain(e.target.value)}
                  placeholder="e.g., techstartup.com"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-accent rounded-lg text-xs transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">Your Job Title</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Frontend Intern, Data Analyst..."
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-accent rounded-lg text-xs transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">Rating (1 to 5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-accent rounded-lg text-xs transition font-sans"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (Highly Recommended)</option>
                  <option value={4}>⭐⭐⭐⭐ (Decent Workplace)</option>
                  <option value={3}>⭐⭐⭐ (Average / Underpaid)</option>
                  <option value={2}>⭐⭐ (Highly Suspicious / Toxic)</option>
                  <option value={1}>⭐ (Total Scam / Fake Recruitment)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">Review Details</label>
              <textarea
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                placeholder="Explain why this role is suspicious or tell us about your experience..."
                className="w-full p-2.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-accent rounded-lg text-xs transition"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg shadow transition"
              >
                {submitting ? 'Submitting...' : 'Post Alert'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filter and Feed */}
      <div className="space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              placeholder="Search by company domain (e.g. google.com)..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-accent rounded-xl text-xs transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-secondary text-white text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
          >
            Filter
          </button>
        </form>

        {/* Reviews Feed */}
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-10">Fetching student feed...</p>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={rev.user?.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
                    <div>
                      <h4 className="text-xs font-bold">{rev.user?.name || 'Anonymous student'}</h4>
                      <p className="text-[10px] text-slate-400">Published {new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500' : 'text-slate-300'}`} />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <span>{rev.companyName}</span>
                    <span className="text-[10px] font-mono text-slate-400 font-normal">({rev.companyDomain})</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">Role: {rev.jobTitle}</div>
                </div>

                <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                  "{rev.reviewText}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No warning reviews match this query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
