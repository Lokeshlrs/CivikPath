import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useCivic } from '../../context/CivicContext';
import { CheckCircle2, ShieldCheck, Lock, Mail, Key } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useCivic();

  const [email, setEmail] = useState('citizen@example.com');
  const [password, setPassword] = useState('Password123!');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const res = await loginUser(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/my-paths');
    } else {
      setErrorMsg(res.message || 'Invalid email or password credentials.');
    }
  };

  const handleGuest = async () => {
    setErrorMsg(null);
    setLoading(true);
    const res = await loginUser('citizen@example.com', 'Password123!');
    setLoading(false);
    if (res.success) {
      navigate('/task');
    } else {
      navigate('/task');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 text-left">
        {/* Left Column matching Figma */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-8 sm:p-12 text-white flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="bg-white/10 p-2.5 rounded-2xl w-fit backdrop-blur-md">
              <Logo size="md" />
            </div>

            <h1 className="text-3xl font-black tracking-tight leading-tight">
              Your path through government, made simple.
            </h1>

            <p className="text-sm text-blue-100 leading-relaxed font-medium">
              Understand procedures. Verify every source. Track each step.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-blue-700/50 text-xs font-semibold text-blue-100">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Official verified sources</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Zero invented legal claims</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Personalized municipal roadmap</span>
            </div>
          </div>
        </div>

        {/* Right Column Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
              CITIZEN ACCESS
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Welcome back</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Sign in to manage and track your civic paths.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Key size={18} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            <Button kind="primary" size="lg" type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </Button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">
              or
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <div className="space-y-2">
            <Link to="/register" className="block w-full">
              <Button kind="secondary" size="md" className="w-full">
                Create an account
              </Button>
            </Link>
            <div className="text-center pt-2">
              <button
                onClick={handleGuest}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Continue as guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
