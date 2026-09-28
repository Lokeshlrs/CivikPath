import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlowHeader } from '../../components/layout/FlowHeader';
import { QuestionCard } from '../../components/civic/QuestionCard';
import { Button } from '../../components/common/Button';
import { MOCK_QUESTIONS } from '../../data/mockTasks';
import { useCivic } from '../../context/CivicContext';
import { ArrowLeft } from 'lucide-react';

export const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { questionAnswers, setQuestionAnswer } = useCivic();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const currentQuestion = MOCK_QUESTIONS[currentQuestionIdx];

  const handleSelect = (optionId: string) => {
    setQuestionAnswer(currentQuestion.id, optionId);
  };

  const handleNext = () => {
    if (currentQuestionIdx < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      navigate('/confirm');
    }
  };

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    } else {
      navigate('/location');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <FlowHeader
        currentStep={currentQuestionIdx + 1}
        totalSteps={MOCK_QUESTIONS.length}
        stepName="Setting up your path"
      />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full flex flex-col justify-center space-y-8">
        <QuestionCard
          question={currentQuestion}
          selectedOptionId={questionAnswers[currentQuestion.id]}
          onSelectOption={handleSelect}
        />

        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <Button kind="ghost" size="md" icon={ArrowLeft} iconPosition="left" onClick={handleBack}>
            Back
          </Button>
          <Button kind="primary" size="lg" onClick={handleNext}>
            {currentQuestionIdx === MOCK_QUESTIONS.length - 1 ? 'Review Details →' : 'Continue →'}
          </Button>
        </div>
      </main>
    </div>
  );
};
