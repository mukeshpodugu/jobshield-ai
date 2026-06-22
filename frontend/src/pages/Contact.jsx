import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const faqs = [
    { q: "How is the risk score (0-100) calculated?", a: "Our NLP model parses the content for grammar, punctuation patterns, unverified chat apps (like Telegram/WhatsApp), financial requests, and salary mismatches." },
    { q: "What should I do if a company domain is wrongly marked suspicious?", a: "Legitimate company representatives can file a domain audit request by emailing us with verification documents (DUNS number or incorporation articles)." },
    { q: "How does the email scanning engine operate?", a: "It audits headers, identifies lookalike sender domains (e.g., Apple vs. Apple-jobs), generic greeting formats, and suspicious shortened hyper-links." }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Security Support Hub</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Have queries about the platform or want to report a fraudulent hiring organization? Reach out below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Support channels (5 cols) */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-md font-bold">Contact Channels</h3>
          
          <div className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-slate-400 font-normal uppercase text-[9px] tracking-wider">Email Inquiry</div>
                <a href="mailto:mukeshpodugu123@gmail.com" className="text-slate-805 dark:text-slate-200 hover:underline">mukeshpodugu123@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-slate-400 font-normal uppercase text-[9px] tracking-wider">Hotline</div>
                <a href="tel:8143999463" className="text-slate-805 dark:text-slate-200 hover:underline">8143999463</a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-slate-400 font-normal uppercase text-[9px] tracking-wider">Location</div>
                <div className="text-slate-805 dark:text-slate-200">Hyderabad, India</div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form (7 cols) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-md font-bold">Submit Support Ticket</h3>

          {submitted && (
            <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Ticket received! Our security analysts will verify the metrics shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-500">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-accent rounded-xl text-xs transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-accent rounded-xl text-xs transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-500">Message details</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Explain the security issue or specify details of the fake job posting..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-accent rounded-xl text-xs transition"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white text-xs font-bold rounded-xl shadow-lg shadow-accent/25 transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-md font-bold flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-accent" />
          Platform FAQs
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-1.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/40 dark:border-slate-850">
              <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">{faq.q}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
