import { toast } from "sonner";

const API_BASE = "/api";

export async function copyAudioUrl(url: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Audio URL copied", {
      description: "Paste it wherever you need it.",
      duration: 2500,
    });
  } catch {
    // Fallback for older browsers / insecure contexts
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    toast.success("Audio URL copied", {
      description: "Paste it wherever you need it.",
      duration: 2500,
    });
  }
}


export async function recordDownload(trackId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/tracks/${trackId}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // API not available — silently ignore in demo mode
  }
}

export async function downloadTrack(audioUrl: string, trackId: string): Promise<void> {
  recordDownload(trackId);
  try {
    toast("Downloading track...", { id: "download-" + trackId });
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = audioUrl.split("/").pop() || "download.mp3";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success("Download started", { id: "download-" + trackId });
  } catch (error) {
    console.error("Fetch failed (CORS?), falling back to direct navigation", error);
    // Fallback: open in new tab if CORS blocks fetch
    window.open(audioUrl, "_blank");
    toast.dismiss("download-" + trackId);
  }
}
