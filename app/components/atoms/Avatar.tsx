import { getAvatarSrc } from "~/utils/formatters";

export interface AvatarProps {
	src?: string;
	name?: string;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

const sizeClasses = {
	sm: "w-8 h-8",
	md: "w-12 h-12",
	lg: "w-16 h-16",
	xl: "w-20 h-20",
};

const fallbackAvatarUrls = [
	"https://images.unsplash.com/photo-1494790108755-2616b612b047",
	"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
	"https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
	"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
	"https://images.unsplash.com/photo-1544725176-7c40e5a71c5e",
	"https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
	"https://images.unsplash.com/photo-1517841905240-472988babdf9",
	"https://images.unsplash.com/photo-1463453091185-61582044d556",
];

// Simple hash function to generate consistent index from string
const hashString = (str: string): number => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash);
};

export function Avatar({
	src,
	name,
	size = "md",
	className = "",
}: AvatarProps) {
	const sizeClass = sizeClasses[size];

	return (
		<div
			className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 ${className}`}
		>
			<img
				src={getAvatarSrc(src, name)}
				alt={name || "User"}
				className="w-full h-full object-cover"
				onError={(e) => {
					const target = e.target as HTMLImageElement;
					// Use hash of name or src to get consistent fallback avatar
					const identifier = name || src || "User";
					const index =
						hashString(identifier) % fallbackAvatarUrls.length;
					target.src = fallbackAvatarUrls[index];
					target.onerror = null; // Prevent infinite loop
				}}
			/>
		</div>
	);
}
