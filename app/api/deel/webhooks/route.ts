import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function validSignature(raw: string, signature: string | null) {
  const secret = process.env.DEEL_WEBHOOK_SIGNING_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const supplied = signature.replace(/^sha256=/, "");
  return supplied.length === expected.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (!validSignature(raw, request.headers.get("x-deel-signature"))) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }
  const event = JSON.parse(raw) as { id?: string; type?: string; name?: string };
  return NextResponse.json({ accepted: true, eventId: event.id ?? null, eventType: event.type ?? event.name ?? "unknown" });
}
