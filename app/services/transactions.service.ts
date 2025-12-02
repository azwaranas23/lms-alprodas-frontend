import { apiClient } from "~/lib/axios";

export interface Transaction {
  id: number;
  order_id: string;
  amount: number;
  base_price: number;
  ppn_amount: number;
  ppn_rate: number;
  platform_fee: number;
  platform_fee_rate: number;
  mentor_net_amount: number;
  status: string;
  payment_method?: string;
  snap_token?: string;
  snap_redirect_url?: string;
  gross_amount: number;
  currency: string;
  transaction_date: string;
  paid_at?: string;
  expired_at?: string;
  course: {
    id: number;
    title: string;
    description: string;
    price: number;
    image?: string;
    subject?: {
      id: number;
      name: string;
    };
    mentor?: {
      id: number;
      name: string;
      email: string;
      profile: {
        bio: string;
        avatar: string;
        gender: string | null;
        expertise: string;
        experience_years: number | null;
        linkedin_url: string | null;
        github_url: string | null;
      };
    };
  };
  student: {
    id: number;
    name: string;
    email: string;
    profile?: {
      bio: string;
      avatar: string;
      gender: string | null;
      expertise: string;
      experience_years: number | null;
      linkedin_url: string | null;
      github_url: string | null;
    };
  };
}

export interface TransactionsListParams {
  page?: number;
  limit?: number;
  status?: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
}

export interface TransactionsListResponse {
  message: string;
  data: {
    items: Transaction[];
    meta: {
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

export interface TransactionDetailResponse {
  message: string;
  data: Transaction;
}

export interface CheckoutRequest {
  course_id: number;
}

export interface CheckoutResponse {
  message: string;
  data: {
    order_id: string;
    snap_token: string;
    redirect_url: string;
    base_price: number;
    ppn_amount: number;
    platform_fee: number;
    mentor_net_amount: number;
    total_amount: number;
    currency: string;
    status: string;
    expires_at: string;
    course: {
      id: number;
      title: string;
      price: number;
    };
    customer: {
      name: string;
      email: string;
    };
  };
}

export const transactionsService = {
  async getTransactions(params?: TransactionsListParams): Promise<TransactionsListResponse> {
    const response = await apiClient.get("/transactions", { params });
    return response.data;
  },

  async getTransactionById(id: number): Promise<TransactionDetailResponse> {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  async checkout(data: CheckoutRequest): Promise<CheckoutResponse> {
    const response = await apiClient.post("/transactions/checkout", data);
    return response.data;
  }
};