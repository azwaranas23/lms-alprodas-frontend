import { topicsService } from "~/services/topics.service";
import { topicKeys } from "~/constants/api";
import { useBaseMutation } from "~/hooks/useBaseMutation";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateTopic() {
  return useBaseMutation({
    mutationFn: (data: FormData) => topicsService.createTopic(data),
    invalidateKeys: [topicKeys.lists()],
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      topicsService.updateTopic(id, data),
    onSuccessCallback: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: topicKeys.detail(id) });
    },
    invalidateKeys: [topicKeys.lists()],
  });
}

export function useDeleteTopic() {
  return useBaseMutation({
    mutationFn: (id: number) => topicsService.deleteTopic(id),
    invalidateKeys: [topicKeys.lists()],
  });
}