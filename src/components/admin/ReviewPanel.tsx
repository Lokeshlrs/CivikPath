import React, { useState } from 'react';
import { AdminReviewItem } from '../../types';
import { AlertTriangle, CheckCircle2, XCircle, FileText, Sparkles, Edit3 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface ReviewPanelProps {
  items: AdminReviewItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  items,
  onApprove,
  onReject,
}) => {
  const [selectedId, setSelectedId] = useState<string>(items[0]?.id || '');
  const activeItem = items.find((i) => i.id === selectedId) || items[0];

  if (!items.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        No pending reviews in queue.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Warning Banner */}
      {/* Warning Banner */}
      <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3.5 text-amber-200">
        <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <div className="flex items-center gap-2 mb-1">
            <strong className="font-bold text-amber-300">
              ⚠ Human Review Required Before Publication
            </strong>
          </div>
          AI-extracted information remains untrusted until an administrator verifies it against the official source.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Queue List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            REVIEW QUEUE ({items.length})
          </h3>
          <div className="space-y-2">
            {items.map((item) => {
              const isSelected = item.id === activeItem.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-xs'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs truncate">{item.service}</span>
                    <StatusBadge status={item.verificationStatus} size="sm" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{item.location}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Extraction Details */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                  EXTRACTION REVIEW
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{activeItem.service}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{activeItem.location}</p>
            </div>
            <StatusBadge status={activeItem.verificationStatus} size="md" />
          </div>

          {/* Extraction Confidence Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-xs font-bold text-white">Extraction Confidence</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                How confidently the system extracted information from the source.
              </p>
            </div>
            <div className="text-2xl font-extrabold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20">
              {activeItem.extractionConfidence}%
            </div>
          </div>

          {/* Extracted Fields */}
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider block">
                Extracted Documents Requirement
              </span>
              <ul className="space-y-1.5 text-slate-200">
                {activeItem.extractedDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FileText size={14} className="text-blue-400 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-medium block">Extracted Fee</span>
                <span className="font-bold text-amber-400 text-sm mt-0.5 block">
                  {activeItem.fee}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-medium block">Extracted Department</span>
                <span className="font-bold text-white text-xs mt-0.5 block truncate">
                  {activeItem.department}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-medium block">Extracted Official Source</span>
              <span className="font-mono text-blue-400 text-xs mt-0.5 block">
                {activeItem.source}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button
              kind="danger"
              size="md"
              icon={XCircle}
              onClick={() => onReject(activeItem.id)}
            >
              Reject Extraction
            </Button>
            <Button
              kind="primary"
              size="md"
              icon={CheckCircle2}
              onClick={() => onApprove(activeItem.id)}
            >
              Approve as Verified
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
