interface Env {
  ADMIN_SECRET: string;
  HMAC_KEY: string;
}

async function createHmacToken(key: string): Promise<string> {
  const payload = {
    role: "admin",
    exp: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
  };
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = btoa(payloadStr);

  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(payloadB64));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return `${payloadB64}.${sigB64}`;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";
  try {
    const body = await request.json<{ password: string }>();

    if (!body.password || !env.ADMIN_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const expected = new TextEncoder().encode(env.ADMIN_SECRET);
    const received = new TextEncoder().encode(body.password);

    if (expected.length !== received.length) {
      return new Response("Unauthorized", { status: 401 });
    }

    let match = true;
    for (let i = 0; i < expected.length; i++) {
      if (expected[i] !== received[i]) match = false;
    }

    if (!match) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = await createHmacToken(env.HMAC_KEY);

    return new Response(JSON.stringify({ token }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("Bad request", { status: 400 });
  }
};
