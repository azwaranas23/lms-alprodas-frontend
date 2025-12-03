import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Play, Check, X, BookOpen } from "lucide-react";
import type { Course } from "~/types/courses";
import { Button } from "~/components/atoms/Button";
import { formatCurrency } from "~/utils/formatters";
import { authService } from "~/services/auth.service";
import { Image } from "~/components/atoms/Image";

interface CourseEnrollmentCardProps {
  courseId: number;
  course: Course;
}

export function CourseEnrollmentCard({
  courseId,
  course,
}: CourseEnrollmentCardProps) {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const navigate = useNavigate();
  const user = authService.getUser();

  const openVideoModal = () => {
    setShowVideoModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    document.body.style.overflow = "auto";
  };

  const getTotalDuration = (sections: Course["sections"]) => {
    if (!sections?.length) return "0 hours";

    const totalMinutes = sections.reduce((total, section) => {
      return (
        total +
        section.lessons.reduce((sectionTotal, lesson) => {
          return sectionTotal + lesson.duration_minutes;
        }, 0)
      );
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const getFirstVideoLesson = () => {
    if (!course.sections?.length) return null;

    for (const section of course.sections) {
      const videoLesson = section.lessons.find(
        (lesson) => lesson.content_type === "VIDEO" && lesson.content_url
      );
      if (videoLesson) {
        // Convert YouTube ID to embed URL
        const videoId = videoLesson.content_url;
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return {
          title: videoLesson.title,
          video_url: embedUrl,
        };
      }
    }
    return null;
  };

  const firstVideoLesson = getFirstVideoLesson();

  const courseIncludes = [
    `${getTotalDuration(course.sections)} on-demand video`,
    `${course.sections?.length || 0} sections`,
    `${course.total_lessons} lessons`,
    "Downloadable resources",
    "Lifetime access",
    "Certificate of completion",
    "Mobile and desktop access",
    "Community forum access",
    "Direct instructor support",
  ];

  return (
    <>
      <div className="sticky top-24">
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 shadow-lg">
          {/* Course Preview */}
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden rounded-[12px] mb-6">
            <Image
              src={course.images?.[2]?.image_path}
              alt={course.title}
              className="w-full h-full object-cover rounded-[12px]"
              imageType="course"
              identifier={courseId.toString()}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button
                variant="ghost"
                onClick={openVideoModal}
                className="w-16 h-16 bg-white/90 rounded-full hover:bg-white p-0"
              >
                <Play className="w-8 h-8 text-blue-600 ml-1" />
              </Button>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center mb-6"></div>

          {/* Enroll Button */}
          {course.is_enrolled ? (
            <Button
              variant="outline"
              className="w-full px-6 py-4 text-lg mb-6"
              onClick={() => navigate(`/student/${courseId}/progress`)}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Continue Learning
            </Button>
          ) : user ? (
            <Link to={`/checkout/${courseId}`}>
              <Button
                variant="primary"
                className="w-full px-6 py-4 text-lg mb-6"
              >
                Enroll with Token
              </Button>
            </Link>
          ) : (
            <Button
              variant="primary"
              className="w-full px-6 py-4 text-lg mb-6"
              onClick={() => navigate("/login")}
            >
              Login to Enroll
            </Button>
          )}

          {/* What's Included */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-bold text-brand-dark">
              What's included:
            </h3>
            <div className="space-y-3">
              {courseIncludes.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-brand-light text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeVideoModal}
        >
          <div
            className="bg-white rounded-[20px] border border-[#DCDEDD] w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-[#DCDEDD]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                    <Play className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-brand-dark text-xl font-bold">
                      Course Preview
                    </h3>
                    <p className="text-brand-light text-sm font-normal">
                      {firstVideoLesson?.title || course.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeVideoModal}
                  className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            {/* Modal Content */}
            <div className="p-6">
              <div className="aspect-video w-full">
                {firstVideoLesson?.video_url ? (
                  <iframe
                    src={firstVideoLesson.video_url}
                    className="w-full h-full rounded-[12px] border-0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="w-full h-full rounded-[12px] bg-gray-100 flex items-center justify-center">
                    <p className="text-brand-light">
                      No preview video available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
