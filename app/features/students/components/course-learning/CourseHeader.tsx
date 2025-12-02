import { ArrowLeft, Bookmark, Share2, Settings } from "lucide-react";
import { Link } from "react-router";
import { getAvatarSrc } from "~/utils/formatters";
import type { CourseLearningData } from "~/types/course-learning";

interface CourseHeaderProps {
	course: CourseLearningData;
	userName?: string;
	userAvatar?: string;
}

export function CourseHeader({ course, userName, userAvatar }: CourseHeaderProps) {
	return (
		<header className="bg-white border-b border-[#DCDEDD] px-6 py-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link
						to="/dashboard/student/my-courses"
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
					</Link>
					<div>
						<h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
						<p className="text-sm text-gray-600">
							by {course.mentor?.name || "Unknown Mentor"}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<Bookmark className="w-5 h-5" />
					</button>
					<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<Share2 className="w-5 h-5" />
					</button>
					<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<Settings className="w-5 h-5" />
					</button>
					<div className="flex items-center gap-3 ml-4 pl-4 border-l border-[#DCDEDD]">
						<img
							src={getAvatarSrc(userAvatar, userName)}
							alt={userName}
							className="w-8 h-8 rounded-full"
						/>
						<span className="text-sm font-medium text-gray-900">{userName}</span>
					</div>
				</div>
			</div>
		</header>
	);
}