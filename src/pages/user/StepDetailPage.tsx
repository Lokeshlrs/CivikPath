import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { useCivic } from '../../context/CivicContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SourceStatusBadge } from '../../components/common/SourceStatusBadge';
import { Button } from '../../components/common/Button';
import { ProcedureStep, StepStatus } from '../../types';
import { isPlaceholder } from '../../utils/placeholderUtils';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Lock,
  Play,
  RotateCcw,
  AlertTriangle,
  LogIn,
} from 'lucide-react';

export const StepDetailPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const { activeProcedure, documents, currentUser, updateStepStatus } = useCivic();

  const step = activeProcedure.steps.find((s) => s.id === stepId || s.nodeId === stepId);

  const [expandedWhy, setExpandedWhy] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  if (!step) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-left space-y-4">
          <button
            onClick={() => navigate('/roadmap')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to roadmap
          </button>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-950 font-bold text-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base">
              <AlertTriangle size={20} className="text-amber-700 shrink-0" />
              <span>Step details not found in current procedure roadmap</span>
            </div>
            <p className="text-xs text-amber-800 font-medium">
              The requested step ID ({stepId}) does not belong to the currently active roadmap ({activeProcedure.title}).
            </p>
            <button
              onClick={() => navigate('/roadmap')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Return to Roadmap Graph
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Check incoming dependencies for this step
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
    Boolean(step.officialSourceId) &&
    !isPlaceholder(step.officialSource);

  const cleanOfficialSource = isSourceVerified ? step.officialSource : 'Unverified Source';

  const validDocs = (step.documentRequirements || documents).filter(
    (doc) => !isPlaceholder(doc.name)
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
        {/* Back Link */}
        <button
          onClick={() => navigate('/roadmap')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to roadmap
        </button>

        {/* Step Title Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
                STEP DETAILS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <SourceStatusBadge status={step.sourceStatus || 'database_only'} size="sm" />
              <StatusBadge status={step.status} size="sm" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900">{step.title}</h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{step.fullDescription}</p>

          {/* Prerequisite Lock Banner */}
          {isLocked && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-950 font-medium">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Lock size={15} className="text-amber-700 shrink-0" />
                <span>Prerequisite Step Required</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                You must complete <strong className="font-semibold">{uncompletedPrereqs[0].title}</strong> before starting or completing this step.
              </p>
            </div>
          )}

          {/* Auth or Error Message */}
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-2 text-xs text-red-800 font-semibold">
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

          {/* Interactive Progress Control Bar */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                CITIZEN PROGRESS STATUS
              </span>
              <span className="font-bold text-slate-900 text-sm capitalize">
                Current Status: {step.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {step.status === 'completed' ? (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange('not_started')}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
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
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
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
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer ${
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Department</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{cleanDept}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Location / Mode</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{step.where}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Official Source</span>
              {isSourceVerified && step.officialSourceUrl ? (
                <a
                  href={step.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 hover:underline mt-0.5 inline-flex items-center gap-1 text-xs"
                >
                  <span>{cleanOfficialSource}</span>
                  <ExternalLink size={12} />
                </a>
              ) : isSourceVerified ? (
                <span className="font-bold text-blue-600 mt-0.5 block truncate">
                  {cleanOfficialSource}
                </span>
              ) : (
                <span className="font-medium text-slate-400 text-[11px] italic mt-0.5 block">
                  Official website link not yet verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* What You Need Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              WHAT YOU NEED
            </h2>
          </div>

          {validDocs.length > 0 ? (
            <div className="space-y-4">
              {validDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {doc.status === 'ready' ? (
                      <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Clock size={20} className="text-amber-600 shrink-0" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Required by: {isPlaceholder(doc.department) ? cleanDept : doc.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <SourceStatusBadge status={doc.sourceStatus} size="sm" />
                    <StatusBadge status={doc.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium py-2">
              No specific documents required or currently verified for this step.
            </p>
          )}

          {/* Why is this required? Expandable section */}
          <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
            <button
              onClick={() => setExpandedWhy(!expandedWhy)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-600" />
                <span>Why is this required?</span>
              </div>
              {expandedWhy ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expandedWhy && (
              <div className="px-5 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/40 space-y-2 leading-relaxed">
                <p>
                  <strong className="text-slate-800">Statutory Rationale:</strong> {step.whyRequired}
                </p>
                <p>
                  Required by: <strong className="text-slate-800">{cleanDept}</strong>
                </p>
                <p>
                  Official source: <strong className={isSourceVerified ? "text-blue-600" : "text-amber-800"}>
                    {cleanOfficialSource}
                  </strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
              WHAT HAPPENS NEXT
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {isPlaceholder(step.nextStepTitle) ? 'Proceed to next step' : (step.nextStepTitle || 'Proceed to next step')}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Once ready, proceed to the next step in the civic roadmap.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {step.officialSourceUrl ? (
              <a
                href={step.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
              >
                🔗 Go to Official Website
              </a>
            ) : isSourceVerified ? (
              <Link to={`/source/${step.officialSourceId}`}>
                <Button kind="outline" size="md" icon={ExternalLink}>
                  View official source →
                </Button>
              </Link>
            ) : (
              <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 text-[11px] font-medium text-center">
                Official website link not yet verified
              </div>
            )}
            <Button kind="primary" size="md" onClick={() => navigate('/roadmap')}>
              Back to roadmap
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
