'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle, X } from 'lucide-react';
import { BASE_URL } from '@/app/services/apiService';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [formData, setFormData] = useState({ email: '', password: '' });

  const validateForm = () => {
    let isValid = true;
    const errors = { email: '', password: '' };

    // Case 1: Email Format Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email address is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid business email (e.g., name@company.com)';
      isValid = false;
    }

    // Case 2: Password Constraints Check (Matches standard backend rules)
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({ email: '', password: '' });
    if (!validateForm()) {
      setIsLoading(false);
      return; 
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
        localStorage.setItem('role', data.role);
        localStorage.setItem('user', JSON.stringify(data));
        router.push('/dashboard');
      } else {
        const serverMessage = data.message || '';
         if (serverMessage.toLowerCase().includes('email') || serverMessage.toLowerCase().includes('user not found')) {
          setFieldErrors(prev => ({ ...prev, email: serverMessage }));
        } else if (serverMessage.toLowerCase().includes('password') || serverMessage.toLowerCase().includes('credential')) {
          setFieldErrors(prev => ({ ...prev, password: serverMessage }));
        } else {
          setError(serverMessage || 'Invalid email or password');
        }
      }
    } catch (err) {
      setError('Connection failed. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#faf9f6] text-slate-800 antialiased font-sans relative overflow-hidden">
      
      {/* ── 🌅 Fluid Tech Background Flares ── */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-300/20 to-purple-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-pink-300/20 to-purple-400/20 blur-[140px] pointer-events-none" />

      {/* Grid Overlay lines */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* ── 🚨 Real-time Global Error Popup Toast ── */}
      {error && (
        <div className="fixed top-6 right-6 z-50 flex items-start gap-3 bg-white border-l-4 border-rose-500 rounded-xl p-4 shadow-xl shadow-slate-200/50 max-w-sm border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Login Issue</h4>
            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{error}</p>
          </div>
          <button 
            type="button"
            onClick={() => setError('')} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Centralized Premium White Card ── */}
      <div className="w-full max-w-[440px] px-6 py-8 md:p-10 mx-4 bg-white/80 backdrop-blur-2xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/40 relative z-10">
        
        {/* Branding Title */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="p-1.5 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-lg shadow-md shadow-emerald-500/20">
            <svg className="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="text-base font-black tracking-widest bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent uppercase">LeadFlow</span>
        </div>

        {/* Action Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-1">Please enter your credentials to access the system</p>
        </div>

        {/* Form Fields Mapping Layout */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 tracking-wide uppercase ml-0.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-150 ${
                  fieldErrors.email 
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500/50'
                }`}
              />
            </div>
            {/* ── 🌟 NEW: Email Warning Text message ── */}
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-500 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 tracking-wide uppercase ml-0.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-150 ${
                  fieldErrors.password 
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500/50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {/* ── 🌟 NEW: Password Warning Text message ── */}
            {fieldErrors.password && (
              <p className="text-[11px] text-rose-500 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md shadow-slate-950/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed duration-150 text-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Verifying...' : 'Log In'}</span>
          </button>
        </form>

        {/* Footer Navigation Switch */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            New here?{' '}
            <Link href="/register" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
              Create Account
            </Link>
          </p>
        </div>

        {/* Back Home Anchor */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-xs font-semibold uppercase tracking-wider transition-colors group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Back to website
          </Link>
        </div>

      </div>
    </div>
  );
}
