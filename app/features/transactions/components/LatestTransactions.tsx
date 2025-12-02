import { LatestTransactions as BaseLatestTransactions } from '~/components/organisms/LatestTransactions';

interface Transaction {
	id: number;
	order_id: string;
	amount: number;
	status: string;
	payment_method: string;
	transaction_date: string;
	course: {
		id: number;
		title: string;
		image?: string;
	};
	student: {
		id: number;
		name: string;
		email: string;
	};
}

interface LatestTransactionsProps {
	transactions: Transaction[];
}

export function LatestTransactions({ transactions }: LatestTransactionsProps) {
	return (
		<BaseLatestTransactions
			transactions={transactions}
			title="Latest Transactions"
			showDetailsButton={true}
			useCompactCurrency={false}
		/>
	);
}
