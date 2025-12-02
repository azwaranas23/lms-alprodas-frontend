import { useState } from 'react';
import { WithdrawalProvider } from '~/contexts/WithdrawalContext';
import AccountVerificationStep from './wizard-steps/steps/AccountVerificationStep';
import WithdrawalDetailsStep from './wizard-steps/steps/WithdrawalDetailsStep';
import BankInformationStep from './wizard-steps/steps/BankInformationStep';
import ReviewSubmitStep from './wizard-steps/steps/ReviewSubmitStep';

interface WithdrawalWizardContentProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

export function WithdrawalWizardContent({
  currentStep,
  onStepChange,
  onComplete,
  onCancel
}: WithdrawalWizardContentProps) {
  const handleNext = () => {
    if (currentStep < 4) {
      onStepChange(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onComplete?.();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AccountVerificationStep onNext={handleNext} onBack={onCancel} />;
      case 2:
        return <WithdrawalDetailsStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <BankInformationStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <ReviewSubmitStep onBack={handleBack} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <WithdrawalProvider>
      {renderCurrentStep()}
    </WithdrawalProvider>
  );
}