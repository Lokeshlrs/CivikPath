import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { RoadmapGraph } from '../../components/roadmap/RoadmapGraph';
import { StepPanel } from '../../components/roadmap/StepPanel';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { SourceStatusBadge } from '../../components/common/SourceStatusBadge';
import { useCivic } from '../../context/CivicContext';
import { MapPin, FileCheck, Layers, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AskCivicAiCard } from '../../components/civic/AskCivicAiCard';

export const RoadmapPage: React.FC = () => {
  const { activeProcedure, selectedStep, setSelectedStep } = useCivic();

  if (!activeProcedure || !activeProcedure.steps || activeProcedure.steps.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 shadow-xs max-w-lg mx-auto">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto font-bold">
              ?
            </div>
            <h2 className="text-xl font-bold text-slate-900">No Active Civic Roadmap Selected</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Please search for a government procedure using Ask CivicPath AI or select a service from the service catalog.
            </p>
            <div className="pt-2">
              <Link
                to="/ask"
                className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors inline-block"
              >
                Find Service Roadmap →
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const currentSelectedStep =
    (selectedStep && activeProcedure.steps.find((s) => s.id === selectedStep.id || s.nodeId === selectedStep.nodeId)) ||
    activeProcedure.steps[0];

  const isVerified = activeProcedure.officialSourceVerified;
  const currentStatus = isVerified
    ? 'verified'
    : (activeProcedure.sourceStatus === 'demo'
        ? 'demo'
        : (activeProcedure.groundingStatus || activeProcedure.sourceStatus || 'database_only'));

  return (
    <MainLayout>
      {/* Context Top Bar */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              ACTIVE CIVIC PATH
            </span>
            <span className="text-slate-300">•</span>
            <h1 className="text-sm font-extrabold text-slate-900">{activeProcedure.title}</h1>
            <div className="flex items-center gap-1 text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              <MapPin size={12} className="text-blue-600" />
              <span>{activeProcedure.location}</span>
            </div>
            <SourceStatusBadge status={currentStatus} size="sm" />
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/documents"
              className="font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
            >
              <FileCheck size={14} className="text-blue-600" />
              <span>Document Checklist</span>
            </Link>
            <Link
              to="/my-paths"
              className="font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
            >
              <Layers size={14} className="text-blue-600" />
              <span>My Paths</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Roadmap Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Grounding & Verification Banner */}
        {isVerified ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-emerald-950">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
              <div>
                <span>✓ Official Source Verified</span>
                <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                  This roadmap and procedural steps are verified against official government domain sources.
                </p>
              </div>
            </div>
            {activeProcedure.officialSourceUrl ? (
              <a
                href={activeProcedure.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0 self-start sm:self-center"
              >
                🔗 Go to Official Website
              </a>
            ) : (
              <span className="text-[11px] text-emerald-700 font-medium italic shrink-0">
                Official website link not yet verified
              </span>
            )}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-amber-950">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-amber-700 shrink-0" />
              <div>
                <span>⚠ Database Roadmap — Not Officially Verified</span>
                <p className="text-[11px] text-amber-800 font-medium mt-0.5">
                  This procedural roadmap is backed by CivicPath's database, but specific steps have not yet been officially verified against a government source.
                </p>
              </div>
            </div>
            {activeProcedure.officialSourceUrl ? (
              <a
                href={activeProcedure.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0 self-start sm:self-center"
              >
                🔗 Go to Official Website
              </a>
            ) : (
              <span className="text-[11px] text-amber-800 font-medium italic shrink-0">
                Official website link not yet verified
              </span>
            )}
          </div>
        )}

        {/* Progress Bar Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-black text-xl shrink-0">
              {activeProcedure.progressPercentage}%
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  CITIZEN ROADMAP PROGRESS
                </span>
                <SourceStatusBadge status={currentStatus} size="sm" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {activeProcedure.completedStepsCount} of {activeProcedure.totalStepsCount} steps completed
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Interactive procedural roadmap persisted to MongoDB database.
              </p>
            </div>
          </div>

          <div className="w-full md:w-80">
            <ProgressBar progress={activeProcedure.progressPercentage} height="lg" showLabel />
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Dependency Graph (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
                  INTERACTIVE ROADMAP GRAPH
                </span>
                <div className="flex items-center gap-2.5 mt-0.5">
                  <h2 className="text-2xl font-bold text-slate-900">Your Civic Path</h2>
                </div>
              </div>
              <SourceStatusBadge status={currentStatus} size="md" className="self-start sm:self-center" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Click any node in the graph to inspect requirements, mark steps complete, and view source details.
            </p>

            {/* React Flow Interactive Graph */}
            <RoadmapGraph
              steps={activeProcedure.steps}
              selectedStepId={currentSelectedStep.id}
              onSelectStep={(id) => {
                const step = activeProcedure.steps.find((s) => s.id === id || s.nodeId === id);
                if (step) setSelectedStep(step);
              }}
            />
          </div>

          {/* RIGHT / MOBILE BOTTOM: Selected Step Panel (4 cols) */}
          <div className="lg:col-span-4">
            <StepPanel step={currentSelectedStep} />
          </div>
        </div>

        {/* "You may also need" Related Services Graph Section */}
        {activeProcedure.relatedServices && activeProcedure.relatedServices.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-left space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                  RECOMMENDED CIVIC SERVICES
                </span>
                <h3 className="text-lg font-bold text-slate-900">You may also need</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Related catalog procedures</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeProcedure.relatedServices.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setSelectedStep(null as any);
                    window.location.href = `/generating?query=${encodeURIComponent(rel.title)}`;
                  }}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/60 hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{rel.sector || 'Related Service'}</span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 line-clamp-2">{rel.title}</h4>
                  </div>
                  <div className="text-[11px] font-semibold text-blue-600 flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span>View Roadmap</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CivicPath Grounded AI Assistant Section */}
        <div className="pt-4">
          <AskCivicAiCard />
        </div>
      </div>
    </MainLayout>
  );
};
