import { PlusCircle, Users, User, Settings } from "lucide-react";

interface MentorQuickActionsProps {
  onCreateCourse: () => void;
  // tetap pakai nama lama demi kompatibilitas,
  // tapi sekarang maknanya "View Students"
  onRequestWithdrawal?: () => void;
  onViewProfile: () => void;
  onAccountSettings: () => void;
}

export function MentorQuickActions({
  onCreateCourse,
  onRequestWithdrawal,
  onViewProfile,
  onAccountSettings,
}: MentorQuickActionsProps) {
  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 flex flex-col justify-between h-full">
      <div className="mb-4">
        <h3 className="text-brand-dark text-lg font-bold mb-1">
          Quick Actions
        </h3>
        <p className="text-brand-light text-sm">
          Shortcuts to manage your teaching activities
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onCreateCourse}
          className="w-full flex items-center justify-between px-4 py-3 rounded-[12px] bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-md font-semibold text-brand-dark">
                Create Course
              </span>
              <span className="text-sm text-brand-light">
                Start a new learning experience
              </span>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={onRequestWithdrawal}
          disabled={!onRequestWithdrawal}
          className="w-full flex items-center justify-between px-4 py-3 rounded-[12px] border border-[#DCDEDD] hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-md font-semibold text-brand-dark">
                View Students
              </span>
              <span className="text-sm text-brand-light">
                See all learners in your courses
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
