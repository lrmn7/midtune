interface Env {
  DB: D1Database;
  HMAC_KEY: string;
}

async function verifyToken(token: string, key: string): Promise<boolean> {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return false;

    // Verify HMAC signature
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(key),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", cryptoKey, sigBytes, encoder.encode(payloadB64));
    if (!valid) return false;

    const payload = JSON.parse(atob(payloadB64));
    if (!payload.exp || Date.now() > payload.exp) return false;
    if (payload.role !== "admin") return false;

    return true;
  } catch {
    return false;
  }
}

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function badRequest(msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return unauthorized();

  const token = auth.slice(7);
  const valid = await verifyToken(token, env.HMAC_KEY);
  if (!valid) return unauthorized();

  const method = request.method;

  if (method === "GET") {
    const { results } = await env.DB.prepare(
      `SELECT id, title, author, release_date AS year, bpm, duration, duration_sec AS durationSec,
              moods, tuning, audio_url AS audioUrl, downloads
       FROM tracks ORDER BY release_date DESC`
    ).all();

    const tracks = (results || []).map((row: Record<string, unknown>) => ({
      ...row,
      moods: typeof row.moods === "string" ? JSON.parse(row.moods as string) : row.moods,
    }));

    return new Response(JSON.stringify(tracks), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  if (method === "POST") {
    const body = await request.json<Record<string, unknown>>();
    const { id, title, author, year, bpm, duration, durationSec, moods, tuning, audioUrl } = body as {
      id: string; title: string; author: string; year: string; bpm: number;
      duration: string; durationSec: number; moods: string[]; tuning: string; audioUrl: string;
    };

    if (!id || !title || !author || !year || !audioUrl) {
      return badRequest("Missing required fields: id, title, author, year, audioUrl");
    }

    try { new URL(audioUrl); } catch { return badRequest("Invalid audioUrl"); }

    await env.DB.prepare(
      `INSERT INTO tracks (id, title, author, release_date, bpm, duration, duration_sec, moods, tuning, audio_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, title, author, year, bpm || null, duration || null, durationSec || null,
            JSON.stringify(moods || []), tuning || null, audioUrl)
      .run();

    return new Response(JSON.stringify({ ok: true, id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (method === "PUT") {
    const body = await request.json<Record<string, unknown>>();
    const { id, title, author, year, bpm, duration, durationSec, moods, tuning, audioUrl } = body as {
      id: string; title: string; author: string; year: string; bpm: number;
      duration: string; durationSec: number; moods: string[]; tuning: string; audioUrl: string;
    };

    if (!id) return badRequest("Missing track id");

    await env.DB.prepare(
      `UPDATE tracks SET title = ?, author = ?, release_date = ?, bpm = ?, duration = ?,
              duration_sec = ?, moods = ?, tuning = ?, audio_url = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
      .bind(title, author, year, bpm || null, duration || null, durationSec || null,
            JSON.stringify(moods || []), tuning || null, audioUrl, id)
      .run();

    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (method === "DELETE") {
    const body = await request.json<{ id: string }>();
    if (!body.id) return badRequest("Missing track id");

    await env.DB.prepare(`DELETE FROM tracks WHERE id = ?`).bind(body.id).run();

    return new Response(JSON.stringify({ ok: true, id: body.id }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};
