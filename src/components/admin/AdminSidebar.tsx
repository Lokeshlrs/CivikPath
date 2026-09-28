import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  FileCheck2,
  GitBranch,
  RefreshCw,
  LogOut,
  ExternalLink,
  Route,
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const AdminSidebar: React.FC = () => {
  const { logout, adminReviews, sourceChanges } = useCivic();

  const pendingReviewsCount = adminReviews.filter((r) => r.verificationStatus === 'pending_human_review').length;
  const pendingChangesCount = sourceChanges.filter((c) => c.status === 'pending').length;

  const navItems = [
    {
      label: 'Overview',
      to: '/admin',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Source registry',
      to: '/admin/sources',
      icon: Database,
      badge: null,
    },
    {
      label: 'Pending verification',
      to: '/admin/verification',
      icon: FileCheck2,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : null,
    },
    {
      label: 'Procedure editor',
      to: '/admin/procedure-editor',
      icon: GitBranch,
      badge: null,
    },
    {
      label: 'Change detection',
      to: '/admin/changes',
      icon: RefreshCw,
      badge: pendingChangesCount > 0 ? pendingChangesCount : null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/30">
            <Route size={18} />
          </div>
          <div>
            <div className="font-extrabold text-white text-base leading-tight">CivicPath</div>
            <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest">
              ADMIN CONTROL
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600/90 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} />
              <span>{item.label}</span>
            </div>
            {item.badge !== null && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
        >
          <span>View Citizen App</span>
          <ExternalLink size={14} />
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
        >
          <LogOut size={14} />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};
