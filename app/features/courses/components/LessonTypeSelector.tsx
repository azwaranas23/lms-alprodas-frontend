import { PlayCircle, Video, FileText } from "lucide-react";

type LessonType = "VIDEO" | "ARTICLE";

interface LessonTypeSelectorProps {
  readonly selectedType: LessonType;
  readonly onChange: (type: LessonType) => void;
}

export function LessonTypeSelector({
  selectedType,
  onChange,
}: Readonly<LessonTypeSelectorProps>) {
  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
          <PlayCircle className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-brand-dark text-xl font-bold">
            Lesson Type
          </h3>
          <p className="text-brand-light text-sm font-normal">
            Choose the type of content for this lesson
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Video Option */}
        <label htmlFor="lesson-type-video" className="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer">
          <span className="sr-only">Video</span>
          <span className="flex items-center gap-3">
            <span className="w-10 h-10 bg-red-50 rounded-[12px] flex items-center justify-center">
              <Video className="w-5 h-5 text-red-600" />
            </span>
            <span className="flex flex-col">
              <span className="text-brand-dark text-base font-semibold">
                Video
              </span>
              <span className="text-brand-light text-sm">
                YouTube video content
              </span>
            </span>
          </span>
          <span className="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2">
            <input
              type="radio"
              id="lesson-type-video"
              name="lessonType"
              value="VIDEO"
              checked={selectedType === "VIDEO"}
              onChange={() => onChange("VIDEO")}
              className="sr-only"
            />
            <span className="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"></span>
            <span className="text-xs font-semibold after:content-['Select'] group-has-[:checked]:after:content-['Selected']"></span>
          </span>
        </label>

        {/* Article Option */}
        <label htmlFor="lesson-type-article" className="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer">
          <span className="sr-only">Article</span>
          <span className="flex items-center gap-3">
            <span className="w-10 h-10 bg-green-50 rounded-[12px] flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </span>
            <span className="flex flex-col">
              <span className="text-brand-dark text-base font-semibold">
                Article
              </span>
              <span className="text-brand-light text-sm">
                Written text content
              </span>
            </span>
          </span>
          <span className="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2">
            <input
              type="radio"
              id="lesson-type-article"
              name="lessonType"
              value="ARTICLE"
              checked={selectedType === "ARTICLE"}
              onChange={() => onChange("ARTICLE")}
              className="sr-only"
            />
            <span className="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"></span>
            <span className="text-xs font-semibold after:content-['Select'] group-has-[:checked]:after:content-['Selected']"></span>
          </span>
        </label>
      </div>
    </div>
  );
}
