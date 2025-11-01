import { useState } from "react";

type UseAutoGenerateTitleResult = {
  loading: boolean;
  error: string | null;
  generateTitle: (text: string) => Promise<string>;
};

export function useAutoGenerateTitle(): UseAutoGenerateTitleResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTitle = async (text: string) => {
    if (!text) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error("Fehler beim Abrufen des Titels");
      const data = await response.json();
      return data.text || "";
    } catch (e: any) {
      setError(e.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    } return "";
  };

  return { loading, error, generateTitle };
}
