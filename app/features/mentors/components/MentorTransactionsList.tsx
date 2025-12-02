import { useState } from "react";
import { CreditCard, Download, Filter, Search } from "lucide-react";
import { TransactionCard, type Transaction } from "~/components/organisms/TransactionCard";
import { Pagination } from "~/components/molecules/Pagination";
import { Button } from "~/components/atoms/Button";
import { Input } from "~/components/atoms/Input";
import { Card } from "~/components/molecules/Card";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { mentorTransactionsService } from "~/services/mentor-transactions.service";
import { QUERY_KEYS } from "~/constants/api";
import { BASE_URL } from "~/constants/api";
import type { MentorTransaction } from "~/types/mentor-transactions";
import { getAvatarSrc, formatCurrency } from "~/utils/formatters";


export function MentorTransactionsList() {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(6);

	const { data, isLoading, error } = useQuery({
		queryKey: [
			...QUERY_KEYS.transactions.mentor,
			currentPage,
			searchQuery,
			itemsPerPage,
		],
		queryFn: () =>
			mentorTransactionsService.getTransactions({
				page: currentPage,
				limit: itemsPerPage,
				search: searchQuery || undefined,
			}),
	});

	const transactions = data?.data?.items || [];
	const meta = data?.data?.meta;
	const totalPages = meta?.total_pages || 1;

	const currentTransactions: Transaction[] = transactions.map(
		(transaction: MentorTransaction) => ({
			id: transaction.id.toString(),
			courseTitle: transaction.course.title,
			courseCategory: "Course",
			courseImage: transaction.course.image || "",
			totalAmount: formatCurrency(transaction.amount),
			studentName: transaction.student.name,
			studentEmail: "",
			studentAvatar: getAvatarSrc(undefined, transaction.student.name),
			status: transaction.status.toLowerCase() as
				| "paid"
				| "pending"
				| "failed",
		})
	);

	const handleViewDetails = (transactionId: string) => {
		navigate(`/dashboard/mentor/transactions/${transactionId}`);
	};

	const handleExportCSV = () => {
		console.log("Exporting CSV...");
	};

	const handleFilterTransactions = () => {
		console.log("Filtering transactions...");
	};

	return (
		<main className="main-content flex-1 overflow-auto p-5">
			<Card className="p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
							<CreditCard className="w-6 h-6 text-blue-600" />
						</div>
						<div>
							<h3 className="text-brand-dark text-xl font-bold">
								My Transactions
							</h3>
							<p className="text-brand-light text-sm font-normal">
								Monitor and manage all course purchase
								transactions
							</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<Button
							variant="outline"
							onClick={handleExportCSV}
							className="py-3 px-4"
						>
							<Download className="w-4 h-4" />
							<span className="text-sm font-semibold">
								Export CSV
							</span>
						</Button>
						<Button
							variant="primary"
							onClick={handleFilterTransactions}
							className="px-4 py-3"
						>
							<Filter className="w-4 h-4 text-white" />
							<span className="text-brand-white text-sm font-semibold">
								Filter Transactions
							</span>
						</Button>
					</div>
				</div>

				{/* Search Section */}
				<div className="mb-6">
					<div className="flex items-center gap-4">
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1); // Reset to page 1 when searching
							}}
							placeholder="Search transactions..."
							variant="search"
							icon={<Search className="h-5 w-5 text-gray-400" />}
						/>
					</div>
				</div>

				{/* Transactions Grid */}
				{isLoading ? (
					<div className="text-center py-10">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<p className="mt-2 text-gray-500">
							Loading transactions...
						</p>
					</div>
				) : error ? (
					<div className="text-center py-10">
						<p className="text-red-500">
							Error loading transactions. Please try again later.
						</p>
					</div>
				) : currentTransactions.length === 0 ? (
					<div className="text-center py-10">
						<p className="text-gray-500">No transactions found</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4">
						{currentTransactions.map((transaction) => (
							<TransactionCard
								key={transaction.id}
								transaction={transaction}
								onViewDetails={handleViewDetails}
							/>
						))}
					</div>
				)}

				{/* Pagination */}
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					itemsPerPage={itemsPerPage}
					onPageChange={setCurrentPage}
					onItemsPerPageChange={(newItemsPerPage) => {
						setItemsPerPage(newItemsPerPage);
						setCurrentPage(1);
					}}
				/>
			</Card>
		</main>
	);
}
