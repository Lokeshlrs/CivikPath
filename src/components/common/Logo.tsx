import React from 'react';
import { Route } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  to?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  isAdmin?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  to = '/',
  size = 'md',
  showSubtitle = false,
  isAdmin = false,
}) => {
  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 28,
  };

  const markSizes = {
    sm: 'w-7 h-7 rounded-md',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const logoContent = (
    <div className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 group cursor-pointer select-none">
      <div
        className={`${markSizes[size]} flex items-center justify-center text-white bg-blue-600 shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors`}
      >
        <Route size={iconSizes[size]} />
      </div>
      <div className="flex flex-col">
        <div className={`flex items-center gap-1.5 font-extrabold ${textSizes[size]} text-slate-900`}>
          <span>CivicPath</span>
          {isAdmin && (
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
              Admin
            </span>
          )}
        </div>
        {showSubtitle && (
          <span className="text-xs font-medium text-slate-500">
            Your path through government, made simple
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{logoContent}</Link>;
  }

  return logoContent;
};
