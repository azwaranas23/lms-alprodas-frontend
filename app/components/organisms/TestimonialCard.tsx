import { Star } from "lucide-react";
import { Card } from "../molecules/Card";
import { Avatar } from "../atoms/Avatar";

interface Testimonial {
	id: number;
	content: string;
	author: {
		name: string;
		title: string;
		avatar: string;
	};
}

interface TestimonialCardProps {
	testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: Readonly<TestimonialCardProps>) {
	return (
		<div className="flex-shrink-0 w-80 mr-6">
			<Card className="p-6 testimonial-card">
			<div className="flex items-center gap-1 mb-4">
				{[1, 2, 3, 4, 5].map((star) => (
					<Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
				))}
			</div>
			<p className="text-brand-light text-base font-normal mb-6 leading-relaxed">
				"{testimonial.content}"
			</p>
			<div className="flex items-center gap-3">
				<Avatar
					src={testimonial.author.avatar}
					name={testimonial.author.name}
					size="md"
				/>
				<div>
					<div className="text-brand-dark text-sm font-semibold">
						{testimonial.author.name}
					</div>
					<div className="text-gray-500 text-sm">
						{testimonial.author.title}
					</div>
				</div>
			</div>
			</Card>
		</div>
	);
}

export type { Testimonial };