import { BookOpen, Tag, Eye, Edit } from "lucide-react";
import { BASE_URL } from "~/constants/api";
import { Tooltip } from "~/components/atoms/Tooltip";
import type { Subject } from "~/services/subjects.service";
import { Image } from "~/components/atoms/Image";

interface SubjectCardProps {
	subject: Subject;
	onEdit?: () => void;
	onView?: () => void;
}

export function SubjectCard({ subject, onEdit, onView }: SubjectCardProps) {
	return (
		<div className="border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4">
			<div className="flex gap-4 h-full">
				<div className="w-36 h-full bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden rounded-[12px] flex-shrink-0">
					<Image
						src={subject.image || undefined}
						alt={subject.name}
						className="w-full h-full object-cover rounded-[12px]"
						imageType="subject"
						identifier={subject.id.toString()}
					/>
				</div>

				<div className="flex-1 flex flex-col min-w-0">
					<div className="flex-1 mb-3">
						<Tooltip content={subject.name}>
							<h4 className="text-brand-dark text-lg font-bold mb-2 truncate">
								{subject.name}
							</h4>
						</Tooltip>
						<p className="text-brand-light text-sm line-clamp-2 mb-3">
							{subject.description || "No description available"}
						</p>

						<div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
							<div className="flex items-center gap-2 min-w-0">
								<BookOpen className="w-4 h-4 flex-shrink-0" />
								<span>{subject.total_courses} Courses</span>
							</div>
							<div className="flex items-center gap-2 min-w-0">
								<Tag className="w-4 h-4 flex-shrink-0" />
								<Tooltip
									content={
										subject.topic?.name || "Unknown Topic"
									}
									className="flex-1 min-w-0"
								>
									<span className="truncate block">
										{subject.topic?.name || "Unknown Topic"}
									</span>
								</Tooltip>
							</div>
						</div>
					</div>

					<div className="flex gap-2">
						<button
							onClick={onView}
							className="flex-1 border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-2 flex items-center justify-center gap-2"
						>
							<Eye className="w-4 h-4 text-gray-600" />
							<span className="text-brand-dark text-sm font-semibold">
								Details
							</span>
						</button>
						<button
							onClick={onEdit}
							className="flex-1 border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-2 flex items-center justify-center gap-2"
						>
							<Edit className="w-4 h-4 text-gray-600" />
							<span className="text-brand-dark text-sm font-semibold">
								Edit
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
