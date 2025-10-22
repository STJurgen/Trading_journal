import { useCallback, useEffect, useState } from 'react';

const useFetch = (fetcher, { immediate = true, dependencies = [] } = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(immediate));

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true);
      try {
        const result = await fetcher(...args);
        setData(result);
        setError(null);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetcher, ...dependencies]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, error, isLoading, refetch: execute };
};

export default useFetch;
