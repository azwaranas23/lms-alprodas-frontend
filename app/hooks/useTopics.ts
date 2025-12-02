import { useState, useEffect } from 'react';
import { topicsService, type Topic, type GetTopicsParams } from '~/services/topics.service';

export function useTopics(params: GetTopicsParams = {}) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0,
  });

  const fetchTopics = async (fetchParams: GetTopicsParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await topicsService.getTopics({ ...params, ...fetchParams });
      setTopics(response.data.items);
      setMeta({
        total: response.data.meta.total,
        page: response.data.meta.page,
        per_page: response.data.meta.limit,
        total_pages: response.data.meta.total_pages,
      });
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [params.page, params.limit, params.search, params.sort, params.order]);

  const refetch = (newParams?: GetTopicsParams) => {
    fetchTopics(newParams);
  };

  return {
    topics,
    loading,
    error,
    meta,
    refetch,
  };
}