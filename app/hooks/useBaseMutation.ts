import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { logger } from "~/utils/logger";

interface BaseMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateKeys?: readonly (readonly string[])[];
  onSuccessCallback?: (data: TData, variables: TVariables) => void;
  onErrorCallback?: (error: unknown, variables: TVariables) => void;
}

export function useBaseMutation<TData = unknown, TVariables = unknown>({
  mutationFn,
  invalidateKeys = [],
  onSuccessCallback,
  onErrorCallback,
  ...options
}: BaseMutationOptions<TData, TVariables> & Omit<UseMutationOptions<TData, unknown, TVariables>, 'mutationFn'>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [...key] });
      });
      onSuccessCallback?.(data, variables);
    },
    onError: (error, variables) => {
      logger.error('Mutation failed', error as Error);
      onErrorCallback?.(error, variables);
    },
    ...options
  });
}