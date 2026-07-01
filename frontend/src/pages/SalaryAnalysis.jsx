import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useApp } from '../context/AppContext';

export default function SalaryAnalysis() {
  const { token, API_BASE_URL } = useApp();
  
  const [title, setTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState('Entry');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !salary) {
      setError('Please provide both job title and salary.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token && token !== 'null' && token !== 'undefined') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/scans/salary`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title,
          salary: parseFloat(salary),
          experience_level: experience
        })
      });

      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      } else {
        setError(json.message || 'Salary audit failed.');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  // Convert stats to Recharts format
  const getChartData = () => {
    if (!result) return [];
    const { market_range } = result;
    return [
      { name: 'Market Minimum', value: market_range.min },
      { name: 'Market Average', value: market_range.avg },
      { name: 'Market Maximum', value: market_range.max },
      { name: 'Your Offer', value: result.salary_offered }
    ];
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'normal':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Market Standard</span>;
      case 'suspicious_high':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/25 flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Suspiciously High</span>;
      case 'suspicious_low':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Suspiciously Low</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Salary Anomaly Check</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Verify if compensation numbers are realistic compared to market averages, to block high-paying mock-scams.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-danger flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Input Module */}
      {!result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Software Engineer, Data Entry Clerk..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-accent/40 text-sm transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Offered Salary (Annual USD)</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g., 65000"
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-accent/40 text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Experience Tier</label>
              <div className="grid grid-cols-3 gap-3">
                {['Entry', 'Mid', 'Senior'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperience(lvl)}
                    className={`py-3.5 text-sm font-semibold rounded-xl border transition ${
                      experience === lvl
                        ? 'border-accent bg-accent/10 text-accent font-bold'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {lvl} Level
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition flex items-center justify-center gap-1.5"
              >
                {loading ? 'Analyzing Pay Rates...' : 'Run Salary Audit'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Results Module */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Scoring Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center font-mono ${
                result.status === 'normal' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' :
                result.status === 'suspicious_low' ? 'border-amber-500 text-amber-500 bg-amber-500/5' :
                'border-rose-500 text-rose-500 bg-rose-500/5'
              }`}>
                <span className="text-2xl font-black">{result.anomaly_score}%</span>
                <span className="text-[9px] uppercase font-bold tracking-wider -mt-1">Anomaly</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold">{result.role_matched}</h3>
                  {getStatusBadge(result.status)}
                </div>
                <p className="text-xs text-slate-500">
                  Experience Tier: {result.experience_level} Level
                </p>
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setTitle(''); setSalary(''); }}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Scan Another Salary
            </button>
          </div>

          {/* Detailed Message */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 rounded-xl">
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-accent" />
              ANALYSIS SUMMARY
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{result.message}</p>
          </div>

          {/* Recharts Visualizer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Compensation Benchmark Visualization
            </h3>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val/1000}k`} tickLine={false} />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Compensation']}
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {getChartData().map((entry, index) => (
                      <path 
                        key={index} 
                        fill={entry.name === 'Your Offer' 
                          ? (result.status === 'normal' ? '#22C55E' : result.status === 'suspicious_low' ? '#F59E0B' : '#EF4444') 
                          : '#14B8A6'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
