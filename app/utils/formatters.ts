export const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

export const formatCurrencyCompact = (amount: number): string => {
	if (amount >= 1000000000) {
		return `Rp ${(amount / 1000000000).toFixed(1).replace(/\.0$/, "")}B`;
	}
	if (amount >= 1000000) {
		return `Rp ${(amount / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
	}
	if (amount >= 1000) {
		return `Rp ${(amount / 1000).toFixed(1).replace(/\.0$/, "")}K`;
	}
	return `Rp ${amount.toLocaleString("id-ID")}`;
};

export const formatDate = (dateString: string): string => {
	return new Date(dateString).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

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

// Image URLs for different content types
const topicImageUrls = [
	"https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
	"https://images.unsplash.com/photo-1551288049-bebda4e38f71",
	"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
	"https://images.unsplash.com/photo-1558655146-9f40138edfeb",
	"https://images.unsplash.com/photo-1504639725590-34d0984388bd",
	"https://images.unsplash.com/photo-1563986768609-322da13575f3",
];

const subjectImageUrls = [
	"https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
	"https://images.unsplash.com/photo-1627398242454-45a1465c2479",
	"https://images.unsplash.com/photo-1551288049-bebda4e38f71",
	"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
	"https://images.unsplash.com/photo-1558655146-9f40138edfeb",
	"https://images.unsplash.com/photo-1504639725590-34d0984388bd",
];

const courseImageUrls = [
	"https://images.unsplash.com/photo-1633356122544-f134324a6cee",
	"https://images.unsplash.com/photo-1551288049-bebda4e38f71",
	"https://images.unsplash.com/photo-1609921212029-bb5a28e60960",
	"https://images.unsplash.com/photo-1627398242454-45a1465c2479",
	"https://images.unsplash.com/photo-1504639725590-34d0984388bd",
	"https://images.unsplash.com/photo-1563986768609-322da13575f3",
];

export type ImageType = "topic" | "subject" | "course";

export const optimizeUnsplashUrl = (url: string, width = 600, quality = 80): string => {
	if (!url || !url.includes("images.unsplash.com")) return url;
	try {
		const parsedUrl = new URL(url);
		parsedUrl.searchParams.set("auto", "format");
		parsedUrl.searchParams.set("fit", "crop");
		parsedUrl.searchParams.set("w", width.toString());
		parsedUrl.searchParams.set("q", quality.toString());
		parsedUrl.searchParams.set("fm", "webp");
		return parsedUrl.toString();
	} catch (e) {
		return url;
	}
};

export const getImageSrc = (
	imagePath?: string,
	fallbackUrl?: string,
	imageType?: ImageType,
	identifier?: string
): string => {
	if (imagePath) {
		if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
			return optimizeUnsplashUrl(imagePath, 800, 80);
		}
		return `${import.meta.env.VITE_BASE_URL}${imagePath}`;
	}

	// If fallbackUrl is explicitly provided, use it
	if (fallbackUrl) {
		return optimizeUnsplashUrl(fallbackUrl, 800, 80);
	}

	// Use type-specific fallback with consistent hash-based selection
	if (imageType && identifier) {
		let urls: string[];
		switch (imageType) {
			case "topic":
				urls = topicImageUrls;
				break;
			case "subject":
				urls = subjectImageUrls;
				break;
			case "course":
				urls = courseImageUrls;
				break;
			default:
				urls = topicImageUrls;
		}
		const index = hashString(identifier) % urls.length;
		return optimizeUnsplashUrl(urls[index], 800, 80);
	}

	// Default fallback
	return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80&fm=webp";
};

export const getAvatarSrc = (avatarPath?: string, name?: string): string => {
	if (avatarPath) {
		if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
			return optimizeUnsplashUrl(avatarPath, 150, 80);
		}
		return `${import.meta.env.VITE_BASE_URL}${avatarPath}`;
	}

	// Avatar URLs from students.html - consistent per user
	const avatarUrls = [
		"https://images.unsplash.com/photo-1494790108755-2616b612b047",
		"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
		"https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
		"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
		"https://images.unsplash.com/photo-1544725176-7c40e5a71c5e",
		"https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
		"https://images.unsplash.com/photo-1517841905240-472988babdf9",
		"https://images.unsplash.com/photo-1463453091185-61582044d556",
	];

	// Use hash of name to get consistent avatar for same user
	const identifier = name || "User";
	const index = hashString(identifier) % avatarUrls.length;
	return optimizeUnsplashUrl(avatarUrls[index], 150, 80);
};

export const truncateText = (text: string, maxLength: number = 30): string => {
	if (!text) return "";
	return text.length > maxLength
		? text.substring(0, maxLength) + "..."
		: text;
};

export const maskAccountNumber = (accountNumber: string): string => {
	if (!accountNumber || accountNumber.length < 4) return accountNumber;
	const lastFour = accountNumber.slice(-4);
	const masked = "*".repeat(Math.max(0, accountNumber.length - 4));
	return masked + lastFour;
};

export const formatDuration = (minutes: number): string => {
	if (!minutes) return "0 min";
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours > 0) {
		return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
	}
	return `${mins}m`;
};

export const formatDateTime = (dateString: string): string => {
	return new Date(dateString).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export const formatNumber = (num: number): string => {
	return new Intl.NumberFormat("id-ID").format(num);
};

export const formatPercentage = (
	value: number,
	decimals: number = 0
): string => {
	return `${value.toFixed(decimals)}%`;
};
