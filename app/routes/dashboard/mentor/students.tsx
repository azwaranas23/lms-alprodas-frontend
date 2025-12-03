// app/routes/dashboard/mentor/students.tsx
import { useState } from "react";
import type { Route } from "./+types/students";
import { Upload, Plus, Users } from "lucide-react";
import { MentorLayout } from "~/components/templates/MentorLayout";
import { MentorRoute } from "~/features/auth/components/RoleBasedRoute";
import { StudentCard, type Student } from "~/components/organisms/StudentCard";
import { StudentsSearchSection } from "~/components/molecules/StudentsSearchSection";
import { Pagination } from "~/components/molecules/Pagination";
import { useStudents } from "~/hooks/api/useUsers";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Students Management - LMS Alprodas" },
    {
      name: "description",
      content: "Manage your students and track their learning progress",
    },
  ];
}

export default function MentorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("8");

  // Fetch students data from API with server-side pagination
  const { data: studentsData, isLoading } = useStudents({
    page: currentPage,
    limit: parseInt(itemsPerPage),
    search: searchTerm,
  });

  const students = studentsData?.data?.items || [];
  const meta = studentsData?.data?.meta || {
    total: 0,
    page: 1,
    per_page: 8,
    total_pages: 1,
  };

  // Transform API data to match existing Student format
  const transformedStudents: Student[] = students.map((student) => ({
    id: String(student.id),
    name: student.name,
    specialization: student.user_profile?.expertise || "Student",
    email: student.email,
    enrolledCourses: student.enrolled_courses_count || 0,
    status: student.is_active ? "Active" : "Inactive",
    avatar:
      student.user_profile?.avatar ||
      "https://images.unsplash.com/photo-1494790108755-2616b612b047",
  }));

  const handleViewDetails = (studentId: string) => {
    console.log("View details for student:", studentId);
  };

  const handleImportCSV = () => {
    console.log("Import CSV clicked");
  };

  const handleAddStudent = () => {
    console.log("Add student clicked");
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
          title="Students Management"
          subtitle="Manage your students and track their progress"
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
        title="Students Management"
        subtitle="Manage your students and track their progress"
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
                    All Students
                  </h3>
                  <p className="text-brand-light text-sm font-normal">
                    Browse and manage all platform students
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleImportCSV}
                  className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-4 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-semibold">Import CSV</span>
                </button>
                <button
                  onClick={handleAddStudent}
                  className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span className="text-brand-white text-sm font-semibold">
                    Add Student
                  </span>
                </button>
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
                    : "Students will appear here once they register"}
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
      </MentorLayout>
    </MentorRoute>
  );
}
