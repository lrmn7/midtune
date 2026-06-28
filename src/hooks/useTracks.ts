import { useState, useEffect } from "react";
import type { Track } from "@/types";
import { tracks as fallbackTracks, getTotalDownloads as getFallbackDownloads } from "@/data/tracks";

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>(fallbackTracks);
  const [totalDownloads, setTotalDownloads] = useState<number>(getFallbackDownloads());
  const [loading, setLoading] = useState(true);

  const fetchTracks = async () => {
    try {
      const res = await fetch("/api/tracks");
      if (!res.ok) throw new Error("API not ready");
      const data: Track[] = await res.json();
      setTracks(data);
      const downloads = data.reduce((sum, t) => sum + (t.downloads || 0), 0);
      setTotalDownloads(downloads);
    } catch {
      setTracks(fallbackTracks);
      setTotalDownloads(getFallbackDownloads());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  return { tracks, totalDownloads, loading, refetch: fetchTracks };
}
