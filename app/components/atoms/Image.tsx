import { useState } from "react";
import { getImageSrc, type ImageType } from "~/utils/formatters";

export interface ImageProps {
	readonly src?: string;
	readonly alt: string;
	readonly fallback?: string;
	readonly className?: string;
	readonly placeholder?: React.ReactNode;
	readonly imageType?: ImageType;
	readonly identifier?: string;
	readonly loading?: "lazy" | "eager";
	readonly fetchPriority?: "high" | "low" | "auto";
	readonly width?: number | string;
	readonly height?: number | string;
}

// Image URLs for different content types (for onError fallback)
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

// Simple hash function to generate consistent index from string
const hashString = (str: string): number => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.codePointAt(i) || 0;
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash);
};

export function Image({
	src,
	alt,
	fallback,
	className = "",
	placeholder,
	imageType,
	identifier,
	loading = "lazy",
	fetchPriority,
	width,
	height,
}: ImageProps) {
	const [hasError, setHasError] = useState(false);
	const imageSrc = getImageSrc(src, fallback, imageType, identifier);

	const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		setHasError(true);
		const target = e.target as HTMLImageElement;

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
			target.src = urls[index];
			target.onerror = null; // Prevent infinite loop
		} else if (fallback && target.src !== fallback) {
			target.src = fallback;
			target.onerror = null; // Prevent infinite loop
		}
	};

	if (hasError && placeholder) {
		return <div className={className}>{placeholder}</div>;
	}

	return (
		<img
			src={imageSrc}
			alt={alt}
			className={className}
			onError={handleError}
			loading={loading}
			fetchPriority={fetchPriority}
			width={width}
			height={height}
		/>
	);
}
