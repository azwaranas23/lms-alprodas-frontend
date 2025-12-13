// app/routes/dashboard/mentor/students.tsx
import { useState, useEffect } from "react";
import type { Route } from "./+types/students";
import { Users } from "lucide-react";
import { MentorLayout } from "~/components/templates/MentorLayout";
import { MentorRoute } from "~/features/auth/components/RoleBasedRoute";
import { StudentCard, type Student } from "~/components/organisms/StudentCard";
import { StudentDetailModal } from "~/components/organisms/StudentDetailModal";
import { StudentsSearchSection } from "~/components/molecules/StudentsSearchSection";
import { Pagination } from "~/components/molecules/Pagination";
import { useQuery } from "@tanstack/react-query";
import { coursesService } from "~/services/courses.service";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "My Students - Alprodas LMS" },
    {
      name: "description",
      content: "View students enrolled in your courses",
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

interface StudentWithDetails extends Student {
  latestEnrollment?: string;
}

export default function MentorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("8");
  const [selectedStudent, setSelectedStudent] = useState<StudentWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce search query by 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch students enrolled in mentor's courses
  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["mentor-students", currentPage, itemsPerPage, debouncedSearchTerm],
    queryFn: () =>
      coursesService.getMentorStudents({
        page: currentPage,
        limit: parseInt(itemsPerPage),
        search: debouncedSearchTerm || undefined,
      }),
  });

  const students = studentsData?.data?.items || [];
  const meta = studentsData?.data?.meta || {
    total: 0,
    page: 1,
    per_page: 8,
    total_pages: 1,
  };

  // Transform API data to match existing Student format
  const transformedStudents: StudentWithDetails[] = students.map((student) => ({
    id: String(student.id),
    name: student.name,
    specialization: student.user_profile?.expertise || "Student",
    email: student.email,
    enrolledCourses: student.enrolled_courses_count || 0,
    status: student.is_active ? "Active" as const : "Inactive" as const,
    avatar:
      student.user_profile?.avatar ||
      "https://images.unsplash.com/photo-1494790108755-2616b612b047",
    latestEnrollment: student.latest_enrollment,
  }));

  const handleViewDetails = (studentId: string) => {
    const student = transformedStudents.find((s) => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (items: string) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <MentorRoute>
        <MentorLayout
          title="My Students"
          subtitle="Students enrolled in your courses"
        >
          <main className="main-content flex-1 overflow-auto p-5">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading students...</p>
              </div>
            </div>
          </main>
        </MentorLayout>
      </MentorRoute>
    );
  }

  return (
    <MentorRoute>
      <MentorLayout
        title="My Students"
        subtitle="Students enrolled in your courses"
      >
        <main className="main-content flex-1 overflow-auto p-5">
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-brand-dark text-xl font-bold">
                    Enrolled Students
                  </h3>
                  <p className="text-brand-light text-sm font-normal">
                    Students taking your courses
                  </p>
                </div>
              </div>
            </div>

            <StudentsSearchSection
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            {transformedStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No students found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Students will appear here once they enroll in your courses"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {transformedStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={meta.total_pages}
              itemsPerPage={parseInt(itemsPerPage)}
              onPageChange={handlePageChange}
              onItemsPerPageChange={(items) =>
                handleItemsPerPageChange(items.toString())
              }
              itemType="students"
              showItemsPerPage={true}
              itemsPerPageOptions={[8, 16, 24, 32]}
            />
          </div>
        </main>

        {/* Student Detail Modal */}
        <StudentDetailModal
          student={selectedStudent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </MentorLayout>
    </MentorRoute>
  );
}
