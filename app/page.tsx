"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowRight, BadgeCheck, Ban, Braces, BriefcaseBusiness, Check, CircleDollarSign, Clock3, Database, ExternalLink, FileCheck2, GitBranch, LineChart, LockKeyhole, Radio, RefreshCw, ShieldCheck, Sparkles, TrendingDown, Users, WalletCards, Webhook, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function Home() {
  const [scenario, setScenario] = useState<Scenario>("baseline");
  const [profile, setProfile] = useState<Profile>("ana");
  const [demoKey, setDemoKey] = useState("");
  const [sandboxState, setSandboxState] = useState<"idle" | "loading" | "connected" | "error">("idle");
  const [sandboxDetail, setSandboxDetail] = useState("Public mode uses deterministic synthetic records.");
  const decision = useMemo(() => {
    if (profile === "marcus") return { income: 5100, limit: 0, available: 0, outstanding: 0, score: 61, risk: "Elevated", status: "Conditional", policy: "PG-US-IC-1.4" };
    if (scenario === "terminated") return { income: 8750, limit: 5400, available: 0, outstanding: 2100, score: 46, risk: "Elevated", status: "Frozen", policy: "PG-US-IC-1.3" };
    if (scenario === "payment") return { income: 8750, limit: 5400, available: 3300, outstanding: 2100, score: 91, risk: "Low", status: "Eligible", policy: "PG-US-IC-1.3" };
    return { income: 8400, limit: 5000, available: 2900, outstanding: 2100, score: 88, risk: "Low", status: "Eligible", policy: "PG-US-IC-1.3" };
  }, [scenario, profile]);

  const chooseProfile = (next: Profile) => { setProfile(next); setScenario("baseline"); };
  const connectSandbox = async () => {
    setSandboxState("loading");
    try {
      const response = await fetch("/api/deel/snapshot", { headers: { "x-demo-access-key": demoKey } });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Connection failed");
      setSandboxState("connected");
      setSandboxDetail(`${body.contracts.length} contracts and ${body.payments.length} payments fetched • API ${body.apiVersion} • ${body.requestIds.length} request IDs captured`);
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
        <nav aria-label="Primary navigation"><a href="#platform">Platform</a><a href="#portfolio-intelligence">Portfolio</a><a href="/architecture">Architecture</a><a href="/integrations/deel">Deel integration</a><a href="#founder">Founder</a></nav>
        <span className="independent-badge"><Radio size={13} /> Independent product concept</span>
        <a className="header-cta" href="https://www.linkedin.com/in/naveenbudda" target="_blank" rel="noreferrer">Request a walkthrough <ArrowRight size={14} /></a>
      </header>

      <section className="product-shell" id="top">
        <div className="product-intro">
          <div><p className="eyebrow"><Sparkles size={14} /> Payroll-native credit intelligence</p><h1>Turn workforce signals into explainable credit decisions.</h1></div>
          <p>A vendor-neutral decisioning and portfolio layer for payroll and HR platforms—built against Deel sandbox workflows as the first reference integration.</p>
        </div>

        <div className="proof-strip" aria-label="Illustrative platform metrics">
          <p><span>Modeled on synthetic data</span> Demonstration metrics—not production claims</p>
          <div><strong>184 ms</strong><span>illustrative decision latency</span></div>
          <div><strong>100%</strong><span>decisions with reason codes</span></div>
          <div><strong>78%</strong><span>straight-through decisions</span></div>
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
                  <div><span><Clock3 /> Contract tenure</span><b>{profile === "ana" ? "26 months" : "4 months"}</b></div>
                  <div><span><BriefcaseBusiness /> Active contracts</span><b>{profile === "marcus" ? "1" : scenario === "terminated" ? "1 of 2" : "2"}</b></div>
                  <div><span><LineChart /> Income trend</span><b className={profile === "ana" ? "positive" : "negative"}>{profile === "ana" ? "Stable +4.2%" : "Declining −18.6%"}</b></div>
                  <div><span><Users /> Client concentration</span><b>{profile === "ana" ? "62%" : "84%"}</b></div>
                  <div><span><BadgeCheck /> Payment reliability</span><b>{profile === "ana" ? "98.4%" : "86.1%"}</b></div>
                </div>
                {profile === "ana" ? <div className="event-controls">
                  <p>Simulate a live workforce event</p>
                  <div>
                    <Button onClick={() => setScenario("payment")} disabled={scenario !== "baseline"} className="button-dark"><CircleDollarSign /> Verify payroll payment</Button>
                    <Button onClick={() => setScenario("terminated")} disabled={scenario === "terminated"} variant="outline" className="button-outline"><Webhook /> Fire termination webhook</Button>
                    <Button onClick={() => setScenario("baseline")} variant="ghost" size="icon" aria-label="Reset demo"><RefreshCw /></Button>
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
                <div className="integration-title"><div><p className="panel-kicker">Private walkthrough mode</p><h2>Deel API Sandbox connector</h2></div><StatusPill tone={sandboxState === "connected" ? "good" : sandboxState === "error" ? "warn" : "neutral"}><Radio size={12}/>{sandboxState === "connected" ? "Connected" : sandboxState === "loading" ? "Connecting" : sandboxState === "error" ? "Action required" : "Locked"}</StatusPill></div>
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
          <h2>Every workforce event rolls up into an exposure decision.</h2>
          <p>This illustrative command centre turns worker-level changes into portfolio-level monitoring: exposure, risk migration, concentrations and the exact events requiring action.</p>
          <span>Modeled on a synthetic 24-worker cohort</span>
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

      <section className="architecture-section" id="architecture">
        <div className="section-copy"><p className="eyebrow"><GitBranch size={14} /> Platform architecture</p><h2>One intelligence layer. Any workforce platform. Any licensed capital partner.</h2><p>PayGraph does not lend. It provides the decisioning, monitoring and governance infrastructure between verified workforce data and regulated financial products.</p></div>
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
        <div className="section-copy light-copy"><p className="eyebrow"><Sparkles size={14} /> Product vision</p><h2>From a working decision core to a global credit operating system.</h2><p>The MVP stays deliberately narrow. The architecture creates a credible path to the operating discipline around the models—not just another score.</p></div>
        <div className="roadmap-grid"><article className="roadmap-live"><span>01 • Working now</span><h3>Decisioning core</h3><p>Payroll gateway, workforce profile, explainable decisions, dynamic limits and portfolio roll-up.</p></article><article><span>02 • Next</span><h3>Early warning & collections</h3><p>Recommended interventions based on income deterioration, contract events and repayment behaviour.</p></article><article><span>03 • Scale</span><h3>Global policy governance</h3><p>Country, lender and worker-class rules with approvals, versions, audit trails and adverse-action controls.</p></article><article><span>04 • Network</span><h3>Capital routing</h3><p>Match eligible workers to licensed partners by geography, risk appetite, price and available capital.</p></article></div>
      </section>

      <section className="founder-section" id="founder">
        <div><p className="eyebrow"><BadgeCheck size={14} /> Founder thesis</p><blockquote>“Payroll is not just a payment rail. It is a real-time risk signal that can make credit fairer, safer and more explainable.”</blockquote></div>
        <div className="founder-card"><span className="founder-initials">NB</span><div><h3>Naveen Budda</h3><p>Co-founder & CPTO, KarmaLife</p></div><ul><li>Built AI-native credit infrastructure supporting 2M+ gig and blue-collar workers</li><li>Led product, engineering and risk systems across employer and NBFC programs</li><li>20+ years across AI/ML, underwriting, portfolio analytics and regulated fintech</li></ul><a href="https://www.linkedin.com/in/naveenbudda" target="_blank" rel="noreferrer">View verified experience <ExternalLink size={13}/></a></div>
      </section>

      <section className="walkthrough-cta"><div><p className="eyebrow"><Radio size={14}/> Continue the conversation</p><h2>See how payroll-native signals become governed credit decisions.</h2><p>Request a focused walkthrough of the decision architecture, portfolio controls and path to licensed-lender integration.</p></div><a href="https://www.linkedin.com/in/naveenbudda" target="_blank" rel="noreferrer">Request a walkthrough <ArrowRight/></a></section>

      <footer><div className="brand"><span className="brand-mark"><GitBranch size={17} /></span><span>PayGraph <b>CreditOS</b></span></div><p>Independent product concept by Naveen Budda. Not affiliated with or endorsed by Deel.</p><div><a href="https://developer.deel.com/api/sandbox" target="_blank" rel="noreferrer">Reference API</a><a href="#top">Back to top</a></div></footer>
    </main>
  );
}
