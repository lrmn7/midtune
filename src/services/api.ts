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

export function downloadTrack(audioUrl: string, trackId: string): void {
  recordDownload(trackId);
  const a = document.createElement("a");
  a.href = audioUrl;
  a.download = "";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
