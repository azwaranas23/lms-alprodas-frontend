import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/withdrawals";
import { type Withdrawal } from "~/services/withdrawals.service";
import {
  useMyWithdrawals,
  useWithdrawalBalance,
} from "~/hooks/api/useWithdrawals";
import { MentorRoute } from "~/features/auth/components/RoleBasedRoute";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
} from "~/utils/formatters";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Withdrawals - LMS Alprodas" },
    {
      name: "description",
      content: "Manage your withdrawal requests and earnings",
    },
  ];
}
import {
  Banknote,
  Search,
  CheckCircle,
  ChevronDown,
  Download,
  Filter,
  Eye,
  Wallet,
  Clock,
  FileText,
  AlertCircle,
  TrendingUp,
  Plus,
} from "lucide-react";
import { MentorLayout } from "~/components/templates/MentorLayout";
import { Header } from "~/components/templates/Header";
import { StatsCard } from "~/components/atoms/StatsCard";
import { Pagination } from "~/components/molecules/Pagination";

function getStatusBadgeClasses(status: string) {
  switch (status) {
    case "COMPLETED":
      return "px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full";
    case "PENDING":
      return "px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full";
    case "REJECTED":
      return "px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full";
    default:
      return "px-3 py-1 bg-gray-100 text-gray-800 text-sm font-semibold rounded-full";
  }
}

export default function MentorWithdrawalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // API status filter mapping
  const getApiStatusFilter = () => {
    switch (statusFilter) {
      case "Pending":
        return "PENDING";
      case "COMPLETED":
        return "COMPLETED";
      case "Rejected":
        return "REJECTED";
      default:
        return undefined;
    }
  };

  // Fetch withdrawals data
  const {
    data: withdrawalsResponse,
    isLoading: isLoadingWithdrawals,
    error: withdrawalsError,
  } = useMyWithdrawals({
    page: currentPage,
    limit: itemsPerPage,
    status: getApiStatusFilter(),
  });

  // Fetch balance data
  const { data: balanceResponse, isLoading: isLoadingBalance } =
    useWithdrawalBalance();

  // Extract data from response
  const withdrawalsData = withdrawalsResponse?.data;
  const balanceData = balanceResponse?.data;

  // Filter withdrawals by search query (client-side)
  const filteredRequests =
    withdrawalsData?.items?.filter(
      (withdrawal) =>
        withdrawal.id.toString().includes(searchQuery) ||
        withdrawal.amount.toString().includes(searchQuery) ||
        withdrawal.bank_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        withdrawal.withdrawal_code
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    ) || [];

  const totalPages = withdrawalsData?.meta?.total_pages || 1;

  return (
    <MentorRoute>
      <PermissionRoute requiredPermission="withdrawals.read">
        <MentorLayout>
          <Header
            title="Withdrawals"
            subtitle="Manage your earnings and withdrawal requests"
          />

          <main className="main-content flex-1 overflow-auto p-5">
            {/* Stats Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Available Balance"
                value={
                  isLoadingBalance
                    ? "Loading..."
                    : formatCurrencyCompact(balanceData?.available_balance || 0)
                }
                subtitle="Ready for withdrawals"
                icon={Wallet}
                iconBgColor="bg-green-50"
                iconColor="text-green-600"
              />
              <StatsCard
                title="Total Earnings"
                value={
                  isLoadingBalance
                    ? "Loading..."
                    : formatCurrencyCompact(balanceData?.total_earnings || 0)
                }
                subtitle="All time earnings"
                icon={CheckCircle}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-600"
              />
              <StatsCard
                title="Total Withdrawn"
                value={
                  isLoadingBalance
                    ? "Loading..."
                    : formatCurrencyCompact(balanceData?.total_withdrawn || 0)
                }
                subtitle="Successfully withdrawn"
                icon={TrendingUp}
                iconBgColor="bg-teal-50"
                iconColor="text-teal-600"
              />
              <StatsCard
                title="Pending Amount"
                value={
                  isLoadingBalance
                    ? "Loading..."
                    : formatCurrencyCompact(
                        balanceData?.pending_withdrawals || 0
                      )
                }
                subtitle="Awaiting approval"
                icon={Clock}
                iconBgColor="bg-yellow-50"
                iconColor="text-yellow-600"
              />
              <StatsCard
                title="Success Records"
                value={
                  isLoadingBalance
                    ? "Loading..."
                    : balanceData?.total_success_count?.toString() || "0"
                }
                subtitle="Successfully completed"
                icon={FileText}
                iconBgColor="bg-purple-50"
                iconColor="text-purple-600"
              />
              <StatsCard
                title="Pending Records"
                value={
                  isLoadingBalance
                    ? "Loading..."
                    : balanceData?.total_pending_count?.toString() || "0"
                }
                subtitle="Need approval"
                icon={AlertCircle}
                iconBgColor="bg-orange-50"
                iconColor="text-orange-600"
              />
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300"
                    placeholder="Search withdrawals, mentors, amounts..."
                  />
                </div>

                {/* Filter and Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Status Filter */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-10 pr-8 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 transition-all duration-300 bg-white appearance-none"
                    >
                      <option>All Status</option>
                      <option>Pending</option>
                      <option>Completed</option>
                      <option>Rejected</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Export Button */}
                  <button className="bg-white border border-[#DCDEDD] text-brand-dark py-3 px-4 rounded-[8px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-semibold">Export</span>
                  </button>

                  {/* Filter Button */}
                  <button className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-white" />
                    <span className="text-brand-white text-base font-semibold">
                      Filter
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Withdrawal Requests */}
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-brand-dark text-xl font-bold">
                    Withdrawal Requests
                  </h3>
                  <p className="text-brand-light text-sm font-normal">
                    All mentor withdrawal requests requiring approval
                  </p>
                </div>
                <div>
                  <Link
                    to="/dashboard/mentor/withdrawals/request"
                    className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-brand-white text-base font-semibold">
                      Request Withdrawal
                    </span>
                  </Link>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingWithdrawals ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-brand-light">
                      Loading withdrawal requests...
                    </p>
                  </div>
                </div>
              ) : withdrawalsError ? (
                <div className="text-center py-12">
                  <div className="text-red-600 mb-4">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-lg font-semibold">
                      Error loading withdrawals
                    </p>
                    <p className="text-sm">Please try again later</p>
                  </div>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No withdrawal requests found
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery
                      ? "No results match your search criteria."
                      : "You haven't made any withdrawal requests yet."}
                  </p>
                </div>
              ) : (
                /* Withdrawal Cards Grid */
                <div className="grid grid-cols-1 gap-4">
                  {filteredRequests.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4"
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon and Withdrawal Info */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 bg-blue-50 rounded-[12px] flex items-center justify-center flex-shrink-0">
                            <Banknote className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-brand-dark text-base font-bold">
                              {withdrawal.withdrawal_code}
                            </h4>
                            <p className="text-brand-light text-sm">
                              Requested at {formatDate(withdrawal.requested_at)}
                            </p>
                            <p className="text-brand-light text-xs">
                              Bank: {withdrawal.bank_name}
                            </p>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right min-w-0 flex-shrink-0 mr-8">
                          <p className="text-lg font-bold text-brand-dark">
                            {formatCurrency(withdrawal.amount)}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0 mr-8">
                          <span
                            className={getStatusBadgeClasses(withdrawal.status)}
                          >
                            {withdrawal.status}
                          </span>
                        </div>

                        {/* Details Button */}
                        <div className="flex-shrink-0 ml-[40px]">
                          <Link
                            to={`/dashboard/mentor/withdrawals/${withdrawal.id}`}
                            className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-2 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4 text-white" />
                            <span className="text-brand-white text-sm font-semibold">
                              Details
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </main>
        </MentorLayout>
      </PermissionRoute>
    </MentorRoute>
  );
}
