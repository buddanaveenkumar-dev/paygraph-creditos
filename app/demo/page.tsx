import Link from "next/link";
import { ArrowRight, Building2, GitBranch, Users } from "lucide-react";

export default function DemoPage() {
  return (
    <main className="demo-hub">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark"><GitBranch size={19}/></span><span>PayGraph <b>CreditOS</b></span></Link>
        <nav><Link href="/">Product</Link><Link href="/demo">Decision demos</Link><Link href="/architecture">Architecture</Link><Link href="/integrations/deel">Deel integration</Link></nav>
        <a className="header-cta" href="https://www.linkedin.com/in/naveenbudda" target="_blank" rel="noreferrer">Request a walkthrough <ArrowRight size={14}/></a>
      </header>
      <section className="demo-hub-hero">
        <p className="eyebrow">Two businesses • one governed risk platform</p>
        <h1>Choose a decision surface.</h1>
        <p>PayGraph demonstrates both sides of a workforce platform’s credit strategy: creating responsible financial products for workers and controlling commercial exposure to employer clients.</p>
      </section>
      <section className="demo-choice-grid">
        <Link href="/#platform" className="demo-choice demo-choice-worker">
          <span className="demo-number">01</span><Users size={28}/><p>New business</p><h2>Worker Credit OS</h2>
          <span>Launch salary advances and partner-funded credit using verified employment, contract and payroll signals.</span>
          <strong>Open worker decision demo <ArrowRight size={16}/></strong>
        </Link>
        <Link href="/demo/employer" className="demo-choice demo-choice-employer">
          <span className="demo-number">02</span><Building2 size={28}/><p>Core risk infrastructure</p><h2>Employer Risk OS</h2>
          <span>Underwrite payroll-funding exposure, set dynamic limits, monitor early warnings and orchestrate collections.</span>
          <strong>Open employer risk demo <ArrowRight size={16}/></strong>
        </Link>
      </section>
      <section className="demo-thesis"><b>The operating thesis</b><p>Growth and control should share one decision architecture: normalized workforce data, versioned policies, real-time events and portfolio accountability.</p></section>
    </main>
  );
}
