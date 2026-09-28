import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { AskCivicAiCard } from '../../components/civic/AskCivicAiCard';
import { Badge } from '../../components/common/Badge';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AskAiPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold border border-blue-200">
              <Sparkles size={14} className="text-blue-600" />
              <span>Grounded AI Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Ask CivicPath AI Guidance
            </h1>

            <p className="text-base text-slate-600 max-w-2xl mx-auto font-medium">
              Ask any question about government procedures, required documents, or official services. Answers are strictly grounded in verified government sources.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 pt-2">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Zero Hallucination Policy</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                <ShieldCheck size={14} className="text-blue-600" />
                <span>Official Domain Verification</span>
              </div>
            </div>
          </div>

          {/* Main Ask Card */}
          <AskCivicAiCard />
        </div>
      </div>
    </MainLayout>
  );
};
