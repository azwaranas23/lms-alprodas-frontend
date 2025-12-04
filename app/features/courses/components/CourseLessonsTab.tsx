// app/features/courses/components/CourseLessonsTab.tsx
import type { Course } from "~/types/courses";
import { Play, FileText } from "lucide-react";

interface CourseLessonsTabProps {
  course: Course;
}

export function CourseLessonsTab({ course }: CourseLessonsTabProps) {
  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-8">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">
        Course Curriculum
      </h2>

      {course.sections?.map((section, sectionIndex) => (
        <div
          key={section.id}
          className={`border border-[#DCDEDD] rounded-[16px] ${
            sectionIndex < (course.sections?.length || 0) - 1 ? "mb-4" : ""
          }`}
        >
          <div className="p-6 border-b border-[#DCDEDD] bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-dark">
                Section {section.order_index}: {section.title}
              </h3>
              <span className="text-sm text-gray-600">
                {section.total_lessons} lessons •{" "}
                {(() => {
                  const totalMinutes = section.lessons.reduce(
                    (total, lesson) => total + lesson.duration_minutes,
                    0
                  );
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;
                  return minutes > 0
                    ? `${hours}.${Math.round((minutes / 60) * 10)} hours`
                    : `${hours} hours`;
                })()}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {section.lessons && section.lessons.length > 0 ? (
              section.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    {lesson.content_type === "VIDEO" ? (
                      <Play className="w-5 h-5 text-blue-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-green-600" />
                    )}
                    <span className="text-brand-dark">{lesson.title}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.floor(lesson.duration_minutes / 60) > 0
                      ? `${Math.floor(lesson.duration_minutes / 60)}:${(
                          lesson.duration_minutes % 60
                        )
                          .toString()
                          .padStart(2, "0")}`
                      : `${lesson.duration_minutes}:00`}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-4 text-center">
                <span className="text-gray-500 text-sm">
                  No lessons available
                </span>
              </div>
            )}
          </div>
        </div>
      ))}

      {(!course.sections || course.sections.length === 0) && (
        <div className="text-center py-8">
          <p className="text-gray-500">No curriculum available yet.</p>
        </div>
      )}
    </div>
  );
}
