const BASE_URL = process.env.DEEL_SANDBOX_BASE_URL ?? "https://api-sandbox.demo.deel.com/rest";
const API_VERSION = "2026-01-01";

type DeelEnvelope = { data?: unknown; page?: unknown } & Record<string, unknown>;

export type DeelSnapshot = {
  mode: "deel-sandbox";
  fetchedAt: string;
  apiVersion: string;
  requestIds: string[];
  contracts: unknown[];
  payments: unknown[];
  provenance: Array<{ source: string; endpoint: string; fetchedAt: string }>;
};

function token() {
  const value = process.env.DEEL_SANDBOX_API_TOKEN;
  if (!value) throw new Error("DEEL_SANDBOX_API_TOKEN is not configured");
  return value;
}

async function deelGet(path: string, signal?: AbortSignal) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/json",
      "X-Version": API_VERSION,
    },
    cache: "no-store",
    signal,
  });
  const requestId = response.headers.get("x-request-id") ?? "not-returned";
  if (!response.ok) throw new Error(`Deel ${path} returned ${response.status} (request ${requestId})`);
  return { body: (await response.json()) as DeelEnvelope, requestId };
}

function rows(body: DeelEnvelope): unknown[] {
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body)) return body;
  return body.data ? [body.data] : [];
}

export function sandboxConfigured() {
  return Boolean(process.env.DEEL_SANDBOX_API_TOKEN);
}

export async function fetchDeelSnapshot(): Promise<DeelSnapshot> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const [contracts, payments] = await Promise.all([
      deelGet("/contracts", controller.signal),
      deelGet("/payments", controller.signal),
    ]);
    const fetchedAt = new Date().toISOString();
    return {
      mode: "deel-sandbox",
      fetchedAt,
      apiVersion: API_VERSION,
      requestIds: [contracts.requestId, payments.requestId],
      contracts: rows(contracts.body),
      payments: rows(payments.body),
      provenance: [
        { source: "Deel API Sandbox", endpoint: "GET /contracts", fetchedAt },
        { source: "Deel API Sandbox", endpoint: "GET /payments", fetchedAt },
      ],
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function privateDemoAuthorized(request: Request) {
  const expected = process.env.DEMO_ACCESS_KEY;
  return Boolean(expected) && request.headers.get("x-demo-access-key") === expected;
}
