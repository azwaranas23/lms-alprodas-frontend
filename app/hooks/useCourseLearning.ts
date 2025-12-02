import { useState, useEffect, useCallback } from "react";
import { coursesService } from "~/services/courses.service";
import type {
	CourseLearningData,
	CourseLesson,
	LessonDetail,
	CourseProgress,
} from "~/types/course-learning";

export function useCourseLearning(courseId: string | undefined) {
	const [courseData, setCourseData] = useState<CourseLearningData | null>(null);
	const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
	const [lessonDetail, setLessonDetail] = useState<LessonDetail | null>(null);
	const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
	const [loading, setLoading] = useState(true);
	const [lessonLoading, setLessonLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch course data and progress
	const fetchCourseData = useCallback(async () => {
		if (!courseId) return;

		try {
			setLoading(true);
			setError(null);

			const [learningResponse, progressResponse] = await Promise.all([
				coursesService.getCourseLearning(Number(courseId)),
				coursesService.getCourseProgress(Number(courseId)),
			]);

			setCourseData(learningResponse.data);
			setCourseProgress(progressResponse.data);

			// Auto-select first lesson or last accessed lesson
			if (progressResponse.data.last_accessed_lesson_id) {
				const lastLesson = findLessonById(
					learningResponse.data.sections,
					progressResponse.data.last_accessed_lesson_id
				);
				if (lastLesson) {
					selectLesson(lastLesson);
				}
			} else if (learningResponse.data.sections?.[0]?.lessons?.[0]) {
				selectLesson(learningResponse.data.sections[0].lessons[0]);
			}
		} catch (err) {
			console.error("Error fetching course data:", err);
			setError("Failed to load course data");
		} finally {
			setLoading(false);
		}
	}, [courseId]);

	// Fetch lesson detail
	const fetchLessonDetail = useCallback(async (lessonId: number) => {
		try {
			setLessonLoading(true);
			const response = await coursesService.getLessonDetail(lessonId);
			setLessonDetail(response.data);
		} catch (err) {
			console.error("Error fetching lesson detail:", err);
		} finally {
			setLessonLoading(false);
		}
	}, []);

	// Select lesson
	const selectLesson = useCallback((lesson: CourseLesson) => {
		setCurrentLesson(lesson);
		fetchLessonDetail(lesson.id);
	}, [fetchLessonDetail]);

	// Complete lesson
	const completeLesson = useCallback(async () => {
		if (!currentLesson) return;

		try {
			const response = await coursesService.completeLesson(currentLesson.id);

			if (response.data.progress) {
				setCourseProgress(response.data.progress);
			}

			// Update lesson completion status in courseData
			if (courseData) {
				const updatedData = { ...courseData };
				updatedData.sections = updatedData.sections.map((section) => ({
					...section,
					lessons: section.lessons.map((lesson) =>
						lesson.id === currentLesson.id
							? { ...lesson, is_completed: true, completed_at: new Date().toISOString() }
							: lesson
					),
				}));
				setCourseData(updatedData);
			}

			// Update lesson detail
			if (lessonDetail) {
				setLessonDetail({
					...lessonDetail,
					is_completed: true,
					completed_at: new Date().toISOString(),
				});
			}

			// Auto-navigate to next lesson if available
			if (response.data.next_lesson) {
				const nextLesson = findLessonById(courseData?.sections || [], response.data.next_lesson.id);
				if (nextLesson) {
					selectLesson(nextLesson);
				}
			}

			return response;
		} catch (err) {
			console.error("Error completing lesson:", err);
			throw err;
		}
	}, [currentLesson, courseData, lessonDetail, selectLesson]);

	// Complete course
	const completeCourse = useCallback(async () => {
		if (!courseId) return;

		try {
			const response = await coursesService.completeCourse(Number(courseId));
			return response;
		} catch (err) {
			console.error("Error completing course:", err);
			throw err;
		}
	}, [courseId]);

	// Navigate to previous/next lesson
	const navigateToPreviousLesson = useCallback(() => {
		if (!lessonDetail?.previous_lesson || !courseData) return;

		const prevLesson = findLessonById(courseData.sections, lessonDetail.previous_lesson.id);
		if (prevLesson) {
			selectLesson(prevLesson);
		}
	}, [lessonDetail, courseData, selectLesson]);

	const navigateToNextLesson = useCallback(() => {
		if (!lessonDetail?.next_lesson || !courseData) return;

		const nextLesson = findLessonById(courseData.sections, lessonDetail.next_lesson.id);
		if (nextLesson) {
			selectLesson(nextLesson);
		}
	}, [lessonDetail, courseData, selectLesson]);

	// Helper function to find lesson by ID
	const findLessonById = (sections: CourseLearningData["sections"], lessonId: number): CourseLesson | null => {
		for (const section of sections) {
			const lesson = section.lessons.find((l) => l.id === lessonId);
			if (lesson) return lesson;
		}
		return null;
	};

	// Initial fetch
	useEffect(() => {
		fetchCourseData();
	}, [fetchCourseData]);

	return {
		// State
		courseData,
		currentLesson,
		lessonDetail,
		courseProgress,
		loading,
		lessonLoading,
		error,

		// Actions
		selectLesson,
		completeLesson,
		completeCourse,
		navigateToPreviousLesson,
		navigateToNextLesson,
		refetchCourse: fetchCourseData,
	};
}