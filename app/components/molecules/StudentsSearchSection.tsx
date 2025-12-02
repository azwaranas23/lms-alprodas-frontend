import { Search } from 'lucide-react';

interface StudentsSearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function StudentsSearchSection({ searchTerm, onSearchChange }: StudentsSearchSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
            placeholder="Search students by name, course, email..."
          />
        </div>
      </div>
    </div>
  );
}