# Deel sandbox walkthrough

The public site remains deterministic and synthetic. Private walkthrough mode retrieves test contracts and payments from Deel's isolated API Sandbox and records API version, fetch time, provenance, and request identifiers.

## Vercel environment variables

- `DEEL_SANDBOX_API_TOKEN`: sandbox-only token from Deel Developer Center.
- `DEMO_ACCESS_KEY`: strong key entered during the private walkthrough.
- `DEEL_WEBHOOK_SIGNING_SECRET`: signing secret for the Deel webhook.
- `DEEL_SANDBOX_BASE_URL`: optional sandbox base-URL override.

Never put these values in GitHub, screenshots, browser code, or messages.

## Configuration

1. Create an API Sandbox in Deel Developer Center and generate its token.
2. Add the variables above in Vercel and redeploy.
3. Configure `https://www.paygraphcredit.com/api/deel/webhooks` as the webhook URL.
4. Subscribe to the precise payment and contract-status events exposed by the sandbox.
5. Store the webhook signing secret in Vercel.

## Five-minute demo

1. Open **Live integration** and explain the synthetic public safety boundary.
2. Enter the private walkthrough key and connect.
3. Show contract/payment counts, pinned API version and request IDs.
4. Demonstrate the explainable decision and payment/termination lifecycle.
5. Show portfolio exposure, risk migration and early-warning queue.
6. Close on data lineage, policy version and decision auditability.

Say: "A working reference connector to Deel's isolated API Sandbox with a deterministic public fallback."

If the sandbox organization restricts direct payment or invoice history, the connector keeps live contract retrieval active, records the `403` request identifier, and uses the deterministic signed-payment-event simulator. This is an explicit permission boundary, not a production-data claim.

Do not claim an official Deel integration, production customer data, or Deel endorsement.
