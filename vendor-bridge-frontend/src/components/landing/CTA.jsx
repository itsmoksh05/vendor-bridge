import { ArrowRight } from "lucide-react";
export function CTA() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-12 text-center md:p-16">
          <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.45),transparent_60%)] blur-2xl" />
          <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <h2 className="relative font-display text-4xl font-bold md:text-5xl">
            Ready to modernize your <span className="text-gradient">procurement?</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Join forward-thinking organizations using VendorBridge to streamline sourcing,
            approvals, and vendor relationships.
          </p>
          <div className="relative mt-8 flex justify-center">
            <button className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_rgba(99,102,241,0.9)] transition-all hover:translate-y-[-1px] hover:bg-primary/90">
              Start for Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
