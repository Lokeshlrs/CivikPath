import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { GovernmentSource } from '../../types';

interface SourceHealthCardProps {
  sources: GovernmentSource[];
}

export const SourceHealthCard: React.FC<SourceHealthCardProps> = ({ sources }) => {
  const healthyCount = sources.filter((s) => s.healthStatus === 'healthy').length;
  const reviewCount = sources.filter((s) => s.healthStatus === 'needs_review').length;
  const unavailableCount = sources.filter((s) => s.healthStatus === 'unavailable').length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs text-left space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">SOURCE HEALTH</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">{sources.length} Total Sources</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 size={14} /> Healthy
          </div>
          <div className="text-xl font-extrabold text-white">{healthyCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <AlertTriangle size={14} /> Needs Review
          </div>
          <div className="text-xl font-extrabold text-white">{reviewCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
            <XCircle size={14} /> Unavailable
          </div>
          <div className="text-xl font-extrabold text-white">{unavailableCount}</div>
        </div>
      </div>
    </div>
  );
};
