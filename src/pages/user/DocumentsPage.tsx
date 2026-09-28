import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { useCivic } from '../../context/CivicContext';
import { DocumentCard } from '../../components/civic/DocumentCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { ArrowLeft } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, toggleDocumentStatus } = useCivic();

  const readyCount = documents.filter((d) => d.status === 'ready').length;
  const progressPercent = Math.round((readyCount / documents.length) * 100);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
        {/* Back navigation */}
        <button
          onClick={() => navigate('/roadmap')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to roadmap
        </button>

        {/* Page Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
                  CHECKLIST MANAGEMENT
                </span>
                <Badge type="demo" size="sm" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Your document checklist</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Keep track of required records before applying at municipal offices.
              </p>
            </div>
            <Badge type="official" size="md" className="self-start sm:self-center" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span>Checklist Progress (Demo)</span>
              <span className="text-blue-600">
                {readyCount} of {documents.length} ready
              </span>
            </div>
            <ProgressBar progress={progressPercent} height="md" color="emerald" />
          </div>
        </div>

        {/* Document Cards List */}
        <div className="space-y-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onToggleStatus={toggleDocumentStatus}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
