import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Key } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useCivic } from '../../context/CivicContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useCivic();

  const [email, setEmail] = useState('admin@civicpath.gov.in');
  const [password, setPassword] = useState('admin123');

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(email);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-left">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-md">
            <Shield size={28} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            CivicPath Administration
          </h1>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
            Sign in to manage sources and verified procedures.
          </p>
        </div>

        <form onSubmit={handleAdminSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Key size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <Button kind="primary" size="lg" type="submit" className="w-full">
            Sign in →
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
          <Lock size={12} className="text-slate-600" />
          <span>Authorized personnel only</span>
        </div>
      </div>
    </div>
  );
};
