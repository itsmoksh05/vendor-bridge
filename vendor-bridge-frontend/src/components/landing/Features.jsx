import {
  Users, FileText, GitCompare, CheckCircle2, ShoppingCart, Receipt, Mail, History,
} from "lucide-react";
const features = [
  { icon: Users, title: "Vendor Management", desc: "Centralize vendor profiles, contacts, and performance metrics." },
  { icon: FileText, title: "RFQ Creation", desc: "Draft and send detailed requests for quotation in minutes." },
  { icon: GitCompare, title: "Quotation Comparison", desc: "Side-by-side analysis to pick the best price and terms." },
  { icon: CheckCircle2, title: "Approval Workflows", desc: "Multi-step approvals with custom rules and escalation." },
  { icon: ShoppingCart, title: "Auto-generated POs", desc: "Convert approved quotes into purchase orders instantly." },
  { icon: Receipt, title: "Invoice Generation", desc: "Create compliant invoices tied to every PO automatically." },
  { icon: Mail, title: "Email Invoices", desc: "Send branded invoices to vendors with one click delivery." },
  { icon: History, title: "Audit Trails", desc: "Immutable activity logs across every action and user." },
];
export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            Features
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Everything procurement <span className="text-gradient">teams need</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            One platform that replaces spreadsheets, email threads, and disconnected tools.
          </p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group glass relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                   style={{ background: "radial-gradient(400px circle at 50% 0%, rgba(99,102,241,0.18), transparent 60%)" }} />
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-violet-500/10 ring-1 ring-primary/30">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
