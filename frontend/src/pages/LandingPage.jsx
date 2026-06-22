import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, BadgeAlert, CheckCircle, Search, TrendingUp, Users, ArrowRight, UserCheck } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const threatFeed = [
    { type: 'Job Post', target: 'Data Entry Clerk', issue: 'Urgent Wire Transfer Demand', score: 94, level: 'Critical' },
    { type: 'Email', target: 'HR Portal @careers-amazon.org', issue: 'Phishing domain mimicry', score: 85, level: 'High' },
    { type: 'Job Post', target: 'Virtual Assistant (No Exp)', issue: 'Telegram interview migration', score: 78, level: 'High' },
    { type: 'Salary', target: 'Software Intern ($160k/yr)', issue: 'Unrealistic pay anomaly', score: 88, level: 'High' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 dark:bg-slate-950 transition-colors">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left */}
            <motion.div 
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent border border-accent/20">
                <Shield className="w-3.5 h-3.5" />
                <span>Next-Gen Candidate Protection</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Identify <span className="text-danger">Fake Jobs</span> & <span className="text-accent">Recruitment Scams</span> Instantly
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
                Don't fall victim to identity theft, checks fraud, or unpaid labor. Validate company domains, scan job listings, and filter recruitment phishing emails using AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/analyze"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-accent hover:bg-accent/90 rounded-xl shadow-lg shadow-accent/25 transition"
                >
                  Scan Job Posting
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/email-scanner"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl transition"
                >
                  Verify Recruiter Email
                </Link>
              </div>
            </motion.div>

            {/* Hero Right: Live Threat Monitor Simulator */}
            <motion.div 
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-[10px] text-slate-400 font-mono">LIVE THREAT FEED</span>
                </div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 mb-4">
                  <BadgeAlert className="w-4 h-4 text-rose-500" />
                  JOBSHIELD NETWORK MONITOR
                </h3>
                
                <div className="space-y-3">
                  {threatFeed.map((threat, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800/60 rounded-lg flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono uppercase">{threat.type}</span>
                          <span className="text-xs font-semibold text-slate-200">{threat.target}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{threat.issue}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-rose-500 font-mono">Risk: {threat.score}%</div>
                        <div className="text-[9px] font-semibold text-slate-500 uppercase">{threat.level}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 border-y border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-accent">14,250+</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">Scams Detected</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-500">98.4%</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">Detection Accuracy</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-accent">6,800+</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">Verified Companies</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-rose-500">2.1 Million</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">Student Wages Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Multi-Layer Threat Prevention</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our advanced analytical modules scan everything from posting text, salaries, domains, to communications.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Card 1 */}
            <motion.div variants={itemVariants} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">Job Description Scanner</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Upload job postings as PDF/DOCX or paste descriptions to analyze grammatical structures and scam keywords.
                </p>
              </div>
              <Link to="/analyze" className="text-xs font-bold text-accent inline-flex items-center gap-1 mt-4 hover:underline">
                Scan job description <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={itemVariants} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-danger mb-4">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">Phishing Email Scanner</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Paste suspect recruiter correspondence to verify sender headers, credential links, and webmail domain warnings.
                </p>
              </div>
              <Link to="/email-scanner" className="text-xs font-bold text-accent inline-flex items-center gap-1 mt-4 hover:underline">
                Scan recruiter email <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={itemVariants} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">Salary Anomaly Check</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Analyze if offered compensation coordinates with market rates. Flag unrealistically high offers (scam bait).
                </p>
              </div>
              <Link to="/salary" className="text-xs font-bold text-accent inline-flex items-center gap-1 mt-4 hover:underline">
                Check salary anomaly <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* Card 4 */}
            <motion.div variants={itemVariants} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">Student Reviews Portal</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Contribute anonymously to the student board. Warn peers about predatory unpaid internships or fake contracts.
                </p>
              </div>
              <Link to="/reviews" className="text-xs font-bold text-accent inline-flex items-center gap-1 mt-4 hover:underline">
                Browse student reviews <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Browser Extension Promo */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              <div className="space-y-5">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent">BROWSER EXTENSION SUPPORT</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  Scan Jobs Directly on LinkedIn & Indeed
                </h2>
                <p className="text-sm md:text-base text-slate-300">
                  Highlight suspicious descriptions, right-click, and scan instantly with our Chrome Extension. Get real-time verification shields over recruitment profiles.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => alert("Browser extension source is available in the /extension folder in your project directory!")}
                    className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg shadow-lg shadow-accent/20 transition"
                  >
                    Install Extension Source
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-sm">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
                    <Shield className="w-5 h-5 text-accent" />
                    <span className="text-xs font-bold text-slate-200 font-mono">JobShield AI popup.html</span>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-slate-400">Highlighted text:</div>
                    <div className="p-2.5 bg-slate-900 text-[11px] text-slate-300 rounded border border-slate-800 font-mono h-24 overflow-hidden">
                      "Looking for data entry clerks. Work from home, no experience required. We pay $45/hr. Contact us on Telegram @HRManager to buy your home office equipment check..."
                    </div>
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded flex items-center justify-between">
                      <span className="text-xs text-rose-500 font-bold">Threat: Critical Scam (94%)</span>
                      <span className="text-[10px] text-rose-500 bg-rose-500/20 px-1.5 py-0.5 rounded font-bold font-mono">FLAGGED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
