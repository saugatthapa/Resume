import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { generateSummary, generateHeadline, suggestSkills } from "@/lib/ai";
import { useAuth } from "@/lib/auth";
import { Sparkles } from "lucide-react";

export default function AITools() {
  const { profile } = useAuth();
  const isPro = profile?.plan === "pro";

  return (
    <AppShell>
      <Seo title="AI Tools" description="Resume summary, headline, and skills generators." />
      <h1 className="font-serif text-3xl font-semibold">AI Career Tools</h1>
      <p className="text-sm text-muted-foreground mt-1">Three quick generators to unblock the hardest parts of your resume.</p>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <SummaryTool isPro={isPro} />
        <HeadlineTool />
        <SkillsTool />
      </div>
    </AppShell>
  );
}

function ToolCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-6">
      <h2 className="font-serif text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function SummaryTool({ isPro }: { isPro: boolean }) {
  const [role, setRole] = useState("");
  const [years, setYears] = useState("3");
  const [skills, setSkills] = useState("");
  const [out, setOut] = useState("");
  return (
    <ToolCard title="Resume Summary Generator">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Role</Label><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Product Manager" data-testid="input-summary-role" /></div>
        <div><Label>Years of experience</Label><Input value={years} onChange={(e) => setYears(e.target.value)} data-testid="input-summary-years" /></div>
      </div>
      <div><Label>Top skills (comma separated)</Label><Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Roadmapping, A/B testing" data-testid="input-summary-skills" /></div>
      <Button onClick={() => setOut(generateSummary(role, years, skills.split(",").map((s) => s.trim()).filter(Boolean), isPro))} data-testid="button-generate-summary">
        <Sparkles className="h-4 w-4 mr-2" />Generate
      </Button>
      {out && <Textarea value={out} onChange={(e) => setOut(e.target.value)} rows={5} className="text-sm" data-testid="output-summary" />}
      {out && !isPro && <div className="text-xs text-muted-foreground">Pro unlocks longer, richer summaries.</div>}
    </ToolCard>
  );
}

function HeadlineTool() {
  const [role, setRole] = useState("");
  const [strength, setStrength] = useState("");
  const [out, setOut] = useState("");
  return (
    <ToolCard title="Resume Headline Generator">
      <div><Label>Role</Label><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Frontend Engineer" data-testid="input-headline-role" /></div>
      <div><Label>Your top strength</Label><Input value={strength} onChange={(e) => setStrength(e.target.value)} placeholder="Performance" data-testid="input-headline-strength" /></div>
      <Button onClick={() => setOut(generateHeadline(role, strength))} data-testid="button-generate-headline">
        <Sparkles className="h-4 w-4 mr-2" />Generate
      </Button>
      {out && <div className="rounded-md bg-secondary p-4 font-serif text-lg" data-testid="output-headline">{out}</div>}
    </ToolCard>
  );
}

function SkillsTool() {
  const [job, setJob] = useState("");
  const [out, setOut] = useState<string[]>([]);
  return (
    <ToolCard title="Skills Suggestion Tool">
      <div><Label>Job title</Label><Input value={job} onChange={(e) => setJob(e.target.value)} placeholder="Marketing Manager" data-testid="input-skills-job" /></div>
      <Button onClick={() => setOut(suggestSkills(job))} data-testid="button-generate-skills">
        <Sparkles className="h-4 w-4 mr-2" />Suggest skills
      </Button>
      {out.length > 0 && (
        <div className="flex flex-wrap gap-2" data-testid="output-skills">
          {out.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
        </div>
      )}
    </ToolCard>
  );
}
