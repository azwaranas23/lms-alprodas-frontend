import { useNavigate } from "react-router";
import { CourseWizard } from "~/features/courses/components/CourseWizard";

export function meta() {
  return [
    { title: "Add Course - Step 1 - Alprodas LMS" },
    { name: "description", content: "Create a new course - Step 1 of 5" },
  ];
}

export default function AddCourse() {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate("/courses/success");
  };

  const handleCancel = () => {
    navigate("/courses");
  };

  return <CourseWizard onComplete={handleComplete} onCancel={handleCancel} />;
}
