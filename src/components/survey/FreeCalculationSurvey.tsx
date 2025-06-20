import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FreeCalculationSurveyProps {
  onNext: (answer: { acceptedOffer: boolean }) => void;
  // No onPrevious needed here as StartSurvey.tsx handles the previous button at the bottom
}

const FreeCalculationSurvey: React.FC<FreeCalculationSurveyProps> = ({ onNext }) => {
  return (
    <>
      <DialogHeader className="mb-6">
        <DialogTitle className="text-4xl md:text-5xl font-heading leading-none uppercase">
          HERE’s a gift from US… <br></br> <span className="line-through"> $99</span> FREE MATERIALS ESTIMATE
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col md:flex-row items-center gap-4 mt-8">
        <button onClick={() => onNext({ acceptedOffer: true })} className="survey-button w-full">
          YES (UPLOAD PDF)
        </button>
        <button onClick={() => onNext({ acceptedOffer: false })} className="survey-button w-full">
          NO THANKS
        </button>
      </div>
    </>
  );
};

export default FreeCalculationSurvey;
