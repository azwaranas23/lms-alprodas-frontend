import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/withdrawals";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Withdrawals Management - Alprodas LMS" },
    {
      name: "description",
      content: "Manage and monitor all withdrawal requests in the system",
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
} from "lucide-react";
import { Layout } from "~/components/templates/Layout";
import { ManagerRoute } from "~/features/auth/components/RoleBasedRoute";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import { Header } from "~/components/templates/Header";
import { Button } from "~/components/atoms/Button";
import { Pagination } from "~/components/molecules/Pagination";
import { type Withdrawal } from "~/services/withdrawals.service";
import {
  useWithdrawals,
  useWithdrawalBalance,
} from "~/hooks/api/useWithdrawals";
import { getAvatarSrc } from "~/utils/formatters";

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusBadgeClasses(status: string) {
  switch (status) {
    case "COMPLETED":
      return "px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full";
    case "PENDING":
    case "PROCESSING":
      return "px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full";
    case "REJECTED":
    case "CANCELLED":
      return "px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full";
    default:
      return "px-3 py-1 bg-gray-100 text-gray-800 text-sm font-semibold rounded-full";
  }
}

function getDisplayStatus(status: string): string {
  switch (status) {
    case "COMPLETED":
      return "Approved";
    case "PENDING":
      return "Pending";
    case "PROCESSING":
      return "Processing";
    case "REJECTED":
      return "Rejected";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

export default function WithdrawalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch withdrawals data from API
  const {
    data: withdrawalsData,
    isLoading,
    error,
  } = useWithdrawals({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter !== "All Status" ? (statusFilter as any) : undefined,
  });

  // Fetch withdrawal balance
  const { data: balanceData } = useWithdrawalBalance();

  // Use API data
  const withdrawalRequests = withdrawalsData?.data?.items || [];
  const balanceInfo = balanceData?.data;

  // Filter withdrawals by search query (client-side)
  const filteredRequests = withdrawalRequests.filter(
    (withdrawal: Withdrawal) =>
      withdrawal.id.toString().includes(searchQuery) ||
      withdrawal.amount.toString().includes(searchQuery) ||
      withdrawal.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.withdrawal_code
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Use API pagination
  const totalPages = withdrawalsData?.data?.meta?.total_pages || 1;

  if (isLoading) {
    return (
      <ManagerRoute>
        <PermissionRoute requiredPermission="withdrawals.read">
          <Layout>
            <Header
              title="Withdrawal Management"
              subtitle="Monitor and approve mentor withdrawal requests"
            />
            <main className="main-content flex-1 overflow-auto p-5">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading withdrawals...</p>
                </div>
              </div>
            </main>
          </Layout>
        </PermissionRoute>
      </ManagerRoute>
    );
  }

  if (error) {
    return (
      <ManagerRoute>
        <PermissionRoute requiredPermission="withdrawals.read">
          <Layout>
            <Header
              title="Withdrawal Management"
              subtitle="Monitor and approve mentor withdrawal requests"
            />
            <main className="main-content flex-1 overflow-auto p-5">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Failed to load withdrawals
                  </h3>
                  <p className="text-gray-500">
                    There was an error loading the withdrawal data. Please try
                    again later.
                  </p>
                </div>
              </div>
            </main>
          </Layout>
        </PermissionRoute>
      </ManagerRoute>
    );
  }

  return (
    <ManagerRoute>
      <PermissionRoute requiredPermission="withdrawals.read">
        <Layout>
          <Header
            title="Withdrawal Management"
            subtitle="Monitor and approve mentor withdrawal requests"
          />

          <main className="main-content flex-1 overflow-auto p-5">
            {/* Stats Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Available Balance */}
              <div className="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand-dark text-sm font-medium">
                      Available Balance
                    </p>
                    <p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">
                      {balanceInfo?.available_balance
                        ? formatCurrency(balanceInfo.available_balance)
                        : "Rp 125M"}
                    </p>
                    <p className="text-success text-sm font-medium">
                      Ready for withdrawals
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Total Successful Withdrawals */}
              <div className="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand-dark text-sm font-medium">
                      Total Successful
                    </p>
                    <p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">
                      {balanceInfo?.total_withdrawn
                        ? formatCurrency(balanceInfo.total_withdrawn)
                        : "Rp 45M"}
                    </p>
                    <p className="text-success text-sm font-medium">
                      +Rp 2.5M this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-[16px] flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Total Pending Withdrawals */}
              <div className="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand-dark text-sm font-medium">
                      Total Pending
                    </p>
                    <p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">
                      {balanceInfo?.pending_withdrawals
                        ? formatCurrency(balanceInfo.pending_withdrawals)
                        : "Rp 8.5M"}
                    </p>
                    <p className="text-danger text-sm font-medium">
                      Awaiting approval
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-[16px] flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Total Withdrawal Records */}
              <div className="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand-dark text-sm font-medium">
                      Total Records
                    </p>
                    <p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">
                      {withdrawalsData?.data?.meta?.total?.toString() || "342"}
                    </p>
                    <p className="text-success text-sm font-medium">
                      All withdrawal requests
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-[16px] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Pending Records */}
              <div className="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand-dark text-sm font-medium">
                      Pending Records
                    </p>
                    <p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">
                      {balanceInfo?.total_pending_count?.toString() || "18"}
                    </p>
                    <p className="text-danger text-sm font-medium">
                      Need approval
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-[16px] flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Successful Records */}
              <div className="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand-dark text-sm font-medium">
                      Successful Records
                    </p>
                    <p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">
                      {balanceInfo?.total_success_count?.toString() || "324"}
                    </p>
                    <p className="text-success text-sm font-medium">
                      Completed withdrawals
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-teal-50 rounded-[16px] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
              </div>
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
                      <option>PENDING</option>
                      <option>PROCESSING</option>
                      <option>COMPLETED</option>
                      <option>REJECTED</option>
                      <option>CANCELLED</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Export Button */}
                  <Button
                    variant="outline"
                    className="py-3 px-4 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-semibold">Export</span>
                  </Button>

                  {/* Filter Button */}
                  <Button variant="primary" className="rounded-[8px] px-6 py-3">
                    <Filter className="w-4 h-4 text-white" />
                    <span className="text-brand-white text-base font-semibold">
                      Filter
                    </span>
                  </Button>
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
              </div>

              {/* Withdrawal Cards Grid */}
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Banknote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No withdrawal requests found
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : "Withdrawal requests will appear here when mentors submit them"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRequests.map((withdrawal: Withdrawal) => (
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
                              #{withdrawal.withdrawal_code}
                            </h4>
                            <p className="text-brand-light text-sm">
                              Requested at {formatDate(withdrawal.requested_at)}
                            </p>
                          </div>
                        </div>

                        {/* Mentor Info */}
                        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={getAvatarSrc(
                                withdrawal.user?.avatar || undefined,
                                withdrawal.user?.name
                              )}
                              alt={withdrawal.user?.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getAvatarSrc(
                                  undefined,
                                  withdrawal.user?.name
                                );
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-brand-dark text-base font-semibold leading-tight">
                              {withdrawal.user.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {`${withdrawal.user?.expertise} Mentor` ||
                                "Web Development Mentor"}
                            </p>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right min-w-0 flex-shrink-0 ml-[50px]">
                          <p className="text-lg font-bold text-brand-dark">
                            {formatCurrency(withdrawal.amount)}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0">
                          <span
                            className={getStatusBadgeClasses(withdrawal.status)}
                          >
                            {getDisplayStatus(withdrawal.status)}
                          </span>
                        </div>

                        {/* Details Button */}
                        <div className="flex-shrink-0 ml-[40px]">
                          <Link
                            to={`/dashboard/withdrawals/${withdrawal.id}`}
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
              {filteredRequests.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              )}
            </div>
          </main>
        </Layout>
      </PermissionRoute>
    </ManagerRoute>
  );
}
