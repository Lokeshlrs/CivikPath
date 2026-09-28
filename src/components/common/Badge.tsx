import React from 'react';
import { Lock, ShieldCheck, AlertTriangle, CheckCircle2, Clock, XCircle, Info } from 'lucide-react';

interface BadgeProps {
  type?: 'official' | 'verified' | 'warning' | 'error' | 'info' | 'neutral' | 'demo' | 'demoSource';
  children?: React.ReactNode;
  icon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type = 'official',
  children,
  icon = true,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const typeStyles = {
    official: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold',
    verified: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200 font-medium',
    error: 'bg-red-50 text-red-700 border border-red-200 font-medium',
    info: 'bg-blue-50 text-blue-700 border border-blue-200 font-medium',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
    demo: 'bg-amber-100/90 text-amber-900 border border-amber-300 font-bold tracking-wide uppercase',
    demoSource: 'bg-amber-100 text-amber-950 border border-amber-400 font-extrabold tracking-wide uppercase',
  };

  const DefaultIcon = () => {
    switch (type) {
      case 'official':
        return <Lock size={size === 'sm' ? 11 : 13} className="text-emerald-700" />;
      case 'verified':
        return <ShieldCheck size={size === 'sm' ? 11 : 13} className="text-emerald-600" />;
      case 'warning':
      case 'demo':
      case 'demoSource':
        return <AlertTriangle size={size === 'sm' ? 11 : 13} className="text-amber-700 shrink-0" />;
      case 'error':
        return <XCircle size={size === 'sm' ? 11 : 13} className="text-red-600" />;
      case 'info':
        return <Clock size={size === 'sm' ? 11 : 13} className="text-blue-600" />;
      default:
        return <CheckCircle2 size={size === 'sm' ? 11 : 13} className="text-slate-500" />;
    }
  };

  const getDefaultText = () => {
    if (type === 'official') return '🔒 OFFICIAL SOURCES ONLY';
    if (type === 'demo') return 'UNVERIFIED — PENDING REVIEW';
    if (type === 'demoSource') return 'UNVERIFIED SOURCE';
    return 'Verified';
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium tracking-wide ${sizeStyles[size]} ${typeStyles[type]} ${className}`}
    >
      {icon && <DefaultIcon />}
      <span>{children || getDefaultText()}</span>
    </span>
  );
};
