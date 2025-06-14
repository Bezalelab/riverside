import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import ProjectTypeSurvey from './ProjectTypeSurvey';
import RepairOptionsSurvey from './RepairOptionsSurvey';
import HomeownerFormSurvey from './HomeownerFormSurvey';
import HomeownerChecklistSurvey from './HomeownerChecklistSurvey';
import ContractorFormSurvey from './ContractorFormSurvey';
import ContractorChecklistSurvey from './ContractorChecklistSurvey';
import ContractorSuccessSurvey from './ContractorSuccessSurvey';
import FreeCalculationSurvey from './FreeCalculationSurvey';
import PdfUploadSurvey from './PdfUploadSurvey';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SurveyAnswers {
  userType?: 'Contractor' | 'Homeowner';
  projectType?: 'Repair' | 'New Construction';
  contractorDetails?: any;
  repairOptions?: string[];
  homeownerDetails?: { name: string; phone: string; email: string };
  free_roofing_calculation?: { acceptedOffer: boolean };
  uploadedPdfFile?: File;
}

const SURVEY_STEPS = {
  START: 'START',
  PROJECT_TYPE: 'PROJECT_TYPE',
  CONTRACTOR_FORM: 'CONTRACTOR_FORM',
  CONTRACTOR_CHECKLIST: 'CONTRACTOR_CHECKLIST',
  CONTRACTOR_SUCCESS: 'CONTRACTOR_SUCCESS',
  REPAIR_OPTIONS: 'REPAIR_OPTIONS',
  HOMEOWNER_FORM: 'HOMEOWNER_FORM',
  HOMEOWNER_CHECKLIST: 'HOMEOWNER_CHECKLIST',
  FREE_CALCULATION: 'FREE_CALCULATION',
  PDF_UPLOAD: 'PDF_UPLOAD'
};

const SUCCESS_STEP_KEYS = [SURVEY_STEPS.CONTRACTOR_SUCCESS, SURVEY_STEPS.HOMEOWNER_CHECKLIST];

const isSuccessStep = (step: string): boolean => {
  return SUCCESS_STEP_KEYS.includes(step);
};

interface UserTypeSurveyProps {
  onNext: (userType: 'Homeowner' | 'Contractor') => void;
}
const imageUrls = ['/survey/start-survey.png', '/survey/repair.png', '/survey/new-construction.png', '/survey/one-last-thing.png', '/survey/checklist.png', '/survey/contractor.png', '/survey/builder.png'];

const UserTypeSurvey: React.FC<UserTypeSurveyProps> = ({ onNext }) => (
  <>
    <DialogHeader className="mb-6">
      <DialogTitle className="text-4xl md:text-5xl font-heading leading-none uppercase">Who are you?</DialogTitle>
    </DialogHeader>
    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5">
      <button onClick={() => onNext('Homeowner')} className="survey-button w-full sm:w-1/2">
        Homeowner
      </button>
      <button onClick={() => onNext('Contractor')} className="survey-button w-full sm:w-1/2">
        Contractor
      </button>
    </div>
  </>
);

const StartSurvey = ({ isHome, userType, buttonText = 'Start Survey', className }: { isHome?: boolean; userType?: 'Homeowner' | 'Contractor'; buttonText?: string; className?: string }) => {
  const [currentStep, setCurrentStep] = useState('');
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  const openSurvey = () => {
    // If userType is provided, skip directly to the appropriate step
    if (userType) {
      if (userType === 'Homeowner') {
        setCurrentStep(SURVEY_STEPS.PROJECT_TYPE);
        setSurveyAnswers((prev) => ({ ...prev, userType: 'Homeowner' }));
        setProgressPercentage(25);
      } else if (userType === 'Contractor') {
        setCurrentStep(SURVEY_STEPS.CONTRACTOR_FORM);
        setSurveyAnswers((prev) => ({ ...prev, userType: 'Contractor' }));
        setProgressPercentage(50);
      }
    } else {
      setCurrentStep(SURVEY_STEPS.START);
      setProgressPercentage(0);
    }
    setIsDialogOpen(true);
  };

  const closeSurvey = () => {
    setIsDialogOpen(false);
  };

  const handleNextStep = (answer?: any) => {
    setSurveyAnswers((prevAnswers) => {
      let newAnswers = { ...prevAnswers };
      let nextStep = currentStep;
      let newProgress = progressPercentage;

      switch (currentStep) {
        case SURVEY_STEPS.START:
          const userType = answer;
          if (userType === 'Homeowner') {
            nextStep = SURVEY_STEPS.PROJECT_TYPE;
            newProgress = 25;
            const { contractorDetails, repairOptions, ...rest } = newAnswers;
            newAnswers = { ...rest, userType: 'Homeowner' };
          } else {
            nextStep = SURVEY_STEPS.CONTRACTOR_FORM;
            newProgress = 50;
            const { homeownerDetails, projectType, repairOptions, free_roofing_calculation, uploadedPdfFile, ...rest } = newAnswers;
            newAnswers = { ...rest, userType: 'Contractor' };
          }
          break;
        case SURVEY_STEPS.PROJECT_TYPE:
          newAnswers.projectType = answer;
          if (answer === 'Repair') {
            nextStep = SURVEY_STEPS.REPAIR_OPTIONS;
            newProgress = 50;
          } else if (answer === 'New Construction') {
            nextStep = SURVEY_STEPS.FREE_CALCULATION;
            newProgress = 50;
          }
          break;
        case SURVEY_STEPS.FREE_CALCULATION:
          newAnswers.free_roofing_calculation = answer;
          if (answer.acceptedOffer) {
            nextStep = SURVEY_STEPS.PDF_UPLOAD;
            newProgress = 60;
          } else {
            nextStep = SURVEY_STEPS.HOMEOWNER_FORM;
            newProgress = 75;
          }
          break;
        case SURVEY_STEPS.PDF_UPLOAD:
          newAnswers.uploadedPdfFile = answer;
          nextStep = SURVEY_STEPS.HOMEOWNER_FORM;
          newProgress = 75;
          break;
        case SURVEY_STEPS.REPAIR_OPTIONS:
          newAnswers.repairOptions = answer;
          nextStep = SURVEY_STEPS.HOMEOWNER_FORM;
          newProgress = 75;
          break;
        case SURVEY_STEPS.HOMEOWNER_FORM:
          newAnswers.homeownerDetails = answer;
          nextStep = SURVEY_STEPS.HOMEOWNER_CHECKLIST;
          newProgress = 100;
          break;
        case SURVEY_STEPS.CONTRACTOR_FORM:
          newAnswers.contractorDetails = answer;
          nextStep = SURVEY_STEPS.CONTRACTOR_CHECKLIST;
          newProgress = 75;
          break;
        case SURVEY_STEPS.CONTRACTOR_CHECKLIST:
          newAnswers.repairOptions = answer;
          nextStep = SURVEY_STEPS.CONTRACTOR_SUCCESS;
          newProgress = 100;
          break;
        default:
          break;
      }

      if (isSuccessStep(nextStep)) {
        const formData = new FormData();

        formData.append('surveyData', JSON.stringify(newAnswers));

        if (newAnswers.uploadedPdfFile) {
          formData.append('pdfFile', newAnswers.uploadedPdfFile);
        }

        fetch('/api/send-email', {
          method: 'POST',
          body: formData
        })
          .then(async (response) => {
            const data = await response.json();
            if (response.ok) {
              toast.success('Thank you for your submission!');
            } else {
              toast.error('Failed to send survey data. Please try again.');
            }
            console.log('Email API response:', data.message);
          })
          .catch((error) => {
            toast.error('An error occurred while sending data. Please try again.');
            console.error('Error sending survey data:', error);
          });
      }

      setCurrentStep(nextStep);
      setProgressPercentage(newProgress);
      return newAnswers;
    });
  };

  const handlePreviousStep = () => {
    if (currentStep === SURVEY_STEPS.PROJECT_TYPE || currentStep === SURVEY_STEPS.CONTRACTOR_FORM) {
      setCurrentStep(SURVEY_STEPS.START);
      setSurveyAnswers({});
      setProgressPercentage(0);
    } else if (currentStep === SURVEY_STEPS.REPAIR_OPTIONS) {
      setCurrentStep(SURVEY_STEPS.PROJECT_TYPE);
      setSurveyAnswers((prev) => {
        const { repairOptions, ...rest } = prev;
        return rest;
      });
      setProgressPercentage(25);
    } else if (currentStep === SURVEY_STEPS.HOMEOWNER_FORM) {
      setSurveyAnswers((prev) => {
        const { homeownerDetails, ...rest } = prev;
        return rest;
      });
      if (surveyAnswers.projectType === 'New Construction') {
        if (surveyAnswers.free_roofing_calculation?.acceptedOffer) {
          setCurrentStep(SURVEY_STEPS.PDF_UPLOAD);
          setProgressPercentage(60);
        } else {
          setCurrentStep(SURVEY_STEPS.FREE_CALCULATION);
          setProgressPercentage(50);
        }
      } else if (surveyAnswers.projectType === 'Repair') {
        setCurrentStep(SURVEY_STEPS.REPAIR_OPTIONS);
        setProgressPercentage(50);
      }
    } else if (currentStep === SURVEY_STEPS.PDF_UPLOAD) {
      setCurrentStep(SURVEY_STEPS.FREE_CALCULATION);
      setSurveyAnswers((prev) => {
        const { uploadedPdfFile, ...rest } = prev;
        return rest;
      });
      setProgressPercentage(50);
    } else if (currentStep === SURVEY_STEPS.FREE_CALCULATION) {
      setCurrentStep(SURVEY_STEPS.PROJECT_TYPE);
      setSurveyAnswers((prev) => {
        const { free_roofing_calculation, ...rest } = prev;
        return rest;
      });
      setProgressPercentage(25);
    } else if (currentStep === SURVEY_STEPS.HOMEOWNER_CHECKLIST) {
      setCurrentStep(SURVEY_STEPS.HOMEOWNER_FORM);
      setProgressPercentage(surveyAnswers.repairOptions ? 75 : 50);
    } else if (currentStep === SURVEY_STEPS.CONTRACTOR_CHECKLIST) {
      setCurrentStep(SURVEY_STEPS.CONTRACTOR_FORM);
      setProgressPercentage(50);
    } else if (currentStep === SURVEY_STEPS.CONTRACTOR_SUCCESS) {
      setCurrentStep(SURVEY_STEPS.CONTRACTOR_CHECKLIST);
      setProgressPercentage(75);
    }
  };

  // Survey Step Components Configuration
  const surveyStepComponentsConfig: Record<string, { component: React.ElementType; props: () => any }> = {
    [SURVEY_STEPS.START]: {
      component: UserTypeSurvey,
      props: () => ({ onNext: (type: 'Homeowner' | 'Contractor') => handleNextStep(type) })
    },
    [SURVEY_STEPS.PROJECT_TYPE]: {
      component: ProjectTypeSurvey,
      props: () => ({ onNext: (projectTypeAnswer: string) => handleNextStep(projectTypeAnswer) })
    },
    [SURVEY_STEPS.FREE_CALCULATION]: {
      component: FreeCalculationSurvey,
      props: () => ({ onNext: (offerAccepted: { acceptedOffer: boolean }) => handleNextStep(offerAccepted) })
    },
    [SURVEY_STEPS.PDF_UPLOAD]: {
      component: PdfUploadSurvey,
      props: () => ({ onNext: (file?: File) => handleNextStep(file) })
    },
    [SURVEY_STEPS.REPAIR_OPTIONS]: {
      component: RepairOptionsSurvey,
      props: () => ({ onNext: (options: string[]) => handleNextStep(options) })
    },
    [SURVEY_STEPS.HOMEOWNER_FORM]: {
      component: HomeownerFormSurvey,
      props: () => ({ onNext: (details: object) => handleNextStep(details) })
    },
    [SURVEY_STEPS.HOMEOWNER_CHECKLIST]: {
      component: HomeownerChecklistSurvey,
      props: () => ({
        onBack: handlePreviousStep,
        onClose: closeSurvey,
        projectType: surveyAnswers.projectType,
        uploadedPdfFileExists: !!surveyAnswers.uploadedPdfFile
      })
    },
    [SURVEY_STEPS.CONTRACTOR_FORM]: {
      component: ContractorFormSurvey,
      props: () => ({ onNext: (details: object) => handleNextStep(details) })
    },
    [SURVEY_STEPS.CONTRACTOR_CHECKLIST]: {
      component: ContractorChecklistSurvey,
      props: () => ({ onNext: (checklist: object) => handleNextStep(checklist) })
    },
    [SURVEY_STEPS.CONTRACTOR_SUCCESS]: {
      component: ContractorSuccessSurvey,
      props: () => ({})
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(isOpen) => !isOpen && closeSurvey()}>
      <DialogTrigger onClick={openSurvey} className={cn('survey-button', className, ` ${isHome ? 'bg-white hover:bg-white/95 text-primary' : 'bg-primary hover:bg-primary/90 text-white'}`)}>
        {buttonText}
      </DialogTrigger>
      <DialogContent>
        {isDialogOpen && (
          <div className="flex flex-col justify-between lg:flex-row">
            <div className="h-[400px] lg:h-[800px] order-last lg:order-first block lg:shrink-0">
              {currentStep === SURVEY_STEPS.START && <img src="/survey/start-survey.png" alt="Start survey" className="object-cover w-full h-full" />}
              {currentStep === SURVEY_STEPS.PROJECT_TYPE && <img src="/survey/start-survey.png" alt="Project type survey" className="object-cover w-full h-full" />}
              {currentStep === SURVEY_STEPS.REPAIR_OPTIONS && <img src="/survey/repair.png" alt="Repair options survey" className="object-cover w-full h-full" />}
              {currentStep === SURVEY_STEPS.FREE_CALCULATION && <img src="/survey/new-construction.png" alt="Free calculation offer" className="object-cover w-full h-full" />}
              {currentStep === SURVEY_STEPS.PDF_UPLOAD && <img src="/survey/new-construction.png" alt="Upload house plan" className="object-cover w-full h-full" />}
              {currentStep === SURVEY_STEPS.HOMEOWNER_FORM && <img src="/survey/one-last-thing.png" alt="Homeowner form survey" className="object-cover w-full h-full" />}
              {currentStep === SURVEY_STEPS.HOMEOWNER_CHECKLIST && <img src="/survey/checklist.png" alt="Homeowner checklist survey" className="object-cover w-full h-full" />}
              {currentStep === SURVEY_STEPS.CONTRACTOR_FORM && <img src="/survey/contractor.png" alt="Contractor survey" className="object-cover w-full h-full" />}
              {currentStep === SURVEY_STEPS.CONTRACTOR_CHECKLIST && <img src="/survey/builder.png" alt="Checklist survey" className="object-cover w-full h-full" />}
              {currentStep === SURVEY_STEPS.CONTRACTOR_SUCCESS && <img src="/survey/checklist.png" alt="Success survey" className="object-cover w-full h-full" />}
            </div>

            <div id="survey-content" className="relative pt-20 lg:pt-35 px-3.75 md:px-6 lg:px-10 pb-6 flex flex-col justify-between w-full">
              {Object.entries(surveyStepComponentsConfig).map(([stepKey, config]) => {
                const StepComponent = config.component;
                return (
                  <div
                    key={stepKey}
                    className={`transition-opacity duration-500 ease-in-out ${(currentStep === SURVEY_STEPS.CONTRACTOR_FORM && 'md:-mt-12') || (currentStep === SURVEY_STEPS.HOMEOWNER_CHECKLIST && 'md:-mt-12')} ${
                      currentStep === stepKey ? 'block' : 'hidden absolute pointer-events-none'
                    } w-full`}
                  >
                    <StepComponent {...config.props()} />
                  </div>
                );
              })}
              {!isSuccessStep(currentStep) && (
                <div className="flex flex-col pt-6 mt-auto gap-5">
                  {currentStep !== SURVEY_STEPS.START && (
                    <button onClick={handlePreviousStep} className="flex items-center gap-2 font-semibold uppercase self-start text-sm">
                      <span className="size-7.5 grid place-items-center rounded-full bg-primary text-white">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.0711 7.00002H0.928932M0.928932 7.00002L7.03576 0.893192M0.928932 7.00002L7.03576 13.1069" stroke="white" strokeWidth="1.2" />
                        </svg>
                      </span>
                      PREVIOUS
                    </button>
                  )}

                  <div className={`w-full h-2 bg-gray-200 rounded-full ${currentStep === SURVEY_STEPS.START && !(currentStep !== SURVEY_STEPS.START) ? '' : ''} `}>
                    <div className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StartSurvey;
