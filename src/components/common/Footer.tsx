import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <Logo size="sm" />
          <span className="text-xs text-slate-500 font-medium">
            For clearer civic journeys across India.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 font-semibold">
            🔒 Verified Official Information Only
          </span>
          <Link
            to="/admin/login"
            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 font-semibold transition-colors"
          >
            <Shield size={14} />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
