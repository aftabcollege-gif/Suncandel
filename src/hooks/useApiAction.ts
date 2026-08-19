"use client";

import { useCallback, useState } from "react";

export function useApiAction<TArgs extends unknown[], TResult>(action: (...args: TArgs) => Promise<TResult>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      try {
        const result = await action(...args);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطای ناشناخته");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [action]
  );

  return { execute, loading, error };
}
