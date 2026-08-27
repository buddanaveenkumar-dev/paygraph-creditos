import { NextResponse } from "next/server";
import { sandboxConfigured } from "@/lib/deel";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    connector: "deel-sandbox",
    configured: sandboxConfigured(),
    apiVersion: "2026-01-01",
    credentialExposure: "server-only",
    publicMode: "synthetic",
  });
}
