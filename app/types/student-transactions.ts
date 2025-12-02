export interface StudentTransaction {
	id: string;
	order_id: string;
	transaction_date: string;
	amount: number;
	status: string;
	course: {
		title: string;
		image?: string;
	};
}

export interface StudentTransactionsParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface StudentTransactionsResponse {
	message: string;
	data: {
		items: StudentTransaction[];
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