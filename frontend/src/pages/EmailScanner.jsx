import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, AlertTriangle, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EmailScanner() {
  const { token, API_BASE_URL } = useApp();
  
  const [sender, setSender] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!body.trim()) {
      setError('Please provide email body text.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/scans/email`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: body, sender })
      });

      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      } else {
        setError(json.message || 'Email scan failed.');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Recruitment Phishing Scanner</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Paste the recruiter's email message and sender address to audit link safety, webmail domains, and phishing tricks.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-danger flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Input Form */}
      {!result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleScan} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Sender's Email Address (Optional)</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="e.g., hr-team@careers-netflix.org"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40 rounded-xl text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email Body Content</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                placeholder="Paste the email headers or the full message content here..."
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-accent/40 font-sans text-sm transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition flex items-center justify-center gap-1.5"
              >
                {loading ? 'Evaluating threat vectors...' : 'Initialize Phishing Audit'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center font-mono ${
                result.risk_score >= 75 ? 'border-rose-500 text-rose-500 bg-rose-500/5' :
                result.risk_score >= 45 ? 'border-orange-500 text-orange-500 bg-orange-500/5' :
                'border-emerald-500 text-emerald-500 bg-emerald-500/5'
              }`}>
                <span className="text-2xl font-black">{result.risk_score}%</span>
                <span className="text-[9px] uppercase font-bold tracking-wider -mt-1">Threat</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold">Phishing Audit Report</h3>
                  <span className={`px-2 py-0.5 text-xs font-bold border rounded-full ${getRiskColor(result.risk_level)}`}>
                    {result.risk_level} Risk
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Audit compiled successfully. Matches {result.red_flags.length} red flags.
                </p>
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setSender(''); setBody(''); }}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Scan Another Email
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Red Flags List */}
            <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-md font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                Security Flags Found
              </h3>
              {result.red_flags.length > 0 ? (
                <ul className="space-y-3">
                  {result.red_flags.map((flag, idx) => (
                    <li key={idx} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                      <span className="text-xs text-rose-800 dark:text-rose-300 font-medium">{flag}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Verified Secure Email</p>
                  <p className="text-[11px] text-slate-500">The writing structures and sender markers indicate standard corporate mail.</p>
                </div>
              )}
            </div>

            {/* Score Breakdowns */}
            <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="text-md font-bold">Threat Vulnerability Map</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Phishing Triggers</span>
                    <span className="font-mono">{result.breakdown.phishing_triggers}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${result.breakdown.phishing_triggers}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Sender Credibility</span>
                    <span className="font-mono">{result.breakdown.sender_credibility}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${result.breakdown.sender_credibility}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Generic Greetings</span>
                    <span className="font-mono">{result.breakdown.generic_greeting}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${result.breakdown.generic_greeting}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Hyperlink Integrity</span>
                    <span className="font-mono">{result.breakdown.link_safety}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${result.breakdown.link_safety}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
