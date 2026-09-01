"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowRight, BadgeCheck, Banknote, BarChart3, Building2, Check, ChevronRight, FileCheck2, GitBranch, Globe2, Landmark, LockKeyhole, ShieldCheck, TrendingDown, Users, WalletCards, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Scenario = "approval" | "growth" | "failed_funding";
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const states = {
  approval: { requested: 500000, approved: 350000, available: 132000, utilized: 218000, pd: 1.8, lgd: 35, score: 82, band: "B+", status: "Approved with conditions", alert: "Normal monitoring", color: "good" },
  growth: { requested: 500000, approved: 425000, available: 207000, utilized: 218000, pd: 1.4, lgd: 35, score: 88, band: "A−", status: "Limit increased", alert: "Growth signal verified", color: "good" },
  failed_funding: { requested: 500000, approved: 250000, available: 32000, utilized: 218000, pd: 4.9, lgd: 42, score: 63, band: "C", status: "Limit reduced", alert: "Collections watch", color: "warn" },
} as const;

function Stat({ label, value, note, accent }: { label: string; value: string; note: string; accent?: boolean }) {
  return <div className={`employer-stat ${accent ? "employer-stat-accent" : ""}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

export default function EmployerRiskDemo() {
  const [scenario, setScenario] = useState<Scenario>("approval");
  const d = states[scenario];
  const expectedLoss = useMemo(() => Math.round(d.utilized * (d.pd / 100) * (d.lgd / 100)), [d]);
  const utilization = Math.round((d.utilized / d.approved) * 100);

  return (
    <main className="employer-os">
      <header className="topbar employer-topbar">
        <Link href="/" className="brand"><span className="brand-mark"><GitBranch size={19}/></span><span>PayGraph <b>CreditOS</b></span></Link>
        <nav><Link href="/">Product</Link><Link href="/demo">Decision demos</Link><Link href="/#platform">Worker Credit OS</Link><Link href="/architecture">Architecture</Link></nav>
        <a className="header-cta" href="https://www.linkedin.com/in/naveenbudda" target="_blank" rel="noreferrer">Request a walkthrough <ArrowRight size={14}/></a>
      </header>

      <section className="employer-hero">
        <div><p className="eyebrow"><Building2 size={14}/> Employer Risk OS • Executive demonstration</p><h1>Grow payroll volume without losing control of exposure.</h1><p>Commercial underwriting, dynamic funding limits, early-warning monitoring and collections orchestration for workforce-platform clients.</p></div>
        <div className="employer-hero-thesis"><span>Portfolio mandate</span><b>Approve the right growth. Detect deterioration early. Preserve recoverability.</b><small>Illustrative decisions modeled on synthetic employer data.</small></div>
      </section>

      <section className="employer-command">
        <div className="employer-command-head">
          <div><span className="live-dot"/> Policy engine online <code>PG-B2B-US-2.1</code></div>
          <div className="scenario-buttons" role="group" aria-label="Employer risk scenarios">
            <button className={scenario === "approval" ? "active" : ""} onClick={() => setScenario("approval")}>Initial decision</button>
            <button className={scenario === "growth" ? "active" : ""} onClick={() => setScenario("growth")}>Verified growth</button>
            <button className={scenario === "failed_funding" ? "active danger" : ""} onClick={() => setScenario("failed_funding")}>Failed funding event</button>
          </div>
        </div>

        <Tabs defaultValue="underwriting" className="employer-tabs">
          <div className="employer-view-nav">
            <span>Executive views</span>
            <TabsList aria-label="Employer Risk OS views">
              <TabsTrigger value="underwriting"><FileCheck2/> <span>Underwriting</span></TabsTrigger>
              <TabsTrigger value="portfolio"><BarChart3/> <span>Portfolio impact</span></TabsTrigger>
              <TabsTrigger value="governance"><ShieldCheck/> <span>Governance</span></TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="underwriting">
            <div className="employer-decision-grid">
              <section className="company-profile">
                <div className="company-heading"><div className="company-logo">NL</div><div><p>Applicant company</p><h2>Northstar Labs, Inc.</h2><span>Technology services • United States • 286 workers</span></div><span className={`company-status ${d.color}`}>{scenario === "failed_funding" ? <AlertTriangle size={13}/> : <BadgeCheck size={13}/>} {d.status}</span></div>
                <div className="company-signals">
                  <div><span><WalletCards/> Monthly payroll volume</span><b>$742,000</b><small>{scenario === "growth" ? "+24% verified growth" : "+11% YoY"}</small></div>
                  <div><span><Banknote/> Funding reliability</span><b>{scenario === "failed_funding" ? "93.8%" : "99.4%"}</b><small>{scenario === "failed_funding" ? "1 failed debit in 30 days" : "18 of 18 cycles on time"}</small></div>
                  <div><span><Globe2/> Country exposure</span><b>6 markets</b><small>Largest market 34%</small></div>
                  <div><span><Users/> Workforce concentration</span><b>22%</b><small>Largest entity share</small></div>
                  <div><span><Landmark/> Liquidity coverage</span><b>{scenario === "failed_funding" ? "0.8×" : "1.7×"}</b><small>Verified cash / next payroll</small></div>
                  <div><span><BarChart3/> Deel tenure</span><b>21 months</b><small>$13.2M processed</small></div>
                </div>
                <div className="requested-limit"><span>Requested payroll-funding limit</span><strong>{usd.format(d.requested)}</strong><small>30-day revolving facility • synthetic application</small></div>
              </section>

              <section className={`commercial-decision ${scenario === "failed_funding" ? "commercial-warning" : ""}`}>
                <div className="commercial-head"><div><p>Credit committee recommendation</p><h2>{usd.format(d.approved)} governed limit</h2><span>Risk band {d.band} • Review cadence {scenario === "failed_funding" ? "7 days" : "30 days"}</span></div><div className="commercial-score"><b>{d.score}</b><small>/100</small></div></div>
                <div className="limit-rail"><div style={{width:`${Math.min(100, (d.approved/d.requested)*100)}%`}}/><span>Approved {Math.round((d.approved/d.requested)*100)}% of request</span></div>
                <div className="commercial-kpis"><Stat label="Available" value={usd.format(d.available)} note="Remaining commitment" accent/><Stat label="Utilized" value={usd.format(d.utilized)} note={`${utilization}% utilization`}/><Stat label="Expected loss" value={usd.format(expectedLoss)} note={`${d.pd}% PD × ${d.lgd}% LGD`}/></div>
                <div className="decision-reasons"><div><span><FileCheck2 size={16}/> Decision rationale</span><code>PG-B2B-US-2.1</code></div>
                  {scenario === "failed_funding" ? <ul><li className="negative"><AlertTriangle/> ACH funding failure detected before payroll cutoff.</li><li className="negative"><TrendingDown/> Liquidity coverage declined from 1.7× to 0.8×.</li><li><LockKeyhole/> Unused commitment reduced by $100,000; utilized exposure preserved.</li><li><ShieldCheck/> Account routed to collections watch with a seven-day review.</li></ul> : <ul><li><Check/> 99.4% funding reliability across 18 completed payroll cycles.</li><li><Check/> Requested limit remains below one month of verified payroll volume.</li><li><Check/> Country and entity concentrations remain within policy thresholds.</li><li><ShieldCheck/> Conditions: weekly liquidity feed and 30-day limit review.</li></ul>}
                </div>
              </section>
            </div>
            <div className={`employer-event ${scenario}`}><div><Activity/><span><b>{d.alert}</b><small>{scenario === "approval" ? "Initial employer decision completed in 312 ms" : scenario === "growth" ? "Three verified payroll cycles triggered a governed limit increase" : "Failed debit triggered limit reduction and collections routing in 1.2 seconds"}</small></span></div><time>{scenario === "approval" ? "09:41:04" : scenario === "growth" ? "10:18:22" : "11:03:45"}</time></div>
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="employer-portfolio">
              <div className="portfolio-exec-head"><div><p>Commercial credit portfolio</p><h2>Risk-adjusted growth command centre</h2></div><span className={scenario === "failed_funding" ? "risk-alert" : "risk-normal"}><Zap size={13}/> {scenario === "failed_funding" ? "1 priority action" : "Within appetite"}</span></div>
              <div className="portfolio-exec-kpis"><Stat label="Total exposure" value="$18.6M" note="43 employer clients"/><Stat label="Utilized" value="$12.1M" note="65% portfolio utilization"/><Stat label="Weighted expected loss" value={scenario === "failed_funding" ? "$248K" : "$221K"} note={scenario === "failed_funding" ? "+$27K after event" : "1.83% of utilized"}/><Stat label="Risk-adjusted yield" value={scenario === "failed_funding" ? "8.1%" : "8.7%"} note="After expected loss" accent/></div>
              <div className="portfolio-exec-grid">
                <div className="exposure-bands"><h3>Exposure by risk band</h3>{[["A / A−","46%","$8.6M"],["B+ / B","35%","$6.5M"],["C and watch","19%","$3.5M"]].map(([label,width,value],i)=><div key={label}><span>{label}</span><i><b className={`band-${i}`} style={{width}}/></i><strong>{value}</strong></div>)}</div>
                <div className="concentration-panel"><h3>Concentration controls</h3><div><span>Technology sector</span><b>28%</b><small>Limit 35%</small></div><div><span>United States</span><b>41%</b><small>Limit 50%</small></div><div><span>Top five clients</span><b>32%</b><small>Limit 40%</small></div></div>
                <div className={`action-queue ${scenario === "failed_funding" ? "queue-alert" : ""}`}><h3>Executive action queue</h3><article><AlertTriangle/><span><b>Northstar Labs</b><small>{scenario === "failed_funding" ? "Confirm cure plan before next payroll cutoff" : "No material exception"}</small></span><strong>{scenario === "failed_funding" ? "P1" : "Clear"}</strong></article><article><Activity/><span><b>Two limit reviews</b><small>Scheduled within the next seven days</small></span><strong>P2</strong></article></div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="governance">
            <div className="governance-board">
              <section><p>Immutable decision record</p><h2>Every limit is reproducible.</h2><div><span>Decision ID</span><code>dec_b2b_91A72F</code></div><div><span>Policy</span><code>PG-B2B-US-2.1</code></div><div><span>Input snapshot</span><code>sha256:f61c…02ae</code></div><div><span>Decision timestamp</span><code>2026-08-28T09:41:04Z</code></div><div><span>Approval authority</span><code>Delegated matrix • L3</code></div></section>
              <section><p>Three lines of defense</p><h2>Controls scale with exposure.</h2><article><span>1</span><div><b>Business ownership</b><small>Origination quality, client context and covenant monitoring</small></div></article><article><span>2</span><div><b>Independent credit risk</b><small>Policy, limits, exceptions and portfolio appetite</small></div></article><article><span>3</span><div><b>Audit and model assurance</b><small>Reproducibility, drift testing and control evidence</small></div></article></section>
              <section className="committee-note"><ShieldCheck/><div><b>Human accountability is preserved</b><p>Automation prepares the recommendation. Material exceptions, overrides and concentration breaches remain within an explicit delegated-authority framework.</p></div></section>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="employer-operating-model"><div><p className="eyebrow">VP operating model</p><h2>One mandate across growth, risk and recoverability.</h2></div><div className="operating-pillars"><article><span>01</span><b>Set appetite</b><p>Translate company strategy into limits, concentrations and approval authority.</p></article><article><span>02</span><b>Scale decisions</b><p>Automate repeatable cases while keeping exceptions explainable and governed.</p></article><article><span>03</span><b>Monitor the book</b><p>Connect every funding and payroll event to exposure and expected loss.</p></article><article><span>04</span><b>Own outcomes</b><p>Close the loop through collections, recoveries and policy recalibration.</p></article></div></section>
      <section className="employer-final"><div><p>PayGraph CreditOS</p><h2>New financial-products growth and commercial-risk control—built as one executive platform.</h2></div><Link href="/demo">Compare both demonstrations <ChevronRight/></Link></section>
      <footer><Link href="/" className="brand"><span className="brand-mark"><GitBranch size={19}/></span><span>PayGraph <b>CreditOS</b></span></Link><p>Independent prototype • Synthetic decisions • Not an official Deel product or partnership</p><a href="https://www.linkedin.com/in/naveenbudda" target="_blank" rel="noreferrer">Request a walkthrough</a></footer>
    </main>
  );
}
