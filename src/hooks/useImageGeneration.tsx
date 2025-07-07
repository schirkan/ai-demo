import { useState } from "react";

export interface ProviderTiming {
  startTime?: number;
  completionTime?: number;
  elapsed?: number;
}

interface UseImageGenerationReturn {
  image: string | null;
  error: string | null;
  timing: ProviderTiming;
  isLoading: boolean;
  startGeneration: (prompt: string) => Promise<void>;
  resetState: () => void;
  activePrompt: string;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timing, setTimings] = useState<ProviderTiming>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activePrompt, setActivePrompt] = useState("");

  const resetState = () => {
    setImage(null);
    setError(null);
    setTimings({});
    setIsLoading(false);
  };

  const startGeneration = async (prompt: string) => {
    const startTime = Date.now();
    setActivePrompt(prompt);
    setIsLoading(true);
    setImage(null);
    setError(null);
    setTimings({ startTime }); // Initialize timing with start time

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      const completionTime = Date.now();
      const elapsed = completionTime - startTime;
      setTimings({ startTime, completionTime, elapsed, });
      setImage(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    image,
    error,
    timing,
    isLoading,
    startGeneration,
    resetState,
    activePrompt,
  };
}