import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, Download, Filter, Search } from 'lucide-react';
import { TransactionCard, type Transaction } from '~/components/organisms/TransactionCard';
import { Pagination } from '~/components/molecules/Pagination';
import { useNavigate } from 'react-router';
import { transactionsService } from '~/services/transactions.service';
import { BASE_URL } from '~/constants/api';

export function TransactionsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Fetch transactions data from API with search query
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["transactions", currentPage, itemsPerPage, searchQuery],
    queryFn: () => transactionsService.getTransactions({
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery || undefined
    }),
  });

  const transactions = transactionsData?.data?.items || [];

  // Transform API data to match TransactionCard component format
  const transformedTransactions: Transaction[] = transactions.map((transaction) => ({
    id: String(transaction.id),
    courseTitle: transaction.course.title,
    courseCategory: 'Course', // Category not in API response
    courseImage: transaction.course.image ? `${BASE_URL}${transaction.course.image}` : 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    totalAmount: `Rp ${transaction.amount.toLocaleString('id-ID')}`,
    studentName: transaction.student.name,
    studentEmail: transaction.student.email,
    studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', // Default avatar as not in API
    status: transaction.status.toLowerCase() as 'paid' | 'pending' | 'failed'
  }));

  const totalPages = transactionsData?.data?.meta?.total_pages || 1;
  const currentTransactions = transformedTransactions;

  const handleViewDetails = (transactionId: string) => {
    navigate(`/dashboard/transactions/${transactionId}`);
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
  };

  const handleFilterTransactions = () => {
    console.log('Filtering transactions...');
  };

  if (isLoading) {
    return (
      <main className="main-content flex-1 overflow-auto p-5">
        <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content flex-1 overflow-auto p-5">
      <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-brand-dark text-xl font-bold">All Transactions</h3>
              <p className="text-brand-light text-sm font-normal">Monitor and manage all course purchase transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExportCSV}
              className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-4 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-semibold">Export CSV</span>
            </button>
            <button
              onClick={handleFilterTransactions}
              className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-white" />
              <span className="text-brand-white text-sm font-semibold">Filter Transactions</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to page 1 when searching
                }}
                className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                placeholder="Search transactions..."
              />
            </div>
          </div>
        </div>

        {/* Transactions Grid */}
        {currentTransactions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search criteria" : "Transactions will appear here once students make purchases"}
            </p>
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
        {transactionsData?.data?.meta && (
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
        )}
      </div>
    </main>
  );
}