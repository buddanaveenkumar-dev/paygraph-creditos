"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowRight, BadgeCheck, Ban, Braces, BriefcaseBusiness, Check, CircleDollarSign, Clock3, Database, FileCheck2, GitBranch, LineChart, LockKeyhole, Radio, RefreshCw, ShieldCheck, Sparkles, Users, WalletCards, Webhook, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Scenario = "baseline" | "payment" | "terminated";
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
  const decision = useMemo(() => {
    if (scenario === "terminated") return { income: 8750, limit: 5400, available: 0, outstanding: 2100, score: 46, risk: "Elevated", status: "Frozen", policy: "PG-US-IC-1.3" };
    if (scenario === "payment") return { income: 8750, limit: 5400, available: 3300, outstanding: 2100, score: 91, risk: "Low", status: "Eligible", policy: "PG-US-IC-1.3" };
    return { income: 8400, limit: 5000, available: 2900, outstanding: 2100, score: 88, risk: "Low", status: "Eligible", policy: "PG-US-IC-1.3" };
  }, [scenario]);

  return (
    <main>
      <header className="topbar">
        <a href="#top" className="brand" aria-label="PayGraph CreditOS home"><span className="brand-mark"><GitBranch size={19} /></span><span>PayGraph <b>CreditOS</b></span></a>
        <nav aria-label="Primary navigation"><a href="#platform">Platform</a><a href="#architecture">Architecture</a><a href="#vision">Vision</a><a href="#founder">Founder</a></nav>
        <span className="independent-badge"><Radio size={13} /> Independent product concept</span>
      </header>

      <section className="product-shell" id="top">
        <div className="product-intro">
          <div><p className="eyebrow"><Sparkles size={14} /> Payroll-native credit intelligence</p><h1>Turn workforce signals into explainable credit decisions.</h1></div>
          <p>A vendor-neutral decisioning and portfolio layer for payroll and HR platforms—built against Deel sandbox workflows as the first reference integration.</p>
        </div>

        <Tabs defaultValue="decision" className="workspace" id="platform">
          <div className="workspace-nav">
            <div><span className="live-dot" /> Reference environment connected</div>
            <TabsList variant="line" aria-label="Product views"><TabsTrigger value="decision">Decision record</TabsTrigger><TabsTrigger value="portfolio">Portfolio</TabsTrigger><TabsTrigger value="data">Data lineage</TabsTrigger></TabsList>
          </div>

          <TabsContent value="decision" className="workspace-content">
            <div className="decision-grid">
              <section className="worker-panel">
                <div className="panel-heading">
                  <div><p className="panel-kicker">Worker profile</p><h2>Ana Silva</h2><span>Independent contractor • United States • USD</span></div>
                  <StatusPill tone={scenario === "terminated" ? "warn" : "good"}>{scenario === "terminated" ? <Ban size={13} /> : <BadgeCheck size={13} />}{decision.status}</StatusPill>
                </div>
                <div className="signal-list">
                  <div><span><CircleDollarSign /> Verified monthly income</span><b>{money.format(decision.income)}</b></div>
                  <div><span><Clock3 /> Contract tenure</span><b>26 months</b></div>
                  <div><span><BriefcaseBusiness /> Active contracts</span><b>{scenario === "terminated" ? "1 of 2" : "2"}</b></div>
                  <div><span><LineChart /> Income trend</span><b className="positive">Stable +4.2%</b></div>
                  <div><span><Users /> Client concentration</span><b>62%</b></div>
                  <div><span><BadgeCheck /> Payment reliability</span><b>98.4%</b></div>
                </div>
                <div className="event-controls">
                  <p>Simulate a live workforce event</p>
                  <div>
                    <Button onClick={() => setScenario("payment")} disabled={scenario !== "baseline"} className="button-dark"><CircleDollarSign /> Verify payroll payment</Button>
                    <Button onClick={() => setScenario("terminated")} disabled={scenario === "terminated"} variant="outline" className="button-outline"><Webhook /> Fire termination webhook</Button>
                    <Button onClick={() => setScenario("baseline")} variant="ghost" size="icon" aria-label="Reset demo"><RefreshCw /></Button>
                  </div>
                </div>
              </section>

              <section className={`decision-panel ${scenario === "terminated" ? "decision-frozen" : ""}`}>
                <div className="decision-topline">
                  <div><p className="panel-kicker">Explainable decision</p><h2>{scenario === "terminated" ? "Line frozen" : `${money.format(decision.limit)} approved line`}</h2></div>
                  <div className="score-ring" aria-label={`Risk score ${decision.score}`}><span>{decision.score}</span><small>/ 100</small></div>
                </div>
                <div className="decision-metrics">
                  <Metric label="Available" value={money.format(decision.available)} note={scenario === "terminated" ? "Frozen immediately" : "After current utilization"} accent />
                  <Metric label="Outstanding" value={money.format(decision.outstanding)} note="Preserved after freeze" />
                  <Metric label="Risk band" value={decision.risk} note="Current lifecycle state" />
                </div>
                <div className="explanation-box">
                  <div className="explanation-head"><span><FileCheck2 size={16} /> Why this decision?</span><code>{decision.policy}</code></div>
                  {scenario === "terminated" ? <ul><li className="reason-alert"><Ban /> Primary contract terminated at 11:03:44 UTC.</li><li><LockKeyhole /> Unused availability frozen; no new draws permitted.</li><li><ShieldCheck /> Outstanding $2,100 remains in active monitoring.</li></ul> : <ul><li><Check /> Verified income exceeds the $6,000 product floor.</li><li><Check /> 26-month tenure exceeds the 6-month minimum.</li><li><Check /> 98.4% payment reliability supports Low risk.</li><li><Check /> 38.9% proposed payment-to-income remains below the 45% cap.</li></ul>}
                </div>
                <div className="formula-row"><span>Calculated, never hardcoded</span><code>min(income capacity, contract cap, product cap)</code></div>
              </section>
            </div>
            <section className="event-strip" aria-live="polite">
              <div className="event-title"><Activity size={17} /><span>Decision lifecycle</span></div>
              {timeline[scenario].map((event) => <div className="event-item" key={event.label}><span className="event-node" /><div><b>{event.label}</b><small>{event.detail}</small></div><time>{event.time}</time></div>)}
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
            </div>
          </TabsContent>

          <TabsContent value="data" className="workspace-content">
            <div className="lineage-grid">
              <div className="lineage-source"><p className="panel-kicker">Reference connector</p><h2>Deel developer sandbox</h2><p>Contract, payment, balance and worker events are normalized before they reach the credit layer.</p><a href="https://developer.deel.com/api/sandbox" target="_blank" rel="noreferrer">View source documentation <ArrowRight /></a></div>
              <div className="lineage-flow"><div><Database /><span><b>Source objects</b><small>Contracts • payments • balances</small></span></div><ArrowRight /><div><Braces /><span><b>PayGraph schema</b><small>Vendor-neutral workforce model</small></span></div><ArrowRight /><div><ShieldCheck /><span><b>Decision record</b><small>Versioned • reproducible • auditable</small></span></div></div>
              <div className="audit-sample"><div><span>Decision ID</span><code>dec_7F29A4</code></div><div><span>Policy version</span><code>PG-US-IC-1.3</code></div><div><span>Input snapshot</span><code>sha256:8e4a…92f1</code></div><div><span>Decision latency</span><code>184 ms</code></div><div><span>Webhook verified</span><code>HMAC-SHA256</code></div></div>
            </div>
          </TabsContent>
        </Tabs>
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
      </section>

      <section className="vision-section" id="vision">
        <div className="section-copy light-copy"><p className="eyebrow"><Sparkles size={14} /> Product vision</p><h2>From a working decision core to a global credit operating system.</h2><p>The MVP stays deliberately narrow. The architecture creates a credible path to the operating discipline around the models—not just another score.</p></div>
        <div className="roadmap-grid"><article className="roadmap-live"><span>01 • Working now</span><h3>Decisioning core</h3><p>Payroll gateway, workforce profile, explainable decisions, dynamic limits and portfolio roll-up.</p></article><article><span>02 • Next</span><h3>Early warning & collections</h3><p>Recommended interventions based on income deterioration, contract events and repayment behaviour.</p></article><article><span>03 • Scale</span><h3>Global policy governance</h3><p>Country, lender and worker-class rules with approvals, versions, audit trails and adverse-action controls.</p></article><article><span>04 • Network</span><h3>Capital routing</h3><p>Match eligible workers to licensed partners by geography, risk appetite, price and available capital.</p></article></div>
      </section>

      <section className="founder-section" id="founder">
        <div><p className="eyebrow"><BadgeCheck size={14} /> Founder thesis</p><blockquote>“Payroll is not just a payment rail. It is a real-time risk signal that can make credit fairer, safer and more explainable.”</blockquote></div>
        <div className="founder-card"><span className="founder-initials">NB</span><div><h3>Naveen Budda</h3><p>Founder & credit infrastructure leader</p></div><ul><li>Built AI-native credit infrastructure for gig and blue-collar workers</li><li>20+ years across AI/ML, product, engineering and regulated fintech</li><li>Experience spanning underwriting, portfolio analytics and lender partnerships</li></ul></div>
      </section>

      <footer><div className="brand"><span className="brand-mark"><GitBranch size={17} /></span><span>PayGraph <b>CreditOS</b></span></div><p>Independent product concept by Naveen Budda. Not affiliated with or endorsed by Deel.</p><div><a href="https://developer.deel.com/api/sandbox" target="_blank" rel="noreferrer">Reference API</a><a href="#top">Back to top</a></div></footer>
    </main>
  );
}
