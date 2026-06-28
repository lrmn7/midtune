/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const onRequestPost: PagesFunction<Env> = async ({ params, request, env }) => {
  const trackId = params.id as string;
  if (!trackId) {
    return new Response(JSON.stringify({ error: "Missing track id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
    const ipHash = await hashString(clientIp + trackId);
    const userAgent = request.headers.get("User-Agent") || "";
    const uaHash = await hashString(userAgent);
    const recent = await env.DB.prepare(
      `SELECT COUNT(*) as cnt FROM download_events
       WHERE track_id = ? AND ip_hash = ? AND created_at > datetime('now', '-60 seconds')`
    )
      .bind(trackId, ipHash)
      .first<{ cnt: number }>();

    if (recent && recent.cnt > 0) {
      const track = await env.DB.prepare(`SELECT downloads FROM tracks WHERE id = ?`)
        .bind(trackId)
        .first<{ downloads: number }>();
      return new Response(JSON.stringify({ downloads: track?.downloads ?? 0, deduplicated: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    await env.DB.prepare(
      `INSERT INTO download_events (track_id, ip_hash, user_agent_hash) VALUES (?, ?, ?)`
    )
      .bind(trackId, ipHash, uaHash)
      .run();

    await env.DB.prepare(`UPDATE tracks SET downloads = downloads + 1, updated_at = datetime('now') WHERE id = ?`)
      .bind(trackId)
      .run();

    const track = await env.DB.prepare(`SELECT downloads FROM tracks WHERE id = ?`)
      .bind(trackId)
      .first<{ downloads: number }>();

    return new Response(JSON.stringify({ downloads: track?.downloads ?? 0 }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Download tracking error:", err);
    return new Response(JSON.stringify({ error: "Failed to record download" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
