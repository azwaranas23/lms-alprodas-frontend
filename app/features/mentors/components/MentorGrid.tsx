import { Search, Upload, Plus } from 'lucide-react';
import { MentorCard } from './MentorCard';

interface Mentor {
  id: string;
  name: string;
  specialization: string;
  avatar: string;
  status: 'Active' | 'Inactive';
  level: 'Expert' | 'Senior' | 'Intermediate';
  earnings: string;
  courseCount: number;
  email: string;
}

interface MentorGridProps {
  mentors: Mentor[];
  onMentorClick?: (id: string) => void;
  onAddMentor?: () => void;
  onImportCSV?: () => void;
}

export function MentorGrid({ mentors, onMentorClick, onAddMentor, onImportCSV }: MentorGridProps) {

  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14C16.4183 14 20 17.5817 20 22H4C4 17.5817 7.58172 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 3L22 8M22 8L17 13M22 8H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-brand-dark text-xl font-bold">All Mentors</h3>
            <p className="text-brand-light text-sm font-normal">Browse and manage all platform mentors</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onImportCSV}
            className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-4 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-semibold">Import CSV</span>
          </button>
          <button 
            onClick={onAddMentor}
            className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="text-brand-white text-sm font-semibold">Add Mentor</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mentors.map(mentor => (
          <MentorCard
            key={mentor.id}
            {...mentor}
            onClick={onMentorClick}
          />
        ))}
      </div>
    </div>
  );
}