import { useCallback, useRef, useState } from "react";

export function useCommonLoading() {
  const isLoading = useRef<Record<string, boolean>>({});

  const toggleLoading = useState(false);

  const setLoading = useCallback((key: any) => {
    isLoading.current[key] = true;
    toggleLoading[1]((prevState) => !prevState);
  }, []);

  const finishLoading = useCallback((key: any) => {
    isLoading.current[key] = false;
  }, []);
  const finishLoadingState = useCallback((key: any) => {
    isLoading.current[key] = false;
    toggleLoading[1]((prevState) => !prevState);
  }, []);

  return {
    isLoading: isLoading.current,
    setLoading,
    finishLoading,
    finishLoadingState,
  };
}

export function setCommonSWRLoading(data: any, error: any, isLoading: boolean) {
  return !data && !error && isLoading;
}
