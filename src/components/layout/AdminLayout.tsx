import React from 'react';
import { AdminSidebar } from '../admin/AdminSidebar';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const { currentUser } = useCivic();

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/60">
        {/* Admin Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-4">
            {actions}
            <div className="flex items-center gap-2.5 border-l border-slate-800 pl-4 text-xs font-semibold text-slate-300">
              <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                <UserCheck size={14} />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-slate-200 font-bold">{currentUser?.name || 'Administrator'}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={10} /> Verified Personnel
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Content Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
