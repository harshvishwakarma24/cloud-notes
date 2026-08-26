import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

export const AuthModal = ({
  mode = null,
  onClose = () => {},
  onLoginSuccess = () => {},
  setMode = () => {}
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('harsh@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  if (!mode) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      name: name || 'Harsh Vishwakarma',
      email: email || 'harsh@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isLoggedIn: true,
      notesCount: 128,
      spacesCount: 6,
      daysActive: 89,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#ffffff] border border-[#e2d8be] rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh] grid grid-cols-1 md:grid-cols-2 relative animate-in zoom-in-95 duration-200 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#f2ece0] text-[#738276] hover:text-[#1b3b2b] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side Watercolor Artwork Column (md and up) */}
        <div 
          className="relative hidden md:flex flex-col justify-end p-8 bg-cover bg-center border-r border-[#e2d8be] min-h-[420px]"
          style={{            backgroundImage: mode === 'signup' 
              ? `url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80')`
              : `url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f5ee]/90 via-transparent to-transparent" />
          <div className="relative z-10 space-y-1">
            <span className="font-serif-title font-semibold text-lg text-[#1b3b2b]">Cloud Notes</span>
            <p className="text-xs text-[#526156]">A peaceful home for your thoughts.</p>
          </div>
        </div>

        {/* Right Side Form Column */}
        <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center space-y-5 sm:space-y-6 bg-[#ffffff]">
          {mode === 'signup' ? (
            /* Sign Up View */
            <>
              <div className="space-y-1">
                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1b3b2b]">
                  Create your account
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2c3830]">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Harsh Vishwakarma"
                    className="w-full bg-[#fdfbf7] border border-[#e2d8be] rounded-2xl px-3.5 py-2.5 text-xs text-[#2c3830] outline-none focus:border-[#1b3b2b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2c3830]">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. harsh@example.com"
                    className="w-full bg-[#fdfbf7] border border-[#e2d8be] rounded-2xl px-3.5 py-2.5 text-xs text-[#2c3830] outline-none focus:border-[#1b3b2b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2c3830]">Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#fdfbf7] border border-[#e2d8be] rounded-2xl px-3.5 py-2.5 text-xs text-[#2c3830] outline-none focus:border-[#1b3b2b]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-[#8a988d] p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1b3b2b] hover:bg-[#284f3b] text-[#f8f5ee] rounded-2xl text-xs font-medium transition-all shadow-sm cursor-pointer mt-2"
                >
                  Create account
                </button>
              </form>

              <div className="text-center text-xs text-[#6e7d71]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#1b3b2b] hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </div>
            </>
          ) : (
            /* Log In View */
            <>
              <div className="space-y-1">
                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1b3b2b]">
                  Welcome back
                </h3>
                <p className="text-xs text-[#6e7d71]">Glad to see you again.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2c3830]">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="harsh@example.com"
                    className="w-full bg-[#fdfbf7] border border-[#e2d8be] rounded-2xl px-3.5 py-2.5 text-xs text-[#2c3830] outline-none focus:border-[#1b3b2b]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#2c3830]">Password</label>
                    <a href="#forgot" className="text-[11px] text-[#6e7d71] hover:text-[#1b3b2b]">Forgot password?</a>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#fdfbf7] border border-[#e2d8be] rounded-2xl px-3.5 py-2.5 text-xs text-[#2c3830] outline-none focus:border-[#1b3b2b]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-[#8a988d] p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1b3b2b] hover:bg-[#284f3b] text-[#f8f5ee] rounded-2xl text-xs font-medium transition-all shadow-sm cursor-pointer mt-2"
                >
                  Log in
                </button>
              </form>

              {/* Social Login Buttons */}
              <div className="space-y-3 pt-1">
                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-[#e5dcce]" />
                  <span className="bg-white px-3 text-[11px] text-[#8a988d] absolute">or continue with</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <button 
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#fdfbf7] border border-[#e2d8be] rounded-2xl text-xs font-medium text-[#2c3830] hover:bg-[#f5f0e4] transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.13C3.26 21.3 7.31 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.22c-.25-.72-.38-1.49-.38-2.22s.13-1.5.38-2.22V6.65H1.29C.47 8.28 0 10.08 0 12s.47 3.72 1.29 5.35l3.99-3.13z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.65l3.99 3.13c.95-2.85 3.6-4.96 6.72-4.96z"/>
                    </svg>
                    <span>Google</span>
                  </button>

                  <button 
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#fdfbf7] border border-[#e2d8be] rounded-2xl text-xs font-medium text-[#2c3830] hover:bg-[#f5f0e4] transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current text-[#1b3b2b]" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.13c.68-.83 1.14-1.99.1-3.13-.99.04-2.22.67-2.92 1.49-.63.73-1.18 1.92-1.03 3.06 1.11.09 2.26-.59 2.85-1.42z"/>
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>
              </div>

              <div className="text-center text-xs text-[#6e7d71]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-[#1b3b2b] hover:underline cursor-pointer"
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
