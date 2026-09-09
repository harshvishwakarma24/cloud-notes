import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const AuthModal = ({
  mode = null,
  onClose = () => { },
  onLoginSuccess = () => { },
  setMode = () => { },
  onNotify = () => {},
  isDarkTheme = false
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!mode) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          onNotify('warning', 'Password must be at least 6 characters.');
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: name.trim(),
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          onLoginSuccess(data.user);
          onClose();
        } else {
          setError(
            'Account created, but no active session was returned. Check your Supabase email confirmation setting.'
          );
          onNotify('info', 'Account created. Check your email to finish signing in.');
        }
      } else {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (error) {
          throw error;
        }

        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      onNotify('error', 'Authentication failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message || `Unable to continue with ${provider}.`);
      onNotify('error', `Unable to continue with ${provider}. Please try again.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`border rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh] grid grid-cols-1 md:grid-cols-2 relative animate-in zoom-in-95 duration-200 overflow-y-auto ${
          isDarkTheme ? 'bg-[#1b251f] border-[#344239]' : 'bg-[#ffffff] border-[#e2d8be]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full cursor-pointer transition-colors ${
            isDarkTheme ? 'bg-[#202c25] text-[#aeb8ae] hover:text-[#e7e1d5]' : 'bg-[#f2ece0] text-[#738276] hover:text-[#1b3b2b]'
          }`}
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side Watercolor Artwork Column */}
        <div
          className={`relative hidden md:flex flex-col justify-end p-8 bg-cover bg-center border-r min-h-[420px] ${
            isDarkTheme ? 'border-[#344239]' : 'border-[#e2d8be]'
          }`}
          style={{
            backgroundImage:
              mode === 'signup'
                ? `url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80')`
                : `url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80')`,
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${
            isDarkTheme ? 'from-[#1b251f]/95' : 'from-[#f8f5ee]/90'
          }`} />

          <div className="relative z-10 space-y-1">
            <span className={`font-serif-title font-semibold text-lg ${
              isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#1b3b2b]'
            }`}>
              Cloud Notes
            </span>
            <p className={`text-xs ${isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#526156]'}`}>
              A peaceful home for your thoughts.
            </p>
          </div>
        </div>

        {/* Right Side Form Column */}
        <div className={`p-6 sm:p-8 md:p-12 flex flex-col justify-center space-y-5 sm:space-y-6 ${
          isDarkTheme ? 'bg-[#1b251f]' : 'bg-[#ffffff]'
        }`}>
          {mode === 'signup' ? (
            <>
              <div className="space-y-1">
                <h3 className={`font-serif-title text-2xl sm:text-3xl font-bold ${
                  isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#1b3b2b]'
                }`}>
                  Create your account
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <label className={`text-xs font-semibold ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
                    Name
                  </label>

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Harsh Vishwakarma"
                    className={`w-full rounded-2xl px-3.5 py-2.5 text-xs outline-none ${
                      isDarkTheme 
                        ? 'bg-[#202c25] border border-[#344239] text-[#e7e1d5] focus:border-[#6f9b7f] placeholder-[#829087]' 
                        : 'bg-[#fdfbf7] border border-[#e2d8be] text-[#2c3830] focus:border-[#1b3b2b]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
                    Email
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. harsh@example.com"
                    className={`w-full rounded-2xl px-3.5 py-2.5 text-xs outline-none ${
                      isDarkTheme 
                        ? 'bg-[#202c25] border border-[#344239] text-[#e7e1d5] focus:border-[#6f9b7f] placeholder-[#829087]' 
                        : 'bg-[#fdfbf7] border border-[#e2d8be] text-[#2c3830] focus:border-[#1b3b2b]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
                    Password
                  </label>

                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-2xl px-3.5 py-2.5 text-xs outline-none ${
                        isDarkTheme 
                          ? 'bg-[#202c25] border border-[#344239] text-[#e7e1d5] focus:border-[#6f9b7f] placeholder-[#829087]' 
                          : 'bg-[#fdfbf7] border border-[#e2d8be] text-[#2c3830] focus:border-[#1b3b2b]'
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3.5 p-1 cursor-pointer ${isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'}`}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className={`text-xs border rounded-xl px-3 py-2 ${
                    isDarkTheme ? 'bg-[#3b1f1f] border-[#7a3b3b] text-[#f5a5a5]' : 'bg-red-50 border-red-100 text-red-600'
                  }`}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1b3b2b] hover:bg-[#284f3b] disabled:opacity-60 disabled:cursor-not-allowed text-[#f8f5ee] rounded-2xl text-xs font-medium transition-all shadow-sm cursor-pointer mt-2"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              <div className={`text-center text-xs ${isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#6e7d71]'}`}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('login');
                  }}
                  className={`font-semibold hover:underline cursor-pointer ${isDarkTheme ? 'text-[#6f9b7f]' : 'text-[#1b3b2b]'}`}
                >
                  Log in
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <h3 className={`font-serif-title text-2xl sm:text-3xl font-bold ${
                  isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#1b3b2b]'
                }`}>
                  Welcome back
                </h3>

                <p className={`text-xs ${isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#6e7d71]'}`}>
                  Glad to see you again.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <label className={`text-xs font-semibold ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
                    Email
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="harsh@example.com"
                    className={`w-full rounded-2xl px-3.5 py-2.5 text-xs outline-none ${
                      isDarkTheme 
                        ? 'bg-[#202c25] border border-[#344239] text-[#e7e1d5] focus:border-[#6f9b7f] placeholder-[#829087]' 
                        : 'bg-[#fdfbf7] border border-[#e2d8be] text-[#2c3830] focus:border-[#1b3b2b]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-semibold ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
                      Password
                    </label>

                    <span className={`text-[11px] ${isDarkTheme ? 'text-[#829087]' : 'text-[#9aa59d]'}`}>
                      Password reset coming later
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-2xl px-3.5 py-2.5 text-xs outline-none ${
                        isDarkTheme 
                          ? 'bg-[#202c25] border border-[#344239] text-[#e7e1d5] focus:border-[#6f9b7f] placeholder-[#829087]' 
                          : 'bg-[#fdfbf7] border border-[#e2d8be] text-[#2c3830] focus:border-[#1b3b2b]'
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3.5 p-1 cursor-pointer ${isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'}`}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className={`text-xs border rounded-xl px-3 py-2 ${
                    isDarkTheme ? 'bg-[#3b1f1f] border-[#7a3b3b] text-[#f5a5a5]' : 'bg-red-50 border-red-100 text-red-600'
                  }`}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1b3b2b] hover:bg-[#284f3b] disabled:opacity-60 disabled:cursor-not-allowed text-[#f8f5ee] rounded-2xl text-xs font-medium transition-all shadow-sm cursor-pointer mt-2"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>

              {/* Social Login Buttons */}
              <div className="space-y-3 pt-1">
                <div className="relative flex items-center justify-center">
                  <div className={`w-full border-t ${isDarkTheme ? 'border-[#344239]' : 'border-[#e5dcce]'}`} />
                  <span className={`px-3 text-[11px] absolute ${
                    isDarkTheme ? 'bg-[#1b251f] text-[#829087]' : 'bg-white text-[#8a988d]'
                  }`}>
                    or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 border rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                      isDarkTheme 
                        ? 'bg-[#202c25] border-[#344239] text-[#e7e1d5] hover:bg-[#26332b]' 
                        : 'bg-[#fdfbf7] border-[#e2d8be] text-[#2c3830] hover:bg-[#f5f0e4]'
                    }`}
                  >
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('apple')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 border rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                      isDarkTheme 
                        ? 'bg-[#202c25] border-[#344239] text-[#e7e1d5] hover:bg-[#26332b]' 
                        : 'bg-[#fdfbf7] border-[#e2d8be] text-[#2c3830] hover:bg-[#f5f0e4]'
                    }`}
                  >
                    <span>Apple</span>
                  </button>
                </div>
              </div>

              <div className={`text-center text-xs ${isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#6e7d71]'}`}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('signup');
                  }}
                  className={`font-semibold hover:underline cursor-pointer ${isDarkTheme ? 'text-[#6f9b7f]' : 'text-[#1b3b2b]'}`}
                >
                  Sign up
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};