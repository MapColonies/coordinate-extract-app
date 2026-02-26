import { useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

export const useDebounce = (onUpdate: (value: string) => void, debounceTime: number = 500) => {
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onUpdate(value);
      }, debounceTime),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  return debouncedSearch;
};
