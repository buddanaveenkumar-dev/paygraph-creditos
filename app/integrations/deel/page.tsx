"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Braces, CircleDollarSign, CreditCard, Database, GitBranch, Handshake, LockKeyhole, Radio, ShieldCheck, UserCheck, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeelIntegrationPage() {
  const [key, setKey] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "connected" | "error">("idle");
  const [detail, setDetail] = useState("Public visitors remain in deterministic synthetic mode.");

  async function connect() {
    setState("loading");
    try {
      const response = await fetch("/api/deel/snapshot", { headers: { "x-demo-access-key": key } });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Connection failed");
      setState("connected");
      const paymentDetail = body.paymentSource === "payments" ? `${body.payments.length} payments` : body.paymentSource === "invoices" ? `${body.payments.length} invoices used as payment evidence` : "payment API restricted • synthetic signed-event fallback active";
      setDetail(`${body.contracts.length} contracts • ${paymentDetail} • API ${body.apiVersion} • request provenance captured`);
      setKey("");
    } catch (error) {
      setState("error");
      setDetail(error instanceof Error ? error.message : "Connection failed");
    }
  }

  return <main className="deel-page">
    <header className="topbar">
      <Link href="/" className="brand"><span className="brand-mark"><GitBranch size={19}/></span><span>PayGraph <b>CreditOS</b></span></Link>
      <nav><Link href="/"><ArrowLeft size={13}/> Product</Link><Link href="/demo">Decision demo</Link><Link href="/architecture">Architecture</Link></nav>
      <a className="header-cta" href="https://www.linkedin.com/in/naveenbudda" target="_blank" rel="noreferrer">Discuss the build path <ArrowRight size={14}/></a>
    </header>

    <section className="deel-hero">
      <div><p className="eyebrow"><BadgeCheck size={14}/> Deel sandbox connector</p><h1>Deel already has the data and distribution. PayGraph adds the credit operating layer.</h1><p>The reference connector reads sandbox contracts, handles signed events and records the provenance behind every decision.</p></div>
      <div className="claims-card"><span>Claims boundary</span><b>Sandbox reference integration</b><p>Not an official Deel product, partnership or production-data connection.</p></div>
    </section>

    <section className="why-deel">
      <p>Business case for Deel</p>
      <h2>Launch a differentiated benefit without becoming the lender.</h2>
      <h3>Deel enables distribution and permissioned workforce signals. PayGraph and licensed partners carry decisioning, credit risk, compliance and servicing under the proposed model.</h3>
      <div className="deel-value-grid"><article><UserCheck/><b>Differentiated benefit</b><span>Fast access to responsible credit using verified workforce signals.</span></article><article><ShieldCheck/><b>No credit exposure</b><span>No lending capital, loss provisioning or servicing obligation for Deel.</span></article><article><CircleDollarSign/><b>New revenue surface</b><span>Illustrative lender-funded revenue share or platform licensing.</span></article></div>
    </section>

    <section className="deel-console">
      <div className="console-head"><div><p className="panel-kicker">Walkthrough mode</p><h2>Live sandbox connection</h2></div><span className={`connector-state connector-${state}`}><Radio size={12}/>{state === "connected" ? "Connected" : state === "loading" ? "Connecting" : state === "error" ? "Action required" : "Locked"}</span></div>
      <div className="console-grid">
        <div className="secure-connect"><LockKeyhole/><h3>Server-side credential boundary</h3><p>The Deel token never reaches the browser or GitHub. A separate access key authorizes a limited, read-only snapshot.</p><label htmlFor="walkthrough-key">Walkthrough access key</label><div><input id="walkthrough-key" type="password" value={key} onChange={event => setKey(event.target.value)} placeholder="Enter access key" autoComplete="off"/><Button className="button-dark" disabled={!key || state === "loading"} onClick={connect}>{state === "loading" ? "Connecting…" : "Connect sandbox"}</Button></div><aside className={`connect-result result-${state}`}><Database size={16}/><span><b>{state === "connected" ? "Snapshot verified" : state === "error" ? "Connection not completed" : "Synthetic safety mode"}</b>{detail}</span></aside></div>
        <div className="api-contract"><p className="panel-kicker">Pinned API contract</p><div><span>Environment</span><code>api-sandbox.demo.deel.com/rest</code></div><div><span>Version</span><code>2026-01-01</code></div><div><span>Read model</span><code>GET /contracts — Live</code><code>GET /payments — Permission-dependent</code><code>Signed payment simulation — Active fallback</code></div><div><span>Events</span><code>payment.completed</code><code>contract.status.updated</code></div><div><span>Verification</span><code>X-Deel-Signature</code><code>HMAC-SHA256</code></div></div>
      </div>
    </section>

    <section className="integration-flow">
      <article><Database/><span>01</span><h3>Retrieve</h3><p>Read sandbox contracts and payments with a pinned API version and request identifiers.</p></article>
      <ArrowRight/>
      <article><Braces/><span>02</span><h3>Normalize</h3><p>Map source objects into a vendor-neutral workforce credit profile with field lineage.</p></article>
      <ArrowRight/>
      <article><ShieldCheck/><span>03</span><h3>Decide</h3><p>Generate an eligibility, limit, risk band and reproducible reason codes.</p></article>
      <ArrowRight/>
      <article><Webhook/><span>04</span><h3>Monitor</h3><p>Propagate signed payment and contract events into exposure and early warnings.</p></article>
    </section>

    <section className="employee-journey">
      <div className="journey-copy"><p className="eyebrow"><CreditCard size={14}/> Worker experience</p><h2>From consent to offer in three steps.</h2><p>The worker authorizes employment verification, reviews the offer and completes acceptance with the licensed lender.</p></div>
      <div className="journey-phone"><div className="phone-top"><span>PayGraph benefit</span><b>Workforce credit</b></div><div className="journey-progress"><i/><i/><i/></div><article><span>01</span><div><b>Confirm eligibility</b><small>Consent to contract and payment verification</small></div><BadgeCheck/></article><article><span>02</span><div><b>Review your offer</b><small>$5,000 line • reasons and repayment shown</small></div><BadgeCheck/></article><article><span>03</span><div><b>Accept securely</b><small>Final disclosures from the licensed lender</small></div><ArrowRight/></article><button>Continue securely</button><small>Illustrative experience • no production credit offered</small></div>
    </section>

    <section className="economics-section">
      <div><p className="eyebrow"><CircleDollarSign size={14}/> Operating model</p><h2>Deel distributes. PayGraph decides. Licensed partners lend.</h2></div>
      <div className="economics-grid"><article><span>Deel</span><b>Distribution and verified workforce signals</b><p>Improved benefit differentiation, engagement and illustrative revenue participation.</p></article><article><span>PayGraph</span><b>Decisioning, monitoring and orchestration</b><p>Platform licensing and/or performance-linked infrastructure fees.</p></article><article><span>Licensed partners</span><b>Capital, compliance and servicing</b><p>Interest, interchange or merchant economics subject to product and jurisdiction.</p></article></div>
      <div className="partner-categories"><Handshake/><b>Salary advances</b><b>Emergency liquidity</b><b>Relocation finance</b><b>Installment credit</b></div>
    </section>
    <section className="integration-close"><div><p className="eyebrow">What is already de-risked</p><h2>The business case and the connector can be reviewed in the same meeting.</h2><p>Leadership can inspect the source boundary, decision logic, portfolio response, partner model and controlled-launch sequence without starting from a blank page.</p></div><a href="https://www.linkedin.com/in/naveenbudda" target="_blank" rel="noreferrer">Discuss the build path <ArrowRight/></a></section>
  </main>;
}
