import { Layers, BookOpen, Clock, Users, Calendar } from "lucide-react";
import type { ReactNode } from "react";

interface LessonFormHeaderProps {
  readonly title: string;
  readonly orderIndex: number;
  readonly lessonsCount: number;
  readonly durationText: string;
  readonly actionText: string;
  readonly metadataList?: Array<{
    readonly icon: ReactNode;
    readonly text: string;
  }>;
}

export function LessonFormHeader({
  title,
  orderIndex,
  lessonsCount,
  durationText,
  actionText,
  metadataList,
}: Readonly<LessonFormHeaderProps>) {
  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-16 bg-orange-50 rounded-[16px] flex items-center justify-center">
            <Layers className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-brand-dark text-3xl font-extrabold">
              {title}
            </h1>
            <span className="px-3 py-1 rounded-md text-sm font-semibold bg-[#FEF3C7] text-[#92400E]">
              Section No. {orderIndex}
            </span>
          </div>
          <div className="flex items-center gap-6 text-base text-gray-600">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{lessonsCount} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{durationText}</span>
            </div>
            {metadataList ? (
              metadataList.map((meta) => (
                <div key={meta.text} className="flex items-center gap-2">
                  {meta.icon}
                  <span>{meta.text}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Course section</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{actionText}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
