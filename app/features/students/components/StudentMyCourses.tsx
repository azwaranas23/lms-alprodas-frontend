import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router";
import {
  BookOpen,
  Filter,
  Search,
  Tag,
  Clock,
  Eye,
  Play,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Download,
} from "lucide-react";
import { coursesService } from "~/services/courses.service";
import { StudentLayout } from "~/components/templates/StudentLayout";
import { Button } from "~/components/atoms/Button";
import { Input } from "~/components/atoms/Input";
import { Select } from "~/components/atoms/Select";
import { getAvatarSrc } from "~/utils/formatters";
import { Image } from "~/components/atoms/Image";

export default function StudentMyCourses() {
  const [searchParams] = useSearchParams();

  // ENROLLED COURSES (bagian atas)
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [enrolledLoading, setEnrolledLoading] = useState(true);
  const [enrolledError, setEnrolledError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // COURSE CATALOG (bagian bawah)
  const [catalogCourses, setCatalogCourses] = useState<any[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [downloadingCertificates, setDownloadingCertificates] = useState<
    Record<number, boolean>
  >({});

  // --- Fetch enrolled courses (My Courses) -----------------
  const fetchMyCourses = async () => {
    try {
      setEnrolledLoading(true);
      setEnrolledError(null);
      const response = await coursesService.getMyEnrolledCourses({
        page: currentPage,
        limit: 6,
      });
      setEnrolledCourses(response.data.items);
      setTotalPages(response.data.meta.total_pages);
    } catch (err) {
      setEnrolledError("Failed to load your courses. Please try again.");
    } finally {
      setEnrolledLoading(false);
    }
  };

  // --- Fetch course catalog (courses lainnya) --------------
  const fetchCatalogCourses = async () => {
    try {
      setCatalogLoading(true);
      setCatalogError(null);
      // ambil halaman pertama katalog, limit 6 (bisa diubah nanti)
      const response = await coursesService.getCourses({
        page: 1,
        limit: 6,
      } as any); // cast ringan karena CoursesListParams punya optional lain
      setCatalogCourses(response.data.items);
    } catch (err) {
      setCatalogError("Failed to load course catalog. Please try again.");
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, [currentPage]);

  useEffect(() => {
    fetchCatalogCourses();
  }, []);

  // Tampilkan message "completed" dari query param
  useEffect(() => {
    if (searchParams.get("completed") === "true") {
      setShowCompletionMessage(true);
      const timer = setTimeout(() => {
        setShowCompletionMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Filter search hanya untuk enrolled courses (bagian atas)
  const filteredEnrolledCourses = enrolledCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hilangkan courses yang sudah di-enroll dari katalog
  const enrolledIds = new Set(enrolledCourses.map((c) => c.id));
  const availableCatalogCourses = catalogCourses.filter(
    (course) => !enrolledIds.has(course.id)
  );

  const handleDownloadCertificate = async (
    courseId: number,
    certificateId: string,
    courseTitle: string
  ) => {
    try {
      setDownloadingCertificates((prev) => ({
        ...prev,
        [courseId]: true,
      }));

      const blob = await coursesService.downloadCertificate(certificateId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${courseTitle
        .replace(/\s+/g, "-")
        .toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download certificate:", err);
      alert("Failed to download certificate. Please try again.");
    } finally {
      setDownloadingCertificates((prev) => ({
        ...prev,
        [courseId]: false,
      }));
    }
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById("course-catalog-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navigate = useNavigate();

  return (
    <StudentLayout
      title="My Courses"
      subtitle="View and continue your enrolled courses and track your progress"
    >
      <main className="main-content flex-1 overflow-auto p-5">
        {/* Course Completion Success Message */}
        {showCompletionMessage && (
          <div className="bg-green-50 border border-green-200 rounded-[20px] p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-green-800 font-semibold">
                🎉 Congratulations!
              </h4>
              <p className="text-green-700 text-sm">
                You have successfully completed the course!
              </p>
            </div>
            <button
              onClick={() => setShowCompletionMessage(false)}
              className="text-green-600 hover:text-green-800"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* ==================== BAGIAN ATAS: MY ENROLLED COURSES ==================== */}
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-50 rounded-[12px] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-brand-dark text-xl font-bold">
                  My Courses
                </h3>
                <p className="text-brand-light text-sm font-normal">
                  View and continue your enrolled courses and track your progress
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex sm:items-center self-start sm:self-auto">
              <Button
                variant="primary"
                onClick={handleScrollToCatalog}
                className="
        inline-flex
        items-center
        justify-center
        gap-2
        px-5
        py-2.5
        whitespace-nowrap
      "
              >
                <Search className="w-4 h-4 text-white" />
                <span className="text-brand-white text-sm font-semibold">
                  Browse Courses
                </span>
              </Button>
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  icon={<Search className="h-5 w-5" />}
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {enrolledLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading courses...</span>
            </div>
          )}

          {/* Error State */}
          {enrolledError && !enrolledLoading && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <BookOpen className="w-12 h-12 mx-auto mb-2" />
                <p>{enrolledError}</p>
              </div>
              <Button onClick={fetchMyCourses} variant="primary">
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State - belum enroll apa pun */}
          {!enrolledLoading &&
            !enrolledError &&
            filteredEnrolledCourses.length === 0 &&
            enrolledCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No courses enrolled yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start your learning journey by enrolling in courses
                </p>
              </div>
            )}

          {/* No Search Results */}
          {!enrolledLoading &&
            !enrolledError &&
            filteredEnrolledCourses.length === 0 &&
            enrolledCourses.length > 0 &&
            searchQuery && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No courses found
                </h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </div>
            )}

          {/* Courses Grid - Enrolled */}
          {!enrolledLoading &&
            !enrolledError &&
            filteredEnrolledCourses.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEnrolledCourses.map((course: any) => (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4 flex flex-col cursor-pointer"
                  >
                    {/* Image - Stacked Top */}
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden rounded-[12px] mb-4">
                      <Image
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover rounded-[12px]"
                        imageType="course"
                        identifier={course.id.toString()}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h4 className="text-brand-dark text-lg font-bold leading-tight mb-2 line-clamp-2">
                        {course.title}
                      </h4>

                      <div className="flex items-center gap-4 mb-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span className="text-sm text-gray-600 line-clamp-1">
                            {course.subject.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                            {course.progress_percentage}% Complete
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={getAvatarSrc(
                            course.mentor.avatar,
                            course.mentor.name
                          )}
                          alt={course.mentor.name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = getAvatarSrc(
                              undefined,
                              course.mentor.name
                            );
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Mentor: {course.mentor.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {course.mentor.expertise || "Mentor"}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex flex-col sm:flex-row gap-3">
                        {course.progress_percentage === 100 &&
                          course.certificate_id ? (
                          <>
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadCertificate(
                                  course.id,
                                  course.certificate_id,
                                  course.title
                                );
                              }}
                              disabled={downloadingCertificates[course.id]}
                              className="flex-1 w-full px-3 py-3.5 flex items-center justify-center gap-2"
                            >
                              {downloadingCertificates[course.id] ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span className="text-sm font-semibold">
                                    Downloading...
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Download className="w-4 h-4" />
                                  <span className="text-sm font-semibold">
                                    Certificate
                                  </span>
                                </>
                              )}
                            </Button>

                            <Link
                              to={`/student/${course.id}/progress`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 w-full btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-3 py-3.5 flex items-center justify-center gap-2"
                            >
                              <Play className="w-4 h-4 text-white" />
                              <span className="text-brand-white text-sm font-semibold">
                                Review
                              </span>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to={`/course/${course.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 w-full border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-3.5 flex items-center justify-center gap-2 bg-white"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                              <span className="text-brand-dark text-sm font-semibold">
                                View Course
                              </span>
                            </Link>
                            <Link
                              to={`/student/${course.id}/progress`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 w-full btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-3 py-3.5 flex items-center justify-center gap-2"
                            >
                              <Play className="w-4 h-4 text-white" />
                              <span className="text-brand-white text-sm font-semibold">
                                {course.progress_percentage === 0
                                  ? "Start"
                                  : "Continue"}
                              </span>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}



          {/* Pagination */}
          {!enrolledLoading &&
            !enrolledError &&
            enrolledCourses.length > 0 &&
            totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <p className="text-[#6B7280] font-['Plus_Jakarta_Sans'] text-[14px] font-normal">
                    Show
                  </p>
                  <Select
                    className="px-3 py-2 rounded-lg"
                    options={[
                      { value: "6", label: "6" },
                      { value: "12", label: "12" },
                      { value: "24", label: "24" },
                    ]}
                    defaultValue="6"
                  />
                  <p className="text-[#6B7280] font-['Plus_Jakarta_Sans'] text-[14px] font-normal">
                    courses per page
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="px-4 py-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        variant={
                          currentPage === pageNum ? "primary" : "outline"
                        }
                        className="px-4 py-2"
                      >
                        {pageNum}
                      </Button>
                    )
                  )}
                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="px-4 py-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
        </div>

        {/* ==================== BAGIAN BAWAH: COURSE CATALOG ==================== */}
        <div
          id="course-catalog-section"
          className="mt-6 bg-white border border-[#DCDEDD] rounded-[20px] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-indigo-50 rounded-[12px] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-brand-dark text-xl font-bold">
                  Course Catalog
                </h3>
                <p className="text-brand-light text-sm font-normal">
                  Explore other courses you can enroll in
                </p>
              </div>
            </div>
          </div>

          {/* Loading state catalog */}
          {catalogLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading catalog...</span>
            </div>
          )}

          {/* Error state catalog */}
          {catalogError && !catalogLoading && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <BookOpen className="w-12 h-12 mx-auto mb-2" />
                <p>{catalogError}</p>
              </div>
              <Button onClick={fetchCatalogCourses} variant="primary">
                Try Again
              </Button>
            </div>
          )}

          {/* Empty state catalog */}
          {!catalogLoading &&
            !catalogError &&
            availableCatalogCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No more courses available
                </h3>
                <p className="text-gray-600">
                  You have already enrolled in all available courses.
                </p>
              </div>
            )}

          {/* Catalog grid */}
          {!catalogLoading &&
            !catalogError &&
            availableCatalogCourses.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {availableCatalogCourses.map((course: any) => (
                  <div
                    key={course.id}
                    className="border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4 flex flex-col"
                  >
                    <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden rounded-[12px] mb-4">
                      <Image
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover rounded-[12px]"
                        imageType="course"
                        identifier={course.id.toString()}
                      />
                    </div>
                    <h4 className="text-brand-dark text-base font-bold leading-tight mb-2">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm text-gray-600">
                        {course.subject?.name}
                      </span>
                    </div>
                    {course.mentor && (
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={getAvatarSrc(
                            course.mentor.avatar,
                            course.mentor.name
                          )}
                          alt={course.mentor.name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = getAvatarSrc(
                              undefined,
                              course.mentor.name
                            );
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Mentor: {course.mentor.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {course.mentor.expertise || "Mentor"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto">
                      <Link
                        to={`/course/${course.id}`}
                        className="w-full flex items-center justify-center gap-2 border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-3.5 bg-white"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-brand-dark text-sm font-semibold">
                          View Course
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </main>
    </StudentLayout>
  );
}
