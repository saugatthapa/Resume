import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingShell } from "@/components/MarketingShell";
import { Seo } from "@/components/Seo";
import { Check, FileText, Mail, Sparkles, Star, Download, Lock } from "lucide-react";

export default function Landing() {
  return (
    <MarketingShell>
      <Seo
        title="Resume & Career Tools — Build a resume you'll be proud to send"
        description="Free resume builder, AI cover letter generator, and headline tools. Land more interviews with templates designed for modern hiring."
      />

      {/* Hero */}
      <section className="bg-grain">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className="mb-5 bg-background/70">
              <Sparkles className="h-3 w-3 mr-1" /> Trusted by 12,000+ job seekers
            </Badge>
            <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Build a resume you'll actually be <span className="text-accent">proud</span> to send.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              Pick a template, fill it in, and walk away with a polished PDF in minutes. Cover letters, headlines,
              and tailored skill suggestions — all in one calm place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-hero-signup">
                  Start free — no credit card
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-hero-pricing">
                  See pricing
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>
              <span>4.9 / 5 from over 2,400 reviews</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-accent/20 blur-2xl" aria-hidden />
            <div className="absolute -bottom-8 -right-4 w-40 h-40 rounded-full bg-primary/15 blur-2xl" aria-hidden />
            <div className="relative resume-paper rounded-lg p-8 rotate-1">
              <div className="font-serif text-2xl font-semibold">Alex Rivera</div>
              <div className="text-xs text-muted-foreground mt-1">alex@example.com · San Francisco · linkedin.com/in/alex</div>
              <div className="border-t-2 border-primary mt-3 mb-3" />
              <div className="text-[11px] uppercase tracking-widest text-primary font-semibold font-serif">Summary</div>
              <p className="text-sm mt-1 text-foreground/80">
                Product-minded engineer with 6+ years shipping consumer apps. Lives at the intersection of craft and outcomes.
              </p>
              <div className="text-[11px] uppercase tracking-widest text-primary font-semibold font-serif mt-3">Experience</div>
              <div className="text-sm mt-1">
                <div className="flex justify-between"><span className="font-medium">Senior Engineer · Northwind</span><span className="text-muted-foreground text-xs">2022 — Present</span></div>
                <ul className="list-disc pl-4 mt-1 text-foreground/80 text-[13px]">
                  <li>Led the migration to a unified design system, cutting build time by 38%.</li>
                  <li>Mentored four engineers from junior to mid-level.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold">Everything you need to put your best foot forward.</h2>
            <p className="mt-3 text-muted-foreground">Three tools that actually save you time, with a calm interface that gets out of your way.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[
              { icon: FileText, title: "Resume Builder", body: "Three thoughtfully crafted templates. A live preview that updates as you type. Export to PDF in one click." },
              { icon: Mail, title: "Cover Letter Generator", body: "Tell us the role and company, pick a tone, and get a personalized 3-paragraph letter — ready to send." },
              { icon: Sparkles, title: "AI Career Tools", body: "Summary, headline, and skills generators that turn a few inputs into copy that sounds like you on a good day." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-card-border bg-card p-6 hover-elevate">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><f.icon className="h-5 w-5" /></div>
                <h3 className="mt-4 font-serif text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-3xl font-semibold text-center">Three steps. About fifteen minutes.</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Sign up free", b: "No credit card. Your data stays in your browser." },
              { n: "02", t: "Fill in your story", b: "Step-by-step prompts. Live preview. AI nudges when you're stuck." },
              { n: "03", t: "Export and apply", b: "Download a polished PDF. Send it. Get the call." },
            ].map((s) => (
              <div key={s.n} className="rounded-xl bg-card border border-card-border p-6">
                <div className="font-serif text-3xl text-accent">{s.n}</div>
                <div className="mt-2 font-semibold">{s.t}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold">Simple pricing. Real choice.</h2>
            <p className="mt-3 text-muted-foreground">Start free forever. Upgrade when you're ready to apply seriously.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            <PricingCard
              tier="Free"
              price="$0"
              cadence="forever"
              cta={<Link href="/signup"><Button variant="outline" className="w-full">Start free</Button></Link>}
              features={[
                "Classic template",
                "2 PDF downloads / day",
                "3 cover letters / day",
                "Watermark on exports",
              ]}
            />
            <PricingCard
              tier="Pro"
              highlight
              price="$5"
              cadence="per month"
              cta={<Link href="/signup"><Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Get Pro</Button></Link>}
              features={[
                "All 3 premium templates",
                "Unlimited PDF downloads",
                "Unlimited cover letters",
                "Watermark-free exports",
                "Richer AI suggestions",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { q: "Got two interviews the week I switched. The cover letter generator alone saved me an evening.", a: "Maya K., Product Manager" },
              { q: "I'd been staring at a blank page for a month. Twenty minutes here, done. Felt like cheating.", a: "Jordan T., Designer" },
              { q: "Clean, fast, and the templates don't look like every other resume builder. My recruiter complimented the layout.", a: "Sam R., Engineer" },
            ].map((t) => (
              <figure key={t.a} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-6">
                <blockquote className="font-serif text-lg leading-snug">"{t.q}"</blockquote>
                <figcaption className="mt-4 text-sm opacity-80">— {t.a}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl text-center px-5">
          <h2 className="font-serif text-4xl font-semibold">Your next role is one good resume away.</h2>
          <p className="mt-3 text-muted-foreground">Sign up free in 30 seconds. No card. No commitment. Just better job applications.</p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup"><Button size="lg" data-testid="button-cta-signup">Create my free account</Button></Link>
            <Link href="/pricing"><Button size="lg" variant="outline">Compare plans</Button></Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

function PricingCard({
  tier, price, cadence, features, cta, highlight,
}: {
  tier: string; price: string; cadence: string; features: string[]; cta: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-7 border ${highlight ? "border-accent bg-card shadow-lg ring-1 ring-accent/20" : "border-card-border bg-card"}`}>
      {highlight && <Badge className="mb-3 bg-accent text-accent-foreground">Most popular</Badge>}
      <div className="font-serif text-2xl font-semibold">{tier}</div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-serif text-5xl font-semibold">{price}</span>
        <span className="text-muted-foreground text-sm">/ {cadence}</span>
      </div>
      <ul className="mt-6 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-7">{cta}</div>
    </div>
  );
}
