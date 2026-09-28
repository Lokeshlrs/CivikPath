import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { SourceVerificationStatus } from '../../types';

interface SourceStatusBadgeProps {
  status?: SourceVerificationStatus | string;
  size?: 'sm' | 'md';
  variant?: 'full' | 'compact';
  className?: string;
}

export const SourceStatusBadge: React.FC<SourceStatusBadgeProps> = ({
  status = 'database_only',
  size = 'sm',
  variant = 'full',
  className = '',
}) => {
  const isSm = size === 'sm';

  if (status === 'database_only') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold bg-amber-50 text-amber-950 border border-amber-300 rounded-full ${
          isSm ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
        } ${className}`}
      >
        <AlertTriangle size={isSm ? 11 : 13} className="text-amber-700 shrink-0" />
        <span>
          {variant === 'compact'
            ? 'Database Roadmap — Not Verified'
            : '⚠ Database Roadmap — Not Officially Verified'}
        </span>
      </span>
    );
  }

  if (status === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full ${
          isSm ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
        } ${className}`}
      >
        <ShieldCheck size={isSm ? 11 : 13} className="text-emerald-600 shrink-0" />
        <span>{variant === 'compact' ? 'Official Verified' : '✓ Official Source Verified'}</span>
      </span>
    );
  }

  if (status === 'review_required' || status === 'review' || status === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full ${
          isSm ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
        } ${className}`}
      >
        <AlertTriangle size={isSm ? 11 : 13} className="text-amber-600 shrink-0" />
        <span>{variant === 'compact' ? 'Review Required' : '⚠ Review Required'}</span>
      </span>
    );
  }

  if (status === 'demo') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold bg-amber-50 text-amber-950 border border-amber-300 rounded-full ${
          isSm ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
        } ${className}`}
      >
        <AlertTriangle size={isSm ? 11 : 13} className="text-amber-700 shrink-0" />
        <span>{variant === 'compact' ? 'Demo — Not Verified' : '⚠ Demo Source — Not Verified'}</span>
      </span>
    );
  }

  if (status === 'unverified') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold bg-amber-50 text-amber-950 border border-amber-300 rounded-full ${
          isSm ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
        } ${className}`}
      >
        <AlertTriangle size={isSm ? 11 : 13} className="text-amber-700 shrink-0" />
        <span>{variant === 'compact' ? 'Not Verified' : '⚠ Not Verified'}</span>
      </span>
    );
  }

  if (status === 'rejected') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold bg-red-50 text-red-700 border border-red-200 rounded-full ${
          isSm ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
        } ${className}`}
      >
        <XCircle size={isSm ? 11 : 13} className="text-red-600 shrink-0" />
        <span>{variant === 'compact' ? 'Rejected' : '✕ Source Rejected'}</span>
      </span>
    );
  }

  if (status === 'inactive' || status === 'unavailable') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold bg-red-50 text-red-700 border border-red-200 rounded-full ${
          isSm ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
        } ${className}`}
      >
        <XCircle size={isSm ? 11 : 13} className="text-red-600 shrink-0" />
        <span>✕ Source Unavailable</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold bg-amber-50 text-amber-950 border border-amber-300 rounded-full ${
        isSm ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } ${className}`}
    >
      <AlertTriangle size={isSm ? 11 : 13} className="text-amber-700 shrink-0" />
      <span>⚠ Database Roadmap — Not Officially Verified</span>
    </span>
  );
};
