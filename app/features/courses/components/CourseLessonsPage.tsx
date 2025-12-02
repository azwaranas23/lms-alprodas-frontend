import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Layout } from "~/components/templates/Layout";
import { Header } from "~/components/templates/Header";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import {
	BookOpen,
	Plus,
	Eye,
	Edit,
	Trash2,
	ArrowLeft,
	Video,
} from "lucide-react";
import { useCourse } from "~/hooks/api/useCourses";
import { useSectionsByCourse } from "~/hooks/api/useSections";
import { useLessonsBySection, useDeleteLesson } from "~/hooks/api/useLessons";

interface CourseLessonsPageProps {
	userRole: "manager" | "mentor";
}

function getTypeStyles(type: string) {
	switch (type) {
		case "VIDEO":
			return "bg-[#F0FDF4] text-[#166534]";
		case "ARTICLE":
			return "bg-[#FEF3C7] text-[#92400E]";
		default:
			return "bg-[#F3F4F6] text-[#374151]";
	}
}

export function CourseLessonsPage({ userRole }: CourseLessonsPageProps) {
	const { id, sectionId } = useParams();
	const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

	// Base path for routes based on user role
	const basePath = userRole === "mentor" ? "/dashboard/mentor/courses" : "/dashboard/courses";

	// Use custom hooks
	const {
		data: courseData,
		isLoading,
		error,
	} = useCourse(Number(id));

	const {
		data: sectionsData,
		isLoading: sectionsLoading,
	} = useSectionsByCourse(Number(id));

	const {
		data: lessonsData,
		isLoading: lessonsLoading,
	} = useLessonsBySection(selectedSectionId || undefined);

	// Delete lesson mutation
	const deleteLessonMutation = useDeleteLesson();

	const course = courseData?.data;
	const sections = sectionsData?.data || [];
	const lessons = lessonsData?.data || [];
	const currentSection = sections.find((s: any) => s.id === selectedSectionId) || sections[0];

	// Set section from URL param or default to first section
	useEffect(() => {
		if (sectionId) {
			setSelectedSectionId(Number(sectionId));
		} else if (sections.length > 0 && !selectedSectionId) {
			setSelectedSectionId(sections[0].id);
		}
	}, [sections.length, sectionId]);

	const handleDeleteLesson = (lessonId: number) => {
		console.log('Delete button clicked for lesson:', lessonId);
		if (window.confirm('Are you sure you want to delete this lesson?')) {
			console.log('User confirmed deletion, calling mutation');
			deleteLessonMutation.mutate(lessonId);
		} else {
			console.log('User cancelled deletion');
		}
	};

	if (isLoading || sectionsLoading || lessonsLoading) {
		return (
			<PermissionRoute requiredPermission="courses.read">
				<Layout>
					<Header title="Loading..." subtitle="Please wait" />
					<main className="main-content flex-1 overflow-auto p-5">
						<div className="flex items-center justify-center min-h-[400px]">
							<div className="text-center">
								<div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
								<p className="text-gray-600">
									Loading course lessons...
								</p>
							</div>
						</div>
					</main>
				</Layout>
			</PermissionRoute>
		);
	}

	if (error || !course) {
		return (
			<PermissionRoute requiredPermission="courses.read">
				<Layout>
					<Header title="Error" subtitle="Failed to load course" />
					<main className="main-content flex-1 overflow-auto p-5">
						<div className="flex items-center justify-center min-h-[400px]">
							<div className="text-center">
								<BookOpen className="w-12 h-12 text-red-500 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									Failed to load course
								</h3>
								<p className="text-gray-500">
									The course could not be loaded. Please try
									again later.
								</p>
								<Link
									to={`${basePath}`}
									className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
								>
									<ArrowLeft className="w-4 h-4" />
									Back to courses
								</Link>
							</div>
						</div>
					</main>
				</Layout>
			</PermissionRoute>
		);
	}

	return (
		<PermissionRoute requiredPermission="courses.read">
			<Layout>
				<Header
					title="Course Lessons"
					subtitle={currentSection ? `Section No. ${currentSection.order_index} - ${currentSection.title}` : 'Loading section...'}
					backButton={{
						to: `${basePath}/${id}`,
						label: "Back",
					}}
				/>
				<main className="main-content flex-1 overflow-auto p-5">
					{/* Course Header */}
					<div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
						<div className="flex items-center gap-6">
							<div className="relative">
								<div className="w-24 h-24 relative overflow-hidden rounded-[16px]">
									{course.images?.[0]?.image_path ? (
										<img
											src={`${import.meta.env.VITE_BASE_URL}/${course.images[0].image_path}`}
											alt="Course Thumbnail"
											className="w-full h-full object-cover"
											onError={(e) => {
												e.currentTarget.style.display = 'none';
												if (e.currentTarget.nextElementSibling) {
													(e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
												}
											}}
										/>
									) : null}
									<div
										className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-bold text-3xl"
										style={{ display: course.images?.[0]?.image_path ? 'none' : 'flex' }}
									>
										{course.title.charAt(0).toUpperCase()}
									</div>
								</div>
							</div>
							<div className="flex-1">
								<h1 className="text-brand-dark text-2xl font-extrabold mb-2">
									{course.title}
								</h1>
								<p className="text-brand-light text-base">
									Manage lessons and learning materials for this course
								</p>
							</div>
						</div>
					</div>

					{/* Course Lessons Header */}
					<div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-orange-50 rounded-[12px] flex items-center justify-center">
									<BookOpen className="w-6 h-6 text-orange-600" />
								</div>
								<div>
									<h2 className="text-brand-dark text-xl font-bold">Course Lessons</h2>
									<p className="text-brand-light text-sm">
										{currentSection ? `Section No. ${currentSection.order_index} - ${currentSection.title}` : 'Loading section...'}
									</p>
								</div>
							</div>
							<Link
								to={`${basePath}/${id}/sections/${selectedSectionId}/lessons/add`}
								className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center gap-2"
							>
								<Plus className="w-4 h-4 text-white" />
								<span className="text-brand-white text-sm font-semibold">Add Lesson</span>
							</Link>
						</div>

					</div>

					{/* Lessons Content */}
					<div className="space-y-4">
						{lessons.map((lesson: any, index: number) => (
							<div
								key={lesson.id}
								className="bg-white border border-[#DCDEDD] rounded-[16px] p-6 mb-4"
							>
								<div className="flex items-center justify-between">
									{/* Group 1: Icon + Title Info */}
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
											{lesson.content_type === 'VIDEO' ? (
												<Video className="w-6 h-6 text-blue-600" />
											) : (
												<BookOpen className="w-6 h-6 text-blue-600" />
											)}
										</div>
										<div>
											<h3 className="text-brand-dark text-lg font-bold">
												{lesson.title}
											</h3>
											<p className="text-brand-light text-sm">
												Lesson No. {lesson.order_index || index + 1}
											</p>
										</div>
									</div>

									{/* Group 2: Metadata */}
									<div className="flex items-center gap-3">
										<p className="text-brand-dark text-base font-bold">
											{lesson.duration_minutes || 0} min
										</p>
										<span
											className={`px-3 py-1 rounded-md text-sm font-semibold ml-[50px] ${getTypeStyles(
												lesson.content_type
											)}`}
										>
											{lesson.content_type === 'VIDEO' ? 'Video' : 'Article'}
										</span>
									</div>

									{/* Group 3: Action Buttons */}
									<div className="flex items-center gap-3">
										<button
											className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-6 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-default"
										>
											<Eye className="w-4 h-4" />
											<span className="text-sm">View</span>
										</button>
										<Link
											to={`${basePath}/${id}/sections/${selectedSectionId}/lessons/${lesson.id}/edit`}
											className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-6 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
										>
											<Edit className="w-4 h-4" />
											<span className="text-sm">Edit</span>
										</Link>
										<button
											onClick={() => handleDeleteLesson(lesson.id)}
											disabled={deleteLessonMutation.isPending}
											className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-6 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<Trash2 className="w-4 h-4" />
											<span className="text-sm">
												{deleteLessonMutation.isPending ? 'Deleting...' : 'Delete'}
											</span>
										</button>
									</div>
								</div>
							</div>
						))}

						{/* Empty State */}
						{!lessonsLoading && lessons.length === 0 && (
							<div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
										<BookOpen className="w-8 h-8 text-blue-600" />
									</div>
									<h3 className="text-brand-dark text-xl font-bold mb-2">Course Lessons</h3>
									<p className="text-brand-light text-base">
										{currentSection
											? `No lessons available in "${currentSection.title}" section.`
											: "No lessons available for this course."
										}
									</p>
								</div>
							</div>
						)}
					</div>
				</main>
			</Layout>
		</PermissionRoute>
	);
}