import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Github } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-mesh">
      <div className="glass rounded-3xl p-8 md:p-12 w-full max-w-md shadow-2xl relative overflow-hidden border-white/40">
        {/* Abstract background decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg mb-6 shadow-primary-500/20 rotate-3">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium text-center mt-2 leading-relaxed">
              Continue your learning journey with <span className="font-bold text-primary-600">DoubtFlow</span>.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-500 px-4 py-3 rounded-xl mb-6 text-sm font-semibold flex items-center gap-2 animate-fade-in transition-all">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="input-field pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-field pl-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary h-14 flex items-center justify-center text-lg gap-3 mt-4">
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="h-4"></div>

            <p className="text-sm font-semibold text-slate-500">
              New here? <Link to="/signup" className="text-primary-600 hover:text-primary-700 underline decoration-2 decoration-primary-200 hover:decoration-primary-600 transition-all">Sign up now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}