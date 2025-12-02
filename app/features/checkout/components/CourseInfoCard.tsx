import { BookOpen } from "lucide-react";
import { Image } from "~/components/atoms/Image";

interface CourseInfoCardProps {
	courseData: {
		id?: number;
		thumbnail: string;
		title: string;
		category: string;
		lessons: string;
		instructor: string;
		level: string;
	};
}

export function CourseInfoCard({ courseData }: CourseInfoCardProps) {
	return (
		<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
			<div className="flex items-center gap-3 mb-6">
				<div className="w-12 h-12 bg-teal-50 rounded-[12px] flex items-center justify-center">
					<BookOpen className="w-6 h-6 text-teal-600" />
				</div>
				<div>
					<h3 className="text-brand-dark text-lg font-bold">
						Course Information
					</h3>
					<p className="text-brand-light text-sm">
						Course details and specifications
					</p>
				</div>
			</div>

			<div className="mb-6">
				<div className="w-full h-48 relative overflow-hidden rounded-[16px] mb-4">
					<Image
						src={courseData.thumbnail}
						alt={courseData.title}
						className="w-full h-full object-cover"
						imageType="course"
						identifier={courseData.title}
					/>
				</div>
				<div>
					<h4 className="text-brand-dark text-xl font-bold mb-2">
						{courseData.title}
					</h4>
					<p className="text-brand-light text-base mb-4">
						{courseData.category}
					</p>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<span className="text-brand-light text-base">Lessons</span>
					<span className="text-brand-dark text-base font-medium">
						{courseData.lessons}
					</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-brand-light text-base">
						Instructor
					</span>
					<span className="text-brand-dark text-base font-medium">
						{courseData.instructor}
					</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-brand-light text-base">Level</span>
					<span className="text-brand-dark text-base font-medium">
						{courseData.level}
					</span>
				</div>
			</div>
		</div>
	);
}
