import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Key, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginRegister() {
  const { login, register, googleLoginSimulate } = useApp();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isLogin && !name.trim()) {
      setError('Please provide your name.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let res;
      if (isLogin) {
        res = await login(email, password);
      } else {
        res = await register(name, email, password);
      }

      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection refused by authentication gateway.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSimulate = async () => {
    setError('');
    setLoading(true);
    try {
      // Simulate Google OAuth response
      const mockGoogleProfile = {
        googleId: `g_oauth_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Jane Doe',
        email: 'janedoe@gmail.com',
        avatar: 'https://cdn-icons-png.flaticon.com/512/145/145843.png'
      };
      
      const res = await googleLoginSimulate(mockGoogleProfile);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Google authentication failed.');
      }
    } catch (err) {
      setError('Google simulation gateway failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <Shield className="w-8 h-8 fill-accent/10" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {isLogin ? 'Access JobShield AI' : 'Create Security Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {isLogin ? 'Secure your session with JWT authentications' : 'Join student networks defending recruitment lines'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs font-semibold text-danger flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-500">Your Full Name</label>
              <div className="relative">
                <User className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-accent rounded-xl text-xs transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1.5 text-slate-500">Email Address</label>
            <div className="relative">
              <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-accent rounded-xl text-xs transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5 text-slate-500">Password</label>
            <div className="relative">
              <Key className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-accent rounded-xl text-xs transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition flex items-center justify-center gap-1.5 text-sm"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Access Account' : 'Register Account'}
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </form>

        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] text-slate-400 uppercase font-mono">OR USE IDP</span>
        </div>

        {/* Mock Google OAuth button */}
        <button
          onClick={handleGoogleSimulate}
          disabled={loading}
          className="w-full py-3 border border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-250 hover:bg-slate-50 dark:hover:bg-slate-850 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google Logo" className="w-4 h-4" />
          Continue with Google
        </button>

        <div className="text-center pt-2">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-xs text-slate-400 hover:text-accent font-semibold transition"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already registered? Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
