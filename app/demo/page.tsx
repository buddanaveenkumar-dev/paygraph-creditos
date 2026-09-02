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
        <p className="eyebrow">Two credit decisions • one control layer</p>
        <h1>Choose a demo.</h1>
        <p>See how the same infrastructure can assess worker credit and manage commercial exposure to employer clients.</p>
      </section>
      <section className="demo-choice-grid">
        <Link href="/#platform" className="demo-choice demo-choice-worker">
          <span className="demo-number">01</span><Users size={28}/><p>Worker products</p><h2>Worker Credit OS</h2>
          <span>Assess eligibility and limits from verified income, contract tenure and payment history.</span>
          <strong>Open worker demo <ArrowRight size={16}/></strong>
        </Link>
        <Link href="/demo/employer" className="demo-choice demo-choice-employer">
          <span className="demo-number">02</span><Building2 size={28}/><p>Commercial exposure</p><h2>Employer Risk OS</h2>
          <span>Set payroll-funding limits, monitor deterioration and prioritize action before the next payroll run.</span>
          <strong>Open employer demo <ArrowRight size={16}/></strong>
        </Link>
      </section>
      <section className="demo-thesis"><b>Shared foundation</b><p>Both demos use normalized workforce data, versioned policies, signed events and an auditable decision record.</p></section>
    </main>
  );
}
