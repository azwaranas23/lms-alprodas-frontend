import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Layout } from "~/components/templates/Layout";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import { Layers, Search, Upload, Plus } from "lucide-react";
import { SubjectCard } from "~/features/subjects/components/SubjectCard";
import { useSubjects } from "~/hooks/api/useSubjects";
import { Button } from "~/components/atoms/Button";
import { Input } from "~/components/atoms/Input";
import { Pagination } from "~/components/molecules/Pagination";
import type { Subject } from "~/services/subjects.service";

export function meta() {
  return [
    { title: "Subjects - LMS Alprodas" },
    {
      name: "description",
      content: "Manage and organize learning subjects across the platform",
    },
  ];
}

export default function Subjects() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("6");
  const [currentPage, setCurrentPage] = useState(1);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch subjects using useSubjects hook
  const {
    data: subjectsData,
    isLoading,
    error,
  } = useSubjects({
    page: currentPage,
    limit: parseInt(itemsPerPage),
    search: debouncedSearchQuery || undefined,
  });

  const subjects = subjectsData?.items || [];
  const meta = subjectsData?.meta || {
    total: 0,
    page: 1,
    per_page: 6,
    total_pages: 0,
  };

  // Handle search with debounce
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to update debounced query
    timeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(query);
    }, 500); // 500ms debounce
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: string) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <PermissionRoute requiredPermission="subjects.read">
        <Layout
          title="Subjects Management"
          subtitle="Manage and organize learning subjects across the platform"
        >
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="main-content flex-1 overflow-auto p-5">
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading subjects...</div>
              </div>
            </main>
          </div>
        </Layout>
      </PermissionRoute>
    );
  }

  if (error) {
    return (
      <PermissionRoute requiredPermission="subjects.read">
        <Layout
          title="Subjects Management"
          subtitle="Manage and organize learning subjects across the platform"
        >
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="main-content flex-1 overflow-auto p-5">
              <div className="flex items-center justify-center h-64">
                <div className="text-red-500">
                  Error: {error?.message || "An error occurred"}
                </div>
              </div>
            </main>
          </div>
        </Layout>
      </PermissionRoute>
    );
  }

  return (
    <PermissionRoute requiredPermission="subjects.read">
      <Layout
        title="Subjects Management"
        subtitle="Manage and organize learning subjects across the platform"
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="main-content flex-1 overflow-auto p-5">
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                    <Layers className="w-6 h-6 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="text-brand-dark text-xl font-bold">
                      All Subjects
                    </h3>
                    <p className="text-brand-light text-sm font-normal">
                      Browse and manage all learning subjects
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="py-3 px-4">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-semibold">Import CSV</span>
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/dashboard/subjects/add")}
                    className="px-4 py-3"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-brand-white text-sm font-semibold">
                      Add Subject
                    </span>
                  </Button>
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
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                      placeholder="Search subjects..."
                    />
                  </div>
                </div>
              </div>

              {/* Subjects Grid */}
              {subjects.length === 0 ? (
                <div className="text-center py-12">
                  <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No subjects found
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : "Subjects will appear here once they are created"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {subjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      onEdit={() =>
                        navigate(`/dashboard/subjects/edit/${subject.id}`)
                      }
                      onView={() => {}}
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
                itemType="subjects"
                showItemsPerPage={true}
              />
            </div>
          </main>
        </div>
      </Layout>
    </PermissionRoute>
  );
}
