import type { JSX } from "react";
import { Star, Users, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import type { Course } from "../../types/courses";
import { Button } from "../atoms/Button";
import { Card } from "../molecules/Card";
import { formatCurrency } from "../../utils/formatters";
import { Image } from "../atoms/Image";
import { Avatar } from "../atoms/Avatar";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps): JSX.Element {
  const getTotalDuration = (sections: typeof course.sections) => {
    if (!sections || sections.length === 0) return "0 hours";
    let totalMinutes = 0;
    sections.forEach((section) => {
      section.lessons.forEach((lesson) => {
        totalMinutes += lesson.duration_minutes;
      });
    });
    const hours = Math.floor(totalMinutes / 60);
    return `${hours} hours`;
  };

  return (
    <Card hover className="p-6">
      <div className="mb-4">
        <div className="w-full h-48 relative overflow-hidden rounded-[12px] mb-4">
          <Image
            src={course.images?.[0]?.image_path}
            alt={course.title}
            className="w-full h-full object-cover rounded-[12px]"
            imageType="course"
            identifier={course.id.toString()}
          />
          {/* Enrolled Badge */}
          {course.is_enrolled && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Enrolled
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-brand-dark text-lg font-bold leading-tight">
            {course.title}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-gray-700">5.0</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {course.total_students} students
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {getTotalDuration(course.sections)}
            </span>
          </div>
        </div>
        {course.mentor && (
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              src={course.mentor.profile?.avatar || undefined}
              name={course.mentor.name}
              size="sm"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {course.mentor.name}
              </p>
              <p className="text-xs text-gray-500">
                {course.mentor.profile?.expertise}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 w-full">
        <Link to={`/course/${course.id}`} className="w-full block">
          <Button
            variant="primary"
            size="sm"
            className="w-full px-4 py-2 text-center"
          >
            View Course
          </Button>
        </Link>
      </div>
    </Card>
  );
}
