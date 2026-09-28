import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { useCivic } from '../../context/CivicContext';
import { SourceCard } from '../../components/civic/SourceCard';
import { ArrowLeft } from 'lucide-react';

export const SourceDetailPage: React.FC = () => {
  const { sourceId } = useParams<{ sourceId: string }>();
  const navigate = useNavigate();
  const { sources } = useCivic();

  const source =
    sources.find((s) => s.id === sourceId) || sources[0];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-left">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <SourceCard source={source} />
      </div>
    </MainLayout>
  );
};
