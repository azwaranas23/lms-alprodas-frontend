import { useState, useEffect } from "react";
import {
	Star,
	Users,
	Clock,
	Info,
	BookOpen,
	Award,
	MessageCircle,
	Play,
	FileText,
	Check,
} from "lucide-react";
import { CourseEnrollmentCard } from "./CourseEnrollmentCard";
import { Tab } from "~/components/atoms/Tab";
import { coursesService } from "~/services/courses.service";
import type { Course } from "~/types/courses";
import { getAvatarSrc } from "~/utils/formatters";

interface CourseContentSectionProps {
	courseId: number;
}

export function CourseContentSection({ courseId }: CourseContentSectionProps) {
	const [activeTab, setActiveTab] = useState("about");
	const [course, setCourse] = useState<Course | null>(null);
	const [loading, setLoading] = useState(true);

	// Fetch course detail
	useEffect(() => {
		const fetchCourseDetail = async () => {
			try {
				setLoading(true);
				const response = await coursesService.getCourseDetail(courseId);
				setCourse(response.data);
			} catch (error) {
				console.error("Failed to fetch course detail:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCourseDetail();
	}, [courseId]);

	// Set active tab based on URL hash
	useEffect(() => {
		const hash = window.location.hash.substr(1);
		const validTabs = ["about", "lessons", "benefits", "testimonials"];
		if (validTabs.includes(hash)) {
			setActiveTab(hash);
		}
	}, []);

	const handleTabSwitch = (tabName: string) => {
		setActiveTab(tabName);
		window.location.hash = tabName;
	};

	const getTotalDuration = (sections: Course["sections"]) => {
		if (!sections || sections.length === 0) return "0 hours";
		let totalMinutes = 0;
		sections.forEach((section) => {
			section.lessons.forEach((lesson) => {
				totalMinutes += lesson.duration_minutes;
			});
		});
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
	};

	if (loading) {
		return (
			<section className="bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2">
							<div className="animate-pulse">
								<div className="h-8 bg-gray-200 rounded mb-4"></div>
								<div className="h-4 bg-gray-200 rounded mb-2"></div>
								<div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
								<div className="h-20 bg-gray-200 rounded mb-8"></div>
								<div className="h-12 bg-gray-200 rounded mb-6"></div>
								<div className="h-64 bg-gray-200 rounded"></div>
							</div>
						</div>
						<div className="lg:col-span-1">
							<div className="h-96 bg-gray-200 rounded animate-pulse"></div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	if (!course) {
		return (
			<section className="bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
					<div className="text-center py-12">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Course not found
						</h2>
						<p className="text-gray-600">
							The course you're looking for doesn't exist or has
							been removed.
						</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2">
						{/* Course Header */}
						<div className="mb-8">
							<h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">
								{course.title}
							</h1>

							{/* Course Meta Info */}
							<div className="flex flex-wrap items-center gap-6 mb-6">
								<div className="flex items-center gap-2">
									<div className="flex items-center gap-1">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												className="w-5 h-5 text-yellow-500 fill-current"
											/>
										))}
									</div>
									<span className="text-brand-dark font-semibold">
										5.0
									</span>
									<span className="text-gray-600">
										(2,340 reviews)
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Users className="w-5 h-5 text-gray-500" />
									<span className="text-gray-600">
										{course.total_students} students
										enrolled
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="w-5 h-5 text-gray-500" />
									<span className="text-gray-600">
										{getTotalDuration(course.sections)} of
										content
									</span>
								</div>
							</div>

							{/* Instructor Info */}
							{course.mentor && (
								<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[16px]">
									<img
										src={getAvatarSrc(
											course.mentor.profile?.avatar,
											course.mentor.name
										)}
										alt={course.mentor.name}
										onError={(e) => {
											e.currentTarget.src = getAvatarSrc(
												undefined,
												course.mentor?.name || ""
											);
										}}
										className="w-16 h-16 rounded-full object-cover"
									/>
									<div>
										<h3 className="text-brand-dark text-lg font-bold">
											{course.mentor.name}
										</h3>
										<p className="text-brand-light text-sm">
											{course.mentor.profile?.expertise}
										</p>
									</div>
								</div>
							)}
						</div>

						{/* Tabs Navigation */}
						<div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
							<div className="flex flex-wrap gap-2">
								<Tab
									isActive={activeTab === "about"}
									onClick={() => handleTabSwitch("about")}
								>
									<Info className="w-4 h-4" />
									<span>About</span>
								</Tab>
								<Tab
									isActive={activeTab === "lessons"}
									onClick={() => handleTabSwitch("lessons")}
								>
									<BookOpen className="w-4 h-4" />
									<span>Lessons</span>
								</Tab>
								<Tab
									isActive={activeTab === "benefits"}
									onClick={() => handleTabSwitch("benefits")}
								>
									<Award className="w-4 h-4" />
									<span>Benefits</span>
								</Tab>
								<Tab
									isActive={activeTab === "testimonials"}
									onClick={() =>
										handleTabSwitch("testimonials")
									}
								>
									<MessageCircle className="w-4 h-4" />
									<span>Testimonials</span>
								</Tab>
							</div>
						</div>

						{/* Tab Content Container */}
						<div>
							{/* About Tab Content */}
							{activeTab === "about" && (
								<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-8">
									<h2 className="text-2xl font-bold text-brand-dark mb-6">
										About This Course
									</h2>

									<div className="prose prose-lg max-w-none mb-8">
										<p className="text-brand-light leading-relaxed mb-4">
											{course.description}
										</p>
										{course.about && (
											<p className="text-brand-light leading-relaxed mb-4">
												{course.about}
											</p>
										)}
									</div>

									<h3 className="text-xl font-bold text-brand-dark mb-4">
										What You'll Learn
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
										{course.key_points?.map(
											(keyPoint, index) => (
												<div
													key={keyPoint.id}
													className="flex items-start gap-3"
												>
													<div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
														<Check className="w-4 h-4 text-green-600" />
													</div>
													<span className="text-brand-light">
														{keyPoint.key_point}
													</span>
												</div>
											)
										)}
									</div>

									{course.personas &&
										course.personas.length > 0 && (
											<>
												<h3 className="text-xl font-bold text-brand-dark mb-4">
													Who This Course Is For
												</h3>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
													{course.personas.map(
														(persona, index) => (
															<div
																key={persona.id}
																className="flex items-start gap-3"
															>
																<div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
																	<Check className="w-4 h-4 text-blue-600" />
																</div>
																<span className="text-brand-light">
																	{
																		persona.persona
																	}
																</span>
															</div>
														)
													)}
												</div>
											</>
										)}
								</div>
							)}

							{/* Lessons Tab Content */}
							{activeTab === "lessons" && (
								<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-8">
									<h2 className="text-2xl font-bold text-brand-dark mb-6">
										Course Curriculum
									</h2>

									{course.sections?.map(
										(section, sectionIndex) => (
											<div
												key={section.id}
												className={`border border-[#DCDEDD] rounded-[16px] ${sectionIndex < (course.sections?.length || 0) - 1 ? "mb-4" : ""}`}
											>
												<div className="p-6 border-b border-[#DCDEDD] bg-gray-50">
													<div className="flex items-center justify-between">
														<h3 className="text-lg font-bold text-brand-dark">
															Section{" "}
															{
																section.order_index
															}
															: {section.title}
														</h3>
														<span className="text-sm text-gray-600">
															{
																section.total_lessons
															}{" "}
															lessons •{" "}
															{(() => {
																const totalMinutes =
																	section.lessons.reduce(
																		(
																			total,
																			lesson
																		) =>
																			total +
																			lesson.duration_minutes,
																		0
																	);
																const hours =
																	Math.floor(
																		totalMinutes /
																			60
																	);
																const minutes =
																	totalMinutes %
																	60;
																return minutes >
																	0
																	? `${hours}.${Math.round((minutes / 60) * 10)} hours`
																	: `${hours} hours`;
															})()}
														</span>
													</div>
												</div>
												<div className="p-6 space-y-4">
													{section.lessons &&
													section.lessons.length >
														0 ? (
														section.lessons.map(
															(
																lesson,
																lessonIndex
															) => (
																<div
																	key={
																		lesson.id
																	}
																	className={`flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0`}
																>
																	<div className="flex items-center gap-3">
																		{lesson.content_type ===
																		"VIDEO" ? (
																			<Play className="w-5 h-5 text-blue-600" />
																		) : (
																			<FileText className="w-5 h-5 text-green-600" />
																		)}
																		<span className="text-brand-dark">
																			{
																				lesson.title
																			}
																		</span>
																	</div>
																	<span className="text-sm text-gray-600">
																		{Math.floor(
																			lesson.duration_minutes /
																				60
																		) > 0
																			? `${Math.floor(lesson.duration_minutes / 60)}:${(lesson.duration_minutes % 60).toString().padStart(2, "0")}`
																			: `${lesson.duration_minutes}:00`}
																	</span>
																</div>
															)
														)
													) : (
														<div className="py-4 text-center">
															<span className="text-gray-500 text-sm">
																No lessons
																available
															</span>
														</div>
													)}
												</div>
											</div>
										)
									)}

									{(!course.sections ||
										course.sections.length === 0) && (
										<div className="text-center py-8">
											<p className="text-gray-500">
												No curriculum available yet.
											</p>
										</div>
									)}
								</div>
							)}

							{/* Benefits Tab Content */}
							{activeTab === "benefits" && (
								<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-8">
									<h2 className="text-2xl font-bold text-brand-dark mb-6">
										Course Benefits
									</h2>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										{[
											{
												icon: "🚀",
												color: "blue",
												title: "Career Advancement",
												description:
													"Master one of the most in-demand frontend frameworks and boost your career prospects.",
											},
											{
												icon: "💻",
												color: "green",
												title: "Hands-on Projects",
												description:
													"Build 5+ real-world projects that you can showcase in your portfolio.",
											},
											{
												icon: "👥",
												color: "purple",
												title: "Community Support",
												description:
													"Join a community of 15k+ students and get help when you need it.",
											},
											{
												icon: "⏰",
												color: "orange",
												title: "Lifetime Access",
												description:
													"Access course content forever, including future updates and new lessons.",
											},
											{
												icon: "🏆",
												color: "yellow",
												title: "Industry Certification",
												description:
													"Receive a verified certificate upon completion to showcase your skills.",
											},
											{
												icon: "🎧",
												color: "red",
												title: "Expert Support",
												description:
													"Get direct access to instructor for questions and code reviews.",
											},
										].map((benefit, index) => (
											<div
												key={index}
												className="flex items-start gap-4"
											>
												<div
													className={`w-12 h-12 bg-${benefit.color}-50 rounded-[12px] flex items-center justify-center flex-shrink-0 text-xl`}
												>
													{benefit.icon}
												</div>
												<div>
													<h3 className="text-lg font-bold text-brand-dark mb-2">
														{benefit.title}
													</h3>
													<p className="text-brand-light">
														{benefit.description}
													</p>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Testimonials Tab Content */}
							{activeTab === "testimonials" && (
								<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-8">
									<h2 className="text-2xl font-bold text-brand-dark mb-6">
										Student Testimonials
									</h2>

									<div className="space-y-6">
										{/* Static dummy testimonials */}
										{[
											{
												id: 1,
												rating: 5,
												review_text:
													"This course completely transformed my understanding of React. The instructor's explanations are crystal clear, and the projects are incredibly practical. I landed my dream job as a React developer just 3 months after completing this course!",
												student: {
													name: "Sarah Johnson",
													profile: {
														avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=200&h=200&fit=crop&crop=face",
													},
												},
												created_at:
													"2024-01-15T10:30:00Z",
												jobTitle:
													"Frontend Developer at TechCorp",
											},
											{
												id: 2,
												rating: 5,
												review_text:
													"The hands-on approach and real-world projects made all the difference. I went from knowing basic JavaScript to building complex React applications. The community support is also amazing!",
												student: {
													name: "Michael Chen",
													profile: {
														avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
													},
												},
												created_at:
													"2024-02-08T14:20:00Z",
												jobTitle:
													"Full Stack Developer at StartupHub",
											},
											{
												id: 3,
												rating: 5,
												review_text:
													"Best React course I've ever taken! The instructor explains complex concepts in a way that's easy to understand. The certificate I earned helped me get a 40% salary increase.",
												student: {
													name: "Emma Rodriguez",
													profile: {
														avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
													},
												},
												created_at:
													"2024-02-22T16:45:00Z",
												jobTitle:
													"Senior React Developer at InnovateNow",
											},
											{
												id: 4,
												rating: 4,
												review_text:
													"Great course with excellent content and structure. The projects really helped me understand how to apply React concepts in real scenarios. Would definitely recommend to anyone starting with React.",
												student: {
													name: "David Kim",
													profile: {
														avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
													},
												},
												created_at:
													"2024-03-05T09:15:00Z",
												jobTitle:
													"Junior Developer at WebSolutions",
											},
											{
												id: 5,
												rating: 5,
												review_text:
													"Amazing instructor and well-structured curriculum. The course covers everything from basics to advanced topics. I feel confident building React apps now and already started working on my own projects!",
												student: {
													name: "Lisa Wang",
													profile: {
														avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face",
													},
												},
												created_at:
													"2024-03-12T11:30:00Z",
												jobTitle:
													"Frontend Engineer at TechFlow",
											},
										].map((review) => (
											<div
												key={review.id}
												className="border border-[#DCDEDD] rounded-[16px] p-6"
											>
												<div className="flex items-center gap-1 mb-4">
													{[1, 2, 3, 4, 5].map(
														(star) => (
															<Star
																key={star}
																className={`w-5 h-5 ${
																	star <=
																	review.rating
																		? "text-yellow-400 fill-current"
																		: "text-gray-300"
																}`}
															/>
														)
													)}
													<span className="ml-2 text-sm font-semibold text-gray-700">
														{review.rating}.0
													</span>
												</div>
												<p className="text-brand-light text-base leading-relaxed mb-6">
													"{review.review_text}"
												</p>
												<div className="flex items-center gap-3">
													<img
														src={getAvatarSrc(
															review.student
																?.profile?.avatar,
															review.student.name
														)}
														alt={
															review.student.name
														}
														onError={(e) => {
															e.currentTarget.src =
																getAvatarSrc(
																	undefined,
																	review
																		.student
																		.name
																);
														}}
														className="w-12 h-12 rounded-full object-cover"
													/>
													<div>
														<div className="text-brand-dark text-base font-semibold">
															{
																review.student
																	.name
															}
														</div>
														<div className="text-gray-500 text-sm">
															{review.jobTitle}
														</div>
													</div>
												</div>
											</div>
										))}

										{/* Show API reviews if available */}
										{course.reviews &&
											course.reviews.length > 0 &&
											course.reviews.map((review) => (
												<div
													key={`api-${review.id}`}
													className="border border-[#DCDEDD] rounded-[16px] p-6"
												>
													<div className="flex items-center gap-1 mb-4">
														{[1, 2, 3, 4, 5].map(
															(star) => (
																<Star
																	key={star}
																	className={`w-5 h-5 ${
																		star <=
																		review.rating
																			? "text-yellow-400 fill-current"
																			: "text-gray-300"
																	}`}
																/>
															)
														)}
														<span className="ml-2 text-sm font-semibold text-gray-700">
															{review.rating}.0
														</span>
													</div>
													<p className="text-brand-light text-base leading-relaxed mb-6">
														"{review.review_text}"
													</p>
													<div className="flex items-center gap-3">
														<img
															src={getAvatarSrc(
																review.student
																	?.profile
																	?.avatar,
																review.student
																	.name
															)}
															alt={
																review.student
																	.name
															}
															onError={(e) => {
																e.currentTarget.src =
																	getAvatarSrc(
																		undefined,
																		review
																			.student
																			.name
																	);
															}}
															className="w-12 h-12 rounded-full object-cover"
														/>
														<div>
															<div className="text-brand-dark text-base font-semibold">
																{
																	review
																		.student
																		.name
																}
															</div>
															<div className="text-gray-500 text-sm">
																{new Date(
																	review.created_at
																).toLocaleDateString(
																	"en-US",
																	{
																		year: "numeric",
																		month: "long",
																		day: "numeric",
																	}
																)}
															</div>
														</div>
													</div>
												</div>
											))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Floating Enrollment Card */}
					<div className="lg:col-span-1">
						<CourseEnrollmentCard
							courseId={courseId}
							course={course}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
