import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { DocumentRequirement } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SourceStatusBadge } from '../common/SourceStatusBadge';
import { Link } from 'react-router-dom';

interface DocumentCardProps {
  document: DocumentRequirement;
  onToggleStatus?: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onToggleStatus,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs text-left space-y-4 transition-all hover:border-slate-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {document.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Required by: <span className="text-slate-700 font-semibold">{document.department}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <SourceStatusBadge status={document.sourceStatus} size="sm" />
          <StatusBadge status={document.status} size="sm" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <span>Why is this required?</span>
          {showExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <div className="flex items-center gap-2">
          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(document.id)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              Mark as {document.status === 'ready' ? 'Pending' : 'Ready'}
            </button>
          )}
          <Link
            to={`/source/${document.officialSourceId}`}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-900 font-semibold transition-colors"
          >
            <span>View source</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {showExplanation && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
          <strong className="text-slate-800 block mb-1">Official Statutory Rationale:</strong>
          {document.whyRequired}
        </div>
      )}
    </div>
  );
};
