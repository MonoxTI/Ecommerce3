import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useUserStore } from '../store/userStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login({ email, password });
      setAuth(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-[0.3em]"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            MON<span className="text-[#c9a84c]">OX</span>
          </h1>
          <p className="text-[#888888] mt-2">Sign in to your account</p>
        </div>

        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-8">
          {error && (
            <div className="bg-[#e53e3e]/10 border border-[#e53e3e]/30 text-[#e53e3e] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[#888888] text-xs font-medium tracking-wider uppercase block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#222222] focus:border-[#c9a84c] text-white px-4 py-3 rounded-lg outline-none transition-colors placeholder-[#444444]"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-[#888888] text-xs font-medium tracking-wider uppercase block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#222222] focus:border-[#c9a84c] text-white px-4 py-3 rounded-lg outline-none transition-colors placeholder-[#444444]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#a8893d] disabled:opacity-50 text-black font-semibold py-3 rounded-lg transition-colors tracking-wider uppercase text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[#888888] text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#c9a84c] hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;