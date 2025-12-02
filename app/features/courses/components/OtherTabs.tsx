import {
  Calendar,
  Clock,
  Download,
  Eye,
  Folder,
  Trophy,
  Users,
  Wrench
} from 'lucide-react';
import { Avatar } from '~/components/atoms/Avatar';

interface Course {
  tools?: string;
  total_students?: number;
}

interface OtherTabsProps {
  course: Course;
  activeTab: string;
}

export function OtherTabs({ course, activeTab }: OtherTabsProps) {
  if (activeTab === 'resources') {
    return (
      <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-brand-dark text-xl font-bold mb-2">Course Resources</h3>
          <p className="text-brand-light text-base">Manage downloadable files, documents, and course materials</p>
        </div>
      </div>
    );
  }

  if (activeTab === 'rewards') {
    return (
      <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-brand-dark text-xl font-bold mb-2">Rewards & Achievements</h3>
          <p className="text-brand-light text-base">Set up badges, certificates, and student achievements</p>
        </div>
      </div>
    );
  }

  if (activeTab === 'tools') {
    // Parse tools from comma-separated string
    const getToolsArray = () => {
      if (!course.tools) return [];
      return course.tools.split(',').map(tool => tool.trim()).filter(tool => tool.length > 0);
    };

    const toolsArray = getToolsArray();

    return (
      <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-brand-dark text-xl font-bold mb-2">Course Tools</h3>

          {toolsArray.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {toolsArray.map((tool, index) => (
                <span key={index} className="badge-expert px-3 py-1 rounded-md text-sm font-semibold bg-blue-100 text-blue-800">
                  {tool}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-brand-light text-base">Manage course tools, software requirements, and learning resources</p>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'students') {
    return (
      <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-lg font-bold">Recent Students</h3>
              <p className="text-brand-light text-sm">Latest course enrollments</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-4 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-semibold">View All</span>
            </button>
            <button className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-white" />
              <span className="text-brand-white text-sm font-semibold">Export List</span>
            </button>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Student 1 */}
          <div className="border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4">
            <div className="flex flex-col items-center mb-3">
              <div className="relative mb-3">
                <Avatar
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
                  name="Alex Chen"
                  size="xl"
                />
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-[#F0FDF4] text-[#166534]">Active</span>
              </div>
            </div>
            <div className="text-center mb-3">
              <h4 className="text-brand-dark text-base font-bold">Alex Chen</h4>
              <p className="text-brand-light text-sm">Student</p>
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Enrolled Jan 15, 2024</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Progress: 75%</span>
              </div>
            </div>
            <button className="w-full border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-2 flex items-center justify-center gap-2">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-brand-dark text-sm font-semibold">View Progress</span>
            </button>
          </div>

          {/* Student 2 */}
          <div className="border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4">
            <div className="flex flex-col items-center mb-3">
              <div className="relative mb-3">
                <Avatar
                  src="https://images.unsplash.com/photo-1494790108755-2616c4e640c2"
                  name="Sarah Williams"
                  size="xl"
                />
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-[#F0FDF4] text-[#166534]">Active</span>
              </div>
            </div>
            <div className="text-center mb-3">
              <h4 className="text-brand-dark text-base font-bold">Sarah Williams</h4>
              <p className="text-brand-light text-sm">Student</p>
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Enrolled Jan 12, 2024</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Progress: 92%</span>
              </div>
            </div>
            <button className="w-full border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-2 flex items-center justify-center gap-2">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-brand-dark text-sm font-semibold">View Progress</span>
            </button>
          </div>

          {/* Student 3 */}
          <div className="border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4">
            <div className="flex flex-col items-center mb-3">
              <div className="relative mb-3">
                <Avatar
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  name="Michael Johnson"
                  size="xl"
                />
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-[#F0FDF4] text-[#166534]">Active</span>
              </div>
            </div>
            <div className="text-center mb-3">
              <h4 className="text-brand-dark text-base font-bold">Michael Johnson</h4>
              <p className="text-brand-light text-sm">Student</p>
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Enrolled Jan 10, 2024</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Progress: 58%</span>
              </div>
            </div>
            <button className="w-full border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-2 flex items-center justify-center gap-2">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-brand-dark text-sm font-semibold">View Progress</span>
            </button>
          </div>

          {/* Student 4 */}
          <div className="border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4">
            <div className="flex flex-col items-center mb-3">
              <div className="relative mb-3">
                <Avatar
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
                  name="Emma Davis"
                  size="xl"
                />
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-[#F0FDF4] text-[#166534]">Active</span>
              </div>
            </div>
            <div className="text-center mb-3">
              <h4 className="text-brand-dark text-base font-bold">Emma Davis</h4>
              <p className="text-brand-light text-sm">Student</p>
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Enrolled Jan 8, 2024</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Progress: 83%</span>
              </div>
            </div>
            <button className="w-full border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-2 flex items-center justify-center gap-2">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-brand-dark text-sm font-semibold">View Progress</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}