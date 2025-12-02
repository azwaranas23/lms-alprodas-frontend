import { useState, useEffect } from "react";
import { Button } from "~/components/atoms/Button";
import { Input } from "~/components/atoms/Input";
import {
	BookOpen,
	Book,
	FileText,
	Tag,
	ChevronDown,
	X,
	Search,
	Lightbulb,
	Check,
	ArrowRight,
} from "lucide-react";
import {
	subjectsService,
	type Subject as APISubject,
} from "~/services/subjects.service";
import { env } from "~/config/env";
import { courseInfoSchema, type CourseInfoData } from "~/schemas/courses";
import { z } from "zod";
import { Image } from "~/components/atoms/Image";

interface CourseData {
	name: string;
	description: string;
	subject: string;
}

interface CourseInfoStepProps {
	data: CourseData;
	onUpdate: (data: Partial<CourseData>) => void;
	onNext: () => void;
	onCancel: () => void;
}

interface Subject {
	id: number;
	name: string;
	description: string | null;
	image: string | null;
	total_courses: number;
}

export function CourseInfoStep({
	data,
	onUpdate,
	onNext,
	onCancel,
}: CourseInfoStepProps) {
	const [showSubjectModal, setShowSubjectModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Fetch subjects on component mount
	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				setLoading(true);
				const response = await subjectsService.getSubjects({
					limit: 100,
				});
				setSubjects(response.items);
			} catch (error) {
				console.error("Error fetching subjects:", error);
				// Fallback to empty array or show error
			} finally {
				setLoading(false);
			}
		};

		fetchSubjects();
	}, []);

	const selectedSubject = subjects.find(
		(s) => s.id.toString() === data.subject
	);

	const filteredSubjects = subjects.filter(
		(subject) =>
			subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(subject.description &&
				subject.description
					.toLowerCase()
					.includes(searchTerm.toLowerCase()))
	);

	const handleSubjectSelect = (subject: Subject) => {
		onUpdate({ subject: subject.id.toString() });
		setShowSubjectModal(false);
		setSearchTerm("");
		if (errors.subject) {
			setErrors((prev) => ({ ...prev, subject: "" }));
		}
	};

	const clearSubjectSelection = () => {
		onUpdate({ subject: "" });
	};

	const handleInputChange = (field: keyof CourseInfoData, value: string) => {
		onUpdate({ [field]: value });
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const validateAndNext = () => {
		// Validate the data using safeParse
		const validationResult = courseInfoSchema.safeParse({
			name: data.name,
			description: data.description,
			subject: data.subject,
		});

		if (validationResult.success) {
			// Clear errors and proceed
			setErrors({});
			onNext();
		} else {
			// Convert Zod errors to our error format
			const newErrors: Record<string, string> = {};
			if (
				validationResult.error.issues &&
				Array.isArray(validationResult.error.issues)
			) {
				validationResult.error.issues.forEach((err) => {
					if (err.path && err.path[0]) {
						newErrors[err.path[0] as string] = err.message;
					}
				});
			}
			setErrors(newErrors);
		}
	};

	return (
		<>
			<div className="flex gap-6 pl-5 items-start">
				{/* Form Section */}
				<div className="flex-1">
					<div className="space-y-6">
						{/* Course Information Section */}
						<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
									<BookOpen className="w-6 h-6 text-blue-600" />
								</div>
								<div>
									<h3 className="text-brand-dark text-xl font-bold">
										Course Information
									</h3>
									<p className="text-brand-light text-sm font-normal">
										Basic course details and subject
										category
									</p>
								</div>
							</div>

							<div className="space-y-5">
								{/* Course Name */}
								<div className="mb-4">
									<label className="block text-brand-dark text-base font-semibold mb-1">
										Course Name *
									</label>
									<Input
										type="text"
										required
										value={data.name}
										onChange={(e) =>
											handleInputChange(
												"name",
												e.target.value
											)
										}
										className="w-full pl-12 pr-4 py-3 bg-white rounded-[16px]"
										variant="search"
										icon={
											<Book className="h-5 w-5 text-gray-400" />
										}
										error={errors.name}
										placeholder="e.g. Complete React Development Masterclass"
									/>
								</div>

								{/* Course Description */}
								<div className="mb-4">
									<label className="block text-brand-dark text-base font-semibold mb-1">
										Course Description *
									</label>
									<div className="relative">
										<div className="absolute top-3 left-4 pointer-events-none">
											<FileText className="h-5 w-5 text-gray-400" />
										</div>
										<textarea
											rows={6}
											required
											value={data.description}
											onChange={(e) =>
												handleInputChange(
													"description",
													e.target.value
												)
											}
											className={`w-full pl-12 pr-4 py-3 bg-white border rounded-[16px] focus:bg-white transition-all duration-300 font-semibold ${
												errors.description
													? "border-2"
													: "border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2"
											}`}
											style={
												errors.description
													? { borderColor: "#DC2626" }
													: {}
											}
											placeholder="Describe what students will learn in this course. Include key topics, skills they'll gain, and what makes this course unique..."
										/>
									</div>
									{errors.description && (
										<p className="text-danger text-sm mt-1">
											{errors.description}
										</p>
									)}
								</div>

								{/* Subject Selection */}
								<div className="mb-4">
									<label className="block text-brand-dark text-base font-semibold mb-1">
										Subject *
									</label>
									<button
										type="button"
										onClick={() =>
											setShowSubjectModal(true)
										}
										className={`w-full border rounded-[16px] focus:bg-white transition-all duration-300 font-semibold px-4 py-3 flex items-center gap-3 text-left ${
											errors.subject
												? "border-2 border-[#DC2626] hover:border-[#DC2626] focus:border-[#DC2626]"
												: "border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2"
										}`}
									>
										<Tag className="w-5 h-5 text-gray-400" />
										<span
											className={`flex-1 ${selectedSubject ? "text-brand-dark font-semibold" : "text-[#0D2929] font-normal"}`}
										>
											{selectedSubject?.name ||
												"Select course subject"}
										</span>
										<ChevronDown className="w-4 h-4 text-gray-400" />
									</button>
									{errors.subject && (
										<p className="text-danger text-sm mt-1">
											{errors.subject}
										</p>
									)}

									{/* Selected Subject Display */}
									{selectedSubject && (
										<div className="mt-3 p-3 bg-gray-50 rounded-[12px] border border-gray-200">
											<div className="flex items-center gap-3">
												<div className="w-24 h-20 relative overflow-hidden rounded-[8px]">
													<Image
														src={
															selectedSubject.image || undefined
														}
														alt={
															selectedSubject.name
														}
														className="w-24 h-20 rounded-[8px] object-cover"
														imageType="subject"
														identifier={selectedSubject.id.toString()}
													/>
												</div>
												<div className="flex-1">
													<p className="text-brand-dark text-base font-semibold">
														{selectedSubject.name}
													</p>
													<div className="flex items-center gap-2 mt-1">
														<BookOpen className="w-4 h-4 text-gray-500" />
														<span className="text-brand-light text-xs font-medium">
															{
																selectedSubject.total_courses
															}{" "}
															courses
														</span>
													</div>
												</div>
												<Button
													variant="ghost"
													onClick={
														clearSubjectSelection
													}
													className="text-gray-400 hover:text-gray-600 p-0"
												>
													<X className="w-4 h-4" />
												</Button>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Form Navigation */}
						<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-brand-dark text-sm font-medium">
										Step 1 of 5
									</p>
									<p className="text-brand-light text-xs font-normal mt-1">
										Fill in the basic course information
									</p>
								</div>
								<div className="flex items-center gap-3">
									<Button
										variant="outline"
										onClick={onCancel}
										className="px-6 py-3"
									>
										Cancel
									</Button>
									<Button
										variant="primary"
										onClick={validateAndNext}
										className="px-6 py-3 flex items-center gap-2"
									>
										Next: Course Photos
										<ArrowRight className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Tips Section */}
				<div className="w-100 flex-shrink-0 pr-5">
					<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 top-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center">
								<Lightbulb className="w-6 h-6 text-green-600" />
							</div>
							<div>
								<h3 className="text-brand-dark text-xl font-bold">
									Course Creation Tips
								</h3>
								<p className="text-brand-light text-sm font-normal">
									Best practices for course info
								</p>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
									<Check className="w-3 h-3 text-green-600" />
								</div>
								<div>
									<p className="text-brand-dark text-base font-semibold">
										Write clear course name
									</p>
									<p className="text-brand-light text-xs font-normal">
										Use descriptive titles that explain what
										students
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
									<Check className="w-3 h-3 text-green-600" />
								</div>
								<div>
									<p className="text-brand-dark text-base font-semibold">
										Compelling description
									</p>
									<p className="text-brand-light text-xs font-normal">
										Highlight outcomes, skills gained, and
										unique value
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
									<Check className="w-3 h-3 text-green-600" />
								</div>
								<div>
									<p className="text-brand-dark text-base font-semibold">
										Choose right subject
									</p>
									<p className="text-brand-light text-xs font-normal">
										Select the most relevant category for
										discoverability
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
									<Check className="w-3 h-3 text-green-600" />
								</div>
								<div>
									<p className="text-brand-dark text-base font-semibold">
										Think like a student
									</p>
									<p className="text-brand-light text-xs font-normal">
										What would attract you to enroll in this
										course?
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
									<Check className="w-3 h-3 text-green-600" />
								</div>
								<div>
									<p className="text-brand-dark text-base font-semibold">
										Review before proceeding
									</p>
									<p className="text-brand-light text-xs font-normal">
										Ensure all information is accurate and
										complete
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Subject Selection Modal */}
			{showSubjectModal && (
				<div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
					<div className="bg-white rounded-[20px] border border-[#DCDEDD] w-full max-w-6xl mx-4 max-h-[80vh] overflow-hidden">
						{/* Modal Header */}
						<div className="p-6 border-b border-[#DCDEDD]">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
										<Tag className="w-6 h-6 text-blue-600" />
									</div>
									<div>
										<h3 className="text-brand-dark text-xl font-bold">
											Select Course Subject
										</h3>
										<p className="text-brand-light text-sm font-normal">
											Choose the main category for your
											course
										</p>
									</div>
								</div>
								<button
									type="button"
									onClick={() => setShowSubjectModal(false)}
									className="w-10 h-10 rounded-full border border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 flex items-center justify-center transition-all duration-300"
								>
									<X className="w-5 h-5 text-gray-600" />
								</button>
							</div>
						</div>

						{/* Search Bar */}
						<div className="p-6 border-b border-[#DCDEDD]">
							<Input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
								icon={
									<Search className="h-5 w-5 text-gray-400" />
								}
								placeholder="Search subjects..."
							/>
						</div>

						{/* Subject List */}
						<div className="p-6 overflow-y-auto max-h-96">
							{loading ? (
								<div className="text-center py-8">
									<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
									<p className="text-brand-light text-base font-medium">
										Loading subjects...
									</p>
								</div>
							) : (
								<>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{filteredSubjects.map((subject) => (
											<div
												key={subject.id}
												onClick={() =>
													handleSubjectSelect(subject)
												}
												className="border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4 cursor-pointer"
											>
												<div className="flex items-center gap-4">
													<div className="w-28 h-20 relative overflow-hidden rounded-[12px]">
														<Image
															src={
																subject.image || undefined
															}
															alt={subject.name}
															className="w-28 h-20 rounded-[12px] object-cover"
															imageType="subject"
															identifier={subject.id.toString()}
														/>
													</div>
													<div className="flex-1">
														<h4 className="text-brand-dark text-base font-bold">
															{subject.name}
														</h4>
														<div className="flex items-center gap-2 mt-2">
															<BookOpen className="w-4 h-4 text-gray-500" />
															<span className="text-brand-light text-xs font-medium">
																{
																	subject.total_courses
																}{" "}
																courses
															</span>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>

									{filteredSubjects.length === 0 &&
										!loading && (
											<div className="text-center py-8">
												<Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
												<p className="text-brand-light text-base font-medium">
													No subjects found
												</p>
												<p className="text-brand-light text-sm font-normal">
													Try adjusting your search
													terms
												</p>
											</div>
										)}
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
