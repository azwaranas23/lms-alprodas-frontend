export interface MentorTransaction {
	id: string;
	order_id: string;
	transaction_date: string;
	amount: number;
	status: string;
	course: {
		title: string;
		image?: string;
	};
	student: {
		name: string;
	};
}

export interface MentorTransactionsParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface MentorTransactionsResponse {
	message: string;
	data: {
		items: MentorTransaction[];
		meta: {
			page: number;
			limit: number;
			total: number;
			total_pages: number;
			has_next: boolean;
			has_prev: boolean;
		};
	};
}