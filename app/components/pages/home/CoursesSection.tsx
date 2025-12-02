import { useState, useEffect, type JSX } from "react";
import { ArrowRight } from "lucide-react";
import { coursesService } from "~/services/courses.service";
import type { Course } from "~/types/courses";
import { Button } from "~/components/atoms/Button";
import { CourseCard } from "~/components/organisms/CourseCard";


export function CoursesSection(): JSX.Element {
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				setLoading(true);
				const response = await coursesService.getMostJoinedCourses();
				setCourses(response.data);
			} catch (error) {
				console.error("Failed to fetch courses:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, []);

	if (loading) {
		return (
			<section id="courses" className="py-20 bg-[#F9F9F9]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col md:flex-row md:justify-between md:items-start mb-16">
						<div className="text-left mb-6 md:mb-0">
							<h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">
								Most Joined Courses
							</h2>
							<p className="text-xl text-brand-light max-w-2xl">
								Join thousands of students in our most popular
								courses
							</p>
						</div>
						<div className="flex-shrink-0">
							<a
								href="courses-student.html"
								className="border border-[#DCDEDD] rounded-[12px] hover:border-[#0C51D9] hover:border-2 hover:bg-white transition-all duration-300 px-8 py-4 text-brand-dark text-lg font-semibold inline-flex items-center gap-2"
							>
								View All Courses
								<ArrowRight className="w-5 h-5" />
							</a>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={i}
								className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 animate-pulse"
							>
								<div className="mb-4">
									<div className="w-full h-48 bg-gray-200 rounded-[12px] mb-4"></div>
									<div className="flex items-center justify-between mb-2">
										<div className="h-6 bg-gray-200 rounded w-3/4"></div>
										<div className="h-5 bg-gray-200 rounded w-12"></div>
									</div>
									<div className="flex items-center gap-4 mb-4">
										<div className="h-4 bg-gray-200 rounded w-20"></div>
										<div className="h-4 bg-gray-200 rounded w-16"></div>
									</div>
									<div className="flex items-center gap-3 mb-4">
										<div className="w-8 h-8 bg-gray-200 rounded-full"></div>
										<div>
											<div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
											<div className="h-3 bg-gray-200 rounded w-16"></div>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="h-6 bg-gray-200 rounded w-24"></div>
									<div className="h-8 bg-gray-200 rounded w-20"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="courses" className="py-20 bg-[#F9F9F9]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row md:justify-between md:items-start mb-16">
					<div className="text-left mb-6 md:mb-0">
						<h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">
							Most Joined Courses
						</h2>
						<p className="text-xl text-brand-light max-w-2xl">
							Join thousands of students in our most popular
							courses
						</p>
					</div>
					<div className="flex-shrink-0">
						<a href="courses-student.html">
							<Button variant="outline" className="px-8 py-4 text-lg">
								View All Courses
								<ArrowRight className="w-5 h-5" />
							</Button>
						</a>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{courses.map((course) => (
						<CourseCard key={course.id} course={course} />
					))}
				</div>
			</div>
		</section>
	);
}
