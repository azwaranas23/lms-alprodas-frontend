import { Tag, BookOpen } from 'lucide-react';
import { Image } from '~/components/atoms/Image';

interface Course {
  id: number;
  title: string;
  price: number;
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

export function LatestCourses({ courses, onCourseDetails }: LatestCoursesProps) {
  const handleDetailsClick = (id: number) => {
    if (onCourseDetails) {
      onCourseDetails(id.toString());
    }
  };

  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-brand-dark text-lg font-bold">Latest Courses Added</h3>
      </div>
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="flex items-center gap-3">
            <Image
              src={course.image}
              alt={course.title}
              className="w-24 h-16 rounded-lg object-cover"
              imageType="course"
              identifier={course.id.toString()}
            />
            <div className="flex-1">
              <div className="mb-1">
                <p className="text-brand-dark text-lg font-bold">{course.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <p className="text-brand-dark text-sm font-normal">{course.subject.name}</p>
                <BookOpen className="w-4 h-4 text-gray-500" />
                <p className="text-brand-dark text-sm font-normal">
                  {course.total_lessons} Lessons
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDetailsClick(course.id)}
              className="btn-details border border-[#DCDEDD] rounded-xl hover:ring-2 hover:ring-[#0C51D9] hover:text-[#0C51D9] transition-all duration-300 py-[14px] px-5 flex items-center justify-center"
            >
              <span className="text-brand-dark text-base font-medium">Details</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}