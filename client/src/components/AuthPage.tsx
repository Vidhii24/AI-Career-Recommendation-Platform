import React, { useState } from 'react';
import {
  Compass,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  User,
  Sparkles,
  ChevronRight,
  KeyRound,
  ShieldCheck,
  Cpu,
  Code2,
  Target
} from 'lucide-react';
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  confirmPasswordReset
} from '../services/api';
import { UserAccount } from '../types';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: UserAccount, hasCompletedAssessment: boolean) => void;
  onExplorePublicCatalog?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  onExplorePublicCatalog
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validation helpers
  const isValidEmailFormat = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const hasMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordStrong = hasMinLength && hasLetter && hasNumber;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // Clear messages when switching modes
  const switchMode = (newMode: 'login' | 'signup' | 'forgot' | 'reset') => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Submit Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (!isValidEmailFormat(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res.success && res.user) {
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          onAuthSuccess(res.user!, Boolean(res.hasCompletedAssessment));
        }, 500);
      } else {
        setErrorMessage(res.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!isValidEmailFormat(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!isPasswordStrong) {
      setErrorMessage('Password must be at least 6 characters and contain both letters and numbers.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser(name, email, password, confirmPassword);
      if (res.success && res.user) {
        setSuccessMessage('Account created successfully! Welcome to CareerCompass AI.');
        setTimeout(() => {
          onAuthSuccess(res.user!, false);
        }, 600);
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server error during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isValidEmailFormat(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setSuccessMessage(res.message || 'Reset instructions generated.');
        if (res.resetToken) {
          setResetToken(res.resetToken);
          // Automatically transition to reset view for seamless recovery
          setTimeout(() => switchMode('reset'), 1200);
        }
      } else {
        setErrorMessage(res.error || 'Password recovery failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!resetToken.trim()) {
      setErrorMessage('Reset token is required.');
      return;
    }

    if (!isPasswordStrong) {
      setErrorMessage('New password must be at least 6 characters and contain letters and numbers.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await confirmPasswordReset(resetToken, password, confirmPassword);
      if (res.success) {
        setSuccessMessage('Password reset successfully! You can now log in.');
        setTimeout(() => switchMode('login'), 1200);
      } else {
        setErrorMessage(res.error || 'Password reset failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* ========================================================= */}
        {/* LEFT SECTION: BRANDING & CAREER TOPOLOGY VISUAL (5 COLS)   */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 bg-linear-to-b from-navy-950 via-slate-900 to-navy-900 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background circuit pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">CareerCompass</span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  AI
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Discover the career path that fits you.
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                Sign in to explore career domains, identify your skill gaps, and build a personalized learning roadmap.
              </p>
            </div>
          </div>

          {/* Minimal Skill-to-Domain Illustration */}
          <div className="relative z-10 my-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-white/10">
              <span className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Profile & Compatibility Engine
              </span>
              <span className="text-[10px] font-mono text-emerald-400">ML-Verified</span>
            </div>

            {/* Connecting topology diagram */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-300 font-mono text-[11px]">Python · SQL · Algorithms</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="font-semibold text-brand-300">Software / AI</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-300 font-mono text-[11px]">AutoCAD · SolidWorks</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="font-semibold text-emerald-300">Mechanical / CAD</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-300 font-mono text-[11px]">Verilog · Circuit Analysis</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="font-semibold text-amber-300">Embedded / VLSI</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              Isolated Student Profiles
            </span>
            {onExplorePublicCatalog && (
              <button
                type="button"
                onClick={onExplorePublicCatalog}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Browse Domains Catalog →
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SECTION: CLEAN AUTHENTICATION FORMS (7 COLS)         */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          {/* Mode Switch Tabs (Sign In / Create Account) */}
          {mode !== 'forgot' && mode !== 'reset' && (
            <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-8 max-w-sm">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* A. SIGN UP FORM                                           */}
          {/* --------------------------------------------------------- */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create your student account</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Start your career discovery journey with personalized AI recommendations.
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">College or Personal Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu or name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 6 characters with letters & numbers"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength checklist */}
                <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-500">
                  <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-semibold' : ''}`}>
                    <CheckCircle2 className={`w-3 h-3 ${hasMinLength ? 'text-emerald-600' : 'text-slate-300'}`} />
                    6+ chars
                  </span>
                  <span className={`flex items-center gap-1 ${hasLetter ? 'text-emerald-600 font-semibold' : ''}`}>
                    <CheckCircle2 className={`w-3 h-3 ${hasLetter ? 'text-emerald-600' : 'text-slate-300'}`} />
                    Letters
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-semibold' : ''}`}>
                    <CheckCircle2 className={`w-3 h-3 ${hasNumber ? 'text-emerald-600' : 'text-slate-300'}`} />
                    Numbers
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 ${
                      confirmPassword && !passwordsMatch
                        ? 'border-red-300 focus:ring-red-400'
                        : 'border-slate-300 focus:ring-brand-500 focus:border-brand-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-[11px] text-red-500">Passwords do not match.</p>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-slate-500 pt-3">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-brand-600 hover:text-brand-800 cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* --------------------------------------------------------- */}
          {/* B. LOGIN FORM                                             */}
          {/* --------------------------------------------------------- */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Log in to access your career assessment, roadmaps, and recommendations.
                </p>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-800 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-slate-500 pt-3">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-bold text-brand-600 hover:text-brand-800 cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            </form>
          )}

          {/* --------------------------------------------------------- */}
          {/* C. FORGOT PASSWORD FORM                                   */}
          {/* --------------------------------------------------------- */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Reset your password</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your account email to receive a password recovery verification code.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Account Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Generating Code...' : 'Send Recovery Code'}</span>
                <KeyRound className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* --------------------------------------------------------- */}
          {/* D. RESET PASSWORD CONFIRMATION                            */}
          {/* --------------------------------------------------------- */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Set New Password</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your recovery code and choose a new secure password.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Reset Recovery Code</label>
                <input
                  type="text"
                  required
                  placeholder="Paste reset token here"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters with letters & numbers"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Updating Password...' : 'Save New Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
