import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlowHeader } from '../../components/layout/FlowHeader';
import { TaskSummary } from '../../components/civic/TaskSummary';
import { Button } from '../../components/common/Button';
import { useCivic } from '../../context/CivicContext';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const ConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTaskInput, location } = useCivic();

  const handleGenerate = () => {
    navigate('/generating');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <FlowHeader currentStep={3} totalSteps={3} stepName="Confirming Details" />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full flex flex-col justify-center text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Let's make sure we got it right.
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Review these details before we build your personalized roadmap.
          </p>
        </div>

        <TaskSummary
          taskInput={currentTaskInput}
          location={location}
          onEditTask={() => navigate('/task')}
          onEditLocation={() => navigate('/location')}
          onEditAnswers={() => navigate('/questions')}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
          <Button
            kind="ghost"
            size="md"
            icon={ArrowLeft}
            iconPosition="left"
            onClick={() => navigate('/questions')}
          >
            Back to questions
          </Button>
          <Button kind="primary" size="lg" icon={Sparkles} onClick={handleGenerate}>
            Generate My Civic Path →
          </Button>
        </div>
      </main>
    </div>
  );
};
