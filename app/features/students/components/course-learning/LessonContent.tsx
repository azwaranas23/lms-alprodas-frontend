import { ChevronLeft, ChevronRight, Download, FileText, Code, BookOpen } from "lucide-react";
import type { LessonDetail } from "~/types/course-learning";
import { formatDate } from "~/utils/formatters";

interface LessonContentProps {
	lesson: LessonDetail | null;
	onPrevious?: () => void;
	onNext?: () => void;
	onComplete?: () => void;
	isCompleting?: boolean;
}

export function LessonContent({
	lesson,
	onPrevious,
	onNext,
	onComplete,
	isCompleting,
}: LessonContentProps) {
	if (!lesson) {
		return (
			<div className="bg-white rounded-[20px] border border-[#DCDEDD] p-8">
				<div className="text-center py-12">
					<BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Select a lesson to begin
					</h3>
					<p className="text-gray-600">
						Choose a lesson from the sidebar to start learning
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-[20px] border border-[#DCDEDD] p-8">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h2>
				<p className="text-gray-600">{lesson.description}</p>
				{lesson.completed_at && (
					<p className="text-sm text-green-600 mt-2">
						✓ Completed on {formatDate(lesson.completed_at)}
					</p>
				)}
			</div>

			{lesson.content && (
				<div className="prose max-w-none mb-8">
					<div dangerouslySetInnerHTML={{ __html: lesson.content }} />
				</div>
			)}

			{lesson.resources && lesson.resources.length > 0 && (
				<div className="mb-8">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
					<div className="space-y-3">
						{lesson.resources.map((resource) => (
							<a
								key={resource.id}
								href={resource.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
							>
								{resource.type === "PDF" && <FileText className="w-5 h-5 text-red-600" />}
								{resource.type === "CODE" && <Code className="w-5 h-5 text-blue-600" />}
								{resource.type === "FILE" && <Download className="w-5 h-5 text-gray-600" />}
								<div className="flex-1">
									<p className="font-medium text-gray-900">{resource.title}</p>
									{resource.size && (
										<p className="text-sm text-gray-600">
											{(resource.size / 1024 / 1024).toFixed(2)} MB
										</p>
									)}
								</div>
								<Download className="w-5 h-5 text-gray-400" />
							</a>
						))}
					</div>
				</div>
			)}

			<div className="flex items-center justify-between pt-6 border-t border-[#DCDEDD]">
				<button
					onClick={onPrevious}
					disabled={!lesson.previous_lesson}
					className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<ChevronLeft className="w-5 h-5" />
					<span>Previous Lesson</span>
				</button>

				{!lesson.is_completed && (
					<button
						onClick={onComplete}
						disabled={isCompleting}
						className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isCompleting ? "Marking Complete..." : "Mark as Complete"}
					</button>
				)}

				<button
					onClick={onNext}
					disabled={!lesson.next_lesson}
					className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<span>Next Lesson</span>
					<ChevronRight className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
}