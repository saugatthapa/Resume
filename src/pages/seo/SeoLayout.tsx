import { MarketingShell } from "@/components/MarketingShell";
import { Seo } from "@/components/Seo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export function SeoLayout({
  title,
  description,
  h1,
  intro,
  body,
  tool,
  ctaHref = "/signup",
  ctaLabel = "Use the full app — free",
}: {
  title: string;
  description: string;
  h1: string;
  intro: string;
  body: ReactNode;
  tool: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <MarketingShell>
      <Seo title={title} description={description} />
      <article className="bg-grain">
        <div className="mx-auto max-w-4xl px-5 py-16 md:py-20">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">{h1}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{intro}</p>
        </div>
      </article>

      <section className="mx-auto max-w-4xl px-5 -mt-6 mb-16">
        <div className="rounded-2xl bg-card border border-card-border p-6 shadow-sm">{tool}</div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-16">
        <div className="prose prose-stone max-w-none">{body}</div>
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link href={ctaHref}><Button size="lg">{ctaLabel}</Button></Link>
          <Link href="/pricing"><Button variant="outline" size="lg">See pricing</Button></Link>
        </div>
      </section>
    </MarketingShell>
  );
}
