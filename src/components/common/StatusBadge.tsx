import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ShieldCheck, XCircle } from 'lucide-react';
import { StepStatus, SourceVerificationStatus, SourceHealthStatus, DocumentStatus } from '../../types';

type AnyStatus = StepStatus | SourceVerificationStatus | SourceHealthStatus | DocumentStatus | 'verified' | 'pending_human_review' | 'rejected';

interface StatusBadgeProps {
  status: AnyStatus;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const getDetails = (): { text: string; styles: string; icon: React.ReactNode } => {
    switch (status) {
      case 'completed':
      case 'ready':
      case 'healthy':
      case 'verified':
      case 'approved':
        return {
          text: label || (status === 'ready' ? 'Ready' : 'Completed'),
          styles: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} className="text-emerald-600" />,
        };
      case 'current':
      case 'info':
        return {
          text: label || 'Current',
          styles: 'bg-blue-50 text-blue-700 border-blue-200/80',
          icon: <Clock size={size === 'sm' ? 12 : 14} className="text-blue-600" />,
        };
      case 'pending':
      case 'pending_review':
      case 'pending_human_review':
      case 'review_required':
      case 'needs_review':
        return {
          text: label || (status === 'pending_human_review' || status === 'review_required' ? 'Review Required' : 'Pending'),
          styles: 'bg-amber-50 text-amber-700 border-amber-200/80',
          icon: <AlertCircle size={size === 'sm' ? 12 : 14} className="text-amber-600" />,
        };
      case 'needs_attention':
      case 'unavailable':
      case 'inactive':
      case 'rejected':
      case 'error':
        return {
          text: label || (status === 'needs_attention' ? 'Needs Attention' : status === 'unavailable' ? 'Unavailable' : 'Rejected'),
          styles: 'bg-red-50 text-red-700 border-red-200/80',
          icon: <XCircle size={size === 'sm' ? 12 : 14} className="text-red-600" />,
        };
      default:
        return {
          text: label || String(status),
          styles: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <ShieldCheck size={size === 'sm' ? 12 : 14} className="text-slate-500" />,
        };
    }
  };

  const { text, styles, icon } = getDetails();

  const sizeStyles = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold tracking-wide ${sizeStyles} ${styles}`}>
      {icon}
      <span>{text}</span>
    </span>
  );
};
