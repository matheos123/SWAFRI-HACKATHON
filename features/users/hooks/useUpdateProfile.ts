import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { updateProfile, UpdateProfilePayload } from "../api/users.api";

interface UseUpdateProfileReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  update: (payload: UpdateProfilePayload) => Promise<void>;
  clearStatus: () => void;
}

export function useUpdateProfile(): UseUpdateProfileReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { setUser } = useAuthStore();

  const update = async (payload: UpdateProfilePayload) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await updateProfile(payload);
      setUser(updatedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    update,
    clearStatus: () => {
      setError(null);
      setSuccess(false);
    },
  };
}
