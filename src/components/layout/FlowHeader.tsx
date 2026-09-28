import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { ProgressBar } from '../common/ProgressBar';
import { X } from 'lucide-react';

interface FlowHeaderProps {
  currentStep?: number;
  totalSteps?: number;
  stepName?: string;
  onExitToLanding?: () => void;
}

export const FlowHeader: React.FC<FlowHeaderProps> = ({
  currentStep = 1,
  totalSteps = 3,
  stepName = 'Setting up your path',
  onExitToLanding,
}) => {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-500 font-medium">
        <Link
          to="/"
          onClick={onExitToLanding}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors font-semibold"
        >
          <X size={16} />
          <span>Exit</span>
        </Link>
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <span>{stepName}</span>
          <span className="text-slate-400">•</span>
          <span className="text-blue-600 font-bold">
            Question {currentStep} of {totalSteps}
          </span>
        </div>
        <Logo size="sm" to="/" />
      </div>
      <ProgressBar progress={progressPercent} height="sm" className="rounded-none" />
    </div>
  );
};
