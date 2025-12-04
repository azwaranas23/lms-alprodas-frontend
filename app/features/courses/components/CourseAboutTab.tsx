// app/features/courses/components/CourseAboutTab.tsx
import type { Course } from "~/types/courses";
import { Check } from "lucide-react";

interface CourseAboutTabProps {
  course: Course;
}

export function CourseAboutTab({ course }: CourseAboutTabProps) {
  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-8">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">
        About This Course
      </h2>

      <div className="prose prose-lg max-w-none mb-8">
        <p className="text-brand-light leading-relaxed mb-4">
          {course.description}
        </p>
        {course.about && (
          <p className="text-brand-light leading-relaxed mb-4">
            {course.about}
          </p>
        )}
      </div>

      <h3 className="text-xl font-bold text-brand-dark mb-4">
        What You'll Learn
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {course.key_points?.map((keyPoint) => (
          <div key={keyPoint.id} className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-brand-light">{keyPoint.key_point}</span>
          </div>
        ))}
      </div>

      {course.personas && course.personas.length > 0 && (
        <>
          <h3 className="text-xl font-bold text-brand-dark mb-4">
            Who This Course Is For
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {course.personas.map((persona) => (
              <div key={persona.id} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-brand-light">{persona.persona}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
