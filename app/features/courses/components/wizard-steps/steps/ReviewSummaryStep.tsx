import {
  Eye,
  Book,
  Tag,
  DollarSign,
  User,
  CheckCircle,
  Users,
  Wrench,
  ArrowLeft,
  Key,
} from "lucide-react";
import { useUser } from "~/hooks/useUser";
import { Button } from "~/components/atoms/Button";
import { env } from "~/config/env";
import { useState, useEffect } from "react";
import { subjectsService } from "~/services/subjects.service";

interface CourseData {
  name?: string;
  description?: string;
  subject?: string;
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
  availability?: "published" | "draft";
  images?: Array<{ image_path: string }>;
  courseToken?: string;
}

interface ReviewSummaryStepProps {
  data: CourseData;
  onUpdate: (data: Partial<CourseData>) => void;
  onComplete: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

export function ReviewSummaryStep({
  data,
  onUpdate,
  onComplete,
  onPrevious,
  isLoading,
}: ReviewSummaryStepProps) {
  const { getFullName } = useUser();
  const [subjectName, setSubjectName] = useState<string>("Loading...");

  const formatPrice = (price?: number) => {
    if (!price) return "Not set";
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  // Fetch subject name from ID
  useEffect(() => {
    const fetchSubjectName = async () => {
      if (data.subject) {
        try {
          const subjects = await subjectsService.getSubjects({ limit: 100 });
          const subject = subjects.items.find(
            (s) => s.id.toString() === data.subject
          );
          setSubjectName(subject?.name || "Not found");
        } catch (error) {
          console.error("Error fetching subject:", error);
          setSubjectName("Not selected");
        }
      } else {
        setSubjectName("Not selected");
      }
    };

    fetchSubjectName();
  }, [data.subject]);

  const getPhotoUrl = (file?: File, existingImagePath?: string) => {
    if (file) {
      return URL.createObjectURL(file);
    }
    if (existingImagePath) {
      return `${env.BASE_URL}/${existingImagePath}`;
    }
    return null;
  };

  const getToolsArray = () => {
    if (!data.tools) return [];
    return data.tools
      .split(",")
      .map((tool) => tool.trim())
      .filter((tool) => tool.length > 0);
  };

  const getKeyPoints = () => {
    return [
      data.keyPoint1,
      data.keyPoint2,
      data.keyPoint3,
      data.keyPoint4,
    ].filter(Boolean);
  };

  const getTargetAudiences = () => {
    return [
      data.targetAudience1,
      data.targetAudience2,
      data.targetAudience3,
      data.targetAudience4,
    ].filter(Boolean);
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-4xl w-full px-5">
        <div className="space-y-6">
          {/* Course Overview */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-brand-dark text-xl font-bold">
                  Course Overview
                </h3>
                <p className="text-brand-light text-sm font-normal">
                  Review all your course information before publishing
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-brand-dark text-lg font-bold">
                  Basic Information
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Book className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-brand-light text-sm font-medium">
                        Course Name
                      </p>
                      <p className="text-brand-dark text-base font-semibold">
                        {data.name || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-brand-light text-sm font-medium">
                        Subject
                      </p>
                      <p className="text-brand-dark text-base font-semibold">
                        {subjectName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-brand-light text-sm font-medium">
                        Price
                      </p>
                      <p className="text-brand-dark text-base font-semibold">
                        {formatPrice(data.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-brand-light text-sm font-medium">
                        Mentor Name
                      </p>
                      <p className="text-brand-dark text-base font-semibold">
                        {getFullName()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Key className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-brand-light text-sm font-medium">
                        Course Token
                      </p>
                      <p className="text-brand-dark text-base font-semibold font-mono">
                        {data.courseToken && data.courseToken.trim() !== ""
                          ? data.courseToken
                          : "Not generated"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Photos */}
              <div className="space-y-4">
                <h4 className="text-brand-dark text-lg font-bold">
                  Course Photos
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="w-full h-30 rounded-[8px] border border-[#DCDEDD] overflow-hidden bg-gray-100 flex items-center justify-center">
                    {getPhotoUrl(
                      data.mainPhoto,
                      data.images?.[0]?.image_path
                    ) ? (
                      <img
                        src={
                          getPhotoUrl(
                            data.mainPhoto,
                            data.images?.[0]?.image_path
                          )!
                        }
                        alt="Main Course Photo"
                        className="w-full h-30 object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Main Photo</span>
                    )}
                  </div>
                  <div className="w-full h-30 rounded-[8px] border border-[#DCDEDD] overflow-hidden bg-gray-100 flex items-center justify-center">
                    {getPhotoUrl(
                      data.previewPhoto,
                      data.images?.[1]?.image_path
                    ) ? (
                      <img
                        src={
                          getPhotoUrl(
                            data.previewPhoto,
                            data.images?.[1]?.image_path
                          )!
                        }
                        alt="Preview Photo"
                        className="w-full h-30 object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Preview Photo
                      </span>
                    )}
                  </div>
                  <div className="w-full h-30 rounded-[8px] border border-[#DCDEDD] overflow-hidden bg-gray-100 flex items-center justify-center">
                    {getPhotoUrl(
                      data.contentPhoto,
                      data.images?.[2]?.image_path
                    ) ? (
                      <img
                        src={
                          getPhotoUrl(
                            data.contentPhoto,
                            data.images?.[2]?.image_path
                          )!
                        }
                        alt="Content Sample"
                        className="w-full h-30 object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Content Sample
                      </span>
                    )}
                  </div>
                  <div className="w-full h-30 rounded-[8px] border border-[#DCDEDD] overflow-hidden bg-gray-100 flex items-center justify-center">
                    {getPhotoUrl(
                      data.certificatePhoto,
                      data.images?.[3]?.image_path
                    ) ? (
                      <img
                        src={
                          getPhotoUrl(
                            data.certificatePhoto,
                            data.images?.[3]?.image_path
                          )!
                        }
                        alt="Certificate Design"
                        className="w-full h-30 object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Certificate Design
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Points & Target Audience */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Key Points */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h4 className="text-brand-dark text-lg font-bold">
                    Key Learning Points
                  </h4>
                </div>

                <div className="space-y-3">
                  {getKeyPoints().length > 0 ? (
                    getKeyPoints().map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-brand-dark text-base">{point}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-base">
                      No key points added
                    </p>
                  )}
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h4 className="text-brand-dark text-lg font-bold">
                    Target Audience
                  </h4>
                </div>

                <div className="space-y-3">
                  {getTargetAudiences().length > 0 ? (
                    getTargetAudiences().map((audience, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <p className="text-brand-dark text-base">{audience}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-base">
                      No target audience defined
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tools & Technologies */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-6 h-6 text-orange-600" />
              <h4 className="text-brand-dark text-lg font-bold">
                Tools & Technologies
              </h4>
            </div>

            <div className="flex flex-wrap gap-2">
              {getToolsArray().length > 0 ? (
                getToolsArray().map((tool, index) => (
                  <span
                    key={index}
                    className="badge-expert px-3 py-1 rounded-md text-sm font-semibold bg-blue-100 text-blue-800"
                  >
                    {tool}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-base">
                  No tools specified
                </span>
              )}
            </div>
          </div>

          {/* Final Actions */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-dark text-sm font-medium">
                  Step 5 of 5
                </p>
                <p className="text-brand-light text-xs font-normal mt-1">
                  Ready to publish your course? Review everything one more time
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={onPrevious}
                  disabled={isLoading}
                  className="px-6 py-3 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="primary"
                  onClick={onComplete}
                  disabled={isLoading}
                  className="px-6 py-3 flex items-center gap-2"
                >
                  {isLoading ? "Creating Course..." : "Publish Course"}
                  <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
