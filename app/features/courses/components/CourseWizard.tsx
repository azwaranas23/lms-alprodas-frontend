import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Layers,
  DollarSign,
  Image,
  CheckCircle,
  Check,
  Lightbulb,
  Bell,
  MessageCircle,
  Settings,
  ChevronDown,
  Key,
} from "lucide-react";
import { useUser } from "~/hooks/useUser";
import { CourseInfoStep } from "./wizard-steps/steps/CourseInfoStep";
import { CoursePhotosStep } from "./wizard-steps/steps/CoursePhotosStep";
import { CourseDetailsStep } from "./wizard-steps/steps/CourseDetailsStep";
import { CoursePriceStep } from "./wizard-steps/steps/CoursePriceStep";
import { ReviewSummaryStep } from "./wizard-steps/steps/ReviewSummaryStep";

interface CourseWizardProps {
  onComplete: (courseData: CourseData) => void;
  onCancel: () => void;
  onStepChange?: (step: number) => void;
  isLoading?: boolean;
}

interface StepConfig {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CourseData {
  name: string;
  description: string;
  subject: string;
  mainPhoto?: File;
  previewPhoto?: File;
  contentPhoto?: File;
  certificatePhoto?: File;
  keyPoint1?: string;
  keyPoint2?: string;
  keyPoint3?: string;
  keyPoint4?: string;
  targetAudience1?: string;
  targetAudience2?: string;
  targetAudience3?: string;
  targetAudience4?: string;
  tools?: string;
  price?: number;
  courseToken: string;
  availability?: "published" | "draft";
  level: string;
  duration: string;
  requirements: string[];
}

const steps: StepConfig[] = [
  { id: 1, title: "Course Information", icon: BookOpen },
  { id: 2, title: "Course Photos", icon: Layers },
  { id: 3, title: "Course Details", icon: DollarSign },
  { id: 4, title: "Course Token", icon: Image },
  { id: 5, title: "Review Summary", icon: CheckCircle },
];

export function CourseWizard({
  onComplete,
  onCancel,
  onStepChange,
  isLoading,
}: CourseWizardProps) {
  const { getFullName, getRoleName, getAvatar } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseData>({
    name: "",
    description: "",
    subject: "",
    level: "",
    duration: "",
    requirements: [],
    courseToken: "",
    availability: "published",
  });

  const updateCourseData = (data: Partial<CourseData>) => {
    setCourseData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    } else {
      onComplete(courseData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CourseInfoStep
            data={courseData}
            onUpdate={updateCourseData}
            onNext={handleNext}
            onCancel={onCancel}
          />
        );
      case 2:
        return (
          <CoursePhotosStep
            data={courseData}
            onUpdate={updateCourseData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <CourseDetailsStep
            data={courseData}
            onUpdate={updateCourseData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <CoursePriceStep
            data={courseData}
            onUpdate={updateCourseData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <ReviewSummaryStep
            data={courseData}
            onUpdate={updateCourseData}
            onComplete={() => onComplete(courseData)}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <CourseInfoStep
            data={courseData}
            onUpdate={updateCourseData}
            onNext={handleNext}
            onCancel={() => {}}
          />
        );
    }
  };

  const getStepTitle = () => {
    const step = steps.find((s) => s.id === currentStep);
    return step ? step.title : "Course Information";
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="flex h-screen">
        {/* Vertical Step Progress */}
        <aside className="w-80 bg-white border-r border-[#DCDEDD] flex flex-col">
          {/* Logo Section */}
          <div className="px-6 py-4 border-b border-[#DCDEDD]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 relative flex items-center justify-center">
                <div className="w-14 h-14 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
                <div className="w-10 h-10 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
                <BookOpen className="w-5 h-5 text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-brand-dark text-lg font-bold">
                  LMS Alprodas
                </h1>
                <p className="text-brand-dark text-xs font-normal">
                  Create New Course
                </p>
              </div>
            </div>
          </div>

          {/* Step Progress */}
          <div className="space-y-8 flex-1 mt-36 px-6">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isConnected = index < steps.length - 1;

              return (
                <div key={step.id}>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                        isActive
                          ? "bg-blue-600"
                          : isCompleted
                            ? "bg-green-600"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-bold ${
                          isActive
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
                  {isConnected && (
                    <div
                      className={`ml-6 w-0.5 h-8 ${
                        isCompleted
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
          {/* Top Navbar */}
          <header className="page-header bg-white border-b border-[#DCDEDD] px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onCancel}
                  className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-2 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                  <span className="text-brand-dark text-base font-semibold">
                    Back
                  </span>
                </button>
                <div>
                  <h2 className="text-brand-dark text-2xl font-extrabold">
                    Create New Course
                  </h2>
                  <p className="text-brand-light text-sm font-normal mt-1">
                    Step {currentStep} of {steps.length}: {getStepTitle()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button className="w-14 h-14 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200">
                    <Bell className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-14 h-14 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-14 h-14 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-[#DCDEDD] mx-5"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {getAvatar() ? (
                      <img
                        src={
                          getAvatar().startsWith("http")
                            ? getAvatar()
                            : `${import.meta.env.VITE_BASE_URL}/${getAvatar()}`
                        }
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold"
                      style={{ display: getAvatar() ? "none" : "flex" }}
                    >
                      {getFullName().charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-brand-dark text-base font-semibold">
                      {getFullName()}
                    </p>
                    <p className="text-brand-dark text-base font-normal leading-7">
                      {getRoleName()}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </header>

          {/* Step Content */}
          <main className="main-content flex-1 overflow-auto py-5">
            <div className="flex gap-6 pl-5 items-start">
              <div className="flex-1">{renderStepContent()}</div>
              {currentStep === 2 && (
                <div className="w-100 flex-shrink-0 pr-5">
                  <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 top-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center">
                        <Image className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-brand-dark text-xl font-bold">
                          Photo Upload Tips
                        </h3>
                        <p className="text-brand-light text-sm font-normal">
                          Best practices for course visuals
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Use high-quality images
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Clear, professional photos increase enrollment
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Show actual content
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Screenshots or examples of what students will learn
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Consistent branding
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Use similar colors and style across all photos
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Main photo is crucial
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            This appears in course listings and search results
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Test on different devices
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Ensure photos look good on mobile and desktop
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="w-100 flex-shrink-0 pr-5">
                  <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 top-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-orange-50 rounded-[12px] flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-brand-dark text-xl font-bold">
                          Course Planning Tips
                        </h3>
                        <p className="text-brand-light text-sm font-normal">
                          Best practices for defining course details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Clear key points
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Focus on specific, measurable learning outcomes
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Know your audience
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Be specific about who will benefit most from your
                            course
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Use action verbs
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Start key points with "Learn", "Build", "Master",
                            etc.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Target different levels
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Consider beginners, intermediates, and professionals
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Be outcome-focused
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Describe what students will achieve
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 4 && (
                <div className="w-100 flex-shrink-0 pr-5">
                  <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 top-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center">
                        <Key className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-brand-dark text-xl font-bold">
                          Token Enrollment Tips
                        </h3>
                        <p className="text-brand-light text-sm font-normal">
                          Best practices for using Course Token.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Share token securely
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Only share the token with students who should join
                            this class.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Regenerate if leaked
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            If the token is shared publicly, generate a new one
                            and update your students.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Use one token per class
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Keep a single token per course section to avoid
                            confusion.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Communicate clearly
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Tell students where to enter the token in their
                            dashboard.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-brand-dark text-base font-semibold">
                            Review regularly
                          </p>
                          <p className="text-brand-light text-xs font-normal">
                            Rotate tokens if class membership changes often.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
