import { Calendar, Users } from "lucide-react";

interface PurchasedCourseData {
	title: string;
	category: string;
	price: string;
	thumbnail: string;
	studentsEnrolled: string;
	purchaseDate: string;
}

interface PurchasedCourseCardProps {
	courseData: PurchasedCourseData;
}

export function PurchasedCourseCard({ courseData }: PurchasedCourseCardProps) {
	return (
		<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-12">
			<div className="mb-6">
				<div className="w-full h-64 rounded-[12px] overflow-hidden border border-[#DCDEDD] mb-4">
					<img
						src={courseData.thumbnail}
						alt="Course Thumbnail"
						className="w-full h-64 object-cover"
						onError={(e) => {
							e.currentTarget.src =
								"https://images.unsplash.com/photo-1516321318423-f06f85e504b3";
						}}
					/>
				</div>
				<div className="text-center">
					<h3 className="text-brand-dark text-xl font-bold mb-2">
						{courseData.title}
					</h3>
					<p className="text-brand-light text-base font-normal">
						{courseData.category} • {courseData.price}
					</p>
				</div>
			</div>
			<div className="flex items-center justify-between pt-4 border-t border-[#DCDEDD]">
				<div className="flex items-center gap-2">
					<Calendar className="w-4 h-4 text-gray-500" />
					<span className="text-brand-light text-sm font-medium">
						{courseData.purchaseDate}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Users className="w-4 h-4 text-gray-500" />
					<span className="text-brand-light text-sm font-medium">
						{courseData.studentsEnrolled}
					</span>
				</div>
			</div>
		</div>
	);
}
