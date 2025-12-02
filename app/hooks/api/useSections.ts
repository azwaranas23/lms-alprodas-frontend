import { useQuery } from "@tanstack/react-query";
import { sectionsService } from "~/services/sections.service";
import { sectionKeys } from "~/constants/api";

// Query Hooks
export function useSection(id: number | undefined) {
  return useQuery({
    queryKey: sectionKeys.detail(id!),
    queryFn: () => sectionsService.getSectionById(id!),
    enabled: !!id,
  });
}

export function useSectionsByCourse(courseId: number | undefined) {
  return useQuery({
    queryKey: sectionKeys.byCourse(courseId!),
    queryFn: () => sectionsService.getSectionsByCourse(courseId!),
    enabled: !!courseId,
  });
}

// Re-export mutations from useSectionMutations for backward compatibility
export {
  useCreateSection,
  useUpdateSection,
  useDeleteSection
} from '~/hooks/mutations/useSectionMutations';