import { useQuery } from "@tanstack/react-query";
import { topicsService } from "~/services/topics.service";
import type { GetTopicsParams } from "~/services/topics.service";
import { topicKeys } from "~/constants/api";

// Query Hooks
export function useTopics(params?: GetTopicsParams) {
  return useQuery({
    queryKey: topicKeys.list(params || {}),
    queryFn: () => topicsService.getTopics(params),
  });
}

export function useTopic(id: number | undefined) {
  return useQuery({
    queryKey: topicKeys.detail(id!),
    queryFn: () => topicsService.getTopicById(id!),
    enabled: !!id,
  });
}

// Re-export mutations from useTopicMutations for backward compatibility
export {
  useCreateTopic,
  useUpdateTopic,
  useDeleteTopic
} from '~/hooks/mutations/useTopicMutations';