import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, History, Shield, AlertTriangle, ShieldCheck, Mail, TrendingUp, Search } from 'lucide-react';

export default function Dashboard() {
  const { user, token, API_BASE_URL } = useApp();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/scans/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) {
          setHistory(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token, navigate]);

  if (!user) return null;

  // Calculate user stats
  const totalScans = history.length;
  const avgRisk = totalScans > 0 
    ? Math.round(history.reduce((acc, scan) => acc + scan.riskScore, 0) / totalScans) 
    : 0;
  const criticalThreats = history.filter(scan => scan.riskScore >= 75).length;

  const getScanIcon = (type) => {
    switch (type) {
      case 'job': return <Shield className="w-4.5 h-4.5 text-accent" />;
      case 'email': return <Mail className="w-4.5 h-4.5 text-indigo-500" />;
      case 'salary': return <TrendingUp className="w-4.5 h-4.5 text-emerald-500" />;
      default: return <Search className="w-4.5 h-4.5 text-slate-500" />;
    }
  };

  const getRiskBadge = (score) => {
    if (score >= 75) return <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">Critical</span>;
    if (score >= 45) return <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">High</span>;
    return <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Safe</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt="User Avatar" className="w-12 h-12 rounded-full ring-2 ring-accent" />
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-slate-500">Account Role: {user.role === 'admin' ? 'Administrator' : 'Student Candidate'}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link to="/analyze" className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-xs font-bold rounded-lg transition">
            Scan New Job
          </Link>
          <Link to="/email-scanner" className="px-4 py-2 border border-slate-350 dark:border-slate-800 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition">
            Scan Email
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Audits Done</div>
          <div className="text-3xl font-extrabold mt-1">{totalScans}</div>
          <div className="text-[10px] text-slate-500 mt-1">Logged session history</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Risk Score</div>
          <div className="text-3xl font-extrabold mt-1">{avgRisk}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Platform index comparison</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Threats Flagged</div>
          <div className="text-3xl font-extrabold mt-1 text-rose-500">{criticalThreats}</div>
          <div className="text-[10px] text-slate-500 mt-1">Risk score &gt;= 75% logs</div>
        </div>
      </div>

      {/* History Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-md font-bold mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-accent" />
          Recent Security Audit Logs
        </h3>

        {loading ? (
          <p className="text-xs text-slate-400 text-center py-8">Fetching logs...</p>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-400">
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Audit Target</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Risk Level</th>
                  <th className="py-3 px-2 text-right">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-300">
                {history.map((scan) => (
                  <tr key={scan._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition">
                    <td className="py-3.5 px-2 flex items-center gap-2 font-semibold">
                      {getScanIcon(scan.type)}
                      <span className="capitalize">{scan.type}</span>
                    </td>
                    <td className="py-3.5 px-2 max-w-xs truncate">
                      {scan.type === 'salary' 
                        ? `${scan.inputData.title} ($${scan.inputData.salary.toLocaleString()})`
                        : scan.type === 'company'
                        ? scan.inputData.domain
                        : scan.inputData.text || 'Document parsed content'}
                    </td>
                    <td className="py-3.5 px-2 text-slate-500">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-2">
                      {getRiskBadge(scan.riskScore)}
                    </td>
                    <td className="py-3.5 px-2 text-right font-bold font-mono">
                      {scan.riskScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <Shield className="w-8 h-8 text-slate-305 mx-auto mb-2" />
            <p className="text-xs text-slate-500">You haven't run any threat audits yet.</p>
            <Link to="/analyze" className="text-xs text-accent font-semibold hover:underline mt-1 inline-block">
              Scan your first job description
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
