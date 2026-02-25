import React, { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const { actor } = useActor();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setError('');
    setLoading(true);
    try {
      const token = await actor.login(username, password);
      if (token) {
        onLogin(token);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #080318 0%, #0f0530 40%, #1a0840 70%, #0f0530 100%)',
      }}
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] opacity-12 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.5) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(217,70,239,0.3))',
              border: '1px solid rgba(120, 80, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(80, 40, 200, 0.3)',
            }}
          >
            <Lock className="text-violet-300" size={28} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">Admin Portal</h1>
          <p className="font-sans text-sm text-white/50 mt-2">Sign in to manage your practice</p>
        </div>

        {/* Login card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(15, 8, 45, 0.7)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(120, 80, 255, 0.25)',
            boxShadow: '0 16px 48px rgba(80, 40, 200, 0.25)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-sans text-sm font-medium text-white/70 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl text-sm font-sans text-white placeholder-white/30 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(120, 80, 255, 0.25)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(139,92,246,0.6)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(100,60,220,0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(120, 80, 255, 0.25)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="block font-sans text-sm font-medium text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm font-sans text-white placeholder-white/30 outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(120, 80, 255, 0.25)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(139,92,246,0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(100,60,220,0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(120, 80, 255, 0.25)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="px-4 py-3 rounded-xl font-sans text-sm text-red-300"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-sans font-medium text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9), rgba(217,70,239,0.8))',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
