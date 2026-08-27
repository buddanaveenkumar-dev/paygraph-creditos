import { NextResponse } from "next/server";
import { fetchDeelSnapshot, privateDemoAuthorized } from "@/lib/deel";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!privateDemoAuthorized(request)) return NextResponse.json({ error: "Private demo access required" }, { status: 401 });
  try {
    const snapshot = await fetchDeelSnapshot();
    return NextResponse.json({
      ...snapshot,
      contracts: snapshot.contracts.slice(0, 25),
      payments: snapshot.payments.slice(0, 50),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sandbox request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
