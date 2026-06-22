import React from 'react';
import { Shield, Mail, Phone, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <Shield className="w-8 h-8 text-accent fill-accent/10" />
              <span>JobShield <span className="text-accent">AI</span></span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm">
              Protecting candidates and student interns from fraudulent hiring practices, fake jobs, recruitment phishing, and salary exploitation. Powered by advanced natural language processing.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Features</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/analyze" className="hover:text-white transition">Analyze Job</Link></li>
              <li><Link to="/email-scanner" className="hover:text-white transition">Phishing Scanner</Link></li>
              <li><Link to="/salary" className="hover:text-white transition">Salary Analysis</Link></li>
              <li><Link to="/company-verify" className="hover:text-white transition">Company Verification</Link></li>
            </ul>
          </div>

          {/* Developer Contact (Exact details requested by USER) */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Developer Contacts</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <a href="mailto:mukeshpodugu123@gmail.com" className="hover:text-white transition">mukeshpodugu123@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <a href="tel:8143999463" className="hover:text-white transition">8143999463</a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.linkedin.com/in/podugu-mukesh-1575a32b4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4.5 h-4.5" />
                </a>
                <a
                  href="https://github.com/mukeshpodugu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4.5 h-4.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} JobShield AI. All rights reserved.</p>
          <p className="mt-4 sm:mt-0">
            Developed with dedication by <span className="text-slate-300 font-medium">PODUGU MUKESH</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
