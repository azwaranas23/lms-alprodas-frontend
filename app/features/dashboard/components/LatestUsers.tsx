import { Avatar } from "~/components/atoms/Avatar";

interface User {
	id: number;
	name: string;
	email: string;
	created_at: string;
	avatar: string | null;
	role: {
		id: number;
		name: string;
		key: string;
	};
}

interface UserItemProps {
	user: User;
}

function UserItem({ user }: UserItemProps) {
	const getBadgeClass = (roleKey: string) => {
		switch (roleKey) {
			case "manager":
				return "badge-high-performing";
			case "mentor":
				return "badge-expert";
			case "student":
				return "badge-creative";
			default:
				return "badge-expert";
		}
	};

	return (
		<div className="flex items-center gap-3">
			<Avatar
				src={user?.avatar || undefined}
				name={user.name}
				size="lg"
			/>
			<div className="flex-1">
				<div className="flex items-center gap-2 mb-1">
					<p className="text-brand-dark text-lg font-bold">
						{user.name}
					</p>
					<span
						className={`${getBadgeClass(user.role.key)} px-2 py-1 rounded-md text-xs font-semibold`}
					>
						{user.role.name}
					</span>
				</div>
				<p className="text-brand-dark text-sm font-normal">
					{user.email}
				</p>
			</div>
			<button className="btn-details border border-[#DCDEDD] rounded-xl hover:ring-2 hover:ring-[#0C51D9] hover:text-[#0C51D9] transition-all duration-300 py-[14px] px-5 flex items-center justify-center">
				<span className="text-brand-dark text-base font-medium">
					Details
				</span>
			</button>
		</div>
	);
}

interface LatestUsersProps {
	users: User[];
}

export function LatestUsers({ users }: LatestUsersProps) {
	return (
		<div className="bg-white border border-[#DCDEDD] rounded-[20px] p-5">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-brand-dark text-lg font-bold">
					Latest Users
				</h3>
			</div>
			<div className="space-y-4">
				{users.map((user) => (
					<UserItem key={user.id} user={user} />
				))}
			</div>
		</div>
	);
}
