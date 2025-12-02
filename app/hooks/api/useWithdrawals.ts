import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawalsService } from "~/services/withdrawals.service";
import { withdrawalKeys } from "~/constants/api";
import type { CreateWithdrawalData } from "~/services/withdrawals.service";
import type { WithdrawalFilters } from "~/types/api-filters";

// Query Hooks
export function useWithdrawal(id: number | undefined) {
  return useQuery({
    queryKey: withdrawalKeys.detail(id!),
    queryFn: () => withdrawalsService.getWithdrawalDetail(id!),
    enabled: !!id,
  });
}

export function useWithdrawals(params?: WithdrawalFilters) {
  return useQuery({
    queryKey: withdrawalKeys.list(params || {}),
    queryFn: () => withdrawalsService.getWithdrawals(params),
  });
}

export function useMyWithdrawals(params?: WithdrawalFilters) {
  return useQuery({
    queryKey: withdrawalKeys.list({ ...params, my: true }),
    queryFn: () => withdrawalsService.getMyWithdrawals(params),
  });
}

export function useWithdrawalBalance() {
  return useQuery({
    queryKey: [...withdrawalKeys.all, 'balance'],
    queryFn: () => withdrawalsService.getWithdrawalBalance(),
  });
}

// Mutation Hooks
export function useCreateWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWithdrawalData) => withdrawalsService.createWithdrawal(data),
    onSuccess: () => {
      // Invalidate withdrawal lists and balance
      queryClient.invalidateQueries({ queryKey: withdrawalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...withdrawalKeys.all, 'balance'] });
    },
  });
}

export function useValidatePassword() {
  return useMutation({
    mutationFn: (password: string) => withdrawalsService.validatePassword(password),
  });
}

export function useCheckBalance() {
  return useMutation({
    mutationFn: (amount: number) => withdrawalsService.checkBalance(amount),
  });
}