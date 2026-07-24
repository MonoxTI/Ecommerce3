import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '../services/authService';
import { useUserStore } from '../store/userStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen 	bg-[#3a3d40] flex items-center justify-center px-4 pt-16">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(192,192,192,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(192,192,192,0.02) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#c0c0c0] flex items-center justify-center">
              <span className="text-black text-sm font-black" style={{ fontFamily: 'Space Mono, monospace' }}>K</span>
            </div>
            <span className="text-4xl font-black text-white tracking-[0.4em]"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}>KIR</span>
          </div>
          <p className="text-[#9a9d9f] text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: 'Space Mono, monospace' }}>// Sign in to your account</p>
        </div>

        <div className="border border-[#d5d8d9]/20 bg-[#4f5256] p-8">
          {/* Error */}
          {error && (
            <div className="border border-[#e53e3e]/40 bg-[#e53e3e]/5 text-[#e53e3e] px-4 py-3 mb-6 text-xs"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-[#9a9d9f] text-xs tracking-[0.2em] uppercase block mb-2"
                style={{ fontFamily: 'Space Mono, monospace' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full 	bg-[#3a3d40] border border-[#d5d8d9]/20 focus:border-[#c0c0c0] text-white px-4 py-3 outline-none transition-colors text-sm placeholder-[#6a6d70]"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[#9a9d9f] text-xs tracking-[0.2em] uppercase block mb-2"
                style={{ fontFamily: 'Space Mono, monospace' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full 	bg-[#3a3d40] border border-[#d5d8d9]/20 focus:border-[#c0c0c0] text-white px-4 py-3 pr-12 outline-none transition-colors text-sm placeholder-[#6a6d70]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a9d9f] hover:text-[#c0c0c0] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c0c0c0] hover:bg-white disabled:opacity-40 text-black font-black py-4 transition-colors tracking-[0.2em] uppercase text-sm mt-2"
              style={{ fontFamily: 'Space Mono, monospace' }}
            >
              {loading ? '// Signing in...' : '// Sign In'}
            </button>
          </form>

          <div className="border-t border-[#d5d8d9]/20 mt-6 pt-6 text-center">
            <p className="text-[#9a9d9f] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
              No account?{' '}
              <Link to="/register" className="text-[#c0c0c0] hover:text-white transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;