import { Briefcase, Store, UserCheck, Shield, Check } from "lucide-react";
const roles = [
  {
    icon: Briefcase,
    title: "Procurement Officer",
    tint: "from-indigo-500/30 to-indigo-500/0",
    ring: "ring-indigo-400/40 text-indigo-300",
    bullets: ["Create & publish RFQs", "Shortlist vendor quotes", "Trigger approval flows", "Generate purchase orders"],
  },
  {
    icon: Store,
    title: "Vendor",
    tint: "from-cyan-400/30 to-cyan-400/0",
    ring: "ring-cyan-400/40 text-cyan-300",
    bullets: ["Receive RFQ invites", "Submit detailed quotes", "Track PO status", "View invoices & payments"],
  },
  {
    icon: UserCheck,
    title: "Manager / Approver",
    tint: "from-violet-500/30 to-violet-500/0",
    ring: "ring-violet-400/40 text-violet-300",
    bullets: ["Review pending approvals", "Compare cost vs budget", "One-click approve / reject", "Audit decision history"],
  },
  {
    icon: Shield,
    title: "Admin",
    tint: "from-amber-400/30 to-amber-400/0",
    ring: "ring-amber-400/40 text-amber-300",
    bullets: ["Manage users & roles", "Configure workflows", "Set approval thresholds", "Access full audit trails"],
  },
];
export function Roles() {
  return (
    <section id="roles" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            Roles
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Built for every role in your <span className="text-gradient">team</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tailored workspaces with permissions, dashboards, and actions for each role.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <div key={r.title} className="glass relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
              <div className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${r.tint} blur-2xl`} />
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ring-1 ${r.ring}`}>
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{r.title}</h3>
              <ul className="mt-4 space-y-2">
                {r.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${r.ring.split(" ").pop()}`} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
