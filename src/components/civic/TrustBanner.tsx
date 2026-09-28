import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const TrustBanner: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="w-full bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3.5 text-left">
      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
        <ShieldCheck size={18} />
      </div>
      <div className="flex-1 text-xs leading-relaxed text-emerald-900">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge type="official" size="sm" />
          <Badge type="demo" size="sm" />
          <span className="font-bold text-emerald-950">Built from verified official sources</span>
        </div>
        <p className="text-emerald-800 font-medium">
          {message ||
            'CivicPath organizes information strictly from verified government portals. Always use the original official source link for final application submission.'}
        </p>
      </div>
    </div>
  );
};
