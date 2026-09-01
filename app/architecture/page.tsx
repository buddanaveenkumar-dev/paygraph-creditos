import Link from "next/link";
import { Activity, ArrowLeft, ArrowRight, BrainCircuit, Braces, Database, GitBranch, Globe2, Gauge, Network, Scale, ShieldCheck, SlidersHorizontal, WalletCards, Webhook } from "lucide-react";

const jurisdictions = [
  ["United States", "FCRA • ECOA / Reg B", "Adverse-action reasons • permissible-purpose controls • bias monitoring"],
  ["United Kingdom", "FCA / Consumer Duty", "Affordability evidence • customer-outcome monitoring • policy approvals"],
  ["India", "RBI digital lending", "Regulated-entity boundary • consent / data minimization • lender policy routing"],
];

export default function ArchitecturePage() {
  return <main className="architecture-page">
    <header className="topbar"><Link href="/" className="brand"><span className="brand-mark"><GitBranch size={19}/></span><span>PayGraph <b>CreditOS</b></span></Link><nav><Link href="/"><ArrowLeft size={13}/> Product</Link><Link href="/demo">Demo</Link><Link href="/demo/employer">Employer Risk OS</Link><Link href="/integrations/deel">Deel integration</Link></nav></header>

    <section className="architecture-hero"><p className="eyebrow"><GitBranch size={14}/> Production reference architecture</p><h1>Graph intelligence, policy governance and real-time risk—in one credit control plane.</h1><p>The prototype demonstrates the decision surfaces. This page shows the production architecture required to operate them globally: entity graph, online features, explainable models, jurisdiction-aware policy, event streaming, model monitoring and immutable audit evidence.</p></section>

    <section className="architecture-detail"><article><Database/><span>Source plane</span><h2>Workforce signals</h2><p>Contracts, payroll, payments, employer entities, balances and lifecycle events enter through versioned connectors.</p></article><ArrowRight/><article><BrainCircuit/><span>Intelligence plane</span><h2>PayGraph CreditOS</h2><p>Graph-derived features + conventional ML/GNN candidates + policy execution + reason codes + portfolio monitoring.</p></article><ArrowRight/><article><WalletCards/><span>Execution plane</span><h2>Licensed partners</h2><p>Capital, disclosures, servicing, reporting and jurisdictional obligations remain with the lender of record.</p></article></section>

    <section className="production-architecture">
      <div className="section-copy"><p className="eyebrow"><Network size={14}/> What “graph” means</p><h2>Not a marketing label. A governed feature pipeline.</h2><p>Graph features complement—not replace—standard underwriting models. The architecture can start with deterministic relationship features and graduate selected use cases to GNNs only where lift, explainability and governance justify the complexity.</p></div>
      <div className="production-grid">
        <article><Network/><span>01 • Entity graph</span><h3>Worker ↔ employer ↔ contract ↔ payment ↔ country</h3><p>Resolve identities, shared employers, client concentration, payment continuity and cross-border relationship patterns.</p><code>Graph store: Neptune / Neo4j-compatible abstraction</code></article>
        <article><SlidersHorizontal/><span>02 • Feature plane</span><h3>Online + offline feature parity</h3><p>Versioned point-in-time features prevent training/serving skew and make every score reproducible.</p><code>Feature TTL • lineage • backfill • PIT joins</code></article>
        <article><BrainCircuit/><span>03 • Model plane</span><h3>Champion / challenger by market</h3><p>Rules + GBM/logistic baselines; graph embeddings or GNN challengers where incremental loss-adjusted lift is proven.</p><code>SHAP / reason mapping • calibration • fairness</code></article>
        <article><Braces/><span>04 • Policy plane</span><h3>Jurisdiction and lender orchestration</h3><p>Model output never bypasses policy. Country, lender, worker class, product and delegated authority determine the executable decision.</p><code>policy_version + model_version + reason_codes</code></article>
        <article><Webhook/><span>05 • Event plane</span><h3>Streaming risk recalculation</h3><p>Payment completion, funding failure, contract termination and payroll changes trigger idempotent exposure updates.</p><code>Signed events • dedupe • replay • DLQ</code></article>
        <article><Activity/><span>06 • ModelOps</span><h3>Drift, stability and outcome monitoring</h3><p>Population shift, feature drift, approval/loss movement and fairness metrics are monitored before model degradation becomes portfolio loss.</p><code>PSI • calibration • bad-rate lift • alerts</code></article>
      </div>
    </section>

    <section className="scale-slo">
      <div><p className="eyebrow"><Gauge size={14}/> Production SLO design</p><h2>Scale is an engineering contract, not a slide claim.</h2><p>Illustrative target architecture: horizontally scalable stateless decision services, cached online features, asynchronous graph recomputation and regional policy deployment.</p></div>
      <div className="slo-grid"><article><strong>&lt;200 ms</strong><span>p95 synchronous decision target</span></article><article><strong>10K+/sec</strong><span>horizontal throughput design point</span></article><article><strong>99.99%</strong><span>decision-service availability target</span></article><article><strong>&lt;2 sec</strong><span>critical-event exposure update target</span></article></div>
      <small>Targets shown are production design objectives, not measured claims for this public prototype.</small>
    </section>

    <section className="regulatory-matrix">
      <div className="section-copy"><p className="eyebrow"><Scale size={14}/> Global compliance control plane</p><h2>One core platform. Different legal execution by jurisdiction.</h2><p>PayGraph separates portable risk intelligence from market-specific obligations. Policies, reasons, approvals and lender routing are versioned independently by geography.</p></div>
      <div className="reg-table"><div className="reg-row reg-head"><b>Market</b><b>Framework lens</b><b>Control encoded in CreditOS</b></div>{jurisdictions.map(([market,framework,control])=><div className="reg-row" key={market}><strong><Globe2 size={14}/>{market}</strong><span>{framework}</span><span>{control}</span></div>)}</div>
      <p className="reg-note">Reference control mapping only; final product design requires licensed counsel and lender-specific compliance approval in each jurisdiction.</p>
    </section>

    <section className="governance-strip"><ShieldCheck/><div><b>Explainability by design</b><p>Every decision retains source provenance, point-in-time inputs, model and policy versions, reason codes, override authority and adverse-action mapping where applicable.</p></div><Webhook/><div><b>Event integrity</b><p>Signed events, idempotent handling, replay protection and request identifiers connect operational changes to portfolio outcomes.</p></div></section>
  </main>;
}
