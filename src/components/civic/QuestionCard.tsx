import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Check, Sparkles } from 'lucide-react';
import { ClarificationQuestion } from '../../types';

interface QuestionCardProps {
  question: ClarificationQuestion;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 text-left">
      {/* AI Conversational Bubble Header */}
      <div className="flex gap-4 items-start">
        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
          <Sparkles size={20} />
        </div>
        <div className="flex-1 bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm p-6 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
            QUESTION {question.questionNumber} OF {question.totalQuestions}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">{question.title}</h2>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
            {question.description}
          </p>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 sm:pl-14">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <div
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`relative p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-300 bg-white text-transparent'
                }`}
              >
                <Check size={14} strokeWidth={3} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {option.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Why do we ask this? Expandable explanation */}
      <div className="pl-0 sm:pl-14">
        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <HelpCircle size={15} className="text-blue-600" />
              <span>Why do we ask this?</span>
            </div>
            {showExplanation ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {showExplanation && (
            <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/40 leading-relaxed">
              {question.explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
