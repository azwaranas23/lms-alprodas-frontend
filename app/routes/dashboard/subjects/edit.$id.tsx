import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { SubjectForm } from "~/features/subjects/components/SubjectForm";
import { Layout } from "~/components/templates/Layout";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import { subjectsService, type Subject } from "~/services/subjects.service";

export function meta() {
  return [
    { title: "Edit Subject - Alprodas LMS" },
    {
      name: "description",
      content: "Edit an existing learning subject",
    },
  ];
}

export default function EditSubject() {
  const { id } = useParams();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backButton = {
    to: "/dashboard/subjects",
    label: "Back",
  };

  useEffect(() => {
    const fetchSubject = async () => {
      if (!id) {
        setError("Subject ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const subjectData = await subjectsService.getSubjectById(parseInt(id));
        setSubject(subjectData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching subject:", err);
        setError(err.response?.data?.message || "Failed to fetch subject");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id]);

  if (loading) {
    return (
      <PermissionRoute requiredPermission="subjects.update">
        <Layout
          title="Edit Subject"
          subtitle="Update an existing learning subject"
          backButton={backButton}
        >
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="main-content flex-1 overflow-auto p-5">
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading subject...</div>
              </div>
            </main>
          </div>
        </Layout>
      </PermissionRoute>
    );
  }

  if (error || !subject) {
    return (
      <PermissionRoute requiredPermission="subjects.update">
        <Layout
          title="Edit Subject"
          subtitle="Update an existing learning subject"
          backButton={backButton}
        >
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="main-content flex-1 overflow-auto p-5">
              <div className="flex items-center justify-center h-64">
                <div className="text-red-500">
                  Error: {error || "Subject not found"}
                </div>
              </div>
            </main>
          </div>
        </Layout>
      </PermissionRoute>
    );
  }

  return (
    <PermissionRoute requiredPermission="subjects.update">
      <Layout
        title="Edit Subject"
        subtitle="Update an existing learning subject"
        backButton={backButton}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="main-content flex-1 overflow-auto p-5">
            <SubjectForm mode="edit" initialData={subject} />
          </main>
        </div>
      </Layout>
    </PermissionRoute>
  );
}
