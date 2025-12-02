import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  GraduationCap,
  ChevronDown,
  Check,
  Play,
  Lock,
  ArrowLeft,
  Bookmark,
  Share2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Eye,
  FileText,
  Download,
  Code,
  Loader2,
  BookOpen,
} from "lucide-react";
import { coursesService } from "~/services/courses.service";
import { getAvatarSrc } from "~/utils/formatters";
import { useUser } from "~/hooks/useUser";

export default function CoursePlayingVideo() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getFullName, getRoleName, getAvatar } = useUser();

  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<number[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [lessonDetail, setLessonDetail] = useState<any>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [courseProgress, setCourseProgress] = useState<any>(null);

  const toggleAccordion = (sectionId: number) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const fetchCourseProgress = async () => {
    try {
      const response = await coursesService.getCourseProgress(Number(courseId));
      setCourseProgress(response.data);
    } catch (err) {
      console.error("Failed to fetch course progress:", err);
    }
  };

  const fetchCourseData = async () => {
    if (!courseId) {
      setError("Course ID not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await coursesService.getCourseLearning(Number(courseId));
      setCourseData(response.data);

      // Find first incomplete lesson and auto-expand its section
      if (response.data.sections.length > 0) {
        let firstIncompleteLesson = null;
        let sectionToExpand = null;

        // Look for first incomplete lesson across all sections
        for (const section of response.data.sections) {
          if (section.lessons && section.lessons.length > 0) {
            const incompleteLesson = section.lessons.find(
              (lesson: any) => !lesson.progress?.is_completed
            );
            if (incompleteLesson) {
              firstIncompleteLesson = incompleteLesson;
              sectionToExpand = section;
              break;
            }
          }
        }

        // If no incomplete lesson found, use first lesson of first section
        if (!firstIncompleteLesson) {
          const firstSection = response.data.sections.find(
            (s: any) => s.lessons && s.lessons.length > 0
          );
          if (firstSection && firstSection.lessons.length > 0) {
            firstIncompleteLesson = firstSection.lessons[0];
            sectionToExpand = firstSection;
          }
        }

        if (sectionToExpand && firstIncompleteLesson) {
          setOpenSections([sectionToExpand.id]);
          setCurrentLesson(firstIncompleteLesson);
          fetchLessonDetail(firstIncompleteLesson.id);
        }
      }
    } catch (err) {
      setError("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
    fetchCourseProgress();
  }, [courseId]);

  const fetchLessonDetail = async (lessonId: number) => {
    try {
      setLessonLoading(true);
      const response = await coursesService.getLessonDetail(lessonId);
      console.log("Lesson detail response:", response.data);
      setLessonDetail(response.data);
    } catch (err) {
      console.error("Failed to load lesson detail:", err);
    } finally {
      setLessonLoading(false);
    }
  };

  // Helper function to ensure proper YouTube embed URL
  const getEmbedUrl = (url: string) => {
    console.log("Original URL:", url);

    // If URL is invalid or too short, use a default demo video
    if (!url || url.length < 10) {
      console.log("Invalid URL, using default demo video");
      return "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Default demo video
    }

    // If it's already an embed URL, check if it has valid video ID
    if (url.includes("youtube.com/embed/")) {
      const videoId = url.split("embed/")[1]?.split("?")[0];
      if (videoId && videoId.length >= 11) {
        return url;
      } else {
        console.log("Invalid video ID in embed URL, using default");
        return "https://www.youtube.com/embed/dQw4w9WgXcQ";
      }
    }

    // Extract video ID from various YouTube URL formats
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }

    // Validate video ID (YouTube IDs are typically 11 characters)
    if (videoId && videoId.length >= 11) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      console.log("Converted to embed URL:", embedUrl);
      return embedUrl;
    }

    // If we can't parse it properly, try to use it as is but with warning
    console.log("Could not parse URL properly, trying original:", url);
    return url;
  };

  const completeLesson = async (lessonId: number) => {
    try {
      await coursesService.completeLesson(lessonId);
      // Refresh course data and progress to update
      fetchCourseData();
      fetchCourseProgress();
    } catch (err) {
      console.error("Failed to complete lesson:", err);
    }
  };

  const handleNextLesson = async () => {
    if (lessonDetail?.navigation?.next_lesson) {
      // Mark current lesson as complete first
      if (lessonDetail?.id && !lessonDetail?.progress?.is_completed) {
        await completeLesson(lessonDetail.id);
      }

      // Navigate to next lesson
      const nextLesson = lessonDetail.navigation.next_lesson;
      handleLessonClick({ id: nextLesson.id, title: nextLesson.title });

      // Refresh course progress to update percentage
      fetchCourseProgress();
    }
  };

  const handleCompleteCourse = async () => {
    try {
      // Mark current lesson as complete first
      if (lessonDetail?.id && !lessonDetail?.progress?.is_completed) {
        await completeLesson(lessonDetail.id);
      }

      // Call API to complete course
      const response = await coursesService.completeCourse(Number(courseId));

      // Refresh course progress after completion
      await fetchCourseProgress();

      if (response.data.success) {
        // Navigate to course completion page with courseId and certificateId
        const params = new URLSearchParams({
          courseId: courseId || "",
          certificateId: response.data.certificate_id || "",
        });

        navigate(`/student/course-completed?${params.toString()}`);
      } else {
        console.error("Course completion failed");
      }
    } catch (error) {
      console.error("Failed to complete course:", error);
    }
  };

  const handlePrevLesson = () => {
    if (lessonDetail?.navigation?.previous_lesson) {
      const prevLesson = lessonDetail.navigation.previous_lesson;
      handleLessonClick({ id: prevLesson.id, title: prevLesson.title });
    }
  };

  // Copy code functionality for article content
  const copyCode = (button: HTMLButtonElement) => {
    const codeBlock = button.closest(".bg-gray-900")?.querySelector("code");
    if (codeBlock) {
      const text = codeBlock.textContent || "";

      navigator.clipboard.writeText(text).then(() => {
        const originalIcon = button.innerHTML;
        button.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"></polyline></svg>';
        button.classList.add("text-green-400");

        setTimeout(() => {
          button.innerHTML = originalIcon;
          button.classList.remove("text-green-400");
        }, 2000);
      });
    }
  };

  // Initialize copy code functionality after content loads
  useEffect(() => {
    if (
      lessonDetail?.content_type === "ARTICLE" &&
      lessonDetail?.content_text
    ) {
      // Add click handlers to copy buttons
      const copyButtons = document.querySelectorAll("[data-copy-code]");
      copyButtons.forEach((button) => {
        button.addEventListener("click", () =>
          copyCode(button as HTMLButtonElement)
        );
      });

      // Cleanup function
      return () => {
        copyButtons.forEach((button) => {
          button.removeEventListener("click", () =>
            copyCode(button as HTMLButtonElement)
          );
        });
      };
    }
  }, [lessonDetail]);

  const handleLessonClick = (lesson: any) => {
    // Allow clicking:
    // 1. Completed lessons (can replay)
    // 2. Current lesson (already selected)
    // 3. First incomplete lesson (can start)
    const isCompleted = lesson.progress?.is_completed;
    const isCurrent = currentLesson?.id === lesson.id;
    const isFirstIncomplete =
      !isCompleted &&
      !courseData?.sections?.some((section: any) =>
        section.lessons?.some(
          (l: any) =>
            l.order_index < lesson.order_index && !l.progress?.is_completed
        )
      );

    if (isCompleted || isCurrent || isFirstIncomplete) {
      setCurrentLesson(lesson);
      fetchLessonDetail(lesson.id);
    }
  };

  const isLessonClickable = (lesson: any) => {
    const isCompleted = lesson.progress?.is_completed;
    const isCurrent = currentLesson?.id === lesson.id;
    const isFirstIncomplete =
      !isCompleted &&
      !courseData?.sections?.some((section: any) =>
        section.lessons?.some(
          (l: any) =>
            l.order_index < lesson.order_index && !l.progress?.is_completed
        )
      );
    return isCompleted || isCurrent || isFirstIncomplete;
  };

  const getLessonIcon = (lesson: any) => {
    if (lesson.progress?.is_completed) {
      return <Check className="w-3 h-3 min-w-[12px] min-h-[12px] text-white" />;
    }
    if (currentLesson?.id === lesson.id) {
      return <Play className="w-3 h-3 min-w-[12px] min-h-[12px] text-white" />;
    }
    // Semua lesson yang tidak completed dan tidak current = locked
    return <Lock className="w-3 h-3 min-w-[12px] min-h-[12px] text-gray-500" />;
  };

  const getLessonStyle = (lesson: any) => {
    if (lesson.progress?.is_completed) {
      return "lesson-item completed flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer";
    }
    if (currentLesson?.id === lesson.id) {
      return "lesson-item active flex items-center gap-3 p-2 rounded-md bg-blue-50 border border-blue-200";
    }
    // Semua lesson yang tidak completed dan tidak current = default style
    return "lesson-item flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer";
  };

  const getIconBackground = (lesson: any) => {
    if (lesson.progress?.is_completed) {
      return "w-5 h-5 bg-green-500 rounded-full flex items-center justify-center";
    }
    if (currentLesson?.id === lesson.id) {
      return "w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center";
    }
    // Semua lesson yang tidak completed dan tidak current = gray background
    return "w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center";
  };

  const getTextStyle = (lesson: any) => {
    if (currentLesson?.id === lesson.id) {
      return "text-sm font-medium text-blue-900 truncate";
    }
    if (lesson.progress?.is_completed) {
      return "text-sm text-gray-700 truncate";
    }
    // Lesson yang belum completed dan bukan current = gray text
    return "text-sm text-gray-500 truncate";
  };

  const getTimeStyle = (lesson: any) => {
    if (currentLesson?.id === lesson.id) {
      return "text-xs text-blue-600 ml-auto";
    }
    return "text-xs text-gray-400 ml-auto";
  };

  const formatDuration = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes % 1) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading course...</span>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-5">
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-8 max-w-md w-full text-center shadow-sm">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Error Content */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-brand-dark mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {error || "Course not found"}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              The course you're looking for might not exist or there was an
              error loading the content.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard/student/my-courses"
              className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
              <span className="text-brand-white text-sm font-semibold">
                Back to My Courses
              </span>
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-6 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-sm font-semibold">Try Again</span>
            </button>
          </div>

          {/* Support Link */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Need help?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="flex h-screen">
        {/* Course Navigation Sidebar */}
        <aside className="w-80 bg-white border-r border-[#DCDEDD] flex flex-col">
          {/* Logo Section */}
          <div className="px-6 py-4 border-b border-[#DCDEDD]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 relative flex items-center justify-center">
                {/* Background circle */}
                <div className="w-14 h-14 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
                {/* Overlapping smaller circle */}
                <div className="w-10 h-10 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
                {/* Lucide icon */}
                <GraduationCap className="w-5 h-5 text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-brand-dark text-lg font-bold">
                  LMS Alprodas
                </h1>
                <p className="text-brand-dark text-xs font-normal">
                  Student Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Course Sections Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {courseData.sections && courseData.sections.length > 0 ? (
                courseData.sections.map((section: any) => (
                  <div key={section.id} className="accordion-section">
                    <button
                      className="accordion-header w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => toggleAccordion(section.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                            {section.order_index}
                          </div>
                          <span
                            className="font-medium text-gray-900"
                            title={section.title}
                          >
                            {truncateText(section.title, 20)}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 accordion-chevron transition-transform ${
                            openSections.includes(section.id)
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </button>
                    <div
                      className={`accordion-content mt-2 ml-9 space-y-2 ${openSections.includes(section.id) ? "" : "hidden"}`}
                    >
                      {section.lessons.length > 0 ? (
                        section.lessons.map((lesson: any) => (
                          <div
                            key={lesson.id}
                            className={getLessonStyle(lesson)}
                            onClick={() => handleLessonClick(lesson)}
                            style={{
                              cursor: isLessonClickable(lesson)
                                ? "pointer"
                                : "not-allowed",
                            }}
                          >
                            <div className={getIconBackground(lesson)}>
                              {getLessonIcon(lesson)}
                            </div>
                            <span
                              className={getTextStyle(lesson)}
                              title={lesson.title}
                            >
                              {truncateText(lesson.title, 20)}
                            </span>
                            <span className={getTimeStyle(lesson)}>
                              {formatDuration(lesson.duration_minutes)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500 p-2 italic">
                          No lessons available
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                /* Empty State */
                <div className="flex items-center justify-center h-full">
                  <div className="text-center py-8 px-4">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No lessons available
                    </h3>
                    <p className="text-gray-500 text-sm">
                      This course doesn't have any lessons yet. Please check
                      back later.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <header className="page-header bg-white border-b border-[#DCDEDD] px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard/student/my-courses"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                  <h2 className="text-brand-dark text-2xl font-extrabold">
                    {lessonDetail?.title ||
                      currentLesson?.title ||
                      courseData.title}
                  </h2>
                  <p className="text-brand-light text-sm font-normal mt-1">
                    {lessonDetail
                      ? `Section ${
                          lessonDetail.section.order_index ||
                          courseData?.sections?.findIndex(
                            (s: any) => s.id === lessonDetail.section.id
                          ) + 1 ||
                          lessonDetail.section.id
                        }: ${lessonDetail.section.title} • Lesson ${lessonDetail.order_index}`
                      : courseData.subject.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200">
                    <Bookmark className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-[#DCDEDD] mx-5"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarSrc(getAvatar(), getFullName())}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getAvatarSrc(undefined, getFullName());
                    }}
                  />
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

          {/* Main Content Area */}
          <main className="main-content flex-1 overflow-auto p-5">
            {currentLesson ? (
              <>
                {/* Video Section */}
                <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
                  {lessonLoading ? (
                    <div className="aspect-video w-full bg-gray-50 rounded-[12px] flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-full">
                      {lessonDetail?.content_type === "VIDEO" ? (
                        <div className="aspect-video w-full">
                          {lessonDetail?.content_url ? (
                            <iframe
                              src={getEmbedUrl(lessonDetail.content_url)}
                              className="w-full h-full rounded-[12px] border-0"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              title={lessonDetail.title}
                            ></iframe>
                          ) : (
                            <div className="w-full h-full bg-gray-50 rounded-[12px] flex items-center justify-center">
                              <div className="text-center text-gray-600">
                                <Play className="w-16 h-16 mx-auto mb-4" />
                                <p className="text-lg">Video not available</p>
                                <p className="text-sm">
                                  Video URL is missing or invalid
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Article Content */
                        <div className="prose max-w-none">
                          {lessonDetail?.content_text ? (
                            <div
                              className="article-content"
                              dangerouslySetInnerHTML={{
                                __html: lessonDetail.content_text,
                              }}
                            />
                          ) : (
                            <div className="text-center py-12 text-gray-600">
                              <FileText className="w-16 h-16 mx-auto mb-4" />
                              <p className="text-lg">
                                Article content not available
                              </p>
                              <p className="text-sm">
                                Content is missing or still being loaded
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Lesson Details */}
                <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-brand-dark mb-2">
                        {lessonDetail?.title || currentLesson.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatDuration(
                              lessonDetail?.duration_minutes ||
                                currentLesson.duration_minutes
                            )}{" "}
                            duration
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Section{" "}
                            {lessonDetail?.section?.order_index ||
                              courseData?.sections?.findIndex(
                                (s: any) => s.id === lessonDetail?.section?.id
                              ) + 1 ||
                              lessonDetail?.section?.id}
                            : {lessonDetail?.section?.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>
                            Lesson{" "}
                            {lessonDetail?.order_index ||
                              currentLesson.order_index}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {lessonDetail?.navigation?.previous_lesson ? (
                        <button
                          onClick={handlePrevLesson}
                          className="bg-white border border-[#DCDEDD] text-brand-dark py-2 px-4 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            Previous
                          </span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-100 border border-[#DCDEDD] text-gray-400 py-2 px-4 rounded-[8px] font-medium cursor-not-allowed flex items-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            Previous
                          </span>
                        </button>
                      )}

                      {lessonDetail?.navigation?.next_lesson ? (
                        <button
                          onClick={handleNextLesson}
                          className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-2 flex items-center gap-2"
                        >
                          <span className="text-brand-white text-sm font-semibold">
                            {lessonDetail?.progress?.is_completed
                              ? "Next Lesson"
                              : "Complete & Next"}
                          </span>
                          <ChevronRight className="w-4 h-4 text-white" />
                        </button>
                      ) : // No next lesson - this is the last lesson
                      !lessonDetail?.progress?.is_completed &&
                        courseProgress?.progress_stats?.percentage !== 100 ? (
                        <button
                          onClick={handleCompleteCourse}
                          className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-2 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4 text-white" />
                          <span className="text-brand-white text-sm font-semibold">
                            Complete Course
                          </span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-100 border border-[#DCDEDD] text-gray-400 py-2 px-4 rounded-[8px] font-medium cursor-not-allowed flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            Course Completed
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resources & Downloads */}
                <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
                  <h4 className="text-lg font-bold text-brand-dark mb-4">
                    Resources & Downloads
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-[#DCDEDD] rounded-lg p-4 hover:border-[#0C51D9] hover:border-2 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">
                            Lesson Notes
                          </h5>
                          <p className="text-sm text-gray-600">
                            Complete lesson transcript and code examples
                          </p>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="border border-[#DCDEDD] rounded-lg p-4 hover:border-[#0C51D9] hover:border-2 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <Code className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">
                            Source Code
                          </h5>
                          <p className="text-sm text-gray-600">
                            Starter and completed project files
                          </p>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State - No Lesson Selected */
              <div className="flex items-center justify-center h-full">
                <div className="text-center py-12">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a lesson to start learning
                  </h3>
                  <p className="text-gray-600">
                    Choose a lesson from the sidebar to begin your learning
                    journey
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
