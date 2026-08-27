import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const connector = await readFile(new URL("../lib/deel.ts", import.meta.url), "utf8");
const webhook = await readFile(new URL("../app/api/deel/webhooks/route.ts", import.meta.url), "utf8");

test("pins stable Deel sandbox contract", () => {
  assert.match(connector, /2026-01-01/);
  assert.match(connector, /api-sandbox\.demo\.deel\.com\/rest/);
});
test("keeps bearer token server-side", () => {
  assert.match(connector, /process\.env\.DEEL_SANDBOX_API_TOKEN/);
  assert.match(connector, /Authorization: `Bearer/);
});
test("uses constant-time webhook verification", () => {
  assert.match(webhook, /createHmac\("sha256"/);
  assert.match(webhook, /timingSafeEqual/);
  assert.match(webhook, /x-deel-signature/);
});
