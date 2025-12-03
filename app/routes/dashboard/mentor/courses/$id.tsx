import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "~/components/templates/Layout";
import { Header } from "~/components/templates/Header";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import {
  BookOpen,
  Calendar,
  ArrowLeft,
  Tag,
  Edit,
  Share2,
  Home,
  Folder,
  Trophy,
  Wrench,
  Clock,
  Users,
  Copy,
  X,
} from "lucide-react";
import { coursesService } from "~/services/courses.service";
import { sectionsService } from "~/services/sections.service";
import { OverviewTab } from "~/features/courses/components/OverviewTab";
import { LessonsTab } from "~/features/courses/components/LessonsTab";
import { OtherTabs } from "~/features/courses/components/OtherTabs";
import { QUERY_KEYS } from "~/constants/api";
import { Image } from "~/components/atoms/Image";

export function meta() {
  return [
    { title: "Course Details - LMS Alprodas" },
    {
      name: "description",
      content: "View and manage course details, sections, and lessons",
    },
  ];
}

function getStatusBadgeClasses(status: string) {
  switch (status) {
    case "PUBLISHED":
      return "px-3 py-1 rounded-md text-sm font-semibold bg-[#F0FDF4] text-[#166534]";
    case "DRAFT":
      return "px-3 py-1 rounded-md text-sm font-semibold bg-[#FEF3C7] text-[#92400E]";
    case "ARCHIVED":
      return "px-3 py-1 rounded-md text-sm font-semibold bg-[#F3F4F6] text-[#374151]";
    default:
      return "px-3 py-1 rounded-md text-sm font-semibold bg-[#F3F4F6] text-[#374151]";
  }
}

export default function MentorCourseDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // NEW: state untuk modal share
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy Token");

  const {
    data: courseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: () => coursesService.getCourseById(Number(id)),
    enabled: !!id,
  });

  // Fetch sections
  const { data: sectionsData } = useQuery({
    queryKey: [...QUERY_KEYS.sections, "course", id],
    queryFn: () => sectionsService.getSectionsByCourse(Number(id)),
    enabled: !!id,
  });

  const course = courseData?.data
    ? {
        ...courseData.data,
        sections: courseData.data.sections?.map((section) => ({
          ...section,
          description: section.description || "",
          lessons: section.lessons.map((lesson) => ({
            ...lesson,
            content_url: lesson.content_url || "",
            content_text: lesson.content_text || undefined,
          })),
        })),
      }
    : undefined;

  const sections = sectionsData?.data || [];

  const totalLessons = sections.reduce(
    (total: number, section: any) => total + (section.total_lessons || 0),
    0
  );
  const totalDuration = sections.reduce((total: number, section: any) => {
    if (section.lessons) {
      return (
        total +
        section.lessons.reduce(
          (sectionTotal: number, lesson: any) =>
            sectionTotal + (lesson.duration_minutes || 0),
          0
        )
      );
    }
    return total;
  }, 0);

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return "0 min";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes} min`;
    if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} min`;
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <PermissionRoute requiredPermission="courses.read">
        <Layout>
          <Header title="Loading..." subtitle="Please wait" />
          <main className="main-content flex-1 overflow-auto p-5">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course details...</p>
              </div>
            </div>
          </main>
        </Layout>
      </PermissionRoute>
    );
  }

  if (error || !course) {
    return (
      <PermissionRoute requiredPermission="courses.read">
        <Layout>
          <Header title="Error" subtitle="Failed to load course" />
          <main className="main-content flex-1 overflow-auto p-5">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Failed to load course
                </h3>
                <p className="text-gray-500">
                  The course could not be loaded. Please try again later.
                </p>
                <Link
                  to="/dashboard/mentor/courses"
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to courses
                </Link>
              </div>
            </div>
          </main>
        </Layout>
      </PermissionRoute>
    );
  }

  // SAFETY: ambil token dengan fallback beberapa nama field
  const courseToken = course.course_token;

  const shareText = `Join my course "${course.title}" on LMS Alprodas.\n\nCourse Token: ${
    courseToken || "-"
  }`;

  const handleCopyToken = async () => {
    if (!courseToken) return;
    try {
      await navigator.clipboard.writeText(String(courseToken));
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy Token"), 1500);
    } catch (err) {
      console.error("Failed to copy token", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: shareText,
        });
      } catch (err) {
        console.error("Share cancelled or failed", err);
      }
    } else {
      // kalau tidak support, kita biarkan user copy manual
      handleCopyToken();
    }
  };

  return (
    <PermissionRoute requiredPermission="courses.read">
      <Layout>
        <Header
          title="Course Details"
          subtitle="Course information and management"
        />
        <main className="main-content flex-1 overflow-auto p-5">
          {/* Course Header */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Image
                  src={course.images?.[0]?.image_path}
                  alt={course.title}
                  className="w-32 h-32 rounded-[16px] object-cover"
                  imageType="course"
                  identifier={course.id.toString()}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-brand-dark text-3xl font-extrabold">
                    {course.title}
                  </h1>
                  <span className={getStatusBadgeClasses(course.status)}>
                    {course.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-base text-gray-600">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>{course.subject?.name || "General"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>
                      {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(totalDuration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Created{" "}
                      {new Date(course.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/dashboard/mentor/courses/${id}/edit`}
                  className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4 text-white" />
                  <span className="text-brand-white text-sm font-semibold">
                    Edit Course
                  </span>
                </Link>

                {/* MODIFIED: tombol share membuka modal */}
                <button
                  type="button"
                  onClick={() => setIsShareOpen(true)}
                  className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-6 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Course
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => switchTab("overview")}
                className={`flex items-center gap-2 px-4 py-3 rounded-[12px] border-2 font-semibold transition-all duration-300 ${
                  activeTab === "overview"
                    ? "border-[#0C51D9] bg-[#0C51D9] text-white hover:bg-[#1e5beb]"
                    : "border-[#DCDEDD] bg-white text-brand-dark font-medium hover:border-[#0C51D9] hover:bg-gray-50"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => switchTab("lessons")}
                className={`flex items-center gap-2 px-4 py-3 rounded-[12px] border-2 font-medium transition-all duration-300 ${
                  activeTab === "lessons"
                    ? "border-[#0C51D9] bg-[#0C51D9] text-white hover:bg-[#1e5beb]"
                    : "border-[#DCDEDD] bg-white text-brand-dark hover:border-[#0C51D9] hover:bg-gray-50"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Lessons</span>
              </button>
              <button
                onClick={() => switchTab("resources")}
                className={`flex items-center gap-2 px-4 py-3 rounded-[12px] border-2 font-medium transition-all duration-300 ${
                  activeTab === "resources"
                    ? "border-[#0C51D9] bg-[#0C51D9] text-white hover:bg-[#1e5beb]"
                    : "border-[#DCDEDD] bg-white text-brand-dark hover:border-[#0C51D9] hover:bg-gray-50"
                }`}
              >
                <Folder className="w-4 h-4" />
                <span>Resources</span>
              </button>
              <button
                onClick={() => switchTab("rewards")}
                className={`flex items-center gap-2 px-4 py-3 rounded-[12px] border-2 font-medium transition-all duration-300 ${
                  activeTab === "rewards"
                    ? "border-[#0C51D9] bg-[#0C51D9] text-white hover:bg-[#1e5beb]"
                    : "border-[#DCDEDD] bg-white text-brand-dark hover:border-[#0C51D9] hover:bg-gray-50"
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Rewards</span>
              </button>
              <button
                onClick={() => switchTab("tools")}
                className={`flex items-center gap-2 px-4 py-3 rounded-[12px] border-2 font-medium transition-all duration-300 ${
                  activeTab === "tools"
                    ? "border-[#0C51D9] bg-[#0C51D9] text-white hover:bg-[#1e5beb]"
                    : "border-[#DCDEDD] bg-white text-brand-dark hover:border-[#0C51D9] hover:bg-gray-50"
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Tools</span>
              </button>
              <button
                onClick={() => switchTab("students")}
                className={`flex items-center gap-2 px-4 py-3 rounded-[12px] border-2 font-medium transition-all duration-300 ${
                  activeTab === "students"
                    ? "border-[#0C51D9] bg-[#0C51D9] text-white hover:bg-[#1e5beb]"
                    : "border-[#DCDEDD] bg-white text-brand-dark hover:border-[#0C51D9] hover:bg-gray-50"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Students</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
            {activeTab === "overview" && <OverviewTab course={course} />}
            {activeTab === "lessons" && <LessonsTab course={course} />}
            {activeTab === "resources" && (
              <OtherTabs course={course} activeTab="resources" />
            )}
            {activeTab === "rewards" && (
              <OtherTabs course={course} activeTab="rewards" />
            )}
            {activeTab === "tools" && (
              <OtherTabs course={course} activeTab="tools" />
            )}
            {activeTab === "students" && (
              <OtherTabs course={course} activeTab="students" />
            )}
          </div>

          {/* SHARE MODAL */}
          {isShareOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-[20px] w-full max-w-lg p-6 shadow-xl relative border border-[#DCDEDD] shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                <button
                  type="button"
                  onClick={() => setIsShareOpen(false)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-brand-dark mb-1">
                  Share Course
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Share this course information and course token with your
                  students so they can enroll.
                </p>

                <div className="border border-[#DCDEDD] rounded-[16px] p-4 mb-4">
                  <h3 className="text-base font-semibold text-brand-dark mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {course.subject?.name || "General Subject"}
                  </p>

                  <div className="flex items-center justify-between bg-[#F9FAFB] rounded-[12px] px-3 py-2 mb-2">
                    <span className="text-xs font-medium text-gray-500">
                      Course Token
                    </span>
                    <span className="font-mono text-sm text-brand-dark">
                      {courseToken || "-"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyToken}
                    disabled={!courseToken}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed mt-1"
                  >
                    <Copy className="w-4 h-4" />
                    {copyLabel}
                  </button>
                </div>

                <div className="bg-[#F9FAFB] rounded-[16px] p-4 mb-4">
                  <p className="text-xs text-gray-600 whitespace-pre-line">
                    {shareText}
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsShareOpen(false)}
                    className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-6 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center gap-2"
                  >
                    <span className="text-white">Share via Device</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </Layout>
    </PermissionRoute>
  );
}
