import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { useCivic } from '../../context/CivicContext';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Button } from '../../components/common/Button';
import { SourceStatusBadge } from '../../components/common/SourceStatusBadge';
import { MapPin, Route, Plus, CheckCircle2, ArrowRight } from 'lucide-react';
import { guideCivicService } from '../../services/aiService';

export const MyPathsPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeProcedure, setGuidedProcedure, setCurrentTaskInput } = useCivic();
  const [availablePaths, setAvailablePaths] = useState<Array<{ title: string; category: string }>>([
    { title: 'Water Connection Application', category: 'Public Utilities' },
    { title: 'Trade License Registration', category: 'Business License' },
    { title: 'Passport Application and Re-issue', category: 'Union Passport Services' },
    { title: 'Udyam MSME Business Registration', category: 'Business Registration' },
    { title: 'Driving Licence Application and Renewal', category: 'Union Transport Services' },
    { title: 'Income Certificate Application', category: 'Revenue Services' },
  ]);
  const [switching, setSwitching] = useState<string | null>(null);

  const handleSelectPath = async (title: string) => {
    try {
      setSwitching(title);
      const res = await guideCivicService(title);
      if (res.matched && res.task && res.roadmap) {
        setGuidedProcedure(res);
      }
    } catch (err) {
      console.warn('[MyPathsPage] Failed to switch path:', err);
    } finally {
      setSwitching(null);
    }
  };

  const completedSteps = (activeProcedure.steps || []).filter((s) => s.status === 'completed');
  const inProgressSteps = (activeProcedure.steps || []).filter(
    (s) => s.status === 'in_progress' || s.status === 'current'
  );
  const upcomingSteps = (activeProcedure.steps || []).filter(
    (s) => s.status !== 'completed' && s.status !== 'in_progress' && s.status !== 'current'
  );

  const activeStatus =
    activeProcedure.officialSourceVerified
      ? 'verified'
      : activeProcedure.groundingStatus || activeProcedure.sourceStatus || 'database_only';

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
                CITIZEN DASHBOARD
              </span>
              <SourceStatusBadge status={activeStatus} size="sm" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">My Civic Paths</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Track and manage all your ongoing municipal and government applications.
            </p>
          </div>

          <Link to="/task" onClick={() => setCurrentTaskInput('')}>
            <Button kind="primary" size="md" icon={Plus}>
              Start New Path
            </Button>
          </Link>
        </div>

        {/* Active Path Card */}
        <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Route size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">Active Path</span>
                  <h2 className="text-xl font-bold text-slate-900">{activeProcedure.title}</h2>
                  <SourceStatusBadge status={activeStatus} size="sm" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mt-1">
                  <MapPin size={14} className="text-blue-600" />
                  <span>{activeProcedure.location}</span>
                </div>
              </div>
            </div>

            <Button kind="primary" size="md" onClick={() => navigate('/roadmap')}>
              Continue Path →
            </Button>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span>Citizen Progress</span>
              <span className="text-blue-600">
                {activeProcedure.completedStepsCount} of {activeProcedure.totalStepsCount} steps completed ({activeProcedure.progressPercentage}%)
              </span>
            </div>
            <ProgressBar progress={activeProcedure.progressPercentage} height="md" />
          </div>
        </div>

        {/* Multi-Path Switcher Library */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">Your Civic Tasks & Procedure Catalog</h3>
            <span className="text-xs text-slate-500 font-medium">Click any procedure below to set as Active Path</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {availablePaths.map((path) => {
              const isActive = activeProcedure.title.toLowerCase() === path.title.toLowerCase();
              return (
                <div
                  key={path.title}
                  onClick={() => !isActive && handleSelectPath(path.title)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isActive
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{path.category}</span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{path.title}</h4>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-slate-100">
                    {isActive ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Currently Active
                      </span>
                    ) : (
                      <span className="text-blue-600 flex items-center gap-1 hover:underline">
                        Switch Path <ArrowRight size={12} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* COMPLETED STEPS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-left space-y-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              ✓ COMPLETED STEPS ({completedSteps.length})
            </span>
            {completedSteps.length > 0 ? (
              <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
                {completedSteps.map((step) => (
                  <li key={step.id || step.nodeId}>• {step.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 font-medium">No steps completed yet.</p>
            )}
          </div>

          {/* IN PROGRESS STEPS */}
          <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs text-left space-y-2 bg-blue-50/20">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              ● CURRENT IN PROGRESS ({inProgressSteps.length})
            </span>
            {inProgressSteps.length > 0 ? (
              <ul className="text-xs text-slate-800 space-y-1.5 font-bold">
                {inProgressSteps.map((step) => (
                  <li key={step.id || step.nodeId}>• {step.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 font-medium">No active in-progress steps.</p>
            )}
          </div>

          {/* UPCOMING STEPS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-left space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              ○ UPCOMING STEPS ({upcomingSteps.length})
            </span>
            {upcomingSteps.length > 0 ? (
              <ul className="text-xs text-slate-500 space-y-1.5 font-medium">
                {upcomingSteps.map((step) => (
                  <li key={step.id || step.nodeId}>• {step.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 font-medium">All steps in progress or completed!</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
