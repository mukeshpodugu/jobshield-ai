import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, Upload, AlertCircle, RefreshCw, CheckCircle, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AnalyzeJob() {
  const { token, API_BASE_URL } = useApp();
  
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const scanSteps = [
    "Uploading data packages...",
    "Extracting document characters...",
    "Injecting text into NLP engine...",
    "Evaluating linguistic scam vectors...",
    "Compiling critical risk report..."
  ];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setError('File size exceeds the 5MB limit.');
        return;
      }
      setFile(selected);
      setText(''); // clear text box
      setError('');
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) {
      setError('Please enter a description or upload a file.');
      return;
    }

    setError('');
    setResult(null);
    setScanning(true);
    setScanStep(0);

    // Simulate scanning step transitions for rich UI engagement
    const stepInterval = setInterval(() => {
      setScanStep(prev => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 900);

    try {
      const formData = new FormData();
      let res;
      
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      if (file) {
        formData.append('file', file);
        res = await fetch(`${API_BASE_URL}/scans/job`, {
          method: 'POST',
          headers,
          body: formData
        });
      } else {
        res = await fetch(`${API_BASE_URL}/scans/job`, {
          method: 'POST',
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text })
        });
      }

      const json = await res.json();
      
      // Delay slightly if API finishes early to maintain scanning animation feel
      setTimeout(() => {
        clearInterval(stepInterval);
        setScanning(false);
        if (json.success) {
          setResult(json.data);
        } else {
          setError(json.message || 'Analysis failed. Please try again.');
        }
      }, 1500);

    } catch (err) {
      clearInterval(stepInterval);
      setScanning(false);
      setError('Connection to security server timed out.');
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
        <h1 className="text-3xl font-extrabold tracking-tight">Job Posting Scanner</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Upload PDF/DOCX resumes or copy-paste description text to inspect recruitment safety levels.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-danger flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Input Module */}
      {!scanning && !result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleScan} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Paste Job Description</label>
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setFile(null); }}
                rows={8}
                placeholder="Paste the entire job posting description, requirements, benefits, and instructions here..."
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-accent/40 font-sans text-sm transition"
              />
            </div>

            <div className="relative flex items-center justify-center py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-white dark:bg-slate-900 text-xs text-slate-400 uppercase font-mono">OR UPLOAD DOCUMENT</span>
            </div>

            <div>
              <div className="flex items-center justify-center w-full">
                <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition ${
                  file ? 'border-accent bg-accent/5' : 'border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-850'
                }`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {file ? (
                      <>
                        <FileText className="w-8 h-8 text-accent mb-2 animate-bounce" />
                        <p className="text-sm font-bold text-accent">{file.name}</p>
                        <p className="text-xs text-slate-400">File loaded successfully</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500"><span className="font-semibold text-accent">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-slate-400">PDF, DOCX, or TXT (Max 5MB)</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Initialize Threat Analysis
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scanning Module */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-white space-y-6 shadow-xl py-16"
          >
            <div className="flex justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
                <Shield className="w-8 h-8 text-accent absolute top-6 left-6" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-mono">JobShield AI Scanning Core</h3>
              <p className="text-sm text-slate-400 h-6 transition-all duration-350">{scanSteps[scanStep]}</p>
            </div>

            <div className="max-w-xs mx-auto bg-slate-850 h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                transition={{ duration: 0.8 }}
              ></motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Module */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/85 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-black font-mono ${
                result.risk_score >= 75 ? 'border-rose-500 text-rose-500 bg-rose-500/5' :
                result.risk_score >= 45 ? 'border-orange-500 text-orange-500 bg-orange-500/5' :
                'border-emerald-500 text-emerald-500 bg-emerald-500/5'
              }`}>
                {result.risk_score}%
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold">Risk Assessment</h3>
                  <span className={`px-2 py-0.5 text-xs font-bold border rounded-full ${getRiskColor(result.risk_level)}`}>
                    {result.risk_level} Risk
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Calculated based on threat profiles matching {result.red_flags.length} red flags.
                </p>
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setText(''); setFile(null); }}
              className="px-4 py-2 border border-slate-350 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Scan Another Job
            </button>
          </div>

          {/* Breakdown & Flags */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Flags (8 cols) */}
            <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-md font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                Security Red Flags
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
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">No major anomalies detected!</p>
                  <p className="text-[11px] text-slate-500">The text structures adhere to standard professional listings.</p>
                </div>
              )}
            </div>

            {/* Sub-Scores (5 cols) */}
            <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="text-md font-bold">Linguistic Vulnerability Map</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Financial Solicitation</span>
                    <span className="font-mono">{result.breakdown.financial_risk}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${result.breakdown.financial_risk}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Unsecure Messaging Channels</span>
                    <span className="font-mono">{result.breakdown.communication_risk}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${result.breakdown.communication_risk}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Urgency & Vague Perks</span>
                    <span className="font-mono">{result.breakdown.urgency_risk}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${result.breakdown.urgency_risk}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Formatting Anomalies</span>
                    <span className="font-mono">{result.breakdown.formatting_anomalies}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${result.breakdown.formatting_anomalies}%` }}></div>
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
