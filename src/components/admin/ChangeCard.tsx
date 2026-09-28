import React from 'react';
import { SourceChangeItem } from '../../types';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { Badge } from '../common/Badge';

interface ChangeCardProps {
  change: SourceChangeItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ChangeCard: React.FC<ChangeCardProps> = ({
  change,
  onApprove,
  onReject,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                ⚠ PROCEDURE INFORMATION CHANGED
              </span>
              <Badge type="demo" size="sm" />
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">{change.service}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Detected on: {change.detectedDate}</p>
          </div>
        </div>

        <StatusBadge status={change.status} size="md" />
      </div>

      {/* Side-by-side diff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Previous Info */}
        <div className="p-4 rounded-xl bg-slate-950 border border-red-900/30 space-y-2">
          <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">
            PREVIOUS VERIFIED INFORMATION
          </span>
          <div className="text-slate-300 font-medium">{change.previousInfo.requirement}</div>
          <div className="text-slate-400">Fee: {change.previousInfo.fee}</div>
        </div>

        {/* New Info */}
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/30 space-y-2">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
            NEW DETECTED SOURCE INFORMATION
          </span>
          <div className="text-slate-200 font-bold">{change.newInfo.requirement}</div>
          <div className="text-emerald-400 font-semibold">Fee: {change.newInfo.fee}</div>
        </div>
      </div>

      <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
        <span className="font-mono text-blue-400">{change.source}</span>
        <span className="text-slate-500 font-medium">
          Changes must be reviewed before becoming part of the verified knowledge base.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
        <Button kind="danger" size="sm" icon={XCircle} onClick={() => onReject(change.id)}>
          Reject Update
        </Button>
        <Button
          kind="secondary"
          size="sm"
          onClick={() => alert(`Reviewing diff for ${change.service}`)}
        >
          Review Changes
        </Button>
        <Button
          kind="primary"
          size="sm"
          icon={CheckCircle2}
          onClick={() => onApprove(change.id)}
        >
          Approve Update
        </Button>
      </div>
    </div>
  );
};
