# PayGraph CreditOS

Payroll-native credit intelligence and decisioning for workforce platforms.

PayGraph CreditOS demonstrates how verified payroll, contract, and payment signals can support responsible, explainable credit decisions for employees and contractors. Deel is the first reference integration; the normalized model is designed to support other payroll and HR data sources.

## What the demo shows

- A workforce credit profile derived from payroll-native signals
- Explainable eligibility, risk-band, and credit-limit decisions
- A verified-payment event that updates available credit
- A contract-termination event that freezes the limit immediately
- Portfolio exposure and risk distribution updated from the same event stream
- Field-level data lineage and a roadmap for governance, collections, and lender routing

All people, decisions, balances, and events in the public demo are synthetic. This prototype does not extend credit, make production lending decisions, or represent an official Deel product or partnership.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## Deploy on Vercel

Import this repository into Vercel, keep the detected framework as **Next.js**, and deploy with the default build settings. No environment variables are required for the synthetic public demo.

## Private Deel sandbox walkthrough

The project includes a server-side reference connector for contracts and payments, pinned to Deel API version `2026-01-01`, plus a signed-webhook receiver. Live retrieval requires a private walkthrough key and server-only Vercel environment variables.

See [`docs/DEEL_SANDBOX_DEMO.md`](docs/DEEL_SANDBOX_DEMO.md) for secure setup and the five-minute demo runbook. Never commit sandbox or production credentials.

## Current architecture

The public prototype uses deterministic, rules-based decision logic so every outcome can be traced to its source signal. Production integrations, licensed-lender execution, jurisdictional policies, bureau/open-banking data, and model governance are roadmap capabilities—not claims about the current build.

## Author

Built by Naveen Budda as an independent product-leadership prototype.
