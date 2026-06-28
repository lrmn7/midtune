/// <reference types="@cloudflare/workers-types" />

interface Env {
  HMAC_KEY: string;
  R2_BUCKET: R2Bucket;
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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = auth.slice(7);
  const valid = await verifyToken(token, env.HMAC_KEY);
  if (!valid) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    // Clean up filename to prevent issues
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_").toLowerCase();
    const key = `midwest-emo/${Date.now()}-${sanitizedName}`;

    // Upload to R2 Bucket
    await env.R2_BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
    });

    const url = `https://files.listune.app/${key}`;

    return new Response(JSON.stringify({ url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response("Failed to upload file", { status: 500 });
  }
};
