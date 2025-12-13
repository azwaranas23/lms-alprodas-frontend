import { type ReactNode } from "react";
import {
  Check,
  CheckCircle,
  UserCheck,
  CreditCard,
  Building2,
  GraduationCap,
} from "lucide-react";
import { BaseHeader } from "./BaseHeader";

interface AddWithdrawalLayoutProps {
  children: ReactNode;
  currentStep: number;
  stepTitle: string;
  onBack?: () => void;
  onCancel?: () => void;
}

const steps = [
  { id: 1, title: "Account Verification", icon: UserCheck },
  { id: 2, title: "Withdrawal Details", icon: CreditCard },
  { id: 3, title: "Bank Information", icon: Building2 },
  { id: 4, title: "Review & Submit", icon: CheckCircle },
];

export function AddWithdrawalLayout({
  children,
  currentStep,
  stepTitle,
  onBack,
  onCancel,
}: AddWithdrawalLayoutProps) {
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "active";
    return "pending";
  };

  const backButton = {
    onClick: currentStep === 1 ? onCancel : onBack,
    label: "Back",
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="flex h-screen">
        {/* Vertical Step Progress Sidebar */}
        <aside className="w-80 bg-white border-r border-[#DCDEDD] flex flex-col shadow-lg">
          {/* Logo Section */}
          <div className="px-6 py-4 border-b border-[#DCDEDD]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 relative flex items-center justify-center">
                <div className="w-14 h-14 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
                <div className="w-10 h-10 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
                <GraduationCap className="w-5 h-5 text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-brand-dark text-lg font-bold">
                  Alprodas LMS
                </h1>
                <p className="text-brand-dark text-xs font-normal">
                  Request Withdrawal
                </p>
              </div>
            </div>
          </div>

          {/* Step Progress */}
          <div className="space-y-8 flex-1 mt-36 px-6">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const isLast = index === steps.length - 1;
              const IconComponent = step.icon;

              return (
                <div key={step.id}>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 ${status === "completed"
                          ? "bg-green-600"
                          : status === "active"
                            ? "bg-blue-600"
                            : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {status === "completed" ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-bold ${status === "completed"
                            ? "text-green-600"
                            : status === "active"
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {!isLast && (
                    <div
                      className={`ml-6 w-0.5 h-8 ${status === "completed"
                          ? "bg-green-600"
                          : status === "active"
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <BaseHeader
            title="Request Withdrawal"
            subtitle={stepTitle}
            backButton={backButton}
            variant="wizard"
          />

          {/* Step Content */}
          <main className="main-content flex-1 overflow-auto py-5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
