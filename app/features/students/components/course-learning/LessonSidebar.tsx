import { ChevronDown, Check, Play, Lock, Clock } from "lucide-react";
import type { CourseSection, CourseLesson, CourseProgress } from "~/types/course-learning";
import { truncateText, formatDuration } from "~/utils/formatters";

interface LessonSidebarProps {
	sections: CourseSection[];
	currentLessonId?: number;
	courseProgress?: CourseProgress;
	openSections: number[];
	onToggleSection: (sectionId: number) => void;
	onSelectLesson: (lesson: CourseLesson) => void;
}

export function LessonSidebar({
	sections,
	currentLessonId,
	courseProgress,
	openSections,
	onToggleSection,
	onSelectLesson,
}: LessonSidebarProps) {
	const isLessonAccessible = (lesson: CourseLesson, sectionIndex: number, lessonIndex: number) => {
		// First lesson is always accessible
		if (sectionIndex === 0 && lessonIndex === 0) return true;

		// Check if previous lesson is completed
		if (lessonIndex > 0) {
			const prevLesson = sections[sectionIndex].lessons[lessonIndex - 1];
			return prevLesson.is_completed || false;
		}

		// Check if last lesson of previous section is completed
		if (sectionIndex > 0) {
			const prevSection = sections[sectionIndex - 1];
			const lastLesson = prevSection.lessons[prevSection.lessons.length - 1];
			return lastLesson.is_completed || false;
		}

		return false;
	};

	return (
		<div className="w-full lg:w-96 bg-white border-l border-[#DCDEDD] overflow-y-auto">
			<div className="p-6 border-b border-[#DCDEDD]">
				<h3 className="text-lg font-bold text-gray-900 mb-2">Course Content</h3>
				{courseProgress && (
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-gray-600">Progress</span>
							<span className="font-semibold">
								{courseProgress.completed_lessons}/{courseProgress.total_lessons} lessons
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${courseProgress.progress_percentage}%` }}
							/>
						</div>
					</div>
				)}
			</div>

			<div className="divide-y divide-[#DCDEDD]">
				{sections.map((section, sectionIndex) => (
					<div key={section.id}>
						<button
							onClick={() => onToggleSection(section.id)}
							className="w-full p-4 hover:bg-gray-50 transition-colors flex items-center justify-between text-left"
						>
							<div className="flex-1">
								<h4 className="font-semibold text-gray-900">
									Section {section.order}: {truncateText(section.title, 25)}
								</h4>
								<div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
									<span>{section.lessons.length} lessons</span>
									<span className="flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{formatDuration(section.total_duration)}
									</span>
									{section.completed_lessons !== undefined && (
										<span className="text-green-600 font-medium">
											{section.completed_lessons}/{section.total_lessons} completed
										</span>
									)}
								</div>
							</div>
							<ChevronDown
								className={`w-5 h-5 text-gray-400 transition-transform ${
									openSections.includes(section.id) ? "rotate-180" : ""
								}`}
							/>
						</button>

						{openSections.includes(section.id) && (
							<div className="bg-gray-50">
								{section.lessons.map((lesson, lessonIndex) => {
									const isAccessible = isLessonAccessible(lesson, sectionIndex, lessonIndex);
									const isCurrent = lesson.id === currentLessonId;

									return (
										<button
											key={lesson.id}
											onClick={() => isAccessible && onSelectLesson(lesson)}
											disabled={!isAccessible}
											className={`w-full p-4 text-left flex items-start gap-3 hover:bg-gray-100 transition-colors ${
												isCurrent ? "bg-blue-50 border-l-4 border-blue-600" : ""
											} ${!isAccessible ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
										>
											<div className="mt-1">
												{lesson.is_completed ? (
													<Check className="w-5 h-5 text-green-600" />
												) : isAccessible ? (
													<Play className="w-5 h-5 text-gray-400" />
												) : (
													<Lock className="w-5 h-5 text-gray-400" />
												)}
											</div>
											<div className="flex-1">
												<h5 className={`font-medium ${
													isCurrent ? "text-blue-900" : "text-gray-900"
												}`}>
													{lesson.order}. {truncateText(lesson.title, 30)}
												</h5>
												<div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
													<Clock className="w-3 h-3" />
													<span>{formatDuration(lesson.duration_minutes)}</span>
													{lesson.video_url && (
														<span className="text-blue-600">• Video</span>
													)}
												</div>
											</div>
										</button>
									);
								})}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}