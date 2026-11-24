import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    setAuthModalMode,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
  } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // Reset form when modal opens or mode switches
  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMessage(null);
      setPassword('');
      setConfirmPassword('');
      setIsSubmitting(false);
      setIsGoogleSubmitting(false);
    }
  }, [isAuthModalOpen, authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (authModalMode === 'signup') {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (authModalMode === 'login') {
        await loginWithEmail(cleanEmail, password);
      } else {
        await signupWithEmail(cleanEmail, password, displayName);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Click backdrop to close */}
      <div className="fixed inset-0" onClick={closeAuthModal} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-navy-900 border border-navy-750 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto">
        {/* Decorative Top Accent Glow */}
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-purple via-indigo-500 to-purple-400" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-navy-950/80 hover:bg-navy-800 text-slate-400 hover:text-white transition-colors border border-navy-700"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Branding */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-purple to-indigo-700 flex items-center justify-center shadow-glow-purple mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white tracking-tight">
              {authModalMode === 'login' ? 'Welcome Back' : 'Create BuyWise Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {authModalMode === 'login'
                ? 'Sign in to access your saved wishlist, comparisons, and AI shopping advisor history.'
                : 'Join BuyWise AI to sync your shopping advisor recommendations and wishlist across devices.'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-navy-950/80 rounded-xl border border-navy-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authModalMode === 'login'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('signup');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authModalMode === 'signup'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting || isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-700 hover:border-brand-purple/50 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm mb-5"
          >
            {isGoogleSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-brand-purple-light" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>
              {isGoogleSubmitting
                ? 'Connecting to Google...'
                : 'Continue with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-navy-800 w-full" />
            <span className="bg-navy-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 shrink-0 font-medium">
              or continue with email
            </span>
            <div className="border-t border-navy-800 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Sign Up only) */}
            {authModalMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Taylor"
                    className="w-full bg-navy-950 border border-navy-750 text-slate-100 placeholder-slate-500 text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-navy-950 border border-navy-750 text-slate-100 placeholder-slate-500 text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                {authModalMode === 'signup' && (
                  <span className="text-[10px] text-slate-500">Min 6 characters</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-navy-950 border border-navy-750 text-slate-100 placeholder-slate-500 text-xs sm:text-sm pl-9 pr-10 py-2.5 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {authModalMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-navy-950 border border-navy-750 text-slate-100 placeholder-slate-500 text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-glow-purple flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {authModalMode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {authModalMode === 'login' ? 'Sign In' : 'Create Account'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Footer toggle note */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {authModalMode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('signup');
                    setErrorMessage(null);
                  }}
                  className="font-semibold text-brand-purple-light hover:text-white transition-colors underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-semibold text-brand-purple-light hover:text-white transition-colors underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
