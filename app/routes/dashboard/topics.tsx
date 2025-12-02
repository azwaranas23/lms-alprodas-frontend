import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Layout } from "~/components/templates/Layout";
import { ManagerRoute } from "~/features/auth/components/RoleBasedRoute";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import { Tag, Search, Upload, Plus, Eye, Edit, Users } from "lucide-react";
import { useTopics } from "~/hooks/api/useTopics";
import { BASE_URL } from "~/constants/api";
import { Button } from "~/components/atoms/Button";
import { Pagination } from "~/components/molecules/Pagination";
import { Tooltip } from "~/components/atoms/Tooltip";
import type { Topic } from "~/types/topics";
import { Image } from "~/components/atoms/Image";

export function meta() {
  return [
    { title: "Topics - LMS Alprodas" },
    {
      name: "description",
      content: "Manage and organize learning topics across the platform",
    },
  ];
}

interface TopicCardProps {
  topic: Topic;
  onEdit: () => void;
  onView: () => void;
}

function TopicCard({ topic, onEdit, onView }: TopicCardProps) {
  const getBadgeClass = (count: number) => {
    const baseClass = "px-2 py-1 rounded-md text-xs font-semibold";
    if (count >= 100) return `${baseClass} badge-expert`;
    if (count >= 50) return `${baseClass} badge-high-performing`;
    if (count >= 25) return `${baseClass} badge-creative`;
    return `${baseClass} badge-intermediate`;
  };

  return (
    <div className="border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4">
      <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden rounded-[12px] mb-4">
        <Image
          src={topic?.image as string}
          alt={topic.name}
          className="w-full h-full object-cover rounded-[12px]"
          imageType="topic"
          identifier={topic.id.toString()}
        />
        <div className="absolute bottom-2 right-2">
          <span className={getBadgeClass(topic.course_count)}>Popular</span>
        </div>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <Tooltip content={topic.name}>
            <h4 className="text-brand-dark text-lg font-bold mb-2 truncate">
              {topic.name}
            </h4>
          </Tooltip>
          <p className="text-brand-light text-sm line-clamp-2 mb-1">
            {topic.description || "No description available"}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>{topic.subject_count} Subjects</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {topic.student_enrollment_count.toLocaleString()} Students
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onView} className="flex-1 px-3 py-2">
          <Eye className="w-4 h-4 text-gray-600" />
          <span className="text-brand-dark text-sm font-semibold">Details</span>
        </Button>
        <Button variant="outline" onClick={onEdit} className="flex-1 px-3 py-2">
          <Edit className="w-4 h-4 text-gray-600" />
          <span className="text-brand-dark text-sm font-semibold">Edit</span>
        </Button>
      </div>
    </div>
  );
}

export default function Topics() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("6");
  const [currentPage, setCurrentPage] = useState(1);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch topics using useTopics hook
  const {
    data: topicsData,
    isLoading,
    error,
  } = useTopics({
    page: currentPage,
    limit: parseInt(itemsPerPage),
    search: debouncedSearchQuery || undefined,
  });

  const topics = topicsData?.data?.items || [];
  const meta = topicsData?.data?.meta || {
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
      <ManagerRoute>
        <PermissionRoute requiredPermission="topics.read">
          <Layout
            title="Topics Management"
            subtitle="Manage and organize learning topics across the platform"
          >
            <div className="flex-1 flex flex-col overflow-hidden">
              <main className="main-content flex-1 overflow-auto p-5">
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Loading topics...</div>
                </div>
              </main>
            </div>
          </Layout>
        </PermissionRoute>
      </ManagerRoute>
    );
  }

  if (error) {
    return (
      <ManagerRoute>
        <PermissionRoute requiredPermission="topics.read">
          <Layout
            title="Topics Management"
            subtitle="Manage and organize learning topics across the platform"
          >
            <div className="flex-1 flex flex-col overflow-hidden">
              <main className="main-content flex-1 overflow-auto p-5">
                <div className="flex items-center justify-center h-64">
                  <div className="text-red-500">Error: {String(error)}</div>
                </div>
              </main>
            </div>
          </Layout>
        </PermissionRoute>
      </ManagerRoute>
    );
  }

  return (
    <ManagerRoute>
      <PermissionRoute requiredPermission="topics.read">
        <Layout
          title="Topics Management"
          subtitle="Manage and organize learning topics across the platform"
        >
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="main-content flex-1 overflow-auto p-5">
              <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                      <Tag className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-brand-dark text-xl font-bold">
                        All Topics
                      </h3>
                      <p className="text-brand-light text-sm font-normal">
                        Browse and manage all learning topics
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
                      onClick={() => navigate("/dashboard/topics/add")}
                      className="px-4 py-3"
                    >
                      <Plus className="w-4 h-4 text-white" />
                      <span className="text-brand-white text-sm font-semibold">
                        Add Topic
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
                        placeholder="Search topics..."
                      />
                    </div>
                  </div>
                </div>

                {/* Topics Grid */}
                {topics.length === 0 ? (
                  <div className="text-center py-12">
                    <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No topics found
                    </h3>
                    <p className="text-gray-500">
                      {searchQuery
                        ? "Try adjusting your search criteria"
                        : "Topics will appear here once they are created"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        onEdit={() =>
                          navigate(`/dashboard/topics/edit/${topic.id}`)
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
                  itemType="topics"
                  showItemsPerPage={true}
                />
              </div>
            </main>
          </div>
        </Layout>
      </PermissionRoute>
    </ManagerRoute>
  );
}
