import { Trophy } from 'lucide-react';
import { getAvatarSrc } from '~/utils/formatters';
import { Image } from '~/components/atoms/Image';

interface CourseCompletionData {
  title: string;
  category: string;
  thumbnail: string;
  mentor: {
    name: string;
    title: string;
    avatar: string;
  };
  stats: {
    lessonsCompleted: string;
    totalDuration: string;
    completionDate: string;
    certificateId: string;
  };
  achievement: string;
}

interface CourseCompletionCardProps {
  courseData: CourseCompletionData;
}

export function CourseCompletionCard({ courseData }: CourseCompletionCardProps) {
  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-12">
      <div className="mb-6">
        {/* Course Layout - Following courses.html structure */}
        <div className="flex gap-4 h-24">
          {/* Course Thumbnail */}
          <div className="w-36 h-24 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden rounded-[12px] flex-shrink-0">
            <Image
              src={courseData.thumbnail}
              alt={courseData.title}
              className="w-full h-full object-cover rounded-[12px]"
              imageType="course"
              identifier={courseData.title}
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center h-24">
            <div>
              {/* Course Name */}
              <h3 className="text-brand-dark text-xl font-bold leading-tight text-left mb-1">
                {courseData.title}
              </h3>

              {/* Course Category */}
              <div className="text-left">
                <span className="text-sm text-gray-600">{courseData.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mentor Info */}
        <div className="flex items-center gap-2 mb-3 mt-4">
          <img
            src={getAvatarSrc(courseData.mentor.avatar, courseData.mentor.name)}
            alt={courseData.mentor.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(courseData.mentor.name)}&background=random`;
            }}
          />
          <div className="text-sm text-left">
            <div className="text-brand-dark font-medium">{courseData.mentor.name}</div>
            <div className="text-gray-500">{courseData.mentor.title}</div>
          </div>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="text-left">
          <p className="text-brand-light text-sm font-medium mb-1">Lessons Completed</p>
          <p className="text-brand-dark text-base font-semibold">{courseData.stats.lessonsCompleted}</p>
        </div>
        <div className="text-left">
          <p className="text-brand-light text-sm font-medium mb-1">Total Duration</p>
          <p className="text-brand-dark text-base font-semibold">{courseData.stats.totalDuration}</p>
        </div>
        <div className="text-left">
          <p className="text-brand-light text-sm font-medium mb-1">Completion Date</p>
          <p className="text-brand-dark text-base font-semibold">{courseData.stats.completionDate}</p>
        </div>
        <div className="text-left">
          <p className="text-brand-light text-sm font-medium mb-1">Certificate ID</p>
          <p className="text-brand-dark text-base font-semibold">{courseData.stats.certificateId}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#DCDEDD]">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-brand-light text-sm font-medium">
            Achievement unlocked: {courseData.achievement}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-600 text-sm font-semibold">Completed</span>
        </div>
      </div>
    </div>
  );
}