import { Tag, BookOpen } from "lucide-react";
import { Image } from "~/components/atoms/Image";

interface Course {
  id: number;
  title: string;
  status: string;
  total_lessons: number;
  created_at: string;
  image: string;
  subject: {
    id: number;
    name: string;
  };
}

interface LatestCoursesProps {
  courses: Course[];
  onCourseDetails?: (id: string) => void;
}

export function LatestCourses({
  courses,
  onCourseDetails,
}: LatestCoursesProps) {
  const handleDetailsClick = (id: number) => {
    onCourseDetails?.(id.toString());
  };

  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-5">
      <div className="mb-4">
        <h3 className="text-brand-dark text-lg font-bold">
          Latest Courses Added
        </h3>
      </div>

      {/* GRID CARD */}
      <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="
              border border-[#DCDEDD]
              rounded-2xl
              p-4
              flex flex-col
              hover:border-[#0C51D9]
              hover:shadow-md
              transition-all duration-300
            "
          >
            {/* IMAGE */}
            <Image
              src={course.image}
              alt={course.title}
              imageType="course"
              identifier={course.id.toString()}
              className="w-full h-40 rounded-xl object-cover mb-3"
            />

            {/* CONTENT */}
            <div className="flex-1">
              <p className="text-brand-dark text-base font-bold leading-snug mb-2">
                {course.title}
              </p>

              <div className="flex flex-col gap-1 text-sm text-brand-dark">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span>{course.subject.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span>{course.total_lessons} Lessons</span>
                </div>
              </div>
            </div>

            {/* ACTION */}
            <button
              onClick={() => handleDetailsClick(course.id)}
              className="
                mt-4
                btn-details
                border border-[#DCDEDD]
                rounded-xl
                py-3
                flex items-center justify-center
                hover:ring-2 hover:ring-[#0C51D9]
                hover:text-[#0C51D9]
                transition-all duration-300
              "
            >
              <span className="text-brand-dark text-sm font-medium">
                Details
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
