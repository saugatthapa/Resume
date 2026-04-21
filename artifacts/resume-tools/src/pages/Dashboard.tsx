import { AppShell, UpgradeBanner } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/auth";
import { ResumeApi, FREE_DOWNLOAD_LIMIT, FREE_COVER_LETTER_LIMIT, type Resume } from "@/lib/storage";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Mail, Sparkles, Crown } from "lucide-react";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    if (!user) return;
    ResumeApi.get().then(({ resume }) => setResume(resume)).catch(() => {});
  }, [user]);

  if (!user || !profile) return null;
  const isPro = profile.plan === "pro";

  return (
    <AppShell>
      <Seo title="Dashboard" description="Your resume and career toolkit." />
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <div className="text-sm text-muted-foreground">Welcome back</div>
            <h1 className="font-serif text-3xl font-semibold">{user.name.split(" ")[0]}</h1>
          </div>
          {!isPro && (
            <Button onClick={() => setUpgradeOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-open-upgrade">
              <Crown className="h-4 w-4 mr-2" />Upgrade to Pro
            </Button>
          )}
        </div>

        <UpgradeBanner onUpgrade={() => setUpgradeOpen(true)} />

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Stat label="Plan" value={isPro ? "Pro" : "Free"}
            sub={isPro ? "Unlimited everything" : "Upgrade for more"} />
          <Stat label="Downloads today"
            value={isPro ? `${profile.downloadsToday}` : `${profile.downloadsToday} / ${FREE_DOWNLOAD_LIMIT}`}
            sub={isPro ? "No limits" : "Resets at midnight"} />
          <Stat label="Cover letters today"
            value={isPro ? `${profile.coverLettersToday}` : `${profile.coverLettersToday} / ${FREE_COVER_LETTER_LIMIT}`}
            sub={isPro ? "No limits" : "Resets at midnight"} />
        </div>

        <h2 className="font-serif text-xl font-semibold mt-10 mb-4">Pick up where you left off</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <ToolCard href="/dashboard/resume" icon={FileText} title="Resume Builder"
            body={resume && resume.experience.length > 0 ? "Continue editing your resume" : "Start building your resume"}
            cta={resume && resume.experience.length > 0 ? "Continue" : "Get started"} />
          <ToolCard href="/dashboard/cover-letter" icon={Mail} title="Cover Letter"
            body="Generate a tailored 3-paragraph letter in seconds" cta="Open" />
          <ToolCard href="/dashboard/ai-tools" icon={Sparkles} title="AI Tools"
            body="Summary, headline & skills suggestions" cta="Open" />
        </div>
      </div>
      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </AppShell>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-serif text-3xl font-semibold mt-1">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}

function ToolCard({ href, icon: Icon, title, body, cta }: { href: string; icon: any; title: string; body: string; cta: string }) {
  return (
    <Link href={href}>
      <div className="rounded-xl border border-card-border bg-card p-5 hover-elevate cursor-pointer h-full" data-testid={`card-tool-${title.toLowerCase().replace(/\s+/g, "-")}`}>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Icon className="h-5 w-5" /></div>
        <div className="mt-4 font-serif text-lg font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground mt-1">{body}</div>
        <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">{cta} <ArrowRight className="h-4 w-4 ml-1" /></div>
      </div>
    </Link>
  );
}
