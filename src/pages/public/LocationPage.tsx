import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlowHeader } from '../../components/layout/FlowHeader';
import { LocationCard } from '../../components/civic/LocationCard';
import { useCivic } from '../../context/CivicContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const LocationPage: React.FC = () => {
  const navigate = useNavigate();
  const { location, setLocation } = useCivic();

  const handleConfirmLocation = () => {
    navigate('/generating');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <FlowHeader currentStep={1} totalSteps={3} stepName="Confirming Location" />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full flex flex-col justify-center text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Where do you want to do this?
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Procedures can differ by location, so we'll always ask you to confirm before we build your roadmap.
          </p>
        </div>

        <LocationCard
          location={location}
          onConfirm={handleConfirmLocation}
          onChangeLocation={setLocation}
        />

        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <Button
            kind="ghost"
            size="md"
            icon={ArrowLeft}
            iconPosition="left"
            onClick={() => navigate('/task')}
          >
            Back to task
          </Button>
        </div>
      </main>
    </div>
  );
};
