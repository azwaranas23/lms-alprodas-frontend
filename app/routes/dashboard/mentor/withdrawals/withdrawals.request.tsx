import { useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/withdrawals.request";
import { AddWithdrawalLayout } from "~/components/templates/AddWithdrawalLayout";
import { WithdrawalWizardContent } from "~/features/withdrawals/components/WithdrawalWizardContent";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Request Withdrawal - LMS Alprodas" },
    {
      name: "description",
      content: "Create a new withdrawal request for your earnings",
    },
  ];
}

export default function MentorWithdrawalRequestPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const handleComplete = () => {
    // Navigate to success page or back to withdrawals
    navigate("/dashboard/mentor/withdrawals/success");
  };

  const handleCancel = () => {
    // Navigate back to withdrawals page
    navigate("/dashboard/mentor/withdrawals");
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      handleCancel();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Step 1 of 4: Account Verification";
      case 2:
        return "Step 2 of 4: Withdrawal Details";
      case 3:
        return "Step 3 of 4: Bank Information";
      case 4:
        return "Step 4 of 4: Review & Submit";
      default:
        return "";
    }
  };

  return (
    <AddWithdrawalLayout
      currentStep={currentStep}
      stepTitle={getStepTitle()}
      onBack={handleBack}
      onCancel={handleCancel}
    >
      <WithdrawalWizardContent
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </AddWithdrawalLayout>
  );
}
