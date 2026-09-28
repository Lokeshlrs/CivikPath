import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, User as UserIcon, LogOut, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './Button';
import { useCivic } from '../../context/CivicContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isAdminLoggedIn, logout } = useCivic();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <Logo showSubtitle={false} />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/services"
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            Explore Services
          </Link>
          <Link
            to="/ask"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 transition-colors"
          >
            <Sparkles size={14} className="text-blue-600" />
            <span>Ask AI</span>
          </Link>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname !== '/') {
                navigate('/#how-it-works');
              } else {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            How it works
          </a>

          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname !== '/') {
                navigate('/#about');
              } else {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            About
          </a>
          <Link
            to="/my-paths"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            My Paths
          </Link>
          <Link
            to="/admin"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Shield size={13} className="text-slate-600" />
            <span>Admin Portal</span>
          </Link>

          {currentUser ? (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <UserIcon size={16} className="text-blue-600" />
                {currentUser.name}
              </span>
              <Button
                kind="ghost"
                size="sm"
                onClick={logout}
                icon={LogOut}
                className="text-slate-500 hover:text-slate-800"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button kind="primary" size="sm">
                Sign in
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/ask"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <Sparkles size={18} className="text-blue-600" />
            Ask CivicPath AI
          </Link>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            How it works
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            About
          </a>
          <Link
            to="/my-paths"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            My Paths
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-blue-600 flex items-center gap-2"
          >
            <Shield size={16} className="text-blue-600" />
            Admin Portal
          </Link>
          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
              <Button kind="secondary" size="md" className="w-full" onClick={logout}>
                Sign Out ({currentUser.name})
              </Button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button kind="primary" size="md" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
