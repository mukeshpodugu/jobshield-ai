import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Users, Check, X, Flag, AlertCircle, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminPanel() {
  const { user, token, API_BASE_URL } = useApp();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // 1. Fetch admin metrics
      const metricsRes = await fetch(`${API_BASE_URL}/admin/metrics`, { headers });
      const metricsJson = await metricsRes.json();
      
      // 2. Fetch pending reviews
      const reviewsRes = await fetch(`${API_BASE_URL}/admin/reviews/pending`, { headers });
      const reviewsJson = await reviewsRes.json();
      
      // 3. Fetch users list
      const usersRes = await fetch(`${API_BASE_URL}/admin/users`, { headers });
      const usersJson = await usersRes.json();

      if (metricsJson.success && reviewsJson.success && usersJson.success) {
        setMetrics(metricsJson.metrics);
        setPendingReviews(reviewsJson.data);
        setUsersList(usersJson.data);
      }
    } catch (err) {
      setError('Failed to fetch admin metrics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [token, user, navigate]);

  const handleModerate = async (reviewId, action) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(json.message);
        // Refresh listings
        fetchData();
      } else {
        setError(json.message || 'Moderation failed.');
      }
    } catch (err) {
      setError('Connection to moderation services failed.');
    }
  };

  if (!user || user.role !== 'admin') return null;

  // Chart data configuration
  const getPieData = () => {
    if (!metrics) return [];
    return [
      { name: 'Job Scans', value: metrics.breakdown.job, color: '#14B8A6' },
      { name: 'Email Scans', value: metrics.breakdown.email, color: '#6366F1' },
      { name: 'Salary Scans', value: metrics.breakdown.salary, color: '#10B981' },
      { name: 'Company Scans', value: metrics.breakdown.company, color: '#64748B' }
    ];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-500">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Security Moderation Panel</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Audit user complaints, verify suspicious corporate domains, and monitor platform metrics.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-danger flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 flex items-start gap-3">
          <Check className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="text-sm font-medium">{success}</div>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-slate-400 text-center py-10">Loading security details...</p>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Users</div>
              <div className="text-2xl font-extrabold mt-1">{metrics?.totalUsers}</div>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total System Scans</div>
              <div className="text-2xl font-extrabold mt-1">{metrics?.totalScans}</div>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</div>
              <div className="text-2xl font-extrabold mt-1 text-amber-500">{metrics?.pendingReviews}</div>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Threats Flagged</div>
              <div className="text-2xl font-extrabold mt-1 text-rose-500">{metrics?.criticalThreats}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Review Moderation Queue (8 columns) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-md font-bold">Pending Review Moderation Queue</h3>
              
              {pendingReviews.length > 0 ? (
                <div className="space-y-4">
                  {pendingReviews.map((rev) => (
                    <div key={rev._id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/40 dark:border-slate-850 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <img src={rev.user?.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{rev.user?.name}</div>
                            <div className="text-[10px] text-slate-400">{rev.user?.email}</div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-bold">{rev.companyName} ({rev.companyDomain})</div>
                        <div className="text-[10px] font-semibold text-slate-500">Role: {rev.jobTitle} | Rating: {rev.rating}⭐</div>
                        <p className="text-xs text-slate-650 dark:text-slate-300">"{rev.reviewText}"</p>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-850/50">
                        <button
                          onClick={() => handleModerate(rev._id, 'delete')}
                          className="px-3 py-1.5 border border-slate-350 dark:border-slate-800 hover:bg-rose-500/5 hover:text-danger text-[11px] font-bold rounded-lg transition flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject / Delete
                        </button>
                        <button
                          onClick={() => handleModerate(rev._id, 'flag')}
                          className="px-3 py-1.5 border border-slate-350 dark:border-slate-800 hover:bg-amber-500/5 hover:text-amber-500 text-[11px] font-bold rounded-lg transition flex items-center gap-1"
                        >
                          <Flag className="w-3.5 h-3.5" />
                          Flag
                        </button>
                        <button
                          onClick={() => handleModerate(rev._id, 'approve')}
                          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-550 py-10 text-center">No reviews pending moderation review.</p>
              )}
            </div>

            {/* Scan Distribution Chart (4 columns) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <h3 className="text-md font-bold mb-4 flex items-center gap-1.5">
                <BarChart3 className="w-5 h-5 text-accent" />
                Scan Distributions
              </h3>
              
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPieData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {getPieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend iconSize={10} layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* User Management List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-md font-bold flex items-center gap-1.5">
              <Users className="w-5 h-5 text-accent" />
              Registered Accounts
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-400">
                    <th className="py-2.5 px-2">Name</th>
                    <th className="py-2.5 px-2">Email</th>
                    <th className="py-2.5 px-2">Role</th>
                    <th className="py-2.5 px-2">Member Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-705 dark:text-slate-300">
                  {usersList.map((usr) => (
                    <tr key={usr._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                      <td className="py-3 px-2 flex items-center gap-2 font-semibold">
                        <img src={usr.avatar} alt="Avatar" className="w-6 h-6 rounded-full" />
                        {usr.name}
                      </td>
                      <td className="py-3 px-2 font-mono">{usr.email}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          usr.role === 'admin' 
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-500">{new Date(usr.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
