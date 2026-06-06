import { FileText, CheckCircle2, ShoppingCart, Users, Play, ArrowRight, Sparkles } from "lucide-react";

const stats = [
  { label: "Active RFQs", value: "12", icon: FileText, tint: "text-indigo-300" },
  { label: "Pending Approvals", value: "4", icon: CheckCircle2, tint: "text-amber-300" },
  { label: "POs Generated", value: "38", icon: ShoppingCart, tint: "text-emerald-300" },
  { label: "Vendors", value: "127", icon: Users, tint: "text-cyan-300" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.45),transparent_60%)] blur-2xl animate-orb" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.38),transparent_60%)] blur-2xl animate-orb-2" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.25),transparent_60%)] blur-2xl animate-orb-slow" />
        <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Procurement ERP, reimagined for modern teams
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-gradient">Procurement, Simplified.</span>
            <br />
            <span className="text-foreground">Vendors, Unified.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            VendorBridge brings your entire procurement lifecycle — RFQs, quotations,
            approvals, and invoices — into one intelligent ERP platform.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_rgba(99,102,241,0.8)] transition-all hover:translate-y-[-1px] hover:bg-primary/90">
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-white/10">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/40">
                <Play className="h-3 w-3 fill-current text-primary" />
              </span>
              Watch Demo
            </button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {["#6366f1", "#22d3ee", "#a78bfa", "#f59e0b"].map((c, i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full ring-2 ring-background"
                  style={{ background: c }}
                />
              ))}
            </div>
            <span>Trusted by 500+ procurement teams worldwide</span>
          </div>
        </div>

        {/* Floating dashboard card */}
        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary/30 via-violet-500/20 to-cyan-400/10 blur-2xl" />
          <div className="glass-strong relative rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="text-xs text-muted-foreground">vendorbridge.app/dashboard</span>
            </div>

            <div className="mt-5 flex items-baseline justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Good morning, Alex</p>
                <h3 className="font-display text-lg font-semibold">Procurement Overview</h3>
              </div>
              <span className="rounded-md bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/30">
                Live
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
                >
                  <div className="flex items-center justify-between">
                    <s.icon className={`h-4 w-4 ${s.tint}`} />
                    <span className="text-[10px] text-muted-foreground">Today</span>
                  </div>
                  <p className="mt-3 font-display text-3xl font-bold text-foreground">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">RFQ #2048 · Office Equipment</span>
                <span className="text-emerald-300">3 quotes received</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-violet-400" />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                <span>Draft</span><span>Quoting</span><span>Approve</span><span>PO</span>
              </div>
            </div>
          </div>

          {/* Floating mini cards */}
          <div className="glass absolute -left-6 top-10 hidden rounded-xl p-3 shadow-xl md:block">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              <div className="text-xs">
                <p className="font-semibold">PO #1124 approved</p>
                <p className="text-muted-foreground">2 min ago</p>
              </div>
            </div>
          </div>
          <div className="glass absolute -bottom-4 -right-2 hidden rounded-xl p-3 shadow-xl md:block">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <div className="text-xs">
                <p className="font-semibold">AI suggested vendor</p>
                <p className="text-muted-foreground">Saves ~12%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
