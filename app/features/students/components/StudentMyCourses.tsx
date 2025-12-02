import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import {
	BookOpen,
	Filter,
	Search,
	Tag,
	Clock,
	Eye,
	Play,
	ChevronLeft,
	ChevronRight,
	Loader2,
	Download,
} from "lucide-react";
import { coursesService } from "~/services/courses.service";
import { StudentLayout } from "~/components/templates/StudentLayout";
import { Button } from "~/components/atoms/Button";
import { Input } from "~/components/atoms/Input";
import { Select } from "~/components/atoms/Select";
import { getAvatarSrc } from "~/utils/formatters";
import { Image } from "~/components/atoms/Image";

export default function StudentMyCourses() {
	const [searchParams] = useSearchParams();
	const [courses, setCourses] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [showCompletionMessage, setShowCompletionMessage] = useState(false);
	const [downloadingCertificates, setDownloadingCertificates] = useState<
		Record<number, boolean>
	>({});

	const fetchMyCourses = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await coursesService.getMyEnrolledCourses({
				page: currentPage,
				limit: 6,
			});
			setCourses(response.data.items);
			setTotalPages(response.data.meta.total_pages);
		} catch (err) {
			setError("Failed to load courses. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMyCourses();
	}, [currentPage]);

	useEffect(() => {
		// Check for completion query parameter
		if (searchParams.get("completed") === "true") {
			setShowCompletionMessage(true);
			// Hide message after 5 seconds
			const timer = setTimeout(() => {
				setShowCompletionMessage(false);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [searchParams]);

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage((prev) => prev + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prev) => prev - 1);
		}
	};

	const filteredCourses = courses.filter(
		(course) =>
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.subject.name
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
	);

	const handleDownloadCertificate = async (
		courseId: number,
		certificateId: string,
		courseTitle: string
	) => {
		try {
			setDownloadingCertificates((prev) => ({
				...prev,
				[courseId]: true,
			}));

			const blob =
				await coursesService.downloadCertificate(certificateId);

			// Create download link
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `certificate-${courseTitle.replace(/\s+/g, "-").toLowerCase()}.pdf`;
			document.body.appendChild(link);
			link.click();

			// Cleanup
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			console.error("Failed to download certificate:", err);
			alert("Failed to download certificate. Please try again.");
		} finally {
			setDownloadingCertificates((prev) => ({
				...prev,
				[courseId]: false,
			}));
		}
	};

	return (
		<StudentLayout
			title="My Courses"
			subtitle="View and continue your enrolled courses and track your progress"
		>
			<main className="main-content flex-1 overflow-auto p-5">
				{/* Course Completion Success Message */}
				{showCompletionMessage && (
					<div className="bg-green-50 border border-green-200 rounded-[20px] p-4 mb-6 flex items-center gap-3">
						<div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
							<svg
								className="w-6 h-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<div className="flex-1">
							<h4 className="text-green-800 font-semibold">
								🎉 Congratulations!
							</h4>
							<p className="text-green-700 text-sm">
								You have successfully completed the course!
							</p>
						</div>
						<button
							onClick={() => setShowCompletionMessage(false)}
							className="text-green-600 hover:text-green-800"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				)}
				{/* Courses Grid Section */}
				<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<div className="w-11 h-11 bg-blue-50 rounded-[12px] flex items-center justify-center">
								<BookOpen className="w-6 h-6 text-blue-600" />
							</div>
							<div>
								<h3 className="text-brand-dark text-xl font-bold">
									My Courses
								</h3>
								<p className="text-brand-light text-sm font-normal">
									View and continue your enrolled courses and
									track your progress
								</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								className="flex items-center gap-2"
							>
								<Filter className="w-4 h-4" />
								<span className="text-sm font-semibold">
									Filter Courses
								</span>
							</Button>
							<Button
								variant="primary"
								className="flex items-center gap-2"
							>
								<Search className="w-4 h-4 text-white" />
								<span className="text-brand-white text-sm font-semibold">
									Browse Courses
								</span>
							</Button>
						</div>
					</div>

					{/* Search Section */}
					<div className="mb-6">
						<div className="flex items-center gap-4">
							<div className="relative flex-1">
								<Input
									type="text"
									icon={<Search className="h-5 w-5" />}
									placeholder="Search courses..."
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
								/>
							</div>
						</div>
					</div>

					{/* Loading State */}
					{loading && (
						<div className="flex justify-center items-center py-12">
							<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
							<span className="ml-2 text-gray-600">
								Loading courses...
							</span>
						</div>
					)}

					{/* Error State */}
					{error && (
						<div className="text-center py-12">
							<div className="text-red-600 mb-4">
								<BookOpen className="w-12 h-12 mx-auto mb-2" />
								<p>{error}</p>
							</div>
							<Button onClick={fetchMyCourses} variant="primary">
								Try Again
							</Button>
						</div>
					)}

					{/* Empty State */}
					{!loading &&
						!error &&
						filteredCourses.length === 0 &&
						courses.length === 0 && (
							<div className="text-center py-12">
								<BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									No courses enrolled yet
								</h3>
								<p className="text-gray-600 mb-4">
									Start your learning journey by enrolling in
									courses
								</p>
							</div>
						)}

					{/* No Search Results */}
					{!loading &&
						!error &&
						filteredCourses.length === 0 &&
						courses.length > 0 &&
						searchQuery && (
							<div className="text-center py-12">
								<Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									No courses found
								</h3>
								<p className="text-gray-600">
									Try adjusting your search terms
								</p>
							</div>
						)}

					{/* Courses Grid */}
					{!loading && !error && filteredCourses.length > 0 && (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{filteredCourses.map((course: any) => (
								<div
									key={course.id}
									className="border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4"
								>
									<div className="flex gap-4 h-full">
										{/* Course Thumbnail */}
										<div className="w-36 h-full bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden rounded-[12px] flex-shrink-0">
											<Image
												src={course.image}
												alt={course.title}
												className="w-full h-full object-cover rounded-[12px]"
												imageType="course"
												identifier={course.id.toString()}
											/>
										</div>

										{/* Content */}
										<div className="flex-1 flex flex-col">
											<div className="flex-1 mb-3">
												<div className="flex items-center justify-between mb-2">
													<h4 className="text-brand-dark text-lg font-bold leading-tight">
														{course.title}
													</h4>
												</div>

												<div className="flex items-center gap-4 mb-3">
													<div className="flex items-center gap-2">
														<Tag className="w-4 h-4" />
														<span className="text-sm text-gray-600">
															{
																course.subject
																	.name
															}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<Clock className="w-4 h-4 text-blue-600" />
														<span className="text-sm font-semibold text-blue-600">
															{
																course.progress_percentage
															}
															% Complete
														</span>
													</div>
												</div>

												<div className="flex items-center gap-3 mb-3">
													<img
														src={getAvatarSrc(
															course.mentor
																.avatar,
															course.mentor.name
														)}
														alt={course.mentor.name}
														className="w-8 h-8 rounded-full object-cover"
														onError={(e) => {
															e.currentTarget.src =
																getAvatarSrc(
																	undefined,
																	course
																		.mentor
																		.name
																);
														}}
													/>
													<div>
														<p className="text-sm font-medium text-gray-900">
															Mentor:{" "}
															{course.mentor.name}
														</p>
														<p className="text-xs text-gray-500">
															{course.mentor
																.expertise ||
																"Mentor"}
														</p>
													</div>
												</div>
											</div>

											<div className="flex gap-2">
												{course.progress_percentage ===
													100 &&
												course.certificate_id ? (
													<>
														<Button
															variant="outline"
															onClick={() =>
																handleDownloadCertificate(
																	course.id,
																	course.certificate_id,
																	course.title
																)
															}
															disabled={
																downloadingCertificates[
																	course.id
																]
															}
															className="flex-1 px-3 py-3.5 flex items-center justify-center gap-2"
														>
															{downloadingCertificates[
																course.id
															] ? (
																<>
																	<Loader2 className="w-4 h-4 animate-spin" />
																	<span className="text-sm font-semibold">
																		Downloading...
																	</span>
																</>
															) : (
																<>
																	<Download className="w-4 h-4 " />
																	<span className=" text-sm font-semibold">
																		Certificate
																	</span>
																</>
															)}
														</Button>
														<Link
															to={`/student/${course.id}/progress`}
															className="flex-1 btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-3 py-3.5 flex items-center justify-center gap-2"
														>
															<Play className="w-4 h-4 text-white" />
															<span className="text-brand-white text-sm font-semibold">
																{course.progress_percentage ===
																0
																	? "Start"
																	: "Continue"}
															</span>
														</Link>
													</>
												) : (
													<>
														<Link
															to={`#`}
															className="flex-1 border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-3.5 flex items-center justify-center gap-2 bg-white"
														>
															<Eye className="w-4 h-4 text-gray-600" />
															<span className="text-brand-dark text-sm font-semibold">
																View Course
															</span>
														</Link>
														<Link
															to={`/student/${course.id}/progress`}
															className="flex-1 btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-3 py-3.5 flex items-center justify-center gap-2"
														>
															<Play className="w-4 h-4 text-white" />
															<span className="text-brand-white text-sm font-semibold">
																{course.progress_percentage ===
																0
																	? "Start"
																	: "Continue"}
															</span>
														</Link>
													</>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Pagination */}
					{!loading &&
						!error &&
						courses.length > 0 &&
						totalPages > 1 && (
							<div className="flex items-center justify-between mt-6">
								<div className="flex items-center gap-2">
									<p className="text-[#6B7280] font-['Plus_Jakarta_Sans'] text-[14px] font-normal">
										Show
									</p>
									<Select
										className="px-3 py-2 rounded-lg"
										options={[
											{ value: "6", label: "6" },
											{ value: "12", label: "12" },
											{ value: "24", label: "24" },
										]}
										defaultValue="6"
									/>
									<p className="text-[#6B7280] font-['Plus_Jakarta_Sans'] text-[14px] font-normal">
										courses per page
									</p>
								</div>
								<div className="flex items-center gap-2">
									{/* Previous Button */}
									<Button
										onClick={handlePrevPage}
										disabled={currentPage === 1}
										variant="outline"
										className="px-4 py-2"
									>
										<ChevronLeft className="w-4 h-4" />
									</Button>
									{/* Page Numbers */}
									{Array.from(
										{ length: totalPages },
										(_, i) => i + 1
									).map((pageNum) => (
										<Button
											key={pageNum}
											onClick={() =>
												setCurrentPage(pageNum)
											}
											variant={
												currentPage === pageNum
													? "primary"
													: "outline"
											}
											className="px-4 py-2"
										>
											{pageNum}
										</Button>
									))}
									{/* Next Button */}
									<Button
										onClick={handleNextPage}
										disabled={currentPage === totalPages}
										variant="outline"
										className="px-4 py-2"
									>
										<ChevronRight className="w-4 h-4" />
									</Button>
								</div>
							</div>
						)}
				</div>
			</main>
		</StudentLayout>
	);
}
