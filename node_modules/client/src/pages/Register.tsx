import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X as XIcon } from 'lucide-react';
import { register } from '../services/authService';
import { useUserStore } from '../store/userStore';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useUserStore();
  const navigate = useNavigate();

  const passwordChecks = [
    { label: 'At least 8 characters', pass: form.password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(form.password) },
    { label: 'Lowercase letter', pass: /[a-z]/.test(form.password) },
    { label: 'Number', pass: /\d/.test(form.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await register(form);
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 pt-16 pb-10">
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
          <p className="text-[#555555] text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: 'Space Mono, monospace' }}>// Create your account</p>
        </div>

        <div className="border border-[#1e1e1e] bg-[#0f0f0f] p-8">
          {error && (
            <div className="border border-[#e53e3e]/40 bg-[#e53e3e]/5 text-[#e53e3e] px-4 py-3 mb-6 text-xs"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-[#555555] text-xs tracking-[0.2em] uppercase block mb-2"
                style={{ fontFamily: 'Space Mono, monospace' }}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full bg-[#080808] border border-[#1e1e1e] focus:border-[#c0c0c0] text-white px-4 py-3 outline-none transition-colors text-sm placeholder-[#333333]"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-[#555555] text-xs tracking-[0.2em] uppercase block mb-2"
                style={{ fontFamily: 'Space Mono, monospace' }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-[#080808] border border-[#1e1e1e] focus:border-[#c0c0c0] text-white px-4 py-3 outline-none transition-colors text-sm placeholder-[#333333]"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[#555555] text-xs tracking-[0.2em] uppercase block mb-2"
                style={{ fontFamily: 'Space Mono, monospace' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full bg-[#080808] border border-[#1e1e1e] focus:border-[#c0c0c0] text-white px-4 py-3 pr-12 outline-none transition-colors text-sm placeholder-[#333333]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555555] hover:text-[#c0c0c0] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength */}
              {form.password.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {passwordChecks.map(check => (
                    <div key={check.label} className="flex items-center gap-2">
                      {check.pass
                        ? <Check size={11} className="text-[#c0c0c0]" />
                        : <XIcon size={11} className="text-[#333333]" />}
                      <span className={`text-xs ${check.pass ? 'text-[#c0c0c0]' : 'text-[#444444]'}`}
                        style={{ fontFamily: 'Space Mono, monospace' }}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !passwordChecks.every(c => c.pass)}
              className="w-full bg-[#c0c0c0] hover:bg-white disabled:opacity-40 text-black font-black py-4 transition-colors tracking-[0.2em] uppercase text-sm mt-2"
              style={{ fontFamily: 'Space Mono, monospace' }}
            >
              {loading ? '// Creating...' : '// Create Account'}
            </button>
          </form>

          <div className="border-t border-[#1e1e1e] mt-6 pt-6 text-center">
            <p className="text-[#555555] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-[#c0c0c0] hover:text-white transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;