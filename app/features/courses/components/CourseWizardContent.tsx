import { useState } from "react";
import { Check, DollarSign, Image, Key, Lightbulb } from "lucide-react";
import { CourseInfoStep } from "./wizard-steps/steps/CourseInfoStep";
import { CoursePhotosStep } from "./wizard-steps/steps/CoursePhotosStep";
import { CourseDetailsStep } from "./wizard-steps/steps/CourseDetailsStep";
import { CourseTokenStep } from "./wizard-steps/steps/CourseTokenStep";
import { ReviewSummaryStep } from "./wizard-steps/steps/ReviewSummaryStep";

interface CourseWizardContentProps {
  onComplete: (courseData: CourseData) => void;
  onCancel: () => void;
  onStepChange?: (step: number) => void;
  isLoading?: boolean;
  mode?: "add" | "edit";
  initialData?: Partial<CourseData>;
}

interface CourseData {
  name: string;
  description: string;
  subject: string;
  mainPhoto?: File;
  previewPhoto?: File;
  contentPhoto?: File;
  certificatePhoto?: File;
  keyPoint1: string;
  keyPoint2?: string;
  keyPoint3?: string;
  keyPoint4?: string;
  targetAudience1: string;
  targetAudience2?: string;
  targetAudience3?: string;
  targetAudience4?: string;
  tools?: string;
  courseToken: string;
  availability: "published" | "draft";
  level: string;
  duration: string;
  requirements: string[];
  images?: Array<{ image_path: string }>;
  mentor?: {
    id: number;
    name: string;
    profile?: {
      expertise?: string;
      avatar?: string;
      totalCourses?: number;
      totalStudents?: number;
    };
  };
}

export function CourseWizardContent({
  onComplete,
  onCancel,
  onStepChange,
  isLoading,
  mode = "add",
  initialData = {},
}: CourseWizardContentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseData>({
    name: initialData.name || "",
    description: initialData.description || "",
    subject: initialData.subject || "",
    level: initialData.level || "",
    duration: initialData.duration || "",
    requirements: initialData.requirements || [],
    availability: initialData.availability || "published",
    keyPoint1: initialData.keyPoint1 || "",
    keyPoint2: initialData.keyPoint2 || "",
    keyPoint3: initialData.keyPoint3 || "",
    keyPoint4: initialData.keyPoint4 || "",
    targetAudience1: initialData.targetAudience1 || "",
    targetAudience2: initialData.targetAudience2 || "",
    targetAudience3: initialData.targetAudience3 || "",
    targetAudience4: initialData.targetAudience4 || "",
    tools: initialData.tools || "",
    courseToken: initialData.courseToken || "",
    images: initialData.images || [],
    mentor: initialData.mentor,
  });

  const updateCourseData = (data: Partial<CourseData>) => {
    setCourseData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
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
          <CourseTokenStep
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
            onCancel={onCancel}
          />
        );
    }
  };

  return (
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
                  Structure your course effectively
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
                    Clear learning objectives
                  </p>
                  <p className="text-brand-light text-xs font-normal">
                    Define what students will achieve after each lesson
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-orange-600" />
                </div>
                <div>
                  <p className="text-brand-dark text-base font-semibold">
                    Progressive difficulty
                  </p>
                  <p className="text-brand-light text-xs font-normal">
                    Start simple and gradually increase complexity
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-orange-600" />
                </div>
                <div>
                  <p className="text-brand-dark text-base font-semibold">
                    Practical examples
                  </p>
                  <p className="text-brand-light text-xs font-normal">
                    Include real-world applications and case studies
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-orange-600" />
                </div>
                <div>
                  <p className="text-brand-dark text-base font-semibold">
                    Interactive content
                  </p>
                  <p className="text-brand-light text-xs font-normal">
                    Mix videos, quizzes, and hands-on exercises
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-orange-600" />
                </div>
                <div>
                  <p className="text-brand-dark text-base font-semibold">
                    Regular assessments
                  </p>
                  <p className="text-brand-light text-xs font-normal">
                    Check student understanding throughout the course
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
                  Use tokens effectively to manage access
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
                    Share in trusted channels
                  </p>
                  <p className="text-brand-light text-xs font-normal">
                    Send tokens via LMS, email, or class group—not publicly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="text-brand-dark text-base font-semibold">
                    Use tokens per course
                  </p>
                  <p className="text-brand-light text-xs font-normal">
                    Avoid reusing the same token across different classes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="text-brand-dark text-base font-semibold">
                    Reset when necessary
                  </p>
                  <p className="text-brand-light text-xs font-normal">
                    If too many unknown students join, regenerate the token.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="text-brand-dark text-base font-semibold">
                    Tell students what to do
                  </p>
                  <p className="text-brand-light text-xs font-normal">
                    Explain clearly where they should paste the token.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="text-brand-dark text-base font-semibold">
                    Keep a backup
                  </p>
                  <p className="text-brand-light text-xs font-normal">
                    Store your token somewhere safe in case you forget it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
