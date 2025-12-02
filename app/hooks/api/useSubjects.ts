import { useQuery } from "@tanstack/react-query";
import { subjectsService } from "~/services/subjects.service";
import type { GetSubjectsParams } from "~/services/subjects.service";
import { subjectKeys } from "~/constants/api";

// Query Hooks
export function useSubjects(params?: GetSubjectsParams) {
  return useQuery({
    queryKey: subjectKeys.list(params || {}),
    queryFn: () => subjectsService.getSubjects(params),
  });
}

export function useSubject(id: number | undefined) {
  return useQuery({
    queryKey: subjectKeys.detail(id!),
    queryFn: () => subjectsService.getSubjectById(id!),
    enabled: !!id,
  });
}

// Re-export mutations from useSubjectMutations for backward compatibility
export {
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject
} from '~/hooks/mutations/useSubjectMutations';