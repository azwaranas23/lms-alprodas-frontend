import { type ReactNode } from "react";
import {
  BookOpen,
  Check,
  CheckCircle,
  DollarSign,
  GraduationCap,
  Image,
  Layers,
} from "lucide-react";
import { BaseHeader } from "./BaseHeader";

interface AddCourseLayoutProps {
  children: ReactNode;
  currentStep: number;
  stepTitle: string;
  mode?: "add" | "edit";
  backTo?: string;
}

const steps = [
  { id: 1, title: "Course Information", icon: BookOpen },
  { id: 2, title: "Course Photos", icon: Layers },
  { id: 3, title: "Course Details", icon: GraduationCap },
  { id: 4, title: "Course Token", icon: Image },
  { id: 5, title: "Review Summary", icon: CheckCircle },
];

export function AddCourseLayout({
  children,
  currentStep,
  stepTitle,
  mode = "add",
  backTo,
}: AddCourseLayoutProps) {
  const backButton = {
    to: backTo || "/dashboard/courses",
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
                  {mode === "edit" ? "Edit Course" : "Create New Course"}
                </p>
              </div>
            </div>
          </div>

          {/* Step Progress */}
          <div className="space-y-8 flex-1 mt-36 px-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.id}>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-bold ${isActive
                          ? "text-blue-600"
                          : isCompleted
                            ? "text-green-600"
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
                      className={`ml-6 w-0.5 h-8 ${isCompleted
                        ? "bg-green-600"
                        : isActive
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
            title={mode === "edit" ? "Edit Course" : "Create New Course"}
            subtitle={`Step ${currentStep} of ${steps.length}: ${stepTitle}`}
            backButton={backButton}
            variant="wizard"
          />

          {/* Main Content */}
          <main className="main-content flex-1 overflow-auto py-5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
