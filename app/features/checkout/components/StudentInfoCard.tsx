import { User } from "lucide-react";
import { getAvatarSrc } from "~/utils/formatters";

interface StudentInfoCardProps {
	studentData: {
		avatar: string;
		name: string;
		email: string;
		phone: string;
		location: string;
	};
}

export function StudentInfoCard({ studentData }: StudentInfoCardProps) {
	return (
		<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
			<div className="flex items-center gap-3 mb-4">
				<div className="w-12 h-12 bg-indigo-50 rounded-[12px] flex items-center justify-center">
					<User className="w-6 h-6 text-indigo-600" />
				</div>
				<div>
					<h3 className="text-brand-dark text-lg font-bold">
						Student Information
					</h3>
					<p className="text-brand-light text-sm">
						Your profile details
					</p>
				</div>
			</div>

			<div className="flex items-center gap-4 mb-4">
				<div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
					<img
						src={studentData.avatar}
						alt="Student"
						className="w-full h-full object-cover"
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							target.src = getAvatarSrc(
								undefined,
								studentData.name
							);
						}}
					/>
				</div>
				<div className="flex-1">
					<h4 className="text-brand-dark text-lg font-bold">
						{studentData.name}
					</h4>
					<p className="text-brand-light text-base">
						{studentData.email}
					</p>
				</div>
			</div>

			<div className="space-y-3">
				<div className="flex justify-between items-center">
					<span className="text-brand-light text-base">Email</span>
					<span className="text-brand-dark text-base font-medium">
						{studentData.email}
					</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-brand-light text-base">Location</span>
					<span className="text-brand-dark text-base font-medium">
						{studentData.location}
					</span>
				</div>
			</div>
		</div>
	);
}
