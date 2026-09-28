import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  ExternalLink,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Lock,
  Play,
  RotateCcw,
  AlertTriangle,
  LogIn,
} from 'lucide-react';
import { ProcedureStep, StepStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Badge } from '../common/Badge';
import { SourceStatusBadge } from '../common/SourceStatusBadge';
import { useCivic } from '../../context/CivicContext';
import { isPlaceholder } from '../../utils/placeholderUtils';

interface StepPanelProps {
  step: ProcedureStep;
  onOpenStepDetails?: (stepId: string) => void;
}

export const StepPanel: React.FC<StepPanelProps> = ({ step }) => {
  const navigate = useNavigate();
  const { activeProcedure, currentUser, updateStepStatus } = useCivic();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Check incoming prerequisite dependencies for this step
  const stepNodeId = step.nodeId || step.id;
  const incomingDeps = activeProcedure.dependencies.filter(
    (dep) => dep.target === stepNodeId || dep.target === step.id
  );

  const uncompletedPrereqs = incomingDeps
    .map((dep) => activeProcedure.steps.find((s) => s.id === dep.source || s.nodeId === dep.source))
    .filter((s): s is ProcedureStep => s !== undefined && s.status !== 'completed');

  const isLocked = uncompletedPrereqs.length > 0;

  const handleStatusChange = async (targetStatus: StepStatus) => {
    setErrorMsg(null);

    if (!currentUser) {
      setErrorMsg('Sign in to save your progress.');
      return;
    }

    if ((targetStatus === 'in_progress' || targetStatus === 'completed') && isLocked) {
      setErrorMsg(`Prerequisite step "${uncompletedPrereqs[0].title}" must be completed first.`);
      return;
    }

    setUpdating(true);
    const res = await updateStepStatus(step.id, targetStatus);
    setUpdating(false);

    if (!res.success && res.message) {
      setErrorMsg(res.message);
    }
  };

  const cleanDept = isPlaceholder(step.department) ? 'Unspecified Department' : step.department;
  const isSourceVerified =
    step.sourceStatus === 'verified' &&
    step.officialSourceId &&
    !isPlaceholder(step.officialSource);

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs text-left space-y-5 sticky top-24">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              SELECTED STEP DETAILS
            </span>
          </div>
          <StatusBadge status={step.status} size="sm" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 leading-snug">{step.title}</h2>
        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{step.fullDescription}</p>
      </div>

      {/* Dependency Locking Notice */}
      {isLocked && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-950 font-medium">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Lock size={14} className="text-amber-700 shrink-0" />
            <span>Prerequisite Step Required</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Must complete <strong className="font-semibold">{uncompletedPrereqs[0].title}</strong> before starting or completing this step.
          </p>
        </div>
      )}

      {/* Error or Unauthenticated Prompt */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2 text-xs text-red-800 font-semibold">
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={15} className="text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          {!currentUser && (
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
            >
              <LogIn size={12} /> Sign in now →
            </button>
          )}
        </div>
      )}

      {/* Step Progress Actions */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
          STEP CITIZEN ACTION
        </span>

        <div className="flex flex-col gap-2">
          {step.status === 'completed' ? (
            <button
              type="button"
              disabled={updating}
              onClick={() => handleStatusChange('not_started')}
              className="w-full py-2 px-3 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reopen Step</span>
            </button>
          ) : (
            <>
              {step.status !== 'in_progress' && (
                <button
                  type="button"
                  disabled={updating || isLocked}
                  onClick={() => handleStatusChange('in_progress')}
                  className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isLocked
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  {isLocked ? <Lock size={14} /> : <Play size={14} />}
                  <span>Start Step</span>
                </button>
              )}

              <button
                type="button"
                disabled={updating || isLocked}
                onClick={() => handleStatusChange('completed')}
                className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
                  isLocked
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isLocked ? <Lock size={14} /> : <CheckCircle2 size={14} />}
                <span>Mark as Completed</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Verification & Metadata */}
      <div className="space-y-3 text-xs">
        {/* Phase 5C Provenance Badge */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs">
            <ShieldCheck size={15} className="text-slate-500" /> Provenance
          </span>
          {isSourceVerified ? (
            <SourceStatusBadge status="verified" size="sm" />
          ) : (
            <span className="text-[10px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              ⚠ Database Roadmap — Not Officially Verified
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block">Department</span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block truncate">
              {cleanDept}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block">Location / Mode</span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block truncate">
              {step.where}
            </span>
          </div>
        </div>

        {step.fee && !isPlaceholder(step.fee) && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 font-medium">Statutory Fee</span>
            <span className="font-bold text-slate-900 bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
              {step.fee}
            </span>
          </div>
        )}

        {step.nextStepTitle && !isPlaceholder(step.nextStepTitle) && (
          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
              NEXT STEP
            </span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block">
              {step.nextStepTitle}
            </span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-2">
        <Link
          to={`/roadmap/step/${step.id}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <span>Open step details →</span>
        </Link>

        {isSourceVerified ? (
          <Link
            to={`/source/${step.officialSourceId}`}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
          >
            <span>View official source</span>
            <ExternalLink size={13} />
          </Link>
        ) : (
          <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 text-[11px] font-medium text-center">
            Official source for this specific step has not yet been verified.
          </div>
        )}
      </div>
    </div>
  );
};
