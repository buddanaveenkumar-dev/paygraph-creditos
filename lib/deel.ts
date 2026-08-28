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
  paymentSource: "payments" | "invoices" | "synthetic-fallback";
  warnings: Array<{ code: string; message: string; requestId?: string }>;
  provenance: Array<{ source: string; endpoint: string; fetchedAt: string }>;
};

class DeelApiError extends Error {
  constructor(public path: string, public status: number, public requestId: string) {
    super(`Deel ${path} returned ${status} (request ${requestId})`);
  }
}

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
  if (!response.ok) throw new DeelApiError(path, response.status, requestId);
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
    const contracts = await deelGet("/contracts", controller.signal);
    let paymentRows: unknown[] = [];
    let paymentRequestId = "not-returned";
    let paymentEndpoint = "GET /payments";
    let paymentSource: DeelSnapshot["paymentSource"] = "payments";
    const warnings: DeelSnapshot["warnings"] = [];
    try {
      const payments = await deelGet("/payments", controller.signal);
      paymentRows = rows(payments.body);
      paymentRequestId = payments.requestId;
    } catch (error) {
      if (!(error instanceof DeelApiError) || ![403, 404].includes(error.status)) throw error;
      warnings.push({ code: "PAYMENTS_SCOPE_RESTRICTED", message: "Direct payment history is unavailable for this sandbox organization.", requestId: error.requestId });
      try {
        const invoices = await deelGet("/invoices", controller.signal);
        paymentRows = rows(invoices.body);
        paymentRequestId = invoices.requestId;
        paymentEndpoint = "GET /invoices";
        paymentSource = "invoices";
      } catch (invoiceError) {
        if (!(invoiceError instanceof DeelApiError) || ![403, 404].includes(invoiceError.status)) throw invoiceError;
        paymentRequestId = invoiceError.requestId;
        paymentEndpoint = "Synthetic payment event fallback";
        paymentSource = "synthetic-fallback";
        warnings.push({ code: "INVOICES_SCOPE_RESTRICTED", message: "Invoice history is also unavailable; signed payment-event simulation remains enabled.", requestId: invoiceError.requestId });
      }
    }
    const fetchedAt = new Date().toISOString();
    return {
      mode: "deel-sandbox",
      fetchedAt,
      apiVersion: API_VERSION,
      requestIds: [contracts.requestId, paymentRequestId],
      contracts: rows(contracts.body),
      payments: paymentRows,
      paymentSource,
      warnings,
      provenance: [
        { source: "Deel API Sandbox", endpoint: "GET /contracts", fetchedAt },
        { source: paymentSource === "synthetic-fallback" ? "PayGraph deterministic simulator" : "Deel API Sandbox", endpoint: paymentEndpoint, fetchedAt },
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
