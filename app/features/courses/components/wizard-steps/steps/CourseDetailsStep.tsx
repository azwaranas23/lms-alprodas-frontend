import { useState } from "react";
import {
  DollarSign,
  CheckCircle,
  User,
  Wrench,
  Check,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { z } from "zod";
import { courseDetailsSchema } from "~/schemas/courses";
import { Button } from "~/components/atoms/Button";
import { FormField, FormInput } from "~/components/molecules/FormField";

interface CourseData {
  keyPoint1?: string;
  keyPoint2?: string;
  keyPoint3?: string;
  keyPoint4?: string;
  targetAudience1?: string;
  targetAudience2?: string;
  targetAudience3?: string;
  targetAudience4?: string;
  tools?: string;
}

interface CourseDetailsStepProps {
  data: CourseData;
  onUpdate: (data: Partial<CourseData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function CourseDetailsStep({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: CourseDetailsStepProps) {
  const [toolsDisplay, setToolsDisplay] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleToolsChange = (value: string) => {
    onUpdate({ tools: value });
    const tools = value
      .split(",")
      .map((tool) => tool.trim())
      .filter((tool) => tool.length > 0);
    setToolsDisplay(tools);
    // Clear error when user starts typing
    if (errors.tools) {
      setErrors((prev) => ({ ...prev, tools: "" }));
    }
  };

  const validateAndNext = () => {
    try {
      // Validate the data - convert undefined to empty string
      courseDetailsSchema.parse({
        keyPoint1: data.keyPoint1 || "",
        keyPoint2: data.keyPoint2 || "",
        keyPoint3: data.keyPoint3 || "",
        keyPoint4: data.keyPoint4 || "",
        targetAudience1: data.targetAudience1 || "",
        targetAudience2: data.targetAudience2 || "",
        targetAudience3: data.targetAudience3 || "",
        targetAudience4: data.targetAudience4 || "",
        tools: data.tools || "",
      });
      // Clear errors and proceed
      setErrors({});
      onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to our error format
        const newErrors: Record<string, string> = {};
        if (error.issues && Array.isArray(error.issues)) {
          error.issues.forEach((err) => {
            if (err.path && err.path[0]) {
              newErrors[err.path[0] as string] = err.message;
            }
          });
        }
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Details Section */}
      <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-brand-dark text-xl font-bold">
              Course Details
            </h3>
            <p className="text-brand-light text-sm font-normal">
              Define key points and target audience for your course
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-8">
          {/* Key Points Column */}
          <div className="space-y-5">
            <div className="mb-4">
              <h4 className="text-brand-dark text-lg font-bold">Key Points</h4>
            </div>

            {/* Key Point 1 */}
            <FormField label="Key Point 1" required error={errors.keyPoint1}>
              <FormInput
                type="text"
                required
                value={data.keyPoint1 || ""}
                onChange={(e) => handleInputChange("keyPoint1", e.target.value)}
                error={errors.keyPoint1}
                icon={<CheckCircle className="h-5 w-5 text-gray-400" />}
                placeholder="e.g. Master React fundamentals and advanced concepts"
              />
            </FormField>

            {/* Key Point 2 */}
            <FormField label="Key Point 2" required error={errors.keyPoint2}>
              <FormInput
                type="text"
                required
                value={data.keyPoint2 || ""}
                onChange={(e) => handleInputChange("keyPoint2", e.target.value)}
                error={errors.keyPoint2}
                icon={<CheckCircle className="h-5 w-5 text-gray-400" />}
                placeholder="e.g. Build real-world projects and applications"
              />
            </FormField>

            {/* Key Point 3 */}
            <FormField label="Key Point 3" required error={errors.keyPoint3}>
              <FormInput
                type="text"
                required
                value={data.keyPoint3 || ""}
                onChange={(e) => handleInputChange("keyPoint3", e.target.value)}
                error={errors.keyPoint3}
                icon={<CheckCircle className="h-5 w-5 text-gray-400" />}
                placeholder="e.g. Learn industry best practices and modern tools"
              />
            </FormField>

            {/* Key Point 4 */}
            <FormField label="Key Point 4" required error={errors.keyPoint4}>
              <FormInput
                type="text"
                required
                value={data.keyPoint4 || ""}
                onChange={(e) => handleInputChange("keyPoint4", e.target.value)}
                error={errors.keyPoint4}
                icon={<CheckCircle className="h-5 w-5 text-gray-400" />}
                placeholder="e.g. Get job-ready skills for the tech industry"
              />
            </FormField>
          </div>

          {/* Student Persona Column */}
          <div className="space-y-5">
            <div className="mb-4">
              <h4 className="text-brand-dark text-lg font-bold">
                Student Persona
              </h4>
            </div>

            {/* Persona 1 */}
            <FormField
              label="Target Audience 1"
              required
              error={errors.targetAudience1}
            >
              <FormInput
                type="text"
                required
                value={data.targetAudience1 || ""}
                onChange={(e) =>
                  handleInputChange("targetAudience1", e.target.value)
                }
                error={errors.targetAudience1}
                icon={<User className="h-5 w-5 text-gray-400" />}
                placeholder="e.g. Beginner developers with basic HTML/CSS knowledge"
              />
            </FormField>

            {/* Persona 2 */}
            <FormField
              label="Target Audience 2"
              required
              error={errors.targetAudience2}
            >
              <FormInput
                type="text"
                required
                value={data.targetAudience2 || ""}
                onChange={(e) =>
                  handleInputChange("targetAudience2", e.target.value)
                }
                error={errors.targetAudience2}
                icon={<User className="h-5 w-5 text-gray-400" />}
                placeholder="e.g. Career changers looking to enter tech industry"
              />
            </FormField>

            {/* Persona 3 */}
            <FormField
              label="Target Audience 3"
              required
              error={errors.targetAudience3}
            >
              <FormInput
                type="text"
                required
                value={data.targetAudience3 || ""}
                onChange={(e) =>
                  handleInputChange("targetAudience3", e.target.value)
                }
                error={errors.targetAudience3}
                icon={<User className="h-5 w-5 text-gray-400" />}
                placeholder="e.g. Students wanting to improve their programming skills"
              />
            </FormField>

            {/* Persona 4 */}
            <FormField
              label="Target Audience 4"
              required
              error={errors.targetAudience4}
            >
              <FormInput
                type="text"
                required
                value={data.targetAudience4 || ""}
                onChange={(e) =>
                  handleInputChange("targetAudience4", e.target.value)
                }
                error={errors.targetAudience4}
                icon={<User className="h-5 w-5 text-gray-400" />}
                placeholder="e.g. Freelancers wanting to expand their skill set"
              />
            </FormField>
          </div>
        </div>

        {/* Tools Section */}
        <div className="mt-8 space-y-4">
          {/* Tools Input */}
          <FormField
            label="Tools & Technologies"
            required
            error={errors.tools}
            className="mb-4"
          >
            <FormInput
              type="text"
              required
              value={data.tools || ""}
              onChange={(e) => handleToolsChange(e.target.value)}
              error={errors.tools}
              icon={<Wrench className="h-5 w-5 text-gray-400" />}
              placeholder="e.g. React, Node.js, MongoDB, TypeScript, Tailwind CSS"
            />
            <p className="text-brand-light text-xs mt-1">
              Separate tools with commas
            </p>
          </FormField>

          {/* Tools Display as Badges */}
          <div className="flex flex-wrap gap-2">
            {toolsDisplay.map((tool, index) => (
              <span
                key={index}
                className="badge-expert px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form Navigation */}
      <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-brand-dark text-sm font-medium">Step 3 of 5</p>
            <p className="text-brand-light text-xs font-normal mt-1">
              Define key points and target audience for your course
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
              <span className="text-brand-dark text-base font-semibold">
                Previous
              </span>
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={validateAndNext}
              className="px-6 py-3"
            >
              <span className="text-brand-white text-base font-semibold">
                Next: Course Price
              </span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
