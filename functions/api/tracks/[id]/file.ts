/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const trackId = params.id as string;
  if (!trackId) {
    return new Response("Missing track id", { status: 400 });
  }

  try {
    const track = await env.DB.prepare(`SELECT title, audio_url FROM tracks WHERE id = ?`)
      .bind(trackId)
      .first<{ title: string; audio_url: string }>();

    if (!track || !track.audio_url) {
      return new Response("Track not found", { status: 404 });
    }

    const audioResponse = await fetch(track.audio_url);
    if (!audioResponse.ok) {
      return new Response("Failed to fetch audio from storage", { status: audioResponse.status });
    }

    // Force browser to download the file instead of playing it inline
    const headers = new Headers(audioResponse.headers);
    const safeTitle = (track.title || "track").replace(/[^a-z0-9]/gi, '_').toLowerCase();
    headers.set("Content-Disposition", `attachment; filename="${safeTitle}.mp3"`);
    // Ensure CORS headers if needed
    headers.set("Access-Control-Allow-Origin", "*");

    return new Response(audioResponse.body, {
      status: audioResponse.status,
      headers,
    });
  } catch (err) {
    console.error("File proxy error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
