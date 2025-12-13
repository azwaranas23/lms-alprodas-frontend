import { useState } from "react";
import type { Route } from "./+types/mentors";
import { Layout } from "~/components/templates/Layout";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import { MentorGrid } from "~/features/mentors/components/MentorGrid";
import { Pagination } from "~/components/molecules/Pagination";
import { useMentors } from "~/hooks/api/useUsers";
import { BASE_URL } from "~/constants/api";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Mentors Management - Alprodas LMS" },
    {
      name: "description",
      content: "Manage platform mentors and track their performance",
    },
  ];
}

export default function Mentors() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("8");

  // Fetch mentors data from API with pagination and search
  const { data: mentorsData, isLoading } = useMentors({
    page,
    search,
    limit: parseInt(itemsPerPage),
  });

  const mentors = mentorsData?.data?.items || [];
  const meta = mentorsData?.data?.meta || {
    total: 0,
    page: 1,
    per_page: 8,
    total_pages: 1,
  };

  // Transform API data to match MentorGrid component format
  const displayMentors = mentors.map((mentor) => ({
    id: String(mentor.id),
    name: mentor.name,
    specialization: mentor.user_profile?.expertise || "Mentor",
    avatar:
      mentor.user_profile?.avatar ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    status: mentor.is_active ? ("Active" as const) : ("Inactive" as const),
    level: "Senior" as const,
    earnings: `Rp ${mentor.total_revenue?.toLocaleString("id-ID") || 0}`,
    courseCount: mentor.created_courses_count || 0,
    email: mentor.email,
  }));

  const handleMentorClick = (id: string) => {
    // Navigate to mentor detail page - could use navigate(`/dashboard/mentors/${id}`)
  };

  const handleAddMentor = () => {
    // Navigate to add mentor page - could use navigate('/dashboard/mentors/add')
  };

  const handleImportCSV = () => {
    // Handle CSV import - could trigger file input dialog
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (items: string) => {
    setItemsPerPage(items);
    setPage(1);
  };

  return (
    <PermissionRoute requiredPermission="mentors.read">
      <Layout
        title="Mentors Management"
        subtitle="Manage platform mentors and track their performance"
      >
        <main className="main-content flex-1 overflow-auto p-5">
          <div className="space-y-6">
            <MentorGrid
              mentors={displayMentors}
              onMentorClick={handleMentorClick}
              onAddMentor={handleAddMentor}
              onImportCSV={handleImportCSV}
            />

            <Pagination
              currentPage={page}
              totalPages={meta.total_pages}
              itemsPerPage={parseInt(itemsPerPage)}
              onPageChange={handlePageChange}
              onItemsPerPageChange={(items) =>
                handleItemsPerPageChange(items.toString())
              }
              itemType="mentors"
              showItemsPerPage={true}
              itemsPerPageOptions={[8, 16, 24, 32]}
            />
          </div>
        </main>
      </Layout>
    </PermissionRoute>
  );
}
