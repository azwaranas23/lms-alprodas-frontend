import { useEffect, useRef } from "react";
import { Play, Pause, Volume2, Maximize, Settings, FileText } from "lucide-react";
import type { LessonDetail } from "~/types/course-learning";

interface VideoPlayerProps {
	lesson: LessonDetail | null;
	onComplete?: () => void;
}

export function VideoPlayer({ lesson, onComplete }: VideoPlayerProps) {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && lesson?.video_url) {
			videoRef.current.load();
		}
	}, [lesson?.video_url]);

	if (!lesson) {
		return (
			<div className="w-full aspect-video bg-black rounded-[20px] flex items-center justify-center">
				<div className="text-center text-white">
					<Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
					<p className="text-lg opacity-75">Select a lesson to start learning</p>
				</div>
			</div>
		);
	}

	if (!lesson.video_url) {
		return (
			<div className="w-full aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-[20px] flex items-center justify-center">
				<div className="text-center">
					<FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
					<h3 className="text-xl font-semibold text-gray-900 mb-2">Text Content</h3>
					<p className="text-gray-600">This lesson contains reading material</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative w-full aspect-video bg-black rounded-[20px] overflow-hidden group">
			<video
				ref={videoRef}
				src={lesson.video_url}
				className="w-full h-full"
				controls
				controlsList="nodownload"
				onEnded={onComplete}
			>
				Your browser does not support the video tag.
			</video>
		</div>
	);
}