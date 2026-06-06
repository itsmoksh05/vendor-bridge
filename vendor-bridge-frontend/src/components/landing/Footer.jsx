import { Logo } from "./Logo";
const cols = [
  { title: "Product", links: ["Features", "How It Works", "Roles", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Customers", "Careers", "Contact", "Blog"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "DPA", "Cookies"] },
];
export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-white/[0.02]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The procurement & vendor management ERP for modern teams.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="font-display text-sm font-semibold text-foreground">{c.title}</h4>
            <ul className="mt-4 space-y-2">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} VendorBridge. All rights reserved.</p>
          <p>Made for procurement teams who move fast.</p>
        </div>
      </div>
    </footer>
  );
}
