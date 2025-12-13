import { useEffect, useState, type JSX } from "react";
import { Navbar } from "~/components/organisms/Navbar";
import { Footer } from "~/components/pages/home/Footer";
import { coursesService } from "~/services/courses.service";
import type { Course } from "~/types/courses";
import { CourseCard } from "~/components/organisms/CourseCard";

export function meta() {
  return [
    { title: "All Courses - Alprodas LMS" },
    {
      name: "description",
      content:
        "Explore all available courses on Alprodas LMS and start your learning journey today.",
    },
  ];
}

export default function CoursesPage(): JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await coursesService.getCourses({
          page: 1,
          limit: 30,
        } as any);
        setCourses(res.data.items);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12 md:mb-12">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#151515]">
                All Courses
              </h1>
              <p className="mt-2 text-sm md:text-base lg:text-lg text-[#6B6B6B] max-w-2xl">
                Explore all available courses on Alprodas LMS and start your
                learning journey today.
              </p>
            </div>

            {/* Loading state */}
            {loading && (
              <p className="text-sm md:text-base text-[#6B6B6B]">
                Loading courses...
              </p>
            )}

            {/* Empty state */}
            {!loading && courses.length === 0 && (
              <p className="text-sm md:text-base text-[#6B6B6B]">
                No courses available at the moment.
              </p>
            )}

            {/* Courses grid */}
            {!loading && courses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
