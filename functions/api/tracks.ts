interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, title, author, release_date AS year, bpm, duration, duration_sec AS durationSec,
              moods, tuning, audio_url AS audioUrl, downloads
       FROM tracks ORDER BY release_date DESC`
    ).all();

    const tracks = (results || []).map((row: Record<string, unknown>) => ({
      ...row,
      moods: typeof row.moods === "string" ? JSON.parse(row.moods) : row.moods,
    }));

    return new Response(JSON.stringify(tracks), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // Ensure instant cache invalidation on edits/deletes
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Failed to fetch tracks:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch tracks" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
