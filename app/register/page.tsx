'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowLeft, 
  ShieldCheck,
  AlertCircle,
  X
} from 'lucide-react';
import { BASE_URL } from '@/app/services/apiService';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

 
  const validateForm = () => {
    let isValid = true;
    const errors = { name: '', email: '', phone: '', password: '', confirmPassword: '' };

    // 1. Name Check
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters long';
      isValid = false;
    }

    // 2. Email Format Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email address is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid business email';
      isValid = false;
    }

    // 3. Phone Number Check (10 Digits Standard)
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }

    // 4. Password Length Check (Matches your input placeholder "Min. 8 chars")
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }

    // 5. Confirm Password Check
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please repeat your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Clear previous warnings
    setFieldErrors({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
 
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        router.push('/login');
      } else {
        const serverMessage = data.message || '';
        const lowerMessage = serverMessage.toLowerCase();

        if (lowerMessage.includes('email') || lowerMessage.includes('already exists')) {
          setFieldErrors(prev => ({ ...prev, email: serverMessage }));
        } else if (lowerMessage.includes('phone') || lowerMessage.includes('mobile')) {
          setFieldErrors(prev => ({ ...prev, phone: serverMessage }));
        } else if (lowerMessage.includes('name')) {
          setFieldErrors(prev => ({ ...prev, name: serverMessage }));
        } else if (lowerMessage.includes('password')) {
          setFieldErrors(prev => ({ ...prev, password: serverMessage }));
        } else {
          setError(serverMessage || 'Registration failed');
        }
      }
    } catch {
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

      {/* ── 🚨 Real-time Error Popup Toast ── */}
      {error && (
        <div className="fixed top-6 right-6 z-50 flex items-start gap-3 bg-white border-l-4 border-rose-500 rounded-xl p-4 shadow-xl shadow-slate-200/50 max-w-sm border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Registration Issue</h4>
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
          <span className="text-base font-black tracking-widest text-slate-900 bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent uppercase">LeadFlow</span>
        </div>

        {/* Action Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h1>
        </div>

        {/* Form Fields Layout */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 tracking-wide uppercase ml-0.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
                }}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-150 ${
                  fieldErrors.name 
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500/50'
                }`}
              />
            </div>
            {fieldErrors.name && (
              <p className="text-[11px] text-rose-500 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <AlertCircle className="w-3 h-3" /> {fieldErrors.name}
              </p>
            )}
          </div>

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
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-500 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 tracking-wide uppercase ml-0.5">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                required
                placeholder="Mobile number"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: '' }));
                }}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-150 ${
                  fieldErrors.phone 
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500/50'
                }`}
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-[11px] text-rose-500 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <AlertCircle className="w-3 h-3" /> {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* Passwords Inline Matrix Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 tracking-wide uppercase ml-0.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min. 8 chars"
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
              {fieldErrors.password && (
                <p className="text-[11px] text-rose-500 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 tracking-wide uppercase ml-0.5">Confirm</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Repeat"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-150 ${
                    fieldErrors.confirmPassword 
                      ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500/50'
                  }`}
                />
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-[11px] text-rose-500 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md shadow-slate-950/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed duration-150 text-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Creating account...' : 'Create Account'}</span>
          </button>
        </form>

        {/* Footer Navigation Switch */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 font-semibold hover:text-indigo-700 transition-colors">
              Log In
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-xs font-semibold uppercase tracking-wider transition-colors group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Back to website
          </Link>
        </div>

      </div>
    </div>
  );
}
