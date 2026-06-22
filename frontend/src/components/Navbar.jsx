import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Sun, Moon, Menu, X, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme, user, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { name: 'Analyze Job', path: '/analyze' },
    { name: 'Email Scanner', path: '/email-scanner' },
    { name: 'Salary Analysis', path: '/salary' },
    { name: 'Company Verify', path: '/company-verify' },
    { name: 'Student Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 glass transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              <Shield className="w-8 h-8 text-accent fill-accent/10" />
              <span>JobShield <span className="text-accent">AI</span></span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isActive(link.path) ? 'text-accent' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth section */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full ring-2 ring-accent/20" />
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-danger dark:text-slate-400 dark:hover:bg-slate-800 transition"
                    title="Log Out"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-accent hover:bg-accent/90 rounded-lg shadow-sm shadow-accent/20 transition"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-bgDark/95 backdrop-blur-md transition-all">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-accent/10 text-accent'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-800 px-3">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-white">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 flex justify-center items-center gap-1.5 py-2.5 text-sm font-semibold rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 flex justify-center items-center gap-1.5 py-2.5 text-sm font-semibold rounded-lg bg-rose-500/10 text-rose-500"
                      >
                        <Settings className="w-4 h-4" />
                        Admin
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-center items-center gap-2 py-2.5 text-sm font-semibold rounded-lg border border-danger/30 text-danger hover:bg-danger/5 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-semibold text-white bg-accent hover:bg-accent/90 rounded-lg shadow-sm transition"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
