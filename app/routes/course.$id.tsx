import type { Route } from "./+types/course.$id";
import { Navbar } from "~/components/organisms/Navbar";
import { CourseHeroSection } from "~/features/courses/components/CourseHeroSection";
import { CourseContentSection } from "~/features/courses/components/CourseContentSection";
import { Footer } from "~/components/pages/home/Footer";

export default function CourseDetail({ params }: Route.ComponentProps) {
  const courseId = parseInt(params.id);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar />
      <CourseHeroSection courseId={courseId} />
      <CourseContentSection courseId={courseId} />
      <Footer />
    </div>
  );
}
