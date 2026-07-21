import { useCallback, useState } from 'react';

export function useTranscript() {
  const [words, setWords] = useState<string[]>([]);

  const push = useCallback((chunk: string | string[]) => {
    const parts = Array.isArray(chunk)
      ? chunk
      : chunk.split(/\s+/).filter(Boolean);
    if (parts.length) setWords((prev) => [...prev, ...parts]);
  }, []);

  const clear = useCallback(() => setWords([]), []);

  return { words, push, clear };
}
