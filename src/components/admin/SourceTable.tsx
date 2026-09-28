import React from 'react';
import { GovernmentSource } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Badge } from '../common/Badge';
import { ExternalLink, Plus } from 'lucide-react';
import { Button } from '../common/Button';

interface SourceTableProps {
  sources: GovernmentSource[];
  onToggleStatus: (id: string) => void;
  onAddSource?: () => void;
}

export const SourceTable: React.FC<SourceTableProps> = ({
  sources,
  onToggleStatus,
  onAddSource,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-left shadow-xs">
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Government Source Registry</h2>
            <Badge type="verified" size="sm" />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified official government domain registry & extraction health.
          </p>
        </div>
        <Button kind="primary" size="sm" icon={Plus} onClick={onAddSource}>
          Add Source
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 text-left">Department</th>
              <th className="py-3.5 px-4 text-left">Service</th>
              <th className="py-3.5 px-4 text-left">Official Domain</th>
              <th className="py-3.5 px-4 text-left">Status</th>
              <th className="py-3.5 px-4 text-left">Last Verified</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {sources.map((source) => (
              <tr key={source.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">{source.department}</td>
                <td className="py-3.5 px-4 text-slate-300">{source.service}</td>
                <td className="py-3.5 px-4 font-mono text-blue-400">{source.officialDomain}</td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={source.status} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-slate-400">{source.lastVerified}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onToggleStatus(source.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-[11px] transition-colors"
                    >
                      {source.status === 'verified' ? 'Flag Review' : 'Approve'}
                    </button>
                    <a
                      href={source.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="View Official Source"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
