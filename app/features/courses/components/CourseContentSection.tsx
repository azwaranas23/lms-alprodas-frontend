import { useState, useEffect } from "react";
import { Star, Users, Clock } from "lucide-react";

import { CourseEnrollmentCard } from "./CourseEnrollmentCard";
import { coursesService } from "~/services/courses.service";
import type { Course } from "~/types/courses";
import { getAvatarSrc } from "~/utils/formatters";
import { CourseTabs } from "./CourseTabs"; // <-- IMPORT BARU

interface CourseContentSectionProps {
  courseId: number;
}

export function CourseContentSection({ courseId }: CourseContentSectionProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch course detail
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await coursesService.getCourseDetail(courseId);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  const getTotalDuration = (sections: Course["sections"]) => {
    if (!sections || sections.length === 0) return "0 hours";
    let totalMinutes = 0;
    sections.forEach((section) => {
      section.lessons.forEach((lesson) => {
        totalMinutes += lesson.duration_minutes;
      });
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded mb-8"></div>
                <div className="h-12 bg-gray-200 rounded mb-6"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Course not found
            </h2>
            <p className="text-gray-600">
              The course you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">
                {course.title}
              </h1>

              {/* Course Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-brand-dark font-semibold">5.0</span>
                  <span className="text-gray-600">(2,340 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">
                    {course.total_students} students enrolled
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">
                    {getTotalDuration(course.sections)} of content
                  </span>
                </div>
              </div>

              {/* Instructor Info */}
              {course.mentor && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[16px]">
                  <img
                    src={getAvatarSrc(
                      course.mentor.profile?.avatar,
                      course.mentor.name
                    )}
                    alt={course.mentor.name}
                    onError={(e) => {
                      e.currentTarget.src = getAvatarSrc(
                        undefined,
                        course.mentor?.name || ""
                      );
                    }}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-brand-dark text-lg font-bold">
                      {course.mentor.name}
                    </h3>
                    <p className="text-brand-light text-sm">
                      {course.mentor.profile?.expertise}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs + Tab Content */}
            <CourseTabs course={course} courseId={courseId} />
          </div>

          {/* Floating Enrollment Card */}
          <div className="lg:col-span-1">
            <CourseEnrollmentCard courseId={courseId} course={course} />
          </div>
        </div>
      </div>
    </section>
  );
}
