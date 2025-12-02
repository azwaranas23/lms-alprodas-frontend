import { useState, useEffect } from 'react';
import { subjectsService, type GetSubjectsParams, type SubjectsResponse } from '~/services/subjects.service';

export function useSubjects(params: GetSubjectsParams = {}) {
  const [subjects, setSubjects] = useState<SubjectsResponse['items']>([]);
  const [meta, setMeta] = useState<SubjectsResponse['meta']>({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async (fetchParams: GetSubjectsParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await subjectsService.getSubjects({
        ...params,
        ...fetchParams,
      });
      setSubjects(response.items);
      setMeta(response.meta);
    } catch (err: any) {
      console.error('Error fetching subjects:', err);
      setError(err.response?.data?.message || 'Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [
    params.page,
    params.limit,
    params.search,
    params.topicId,
    params.sort,
    params.order,
  ]);

  const refetch = (newParams?: GetSubjectsParams) => {
    fetchSubjects(newParams);
  };

  return {
    subjects,
    meta,
    loading,
    error,
    refetch,
  };
}