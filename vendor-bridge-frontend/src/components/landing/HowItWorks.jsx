import { FileEdit, MessageSquareQuote, GitCompare, ShieldCheck, FileSignature, Banknote } from "lucide-react";
const steps = [
  { icon: FileEdit, title: "Create RFQ", desc: "Define requirements and invite vendors." },
  { icon: MessageSquareQuote, title: "Vendors Quote", desc: "Receive structured responses fast." },
  { icon: GitCompare, title: "Compare Quotes", desc: "Evaluate price, terms, lead time." },
  { icon: ShieldCheck, title: "Approve", desc: "Route through your approval chain." },
  { icon: FileSignature, title: "Generate PO", desc: "Auto-issue compliant purchase orders." },
  { icon: Banknote, title: "Invoice & Pay", desc: "Send invoices and close the loop." },
];
export function HowItWorks() {
  return (
    <section id="how" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            How it works
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            A workflow built for <span className="text-gradient">speed</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            From request to payment in six well-defined steps.
          </p>
        </div>
        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" />
          <div className="grid gap-8 md:grid-cols-6">
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background ring-1 ring-white/10">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/40 to-violet-500/10 opacity-60 blur-md" />
                  <s.icon className="relative h-6 w-6 text-primary" />
                </div>
                <div className="mt-3 inline-block rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  STEP {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-2 font-display text-base font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
