import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { CoverLetters, Profiles, FREE_COVER_LETTER_LIMIT } from "@/lib/storage";
import { generateCoverLetter, TONE_OPTIONS } from "@/lib/ai";
import { useEffect, useState } from "react";
import { Copy, Download, Sparkles } from "lucide-react";
import { UpgradeModal } from "@/components/UpgradeModal";

export default function CoverLetter() {
  const { user, profile, refresh } = useAuth();
  const { toast } = useToast();
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState<typeof TONE_OPTIONS[number]["value"]>("professional");
  const [letter, setLetter] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    if (user) setLetter(CoverLetters.get(user.id));
  }, [user]);

  const isPro = profile?.plan === "pro";

  const onGenerate = () => {
    if (!user || !profile) return;
    if (!isPro && profile.coverLettersToday >= FREE_COVER_LETTER_LIMIT) {
      setUpgradeOpen(true);
      return;
    }
    if (!role.trim() || !company.trim()) {
      toast({ title: "Add a role and company", description: "We need both to write a useful letter.", variant: "destructive" });
      return;
    }
    const text = generateCoverLetter({
      role,
      company,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      tone,
      applicantName: user.name,
    });
    setLetter(text);
    CoverLetters.set(user.id, text);
    Profiles.recordCoverLetter(user.id);
    refresh();
    toast({ title: "Cover letter ready", description: "Tweak the wording and make it your own." });
  };

  const onCopy = async () => {
    if (!letter) return;
    await navigator.clipboard.writeText(letter);
    toast({ title: "Copied to clipboard" });
  };

  const onDownload = () => {
    if (!letter) return;
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${(company || "draft").replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <Seo title="Cover Letter Generator" description="Generate a tailored cover letter in seconds." />
      <h1 className="font-serif text-3xl font-semibold">Cover Letter Generator</h1>
      <p className="text-sm text-muted-foreground mt-1">Tell us about the role. We'll draft a 3-paragraph letter you can refine.</p>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="rounded-xl border border-card-border bg-card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Job title</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Designer" data-testid="input-role" />
            </div>
            <div>
              <Label>Company</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Northwind" data-testid="input-company" />
            </div>
          </div>
          <div>
            <Label>Key skills (comma separated)</Label>
            <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="design systems, prototyping, user research" data-testid="input-skills" />
          </div>
          <div>
            <Label className="block mb-2">Tone</Label>
            <div className="flex gap-2">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`px-3 py-1.5 text-sm rounded-md border hover-elevate ${tone === t.value ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
                  data-testid={`button-tone-${t.value}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={onGenerate} className="w-full" data-testid="button-generate">
            <Sparkles className="h-4 w-4 mr-2" />Generate cover letter
          </Button>
          {!isPro && (
            <div className="text-xs text-muted-foreground text-center">
              {Math.max(0, FREE_COVER_LETTER_LIMIT - (profile?.coverLettersToday ?? 0))} of {FREE_COVER_LETTER_LIMIT} free generations left today.
            </div>
          )}
        </div>

        <div className="rounded-xl border border-card-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <Label>Your cover letter</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onCopy} disabled={!letter} data-testid="button-copy"><Copy className="h-4 w-4 mr-1" />Copy</Button>
              <Button variant="outline" size="sm" onClick={onDownload} disabled={!letter} data-testid="button-download-letter"><Download className="h-4 w-4 mr-1" />Download</Button>
            </div>
          </div>
          <Textarea
            value={letter}
            onChange={(e) => { setLetter(e.target.value); if (user) CoverLetters.set(user.id, e.target.value); }}
            rows={20}
            placeholder="Your generated cover letter will appear here. Edit it to make it sound like you."
            className="font-serif text-base leading-relaxed"
            data-testid="textarea-letter"
          />
        </div>
      </div>
      <UpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        reason={`Free plan is limited to ${FREE_COVER_LETTER_LIMIT} cover letters per day.`}
      />
    </AppShell>
  );
}
