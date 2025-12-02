import { BookOpen, Mail, Eye } from 'lucide-react';
import { getAvatarSrc } from '~/utils/formatters';
import { Tooltip } from '~/components/atoms/Tooltip';

export type StudentStatus = 'Active' | 'Inactive' | 'Graduated';

export interface Student {
  id: string;
  name: string;
  specialization: string;
  email: string;
  enrolledCourses: number;
  status: StudentStatus;
  avatar: string;
}

interface StudentCardProps {
  student: Student;
  onViewDetails: (studentId: string) => void;
}

const getStatusStyle = (status: StudentStatus) => {
  switch (status) {
    case 'Active':
      return 'bg-[#F0FDF4] text-[#166534]';
    case 'Inactive':
      return 'bg-[#FEF2F2] text-[#DC2626]';
    case 'Graduated':
      return 'bg-[#EBF8FF] text-[#1E40AF]';
    default:
      return 'bg-[#F0FDF4] text-[#166534]';
  }
};

export function StudentCard({ student, onViewDetails }: StudentCardProps) {
  return (
    <div className="border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4">
      <div className="flex flex-col items-center mb-3">
        <div className="relative">
          <img
            src={getAvatarSrc(student.avatar, student.name)}
            alt={student.name}
            className="w-20 h-20 rounded-full object-cover mb-3"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getAvatarSrc(undefined, student.name);
            }}
          />
          <span className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-md text-xs font-semibold ${getStatusStyle(student.status)}`}>
            {student.status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-left flex-1 min-w-0">
          <Tooltip content={student.name}>
            <h4 className="text-[#0C1C3C] font-['Plus_Jakarta_Sans'] text-[16px] font-bold truncate">
              {student.name}
            </h4>
          </Tooltip>
          <Tooltip content={student.specialization}>
            <p className="mt-1 text-[#6B7280] font-['Plus_Jakarta_Sans'] text-[14px] font-normal truncate">
              {student.specialization}
            </p>
          </Tooltip>
        </div>
      </div>

      <div className="border-b border-[#DCDEDD] mb-3"></div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{student.enrolledCourses} Enrolled</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
          <Tooltip content={student.email} className="flex-1 min-w-0">
            <span className="truncate block">{student.email}</span>
          </Tooltip>
        </div>
      </div>

      <button
        onClick={() => onViewDetails(student.id)}
        className="w-full border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-3 flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4 text-gray-600" />
        <span className="text-brand-dark text-sm font-semibold">Details</span>
      </button>
    </div>
  );
}