import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlowHeader } from '../../components/layout/FlowHeader';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const TaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTaskInput, setCurrentTaskInput } = useCivic();
  const [val, setVal] = useState(currentTaskInput);

  const suggestions = [
    'I want to apply for a passport',
    'Income Certificate Application',
    'Caste Certificate Application',
    'Water Connection Application',
    'Trade License Registration',
  ];

  const handleContinue = () => {
    if (val.trim()) {
      setCurrentTaskInput(val.trim());
      navigate('/generating');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <FlowHeader currentStep={1} totalSteps={2} stepName="Describe your civic task" />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full flex flex-col justify-center text-center space-y-8">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What do you want to accomplish?
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Describe the government service, certificate, or registration you need guidance on.
          </p>
        </div>

        {/* Large Input Box */}
        <div className="space-y-4 text-left">
          <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-md focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
              Your Goal / Task
            </label>
            <textarea
              value={val}
              onChange={(e) => setVal(e.target.value)}
              rows={3}
              placeholder="I want to apply for a passport"
              className="w-full text-lg font-semibold text-slate-900 bg-transparent focus:outline-none resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Example Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-500">Popular suggestions:</span>
            {suggestions.map((sug) => (
              <button
                key={sug}
                onClick={() => setVal(sug)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <Button kind="ghost" size="md" icon={ArrowLeft} iconPosition="left" onClick={() => navigate('/')}>
            Back
          </Button>
          <Button kind="primary" size="lg" onClick={handleContinue}>
            Continue →
          </Button>
        </div>
      </main>
    </div>
  );
};
