import {
  Edit3,
  Type,
  Clock,
  Video,
  Link,
  FileText,
} from "lucide-react";
import { RichTextEditor } from "~/components/organisms/RichTextEditor";

type LessonType = "VIDEO" | "ARTICLE";

interface LessonFormData {
  title: string;
  type: LessonType;
  duration_minutes: number;
  content_url?: string;
  content_text?: string;
}

interface LessonFormFieldsProps {
  readonly formData: LessonFormData;
  readonly onChange: (field: keyof LessonFormData, value: any) => void;
}

// Function to extract YouTube video ID from URL
const extractYouTubeId = (url: string): string => {
  if (!url) return "";

  // If it's already just an ID (no slash or protocol), return as is
  if (!url.includes("/") && !url.includes("?") && !url.includes("http")) {
    return url;
  }

  // Extract from embed URL: https://www.youtube.com/embed/VIDEO_ID
  const embedMatch = /\/embed\/([a-zA-Z0-9_-]+)/.exec(url);
  if (embedMatch) return embedMatch[1];

  // Extract from watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = /[?&]v=([a-zA-Z0-9_-]+)/.exec(url);
  if (watchMatch) return watchMatch[1];

  // Extract from youtu.be URL: https://youtu.be/VIDEO_ID
  const shortMatch = /youtu\.be\/([a-zA-Z0-9_-]+)/.exec(url);
  if (shortMatch) return shortMatch[1];

  return url;
};

export function LessonFormFields({
  formData,
  onChange,
}: Readonly<LessonFormFieldsProps>) {
  return (
    <>
      {/* Lesson Information */}
      <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center">
            <Edit3 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-brand-dark text-xl font-bold">
              Lesson Information
            </h3>
            <p className="text-brand-light text-sm font-normal">
              Basic lesson details and metadata
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Content Title */}
          <div className="mb-4">
            <label htmlFor="content-title-input" className="block text-brand-dark text-base font-semibold mb-1">
              Content Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Type className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="content-title-input"
                required
                value={formData.title}
                onChange={(e) => onChange("title", e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                placeholder="Enter lesson title"
              />
            </div>
          </div>

          {/* Content Duration */}
          <div className="mb-4">
            <label htmlFor="content-duration-input" className="block text-brand-dark text-base font-semibold mb-1">
              Content Duration (minutes) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="content-duration-input"
                required
                min="1"
                max="999"
                value={formData.duration_minutes || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue =
                    value === "" ? 0 : Number.parseInt(value, 10) || 0;
                  onChange("duration_minutes", numValue);
                }}
                className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                placeholder="e.g. 15"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Video Content Section */}
      {formData.type === "VIDEO" && (
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-[12px] flex items-center justify-center">
              <Video className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-xl font-bold">
                Video Content
              </h3>
              <p className="text-brand-light text-sm font-normal">
                YouTube video configuration
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="youtube-id-input" className="block text-brand-dark text-base font-semibold mb-1">
              YouTube Video URL or ID *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="youtube-id-input"
                required
                value={formData.content_url || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const extractedId = extractYouTubeId(value);
                  onChange("content_url", extractedId);
                }}
                className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                placeholder="Paste YouTube URL or enter video ID (e.g. https://www.youtube.com/watch?v=9-poYwCZxDQ)"
              />
            </div>
            <p className="text-brand-light text-xs mt-2">
              You can paste any YouTube URL and it will automatically extract the video ID
            </p>
          </div>
        </div>
      )}

      {/* Article Content Section */}
      {formData.type === "ARTICLE" && (
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-xl font-bold">
                Article Content
              </h3>
              <p className="text-brand-light text-sm font-normal">
                Rich text content editor
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="block text-brand-dark text-base font-semibold mb-1">
              Article Content *
            </h4>
            <div className="border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus-within:border-[#0C51D9] focus-within:border-2 transition-all duration-300 overflow-hidden">
              <RichTextEditor
                value={formData.content_text || ""}
                onChange={(data) => onChange("content_text", data)}
                placeholder="Write your article content here..."
                className="min-h-[400px]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
