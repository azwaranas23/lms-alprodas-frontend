import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import type { Route } from "./+types/course-completed";
import { Share2, Compass } from "lucide-react";
import { SuccessIcon } from "~/features/students/components/SuccessIcon";
import { CourseCompletionCard } from "~/features/students/components/CourseCompletionCard";
import { coursesService } from "~/services/courses.service";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Course Completed - Alprodas LMS" },
    {
      name: "description",
      content: "Congratulations! You have successfully completed the course",
    },
  ];
}

interface CourseCompletionData {
  title: string;
  category: string;
  thumbnail: string;
  mentor: {
    name: string;
    title: string;
    avatar: string;
  };
  stats: {
    lessonsCompleted: string;
    totalDuration: string;
    completionDate: string;
    certificateId: string;
  };
  achievement: string;
}

export default function CourseCompletedPage() {
  const [searchParams] = useSearchParams();
  const [courseData, setCourseData] = useState<CourseCompletionData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseEnrollmentData = async () => {
      const courseId = searchParams.get("courseId");
      const certificateId = searchParams.get("certificateId");

      if (courseId) {
        try {
          setLoading(true);
          const response = await coursesService.getCourseEnrollment(
            Number(courseId)
          );
          const enrollmentData = response.data;

          const courseCompletionData: CourseCompletionData = {
            title: enrollmentData.course.title,
            category: enrollmentData.course.subject.name,
            thumbnail: enrollmentData.course.images[0]?.image_path || "",
            mentor: {
              name: enrollmentData.course.mentor.name,
              title:
                enrollmentData.course.mentor.profile?.expertise ||
                "Course Mentor",
              avatar: enrollmentData.course.mentor.profile?.avatar || "",
            },
            stats: {
              lessonsCompleted: `${enrollmentData.course.total_lessons} / ${enrollmentData.course.total_lessons}`,
              totalDuration: `${Math.ceil(
                enrollmentData.course.sections.reduce(
                  (total: number, section: any) =>
                    total +
                    section.lessons.reduce(
                      (sectionTotal: number, lesson: any) =>
                        sectionTotal + lesson.duration_minutes,
                      0
                    ),
                  0
                ) / 60
              )} hours`,
              completionDate: new Date(
                enrollmentData.completed_at
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              certificateId: certificateId || enrollmentData.certificate_id,
            },
            achievement: `${enrollmentData.course.subject.name} Master`,
          };

          setCourseData(courseCompletionData);
        } catch (error) {
          console.error("Failed to fetch course enrollment data:", error);
          // Fallback to default data
          const defaultData: CourseCompletionData = {
            title: "Course Completed",
            category: "Learning",
            thumbnail: "",
            mentor: {
              name: "Course Mentor",
              title: "Expert Instructor",
              avatar: "",
            },
            stats: {
              lessonsCompleted: "N/A",
              totalDuration: "N/A",
              completionDate: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              certificateId: certificateId || "CERT-2024-001",
            },
            achievement: "Course Master",
          };
          setCourseData(defaultData);
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback to URL params if no courseId
        const defaultData: CourseCompletionData = {
          title:
            searchParams.get("courseTitle") ||
            "Complete React Mastery: Advanced Frontend Development",
          category:
            searchParams.get("courseCategory") || "Frontend Development",
          thumbnail:
            searchParams.get("courseThumbnail") ||
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
          mentor: {
            name: searchParams.get("mentorName") || "Dr. Emily Carter",
            title:
              searchParams.get("mentorTitle") ||
              "React Expert & Frontend Architect",
            avatar:
              searchParams.get("mentorAvatar") ||
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
          },
          stats: {
            lessonsCompleted: searchParams.get("lessonsCompleted") || "23 / 23",
            totalDuration: searchParams.get("totalDuration") || "8.5 hours",
            completionDate:
              searchParams.get("completionDate") || "December 21, 2024",
            certificateId: searchParams.get("certificateId") || "CERT-2024-001",
          },
          achievement: searchParams.get("achievement") || "React Master",
        };
        setCourseData(defaultData);
        setLoading(false);
      }
    };

    fetchCourseEnrollmentData();

    // Load confetti library dynamically
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [searchParams]);

  const handleShareAchievement = () => {
    if (!courseData) return;

    // Create share text
    const shareText = `🎉 I just completed "${courseData.title}" on Alprodas LMS! Achievement unlocked: ${courseData.achievement}`;

    // Try to use Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: "Course Completed!",
          text: shareText,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("Error sharing:", error);
          fallbackShare(shareText);
        });
    } else {
      fallbackShare(shareText);
    }
  };

  const fallbackShare = (text: string) => {
    // Fallback: copy to clipboard
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Achievement copied to clipboard! 🎉");
      })
      .catch(() => {
        // Final fallback: show alert with text
        alert(`Share this achievement:\n\n${text}`);
      });
  };

  if (loading || !courseData) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course completion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        {/* Success Icon */}
        <SuccessIcon />

        {/* Success Message */}
        <div className="mb-12">
          <h1 className="text-brand-dark text-4xl font-extrabold mb-4">
            Course Completed! 🎉
          </h1>
          <p className="text-brand-light text-base font-normal">
            Congratulations! You've successfully completed this course. You've
            demonstrated exceptional dedication and skill in your learning
            journey.
          </p>
        </div>

        {/* Course Info Card */}
        <CourseCompletionCard courseData={courseData} />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleShareAchievement}
            className="border border-[#DCDEDD] rounded-[12px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-8 py-4 flex items-center justify-center gap-3"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
            <span className="text-brand-dark text-base font-semibold">
              Share Achievement
            </span>
          </button>
          <Link
            to="/dashboard/student/my-courses"
            className="btn-primary rounded-[12px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-8 py-4 flex items-center justify-center gap-3"
          >
            <Compass className="w-5 h-5 text-white" />
            <span className="text-brand-white text-base font-semibold">
              Explore More Courses
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
