"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowRight, BadgeCheck, Ban, Braces, BriefcaseBusiness, Check, CircleDollarSign, Clock3, Database, ExternalLink, FileCheck2, GitBranch, LineChart, LockKeyhole, Radio, RefreshCw, ShieldCheck, Sparkles, TrendingDown, Users, WalletCards, Webhook, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Scenario = "baseline" | "payment" | "terminated";
type Profile = "ana" | "marcus";
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const timeline = {
  baseline: [
    { label: "Profile synchronized", detail: "12 months of contract and payment history", time: "09:41:02" },
    { label: "Decision completed", detail: "Policy PG-US-IC-1.3 • Low risk", time: "09:41:04" },
  ],
  payment: [
    { label: "Payment verified", detail: "$8,750 received from primary client", time: "10:12:18" },
    { label: "Limit recalculated", detail: "Income confidence improved • +$400", time: "10:12:19" },
  ],
  terminated: [
    { label: "Contract termination received", detail: "Signed webhook • primary contract ended", time: "11:03:44" },
    { label: "Unused line frozen", detail: "$3,300 availability removed instantly", time: "11:03:45" },
  ],
};

function Metric({ label, value, note, accent = false }: { label: string; value: string; note: string; accent?: boolean }) {
  return <div className={`metric-card ${accent ? "metric-accent" : ""}`}><p>{label}</p><strong>{value}</strong><span>{note}</span></div>;
}

function StatusPill({ tone, children }: { tone: "good" | "warn" | "neutral"; children: React.ReactNode }) {
  return <span className={`status-pill status-${tone}`}>{children}</span>;
}

function JsonCode({ value }: { value: Record<string, unknown> }) {
  return <pre className="json-code">{JSON.stringify(value, null, 2).split("\n").map((line, index) => {
    const match = line.match(/^(\s*)("[^"]+")(\s*:\s*)(.*)$/);
    return <span key={`${index}-${line}`}>{match ? <>{match[1]}<i>{match[2]}</i>{match[3]}<b>{match[4]}</b></> : line}{"\n"}</span>;
  })}</pre>;
}

export default function Home() {
  const [scenario, setScenario] = useState<Scenario>("baseline");
  const [profile, setProfile] = useState<Profile>("ana");
  const [demoKey, setDemoKey] = useState("");
  const [sandboxState, setSandboxState] = useState<"idle" | "loading" | "connected" | "error">("idle");
  const [sandboxDetail, setSandboxDetail] = useState("Public mode uses deterministic synthetic records.");
  const [income, setIncome] = useState(8400);
  const [tenure, setTenure] = useState(26);
  const [volatility, setVolatility] = useState(4);
  const [activeContract, setActiveContract] = useState(true);
  const [payloadView, setPayloadView] = useState<"incoming" | "outgoing">("incoming");
  const [contractors, setContractors] = useState(500000);
  const [averageLine, setAverageLine] = useState(3000);
  const [utilizationRate, setUtilizationRate] = useState(40);
  const decision = useMemo(() => {
    if (profile === "marcus") return { income: 5100, limit: 0, available: 0, outstanding: 0, score: 61, risk: "Elevated", status: "Conditional", policy: "PG-US-IC-1.4" };
    const calculatedScore = Math.max(20, Math.min(96, 38 + Math.min(tenure, 24) * 1.4 + Math.min(income, 12000) / 900 - volatility * .8 + (activeContract ? 18 : -25)));
    const score = scenario === "terminated" || !activeContract ? Math.min(46, Math.round(calculatedScore)) : scenario === "payment" ? Math.min(96, Math.round(calculatedScore + 3)) : Math.round(calculatedScore);
    const risk = score >= 80 ? "Low" : score >= 65 ? "Medium" : "Elevated";
    const eligible = activeContract && tenure >= 6 && income >= 3000 && volatility <= 35;
    const rawLimit = eligible ? Math.min(10000, Math.max(2000, Math.round((income * .6 * (1 - volatility / 130)) / 100) * 100)) : 0;
    const limit = scenario === "payment" ? Math.min(10000, rawLimit + 400) : rawLimit;
    if (scenario === "terminated" || !activeContract) return { income, limit, available: 0, outstanding: 2100, score, risk: "Elevated", status: "Frozen", policy: "PG-US-IC-1.4" };
    if (!eligible) return { income, limit: 0, available: 0, outstanding: 0, score, risk, status: "Conditional", policy: "PG-US-IC-1.4" };
    return { income: scenario === "payment" ? income + 350 : income, limit, available: Math.max(0, limit - 2100), outstanding: 2100, score, risk, status: "Eligible", policy: "PG-US-IC-1.4" };
  }, [scenario, profile, income, tenure, volatility, activeContract]);

  const incomingPayload = useMemo(() => scenario === "terminated" || !activeContract ? {
    id: "evt_deel_01J8K4TQ", type: "contract.status.updated", api_version: "2026-01-01", created_at: "2026-09-01T11:03:44Z",
    data: { contract_id: "ct_9f27a", worker_id: "wrk_ana_01", previous_status: "active", status: "terminated", effective_at: "2026-09-01T11:03:44Z" },
    verification: { header: "X-Deel-Signature", algorithm: "HMAC-SHA256", verified: true }
  } : {
    id: scenario === "payment" ? "evt_deel_01J8K3PN" : "snapshot_deel_01J8K2ZZ", type: scenario === "payment" ? "payment.completed" : "worker.credit_profile.synced", api_version: "2026-01-01", created_at: "2026-09-01T10:12:18Z",
    data: { contract_id: "ct_9f27a", worker_id: "wrk_ana_01", amount: scenario === "payment" ? 8750 : income, currency: "USD", contract_status: activeContract ? "active" : "terminated" },
    verification: { header: "X-Deel-Signature", algorithm: "HMAC-SHA256", verified: true }
  }, [scenario, income, activeContract]);
  const outputPayload = useMemo(() => ({
    decision_id: "dec_7F29A4", worker_id: "wrk_ana_01", policy: decision.policy, status: decision.status.toLowerCase(), risk_score: decision.score,
    risk_band: decision.risk.toLowerCase(), approved_limit: decision.limit, available_limit: decision.available, outstanding_exposure: decision.outstanding,
    reason_codes: decision.status === "Frozen" ? ["CONTRACT_INACTIVE", "UNUSED_LINE_FROZEN", "EXPOSURE_PRESERVED"] : decision.status === "Conditional" ? ["POLICY_THRESHOLD_FAILED", "REASSESSMENT_ALLOWED"] : ["INCOME_VERIFIED", "TENURE_PASSED", "AFFORDABILITY_PASSED"],
    latency_ms: 184, evaluated_at: "2026-09-01T10:12:19Z"
  }), [decision]);

  const monthlyVolume = contractors * averageLine * (utilizationRate / 100);
  const annualOriginations = monthlyVolume * 4;
  const annualRevenue = annualOriginations * .015;

  const chooseProfile = (next: Profile) => { setProfile(next); setScenario("baseline"); };
  const runScenario = (next: Scenario) => { setScenario(next); setPayloadView("incoming"); window.setTimeout(() => setPayloadView("outgoing"), 650); };
  const connectSandbox = async () => {
    setSandboxState("loading");
    try {
      const response = await fetch("/api/deel/snapshot", { headers: { "x-demo-access-key": demoKey } });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Connection failed");
      setSandboxState("connected");
      const paymentDetail = body.paymentSource === "payments" ? `${body.payments.length} payments` : body.paymentSource === "invoices" ? `${body.payments.length} invoices used as payment evidence` : "payment API restricted; synthetic event fallback active";
      setSandboxDetail(`${body.contracts.length} contracts and ${paymentDetail} • API ${body.apiVersion} • ${body.requestIds.length} request IDs captured`);
      setDemoKey("");
    } catch (error) {
      setSandboxState("error");
      setSandboxDetail(error instanceof Error ? error.message : "Connection failed");
    }
  };

  return (
    <main>
      <header className="topbar">
        <a href="#top" className="brand" aria-label="PayGraph CreditOS home"><span className="brand-mark"><GitBranch size={19} /></span><span>PayGraph <b>CreditOS</b></span></a>
        <nav aria-label="Primary navigation"><a href="/demo">Decision demos</a><a href="#platform">Worker Credit OS</a><a href="/demo/employer">Employer Risk OS</a><a href="/architecture">Architecture</a><a href="/integrations/deel">Deel integration</a></nav>
        <a className="header-cta" href="https://www.linkedin.com/in/naveenbudda" target="_blank" rel="noreferrer">Discuss the build path <ArrowRight size={14} /></a>
      </header>

      <section className="product-shell" id="top">
        <div className="product-intro">
          <div><p className="eyebrow"><Sparkles size={14} /> Credit infrastructure for workforce platforms</p><h1>Credit decisions built on verified work data.</h1></div>
          <p>PayGraph turns payroll, contract and payment signals into governed worker-credit decisions, employer exposure controls and portfolio intelligence.</p>
        </div>

        <div className="proof-strip" aria-label="Illustrative platform metrics">
          <p><span>Prototype metrics</span> Synthetic records</p>
          <div><strong>184 ms</strong><span>decision time</span></div>
          <div><strong>100%</strong><span>reason-code coverage</span></div>
          <div><strong>78%</strong><span>automated decisions</span></div>
        </div>

        <Tabs defaultValue="decision" className="workspace" id="platform">
          <div className="workspace-nav">
            <div><span className="live-dot" /> Reference environment connected</div>
            <TabsList variant="line" aria-label="Product views"><TabsTrigger value="decision">Decision record</TabsTrigger><TabsTrigger value="portfolio">Portfolio</TabsTrigger><TabsTrigger value="data">Data lineage</TabsTrigger><TabsTrigger value="integration">Live integration</TabsTrigger></TabsList>
          </div>

          <TabsContent value="decision" className="workspace-content">
            <div className="decision-grid">
              <section className="worker-panel">
                <div className="profile-switch" role="group" aria-label="Select a decision profile">
                  <button className={profile === "ana" ? "active" : ""} onClick={() => chooseProfile("ana")}><span>AS</span><b>Ana Silva</b><small>Approved</small></button>
                  <button className={profile === "marcus" ? "active conditional" : ""} onClick={() => chooseProfile("marcus")}><span>MT</span><b>Marcus Taylor</b><small>Conditional</small></button>
                </div>
                <div className="panel-heading">
                  <div><p className="panel-kicker">Worker profile</p><h2>{profile === "ana" ? "Ana Silva" : "Marcus Taylor"}</h2><span>Independent contractor • United States • USD</span></div>
                  <StatusPill tone={profile === "marcus" || scenario === "terminated" ? "warn" : "good"}>{profile === "marcus" || scenario === "terminated" ? <Ban size={13} /> : <BadgeCheck size={13} />}{decision.status}</StatusPill>
                </div>
                <div className="signal-list">
                  <div><span><CircleDollarSign /> Verified monthly income</span><b>{money.format(decision.income)}</b></div>
                  <div><span><Clock3 /> Contract tenure</span><b>{profile === "ana" ? `${tenure} months` : "4 months"}</b></div>
                  <div><span><BriefcaseBusiness /> Active contracts</span><b>{profile === "marcus" ? "1" : scenario === "terminated" || !activeContract ? "Inactive" : "2"}</b></div>
                  <div><span><LineChart /> Income volatility</span><b className={profile === "ana" && volatility <= 20 ? "positive" : "negative"}>{profile === "ana" ? `${volatility}%` : "18.6%"}</b></div>
                  <div><span><Users /> Client concentration</span><b>{profile === "ana" ? "62%" : "84%"}</b></div>
                  <div><span><BadgeCheck /> Payment reliability</span><b>{profile === "ana" ? "98.4%" : "86.1%"}</b></div>
                </div>
                {profile === "ana" ? <div className="event-controls">
                  <p>Simulate a live workforce event</p>
                  <div>
                    <Button onClick={() => runScenario("payment")} disabled={scenario !== "baseline"} className="button-dark"><CircleDollarSign /> Verify payroll payment</Button>
                    <Button onClick={() => runScenario("terminated")} disabled={scenario === "terminated"} variant="outline" className="button-outline"><Webhook /> Fire termination webhook</Button>
                    <Button onClick={() => runScenario("baseline")} variant="ghost" size="icon" aria-label="Reset demo"><RefreshCw /></Button>
                  </div>
                </div> : <div className="conditional-note"><TrendingDown size={16} /><span><b>Manual evidence requested</b>Two additional payroll cycles or a secondary active contract could trigger reassessment.</span></div>}
              </section>

              <section className={`decision-panel ${scenario === "terminated" || profile === "marcus" ? "decision-frozen" : ""}`}>
                <div className="decision-topline">
                  <div><p className="panel-kicker">Explainable decision</p><h2>{profile === "marcus" ? "Conditional review" : scenario === "terminated" ? "Line frozen" : `${money.format(decision.limit)} approved line`}</h2></div>
                  <div className="score-ring" aria-label={`Risk score ${decision.score}`}><span>{decision.score}</span><small>/ 100</small></div>
                </div>
                <div className="decision-metrics">
                  <Metric label="Available" value={money.format(decision.available)} note={profile === "marcus" ? "No line activated" : scenario === "terminated" ? "Frozen immediately" : "After current utilization"} accent />
                  <Metric label="Outstanding" value={money.format(decision.outstanding)} note="Preserved after freeze" />
                  <Metric label="Risk band" value={decision.risk} note="Current lifecycle state" />
                </div>
                <div className="explanation-box">
                  <div className="explanation-head"><span><FileCheck2 size={16} /> Why this decision?</span><code>{decision.policy}</code></div>
                  {profile === "marcus" ? <ul><li className="reason-alert"><Ban /> $5,100 verified income is below the $6,000 product floor.</li><li className="reason-alert"><Ban /> 4-month tenure is below the 6-month minimum.</li><li className="reason-alert"><Ban /> 84% client concentration exceeds the 75% policy threshold.</li><li><ShieldCheck /> Reassessment allowed after two stable payroll cycles.</li></ul> : scenario === "terminated" ? <ul><li className="reason-alert"><Ban /> Primary contract terminated at 11:03:44 UTC.</li><li><LockKeyhole /> Unused availability frozen; no new draws permitted.</li><li><ShieldCheck /> Outstanding $2,100 remains in active monitoring.</li></ul> : <ul><li><Check /> Verified income exceeds the $6,000 product floor.</li><li><Check /> 26-month tenure exceeds the 6-month minimum.</li><li><Check /> 98.4% payment reliability supports Low risk.</li><li><Check /> 38.9% proposed payment-to-income remains below the 45% cap.</li></ul>}
                </div>
                <div className="formula-row"><span>Policy revised 26 Aug 2026 • <button title="v1.4 added conditional-decision explanations">View change</button></span><code>min(income capacity, contract cap, product cap)</code></div>
              </section>
            </div>
            {profile === "ana" && <section className="technical-proof-grid">
              <div className="simulator-card">
                <div className="simulator-head"><div><p className="panel-kicker">Interactive policy simulator</p><h3>Change the workforce signals</h3></div><StatusPill tone={decision.risk === "Low" ? "good" : "warn"}>{decision.risk} risk</StatusPill></div>
                <div className="simulator-control"><label><span>Verified monthly income</span><b>{money.format(income)}</b></label><Slider min={2000} max={20000} step={250} value={[income]} onValueChange={(value) => { setIncome(value[0]); setScenario("baseline"); }}/><small>$2,000</small><small>$20,000</small></div>
                <div className="simulator-control"><label><span>Contract tenure</span><b>{tenure} months</b></label><Slider min={1} max={48} step={1} value={[tenure]} onValueChange={(value) => { setTenure(value[0]); setScenario("baseline"); }}/><small>1 month</small><small>48 months</small></div>
                <div className="simulator-control"><label><span>Income volatility</span><b>{volatility}%</b></label><Slider min={0} max={60} step={1} value={[volatility]} onValueChange={(value) => { setVolatility(value[0]); setScenario("baseline"); }}/><small>Stable</small><small>60%</small></div>
                <div className="simulator-toggle"><div><span>Active contract status</span><small>Lifecycle status immediately controls availability</small></div><Switch checked={activeContract} onCheckedChange={(checked) => { setActiveContract(checked); setScenario(checked ? "baseline" : "terminated"); }}/></div>
              </div>
              <div className="payload-console" aria-live="polite">
                <div className="console-chrome"><span/><span/><span/><b>Live decision exchange</b><em>{scenario === "baseline" ? "snapshot" : "event processed"}</em></div>
                <div className="payload-tabs"><button className={payloadView === "incoming" ? "active" : ""} onClick={() => setPayloadView("incoming")}>Deel incoming</button><button className={payloadView === "outgoing" ? "active" : ""} onClick={() => setPayloadView("outgoing")}>PayGraph output</button><span>{payloadView === "incoming" ? "POST /webhooks/deel" : "POST /v1/decisions"}</span></div>
                <JsonCode value={payloadView === "incoming" ? incomingPayload : outputPayload}/>
                <div className="console-status"><span className="live-dot"/> HMAC verified <b>•</b> idempotency enforced <b>•</b> 184ms illustrative latency</div>
              </div>
            </section>}
            <section className="event-strip" aria-live="polite">
              <div className="event-title"><Activity size={17} /><span>Decision lifecycle</span></div>
              {(profile === "marcus" ? [{ label: "Profile synchronized", detail: "4 months of contract and payment history", time: "09:46:11" }, { label: "Conditional decision", detail: "Policy PG-US-IC-1.4 • Elevated risk", time: "09:46:12" }] : timeline[scenario]).map((event) => <div className="event-item" key={event.label}><span className={`event-node ${profile === "marcus" ? "event-warn" : ""}`} /><div><b>{event.label}</b><small>{event.detail}</small></div><time>{event.time}</time></div>)}
            </section>
          </TabsContent>

          <TabsContent value="portfolio" className="workspace-content">
            <div className="portfolio-header"><div><p className="panel-kicker">Demo cohort</p><h2>Portfolio command centre</h2></div><StatusPill tone="neutral"><Radio size={12} /> Live event roll-up</StatusPill></div>
            <div className="portfolio-metrics">
              <Metric label="Workers monitored" value="24" note="3 countries • 4 employers" />
              <Metric label="Outstanding exposure" value="$31,600" note="Unchanged by line freeze" />
              <Metric label="Available commitments" value={scenario === "terminated" ? "$43,600" : "$46,900"} note={scenario === "terminated" ? "↓ $3,300 after event" : "Current approved capacity"} accent />
              <Metric label="Expected loss" value={scenario === "terminated" ? "$1,042" : "$824"} note={scenario === "terminated" ? "Risk alert reflected" : "2.61% of outstanding"} />
            </div>
            <div className="portfolio-body">
              <div className="risk-distribution"><h3>Risk distribution</h3><div className="bar-row"><span>Low</span><div><i style={{ width: scenario === "terminated" ? "58%" : "63%" }} /></div><b>{scenario === "terminated" ? "14" : "15"}</b></div><div className="bar-row"><span>Medium</span><div><i className="bar-medium" style={{ width: "25%" }} /></div><b>6</b></div><div className="bar-row"><span>Elevated</span><div><i className="bar-high" style={{ width: scenario === "terminated" ? "17%" : "12%" }} /></div><b>{scenario === "terminated" ? "4" : "3"}</b></div></div>
              <div className={`watch-card ${scenario === "terminated" ? "watch-active" : ""}`}><span className="watch-icon">{scenario === "terminated" ? <Zap /> : <ShieldCheck />}</span><div><p>{scenario === "terminated" ? "New early-warning signal" : "Portfolio operating normally"}</p><h3>{scenario === "terminated" ? "Ana Silva • Contract termination" : "No critical workforce events"}</h3><span>{scenario === "terminated" ? "$3,300 unused line frozen in 1 second. Outstanding exposure retained for monitoring." : "All event feeds current. Next scheduled policy review in 6 days."}</span></div></div>
              <div className="exposure-trend"><div><p className="panel-kicker">Four-week exposure trend</p><h3>$31.6K monitored</h3></div><svg viewBox="0 0 520 105" role="img" aria-label="Illustrative four-week outstanding exposure trend"><path className="trend-area" d="M0 92 L0 76 C70 68 100 70 145 54 S235 66 285 44 S390 45 430 26 S490 25 520 12 L520 105 L0 105 Z"/><path className="trend-line" d="M0 76 C70 68 100 70 145 54 S235 66 285 44 S390 45 430 26 S490 25 520 12"/><circle cx="520" cy="12" r="5"/></svg><div className="warning-row"><span><Zap size={12}/> 3 income-volatility flags</span><span><Webhook size={12}/> 1 contract event</span><span><ShieldCheck size={12}/> 0 policy breaches</span></div></div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="workspace-content">
            <div className="lineage-grid">
              <div className="lineage-source"><p className="panel-kicker">Reference connector</p><h2>Deel developer sandbox</h2><p>Contract, payment, balance and worker events are normalized before they reach the credit layer.</p><a href="https://developer.deel.com/api/sandbox" target="_blank" rel="noreferrer">View source documentation <ArrowRight /></a></div>
              <div className="lineage-flow"><div><Database /><span><b>Source objects</b><small>Contracts • payments • balances</small></span></div><ArrowRight /><div><Braces /><span><b>PayGraph schema</b><small>Vendor-neutral workforce model</small></span></div><ArrowRight /><div><ShieldCheck /><span><b>Decision record</b><small>Versioned • reproducible • auditable</small></span></div></div>
              <div className="audit-sample"><div><span>Decision ID</span><code>{profile === "marcus" ? "dec_8C14D2" : "dec_7F29A4"}</code></div><div><span>Policy version</span><code>{decision.policy}</code></div><div><span>Input snapshot</span><code>sha256:8e4a…92f1</code></div><div><span>Decision latency</span><code>184 ms</code></div><div><span>Webhook verified</span><code>HMAC-SHA256</code></div></div>
            </div>
          </TabsContent>

          <TabsContent value="integration" className="workspace-content">
            <div className="integration-grid">
              <section className="integration-console">
                <div className="integration-title"><div><p className="panel-kicker">Walkthrough mode</p><h2>Deel API Sandbox connector</h2></div><StatusPill tone={sandboxState === "connected" ? "good" : sandboxState === "error" ? "warn" : "neutral"}><Radio size={12}/>{sandboxState === "connected" ? "Connected" : sandboxState === "loading" ? "Connecting" : sandboxState === "error" ? "Action required" : "Locked"}</StatusPill></div>
                <p>Live credentials remain on the server. Enter the private walkthrough key to fetch sandbox contracts and payments without exposing the Deel token to the browser or repository.</p>
                <div className="integration-form"><label htmlFor="demo-key">Walkthrough access key</label><div><input id="demo-key" type="password" value={demoKey} onChange={(event) => setDemoKey(event.target.value)} placeholder="Enter private key" autoComplete="off"/><Button className="button-dark" disabled={!demoKey || sandboxState === "loading"} onClick={connectSandbox}>{sandboxState === "loading" ? "Connecting…" : "Connect sandbox"}</Button></div></div>
                <div className={`integration-result state-${sandboxState}`}><Database size={17}/><span><b>{sandboxState === "connected" ? "Live snapshot verified" : sandboxState === "error" ? "Sandbox not connected" : "Synthetic safety mode"}</b>{sandboxDetail}</span></div>
              </section>
              <section className="integration-contract">
                <p className="panel-kicker">Pinned integration contract</p>
                <div><span>Environment</span><code>api-sandbox.demo.deel.com/rest</code></div><div><span>API version</span><code>2026-01-01</code></div><div><span>Read model</span><code>GET /contracts • GET /payments</code></div><div><span>Event model</span><code>payment.completed • contract.status.updated</code></div><div><span>Webhook trust</span><code>X-Deel-Signature • HMAC-SHA256</code></div><div><span>Fallback</span><code>Deterministic synthetic data</code></div>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="portfolio-proof" id="portfolio-intelligence">
        <div className="portfolio-proof-copy">
          <p className="eyebrow"><Activity size={14} /> Portfolio intelligence • Live prototype</p>
          <h2>See exposure change when work changes.</h2>
          <p>Payments, income volatility and contract events update limits, expected loss and the review queue from the same decision record.</p>
          <span>Synthetic cohort • 24 workers</span>
        </div>
        <div className="portfolio-proof-panel">
          <div className="portfolio-proof-head"><div><span>Monitored exposure</span><strong>$31,600</strong><small>24 workers • 3 countries • 4 employers</small></div><StatusPill tone="neutral"><Radio size={12}/> Event feeds current</StatusPill></div>
          <div className="portfolio-proof-kpis"><div><span>Expected loss</span><b>2.61%</b><small>$824 modeled</small></div><div><span>Available commitments</span><b>$46.9K</b><small>Approved capacity</small></div><div><span>Alerts requiring review</span><b>4</b><small>3 income • 1 contract</small></div></div>
          <div className="portfolio-proof-visuals">
            <div className="proof-risk"><p>Exposure by risk band</p><div><span>Low</span><i><b style={{width:"63%"}}/></i><strong>63%</strong></div><div><span>Medium</span><i><b className="medium" style={{width:"25%"}}/></i><strong>25%</strong></div><div><span>Elevated</span><i><b className="elevated" style={{width:"12%"}}/></i><strong>12%</strong></div></div>
            <div className="proof-trend"><p>Four-week exposure trend</p><svg viewBox="0 0 460 120" role="img" aria-label="Illustrative four-week monitored exposure trend"><path d="M0 98 C62 94 86 77 137 82 S220 58 270 63 S360 38 460 25"/><circle cx="460" cy="25" r="5"/></svg><div><span>W1</span><span>W2</span><span>W3</span><span>W4</span></div></div>
          </div>
          <div className="portfolio-alert"><Zap size={17}/><div><b>Early-warning queue</b><span>Income volatility rose above 20% for 3 workers; one contract termination requires exposure review.</span></div><em>4 open</em></div>
        </div>
      </section>

      <section className="roi-section" id="business-impact">
        <div className="roi-copy"><p className="eyebrow"><CircleDollarSign size={14}/> Illustrative business case</p><h2>A new revenue line, funded by lending partners.</h2><p>Deel provides permissioned workforce data and distribution. Licensed partners provide capital and own the credit risk. Adjust the assumptions to test the opportunity.</p><div className="roi-boundary"><ShieldCheck/><span><b>Deel does not fund the loans</b><small>Capital, underwriting responsibility, licensing and servicing remain with regulated partners.</small></span></div></div>
        <div className="roi-calculator">
          <div className="roi-control"><label><span>Active contractors monitored</span><b>{contractors.toLocaleString("en-US")}</b></label><Slider min={100000} max={1000000} step={50000} value={[contractors]} onValueChange={(value) => setContractors(value[0])}/><small>100K</small><small>1M</small></div>
          <div className="roi-control"><label><span>Average monthly credit line</span><b>{money.format(averageLine)}</b></label><Slider min={500} max={10000} step={500} value={[averageLine]} onValueChange={(value) => setAverageLine(value[0])}/><small>$500</small><small>$10K</small></div>
          <div className="roi-control"><label><span>Average line utilization</span><b>{utilizationRate}%</b></label><Slider min={10} max={80} step={5} value={[utilizationRate]} onValueChange={(value) => setUtilizationRate(value[0])}/><small>10%</small><small>80%</small></div>
          <div className="roi-results"><div><span>Monthly utilized portfolio</span><strong>{money.format(monthlyVolume)}</strong><small>Contractors × line × utilization</small></div><div><span>Annual originated volume</span><strong>{money.format(annualOriginations)}</strong><small>Assumes four portfolio turns per year</small></div><div className="roi-highlight"><span>Potential annual Deel revenue</span><strong>{money.format(annualRevenue)}</strong><small>Illustrative 1.5% lender-paid share</small></div><div className="roi-zero"><span>Deel balance-sheet credit risk</span><strong>$0</strong><small>Under the proposed partner-funded model</small></div></div>
          <p className="roi-disclaimer">Scenario only; not a forecast of Deel revenue. The model excludes operating costs, lender losses, eligibility rates and market-specific restrictions.</p>
        </div>
      </section>

      <section className="strategic-window">
        <div className="strategic-window-copy"><p className="eyebrow"><Zap size={14}/> Strategic window</p><h2>Workforce platforms already own the signal. The credit layer is the next decision.</h2><p>Verified contracts, payroll and payment history create an advantage traditional lenders cannot reproduce at application time. PayGraph turns that data advantage into a controlled business.</p></div>
        <div className="strategic-evidence"><article><span>01</span><b>Proprietary signal</b><p>Permissioned workforce data supports faster eligibility, clearer limits and earlier risk detection.</p></article><article><span>02</span><b>Adjacent revenue</b><p>Partner-funded products can deepen worker value without placing consumer credit on the platform balance sheet.</p></article><article><span>03</span><b>Execution lead</b><p>The decision core, reference connector, portfolio view and operating boundaries are already demonstrated.</p></article></div>
        <div className="strategic-choice"><span>Leadership decision</span><b>Build from zero, partner with the platform, or bring the capability in-house.</b><p>The working system makes the technical, commercial and operating trade-offs reviewable now.</p></div>
      </section>

      <section className="architecture-section" id="architecture">
        <div className="section-copy"><p className="eyebrow"><GitBranch size={14} /> System architecture</p><h2>Connect workforce data to regulated credit.</h2><p>PayGraph runs the decision and monitoring layer. Licensed partners provide capital, disclosures and servicing.</p></div>
        <div className="architecture-map">
          <div className="arch-column"><span className="arch-label">Workforce data</span><article><Database /><div><b>Payroll & HR</b><small>Deel reference connector</small></div></article><article><Webhook /><div><b>Real-time events</b><small>Payments • amendments • termination</small></div></article></div>
          <div className="arch-arrow"><ArrowRight /></div>
          <div className="arch-core"><span className="arch-label">PayGraph CreditOS</span><article><ShieldCheck /><div><b>Workforce Credit Profile</b><small>Verified income and contract graph</small></div></article><article><Braces /><div><b>Decision & Limit Engine</b><small>Eligibility • capacity • reasons</small></div></article><article><Activity /><div><b>Portfolio Intelligence</b><small>Exposure • events • early warnings</small></div></article></div>
          <div className="arch-arrow"><ArrowRight /></div>
          <div className="arch-column"><span className="arch-label">Financial products</span><article><WalletCards /><div><b>Licensed lenders</b><small>Capital and regulated servicing</small></div></article><article><CircleDollarSign /><div><b>Worker products</b><small>Income lines • relocation • emergency</small></div></article></div>
        </div>
        <div className="regulated-flow"><span>Operating boundary</span><b>PayGraph decisioning</b><ArrowRight/><b>Licensed lender of record</b><ArrowRight/><b>Disclosures, servicing & reporting</b><small>Licensing and product terms remain with the regulated capital partner in each jurisdiction.</small></div>
      </section>

      <section className="vision-section" id="vision">
        <div className="section-copy light-copy"><p className="eyebrow"><Sparkles size={14} /> Controlled launch path</p><h2>Move from working proof to pilot in 90 days.</h2><p>The sequence validates data and policy first, then introduces capital and customers inside explicit risk boundaries.</p></div>
        <div className="roadmap-grid"><article className="roadmap-live"><span>Now • Working proof</span><h3>Decision core</h3><p>Worker and employer decisions, reason codes, events, governance and portfolio impact.</p></article><article><span>Days 1–30</span><h3>Policy and data validation</h3><p>Confirm source coverage, consent, eligibility rules, jurisdiction and risk appetite.</p></article><article><span>Days 31–60</span><h3>Partner and control readiness</h3><p>Complete lender routing, disclosures, servicing boundaries and operational playbooks.</p></article><article><span>Days 61–90</span><h3>Controlled pilot</h3><p>Launch a bounded cohort with approval, exposure, loss and customer-outcome reporting.</p></article></div>
      </section>

      <section className="founder-section" id="founder">
        <div><p className="eyebrow"><BadgeCheck size={14} /> Operator evidence</p><blockquote>“I built PayGraph to show how workforce data can become a governed credit business—not just another payroll feature.”</blockquote></div>
        <div className="founder-card"><span className="founder-initials">NB</span><div><h3>Naveen Budda</h3><p>Co-founder & CPTO, KarmaLife</p></div><ul><li>Built AI-native credit infrastructure supporting 2M+ gig and blue-collar workers</li><li>Led product, engineering and risk systems across employer and NBFC programs</li><li>20+ years across AI/ML, underwriting, portfolio analytics and regulated fintech</li></ul><a href="https://www.linkedin.com/in/naveenbudda" target="_blank" rel="noreferrer">View LinkedIn Profile <ExternalLink size={13}/></a></div>
      </section>

      <section className="walkthrough-cta"><div><p className="eyebrow"><Radio size={14}/> Build decision</p><h2>Decide whether to build, partner or bring the capability in-house.</h2><p>The prototype is ready for a technical, risk and commercial review.</p></div><a href="https://www.linkedin.com/in/naveenbudda" target="_blank" rel="noreferrer">Discuss the build path <ArrowRight/></a></section>

      <footer><div className="brand"><span className="brand-mark"><GitBranch size={17} /></span><span>PayGraph <b>CreditOS</b></span></div><p>Independent prototype by Naveen Budda. Not affiliated with or endorsed by Deel.</p><div><a href="https://developer.deel.com/api/sandbox" target="_blank" rel="noreferrer">Reference API</a><a href="#top">Back to top</a></div></footer>
    </main>
  );
}
