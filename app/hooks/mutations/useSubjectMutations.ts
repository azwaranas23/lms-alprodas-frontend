import { subjectsService } from "~/services/subjects.service";
import { subjectKeys } from "~/constants/api";
import { useBaseMutation } from "~/hooks/useBaseMutation";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: (data: FormData) => subjectsService.createSubject(data),
    onSuccessCallback: () => {
      // Also invalidate topics as subjects are related to topics
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    invalidateKeys: [subjectKeys.lists()],
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      subjectsService.updateSubject(id, data),
    onSuccessCallback: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    invalidateKeys: [subjectKeys.lists()],
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: (id: number) => subjectsService.deleteSubject(id),
    onSuccessCallback: () => {
      // Also invalidate topics as subjects are related to topics
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    invalidateKeys: [subjectKeys.lists()],
  });
}