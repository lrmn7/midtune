import type { TrackInput } from "@/types";

const API_BASE = "/api/admin";

export async function adminLogin(password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Login failed");
    throw new Error(msg);
  }
  const data = (await res.json()) as { token: string };
  return data.token;
}

function authHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function adminListTracks(token: string) {
  const res = await fetch(`${API_BASE}/tracks`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to list tracks");
  return res.json();
}

export async function adminCreateTrack(token: string, track: TrackInput) {
  const res = await fetch(`${API_BASE}/tracks`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(track),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Failed to create track");
    throw new Error(msg);
  }
  return res.json();
}

export async function adminUpdateTrack(token: string, track: TrackInput) {
  const res = await fetch(`${API_BASE}/tracks`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(track),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Failed to update track");
    throw new Error(msg);
  }
  return res.json();
}

export async function adminDeleteTrack(token: string, id: string) {
  const res = await fetch(`${API_BASE}/tracks`, {
    method: "DELETE",
    headers: authHeaders(token),
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Failed to delete track");
    throw new Error(msg);
  }
  return res.json();
}

export async function adminUploadAudio(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "Failed to upload file");
    throw new Error(msg);
  }

  const data = (await res.json()) as { url: string };
  return data.url;
}
