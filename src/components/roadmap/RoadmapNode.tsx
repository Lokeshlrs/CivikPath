import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { StepStatus, SourceVerificationStatus } from '../../types';
import { SourceStatusBadge } from '../common/SourceStatusBadge';

export interface CustomNodeData {
  title: string;
  shortDescription: string;
  status: StepStatus;
  sourceStatus: SourceVerificationStatus;
  isDocument?: boolean;
  stepId: string;
  iconType?: string;
  selected?: boolean;
  onNodeClick?: (stepId: string) => void;
}

export const RoadmapNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as CustomNodeData;
  const { title, shortDescription, status, sourceStatus, isDocument, stepId, onNodeClick } = nodeData;

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500 bg-white ring-emerald-500/20';
      case 'current':
        return 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/30';
      case 'needs_attention':
        return 'border-amber-500 bg-amber-50/20 ring-amber-500/20';
      default:
        return 'border-slate-200 bg-white';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-emerald-600" />;
      case 'current':
        return <Clock size={16} className="text-blue-600" />;
      case 'needs_attention':
        return <AlertCircle size={16} className="text-amber-600" />;
      default:
        return <Clock size={16} className="text-slate-400" />;
    }
  };

  return (
    <div
      onClick={() => onNodeClick?.(stepId)}
      className={`relative min-w-[240px] max-w-[280px] p-3.5 rounded-2xl border-2 shadow-sm transition-all duration-150 cursor-pointer select-none text-left ${getStatusColor()} ${
        selected ? 'ring-4 ring-blue-500/40 border-blue-600 shadow-md' : 'hover:border-blue-400'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-blue-600" />

      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            status === 'completed'
              ? 'bg-emerald-100 text-emerald-700'
              : status === 'current'
              ? 'bg-blue-600 text-white'
              : status === 'needs_attention'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {isDocument ? <FileText size={18} /> : getStatusIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-slate-900 truncate">{title}</h4>
            <ChevronRight size={14} className="text-slate-400 shrink-0" />
          </div>
          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
            {shortDescription}
          </p>

          <div className="flex items-center justify-between gap-1.5 mt-2 pt-2 border-t border-slate-100 text-[10px]">
            {/* Data-driven Source Status */}
            <SourceStatusBadge status={sourceStatus} size="sm" variant="full" />
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-blue-600" />
    </div>
  );
};
