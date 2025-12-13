import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { MentorLayout } from "~/components/templates/MentorLayout";
import { MentorRoute } from "~/features/auth/components/RoleBasedRoute";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import { Header } from "~/components/templates/Header";
import { useUser } from "~/hooks/useUser";
import {
  BookOpen,
  Download,
  PlusCircle,
  Search,
  Tag,
  Users,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { coursesService, type Course } from "~/services/courses.service";
import { env } from "~/config/env";
import { Image } from "~/components/atoms/Image";
import { Avatar } from "~/components/atoms/Avatar";

export function meta() {
  return [
    { title: "My Courses - Alprodas LMS" },
    {
      name: "description",
      content: "Create and manage your courses and learning materials",
    },
  ];
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function MentorCoursesPage() {
  const navigate = useNavigate();
  const { getFullName, getAvatar } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query by 500ms
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch courses data from API
  const {
    data: coursesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses", currentPage, itemsPerPage, debouncedSearchQuery],
    queryFn: () =>
      coursesService.getCourses({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchQuery || undefined,
      }),
  });

  // Use API data
  const courses = coursesData?.data?.items || [];
  const totalPages = coursesData?.data?.meta?.total_pages || 1;

  const handleCreateCourse = () => {
    navigate("/dashboard/mentor/courses/add");
  };

  const handleExportData = () => {
    console.log("Export functionality would be implemented here");
  };

  const handleEditCourse = (courseId: number) => {
    navigate(`/dashboard/mentor/courses/${courseId}/edit`);
  };

  const handleViewDetails = (courseId: number) => {
    navigate(`/dashboard/mentor/courses/${courseId}`);
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full";
      case "DRAFT":
        return "px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full";
      case "ARCHIVED":
        return "px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full";
      default:
        return "px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full";
    }
  };

  if (isLoading) {
    return (
      <MentorRoute>
        <PermissionRoute requiredPermission="courses.read">
          <MentorLayout>
            <Header
              title="My Courses"
              subtitle="Create and manage your courses and learning materials"
            />
            <main className="main-content flex-1 overflow-auto p-5">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading courses...</p>
                </div>
              </div>
            </main>
          </MentorLayout>
        </PermissionRoute>
      </MentorRoute>
    );
  }

  if (error) {
    return (
      <MentorRoute>
        <PermissionRoute requiredPermission="courses.read">
          <MentorLayout>
            <Header
              title="My Courses"
              subtitle="Create and manage your courses and learning materials"
            />
            <main className="main-content flex-1 overflow-auto p-5">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Failed to load courses
                  </h3>
                  <p className="text-gray-500">
                    There was an error loading the courses data. Please try
                    again later.
                  </p>
                </div>
              </div>
            </main>
          </MentorLayout>
        </PermissionRoute>
      </MentorRoute>
    );
  }

  return (
    <MentorRoute>
      <PermissionRoute requiredPermission="courses.read">
        <MentorLayout>
          <Header
            title="My Courses"
            subtitle="Create and manage your courses and learning materials"
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="main-content flex-1 overflow-auto p-5">
              {/* Courses Grid Section */}
              <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-blue-50 rounded-[12px] flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-brand-dark text-xl font-bold">
                        My Courses
                      </h3>
                      <p className="text-brand-light text-sm font-normal">
                        Create and manage your courses and learning materials
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleCreateCourse}
                      className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4 text-white" />
                      <span className="text-brand-white text-sm font-semibold">
                        Create Course
                      </span>
                    </button>
                  </div>
                </div>

                {/* Search Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                        placeholder="Search courses..."
                      />
                    </div>
                  </div>
                </div>

                {/* Courses Grid */}
                {courses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No courses found
                    </h3>
                    <p className="text-gray-500">
                      {searchQuery
                        ? "Try adjusting your search criteria"
                        : "Courses will appear here when they are created"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {courses.map((course: Course) => (
                      <div
                        key={course.id}
                        className="border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4"
                      >
                        <div className="flex gap-4 h-full">
                          {/* Course Thumbnail */}
                          <div className="w-36 h-full relative overflow-hidden rounded-[12px] flex-shrink-0">
                            {course.images && course.images.length > 0 ? (
                              <Image
                                src={course.images[0].image_path}
                                alt={course.title}
                                className="w-full h-full object-cover"
                                imageType="course"
                                identifier={course.id.toString()}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                                {course.title.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 flex flex-col">
                            <div className="flex-1 mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-brand-dark text-lg font-bold leading-tight">
                                  {course.title}
                                </h4>
                                <span
                                  className={getStatusBadgeClasses(
                                    course.status
                                  )}
                                >
                                  {course.status}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                <Tag className="w-4 h-4" />
                                <span className="text-sm text-gray-600">
                                  {course.subject?.topic?.name ||
                                    course.subject?.name ||
                                    "General"}
                                </span>
                              </div>

                              <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-4 h-4" />
                                  <span>
                                    {course.total_lessons || 0} Lessons
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  <span>
                                    {course.total_students?.toLocaleString() ||
                                      0}{" "}
                                    Students
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2 mb-3">
                                <Avatar
                                  src={getAvatar() || undefined}
                                  name={getFullName()}
                                  size="md"
                                />
                                <div className="text-sm">
                                  <div className="text-brand-dark font-medium">
                                    {course.mentor?.name || getFullName()}
                                  </div>
                                  <div className="text-gray-500">
                                    {course.mentor?.profile?.expertise ||
                                      "Mentor"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCourse(course.id)}
                                className="flex-1 border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-3.5 flex items-center justify-center gap-2"
                              >
                                <Edit className="w-4 h-4 text-gray-600" />
                                <span className="text-brand-dark text-sm font-semibold">
                                  Edit Course
                                </span>
                              </button>
                              <button
                                onClick={() => handleViewDetails(course.id)}
                                className="flex-1 btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-3 py-3.5 flex items-center justify-center gap-2"
                              >
                                <Eye className="w-4 h-4 text-white" />
                                <span className="text-brand-white text-sm font-semibold">
                                  Details
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2">
                    <p className="text-[#6B7280] font-['Plus_Jakarta_Sans'] text-[14px] font-normal">
                      Show
                    </p>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="px-3 py-2 border border-[#DCDEDD] rounded-lg hover:border-[#0C51D9] focus:border-[#0C51D9] transition-all duration-300 bg-white appearance-none"
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                    <p className="text-[#6B7280] font-['Plus_Jakarta_Sans'] text-[14px] font-normal">
                      courses per page
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-[#DCDEDD] rounded-lg hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 border rounded-lg font-semibold transition-all duration-300 ${currentPage === index + 1
                          ? "border-[#2151A0] blue-gradient blue-btn-shadow text-white"
                          : "border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50"
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-[#DCDEDD] rounded-lg hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </MentorLayout>
      </PermissionRoute>
    </MentorRoute>
  );
}
