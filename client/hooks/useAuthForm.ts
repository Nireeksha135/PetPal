import { useState, useCallback } from "react";
import { getApiErrorMessage } from "@/services/api";

export function useAuthForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runSubmit = useCallback(async (fn: () => Promise<void>) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await fn();
    } catch (error) {
      setServerError(getApiErrorMessage(error));
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { serverError, isSubmitting, runSubmit, setServerError };
}
