import { MarketingShell } from "@/components/MarketingShell";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, Minus } from "lucide-react";

const ROWS: { feature: string; free: boolean | string; pro: boolean | string }[] = [
  { feature: "Resume templates", free: "1 (Classic)", pro: "All 3" },
  { feature: "PDF downloads / day", free: "2", pro: "Unlimited" },
  { feature: "Cover letter generations / day", free: "3", pro: "Unlimited" },
  { feature: "Watermark-free PDF", free: false, pro: true },
  { feature: "Live preview & autosave", free: true, pro: true },
  { feature: "AI summary, headline & skills tools", free: true, pro: true },
  { feature: "Richer AI suggestions", free: false, pro: true },
  { feature: "All future templates", free: false, pro: true },
];

export default function Pricing() {
  return (
    <MarketingShell>
      <Seo
        title="Pricing — Free & Pro plans"
        description="Start free forever. Upgrade to Pro for $5/month for unlimited downloads, all templates, and watermark-free PDFs."
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold">Simple pricing. No surprises.</h1>
            <p className="mt-4 text-muted-foreground">Start free, upgrade only when you need more.</p>
          </div>

          <div className="mt-12 rounded-2xl border border-card-border bg-card overflow-hidden">
            <div className="grid grid-cols-3 border-b border-border">
              <div className="p-6"></div>
              <div className="p-6 text-center border-l border-border">
                <div className="font-serif text-2xl font-semibold">Free</div>
                <div className="mt-2 font-serif text-3xl">$0</div>
                <div className="text-xs text-muted-foreground">forever</div>
              </div>
              <div className="p-6 text-center border-l border-border bg-accent/5">
                <div className="font-serif text-2xl font-semibold">Pro</div>
                <div className="mt-2 font-serif text-3xl">$5</div>
                <div className="text-xs text-muted-foreground">per month</div>
              </div>
            </div>
            {ROWS.map((r) => (
              <div key={r.feature} className="grid grid-cols-3 border-b border-border last:border-0 text-sm">
                <div className="p-4 font-medium">{r.feature}</div>
                <div className="p-4 text-center border-l border-border">{cell(r.free)}</div>
                <div className="p-4 text-center border-l border-border bg-accent/5">{cell(r.pro)}</div>
              </div>
            ))}
            <div className="grid grid-cols-3 p-4">
              <div></div>
              <div className="px-4 border-l border-border"><Link href="/signup"><Button variant="outline" className="w-full">Start free</Button></Link></div>
              <div className="px-4 border-l border-border bg-accent/5"><Link href="/signup"><Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Get Pro</Button></Link></div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            This is a demo product. Upgrades are simulated — no real payments are processed.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}

function cell(v: boolean | string) {
  if (v === true) return <Check className="h-4 w-4 mx-auto text-primary" />;
  if (v === false) return <Minus className="h-4 w-4 mx-auto text-muted-foreground" />;
  return <span>{v}</span>;
}
