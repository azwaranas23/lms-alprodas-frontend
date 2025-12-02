import { Mail, Banknote, BookOpen, Eye } from 'lucide-react';
import { getAvatarSrc } from '~/utils/formatters';
import { Tooltip } from '~/components/atoms/Tooltip';

interface MentorCardProps {
  id: string;
  name: string;
  specialization: string;
  avatar: string;
  status: 'Active' | 'Inactive';
  level: 'Expert' | 'Senior' | 'Intermediate';
  earnings: string;
  courseCount: number;
  email: string;
  onClick?: (id: string) => void;
}

const levelStyles = {
  Expert: 'bg-[#EBF8FF] text-[#1E40AF]',
  Senior: 'bg-[#FEF3C7] text-[#D97706]',
  Intermediate: 'bg-[#F3E8FF] text-[#7C3AED]',
};

const statusStyles = {
  Active: 'bg-[#F0FDF4] text-[#166534]',
  Inactive: 'bg-[#FEF2F2] text-[#DC2626]',
};

export function MentorCard({
  id,
  name,
  specialization,
  avatar,
  status,
  level,
  earnings,
  courseCount,
  email,
  onClick
}: MentorCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div className="border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4">
      <div className="flex flex-col items-center mb-3">
        <div className="relative">
          <img
            src={getAvatarSrc(avatar, name)}
            alt={name}
            className="w-20 h-20 rounded-full object-cover mb-3"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getAvatarSrc(undefined, name);
            }}
          />
          <span
            className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-md text-xs font-semibold ${statusStyles[status]}`}
          >
            {status}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="text-left flex-1 min-w-0 mr-2">
          <Tooltip content={name}>
            <h4 className="text-[#0C1C3C] font-['Plus_Jakarta_Sans'] text-[16px] font-bold truncate">
              {name}
            </h4>
          </Tooltip>
          <Tooltip content={specialization}>
            <p className="mt-1 text-[#6B7280] font-['Plus_Jakarta_Sans'] text-[14px] font-normal truncate">
              {specialization}
            </p>
          </Tooltip>
        </div>
        <span className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${levelStyles[level]}`}>
          {level}
        </span>
      </div>

      <div className="border-b border-[#DCDEDD] mb-3"></div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
          <Banknote className="w-3.5 h-3.5 flex-shrink-0" />
          <Tooltip content={earnings} className="flex-1 min-w-0">
            <span className="truncate block">{earnings}</span>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{courseCount} Courses</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
          <Tooltip content={email} className="flex-1 min-w-0">
            <span className="truncate block">{email}</span>
          </Tooltip>
        </div>
      </div>
      
      <button
        onClick={handleClick}
        className="w-full border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-3 flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4 text-gray-600" />
        <span className="text-brand-dark text-sm font-semibold">Details</span>
      </button>
    </div>
  );
}