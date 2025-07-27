import { ImageRequest, ImageResponse } from "@/app/api/image/route";
import { useState } from "react";

export interface ProviderTiming {
  startTime?: number;
  completionTime?: number;
  elapsed?: number;
}

interface UseImageGenerationReturn {
  image?: string;
  error?: Error;
  timing: ProviderTiming;
  isLoading: boolean;
  startGeneration: (prompt: string, options?: { quality?: string, style?: string, seed?: number }) => Promise<void>;
  resetState: () => void;
  activePrompt: string;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [image, setImage] = useState<string>();
  const [error, setError] = useState<Error>();
  const [timing, setTimings] = useState<ProviderTiming>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activePrompt, setActivePrompt] = useState("");

  const resetState = () => {
    setImage(undefined);
    setError(undefined);
    setTimings({});
    setIsLoading(false);
  };

  const startGeneration = async (prompt: string, options?: { quality?: string, style?: string, seed?: number }) => {
    const startTime = Date.now();
    setActivePrompt(prompt);
    setIsLoading(true);
    setImage(undefined);
    setError(undefined);
    setTimings({ startTime }); // Initialize timing with start time

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, ...options } as ImageRequest),
      });
      const data = await response.json() as ImageResponse;
      if (!response.ok || !data.url) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      const completionTime = Date.now();
      const elapsed = completionTime - startTime;
      setTimings({ startTime, completionTime, elapsed, });
      setImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unexpected error occurred"));
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