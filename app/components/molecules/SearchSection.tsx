import { Search, Layers, CheckCircle, ChevronDown } from 'lucide-react';
import { Select } from '~/components/atoms/Select';

export function SearchSection() {
  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300"
            placeholder="Search courses, students, mentors, subjects..."
          />
        </div>

        {/* Filter and Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Subject Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Layers className="h-4 w-4 text-gray-400" />
            </div>
            <Select
              className="pl-10 pr-8 py-3 rounded-[16px] hover:border-2 focus:border-2"
              options={[
                { value: 'all', label: 'All Subjects' },
                { value: 'web', label: 'Web Development' },
                { value: 'data', label: 'Data Science' },
                { value: 'mobile', label: 'Mobile Development' },
                { value: 'design', label: 'UI/UX Design' }
              ]}
              defaultValue="all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <CheckCircle className="h-4 w-4 text-gray-400" />
            </div>
            <Select
              className="pl-10 pr-8 py-3 rounded-[16px] hover:border-2 focus:border-2"
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'draft', label: 'Draft' }
              ]}
              defaultValue="all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Search Button */}
          <button className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-white" />
            <span className="text-brand-white text-base font-semibold">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}