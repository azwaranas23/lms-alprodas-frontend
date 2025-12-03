import {
  Globe,
  FileText,
  User,
  Star,
  Users,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Key,
} from "lucide-react";
import { useState } from "react";
import { useUser } from "~/hooks/useUser";
import { Button } from "~/components/atoms/Button";
import { FormField, FormInput } from "~/components/molecules/FormField";
import { Avatar } from "~/components/atoms/Avatar";

interface CourseData {
  price?: number; // masih dibiarkan untuk kompatibilitas, tapi tidak dipakai di UI
  courseToken?: string;
  availability?: "published" | "draft";
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

interface CoursePriceStepProps {
  data: CourseData;
  onUpdate: (data: Partial<CourseData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Helper untuk generate token XXXX-XXXX (huruf & angka)
const TOKEN_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateTokenSegment(length: number) {
  let result = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * TOKEN_CHARS.length);
    result += TOKEN_CHARS[idx];
  }
  return result;
}

function generateCourseToken() {
  return `${generateTokenSegment(4)}-${generateTokenSegment(4)}`;
}

export function CoursePriceStep({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: CoursePriceStepProps) {
  const {
    getFullName,
    getAvatar,
    getExpertise,
    getTotalCourses,
    getTotalStudents,
  } = useUser();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use mentor data from course (edit mode) or current user (add mode)
  const mentorName = data.mentor?.name || getFullName();
  const mentorExpertise = data.mentor?.profile?.expertise || getExpertise();
  const mentorAvatar = data.mentor?.profile?.avatar || getAvatar();
  const mentorTotalCourses =
    data.mentor?.profile?.totalCourses || getTotalCourses();
  const mentorTotalStudents =
    data.mentor?.profile?.totalStudents || getTotalStudents();

  const handleAvailabilityChange = (availability: "published" | "draft") => {
    onUpdate({ availability });
    if (errors.availability) {
      setErrors((prev) => ({ ...prev, availability: "" }));
    }
  };

  const handleGenerateToken = () => {
    const token = generateCourseToken();
    onUpdate({ courseToken: token });
    if (errors.courseToken) {
      setErrors((prev) => ({ ...prev, courseToken: "" }));
    }
  };

  const validateAndNext = () => {
    const validationErrors: Record<string, string> = {};

    if (!data.courseToken || data.courseToken.trim() === "") {
      validationErrors.courseToken = "Please generate a course token";
    }

    if (!data.availability) {
      validationErrors.availability = "Please select course availability";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Token Courses Section */}
      <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
            <Key className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-brand-dark text-xl font-bold">Token Courses</h3>
            <p className="text-brand-light text-sm font-normal">
              Generate Course Token and set course availability
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Course Token */}
          <FormField
            label="Course Token"
            required
            error={errors.courseToken}
            className="mb-6"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <FormInput
                  type="text"
                  required
                  readOnly
                  value={data.courseToken || ""}
                  error={errors.courseToken}
                  icon={
                    <span className="text-gray-400 font-semibold text-lg">
                      <Key className="w-4 h-4" />
                    </span>
                  }
                  placeholder="Click Generate Token to create Course Token"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateToken}
                className="px-4 py-3 rounded-[8px] whitespace-nowrap"
              >
                Generate Token
              </Button>
            </div>
            <p className="text-xs text-brand-light mt-2">
              Format: <span className="font-mono">XXXX-XXXX</span> (letters and
              numbers). Share this token only with students you want to join
              this class.
            </p>
          </FormField>

          {/* Course Availability Radio Options */}
          <div className="mb-6">
            <label className="block text-brand-dark text-base font-semibold mb-3">
              Course Availability *
            </label>
            <div className="flex gap-4">
              {/* Published Option */}
              <label className="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-[12px] flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-brand-dark text-base font-semibold">
                      Published
                    </p>
                    <p className="text-brand-light text-sm">
                      Students can join with token
                    </p>
                  </div>
                </div>
                <div className="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2">
                  <input
                    type="radio"
                    name="availability"
                    value="published"
                    checked={data.availability === "published"}
                    onChange={() => handleAvailabilityChange("published")}
                    className="hidden"
                  />
                  <div className="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"></div>
                  <p className="text-xs font-semibold after:content-['Select'] group-has-[:checked]:after:content-['Selected']"></p>
                </div>
              </label>

              {/* Draft Option */}
              <label className="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-[12px] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-brand-dark text-base font-semibold">
                      Draft
                    </p>
                    <p className="text-brand-light text-sm">
                      Saved as draft, not visible
                    </p>
                  </div>
                </div>
                <div className="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2">
                  <input
                    type="radio"
                    name="availability"
                    value="draft"
                    checked={data.availability === "draft"}
                    onChange={() => handleAvailabilityChange("draft")}
                    className="hidden"
                  />
                  <div className="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"></div>
                  <p className="text-xs font-semibold after:content-['Select'] group-has-[:checked]:after:content-['Selected']"></p>
                </div>
              </label>
            </div>
            {errors.availability && (
              <div className="mt-2">
                <p className="text-danger text-sm">{errors.availability}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mentor Profile Section (tetap) */}
      <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-brand-dark text-xl font-bold">Course Mentor</h3>
            <p className="text-brand-light text-sm font-normal">
              This course will be attributed to your profile
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-[16px] border border-gray-200">
          <div className="flex items-center gap-4">
            <Avatar
              src={mentorAvatar || undefined}
              name={mentorName}
              size="lg"
            />
            <div>
              <h4 className="text-brand-dark text-lg font-bold">
                {mentorName}
              </h4>
              <p className="text-brand-light text-sm">{mentorExpertise}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-brand-dark text-sm font-medium">4.9</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-brand-dark text-sm font-medium">
                {mentorTotalStudents} Students
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-green-600" />
              <span className="text-brand-dark text-sm font-medium">
                {mentorTotalCourses} Courses
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Navigation */}
      <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-brand-dark text-sm font-medium">Step 4 of 5</p>
            <p className="text-brand-light text-xs font-normal mt-1">
              Generate course token and set availability
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onPrevious}
              className="px-6 py-3 rounded-[8px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-base font-semibold">Previous</span>
            </Button>
            <Button
              variant="primary"
              onClick={validateAndNext}
              className="px-6 py-3 rounded-[8px]"
            >
              <span className="text-brand-white text-base font-semibold">
                Next: Review Summary
              </span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
