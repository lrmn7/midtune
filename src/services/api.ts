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
    toast.success("Download started", { id: "download-" + trackId });
    
    const a = document.createElement("a");
    // Use the backend proxy to bypass CORS and force the download dialog
    a.href = `${API_BASE}/tracks/${trackId}/file`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download failed, falling back to direct navigation", error);
    window.open(audioUrl, "_blank");
  }
}
