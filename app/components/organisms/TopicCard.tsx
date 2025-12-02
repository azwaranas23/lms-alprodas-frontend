import { Link } from "react-router";
import type { Topic } from "../../types/topics";
import { Card } from "../molecules/Card";
import { Image } from "../atoms/Image";

interface TopicCardProps {
	topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
	return (
		<Link to={`/topic/${topic.id}`} className="block">
			<Card hover padding="none">
			<div className="w-full h-32 relative overflow-hidden rounded-t-[20px]">
				<Image
					src={topic.image || undefined}
					alt={topic.name}
					className="w-full h-full object-cover"
					imageType="topic"
					identifier={topic.id.toString()}
				/>
			</div>
			<div className="p-6 text-center">
				<h3 className="text-brand-dark text-lg font-bold mb-2">
					{topic.name}
				</h3>
				<p className="text-brand-light text-sm mb-4 line-clamp-2">
					{topic.description || "Explore this topic"}
				</p>
				<div className="text-blue-600 text-sm font-semibold">
					{topic.course_count}+ Courses
				</div>
			</div>
			</Card>
		</Link>
	);
}