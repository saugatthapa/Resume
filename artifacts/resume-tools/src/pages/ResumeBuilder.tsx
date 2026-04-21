import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { ResumePreview } from "@/components/ResumePreview";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import {
  Resumes, Profiles, AdminTemplates as TplStore, emptyResume, newId, FREE_DOWNLOAD_LIMIT,
  type Resume, type Experience, type Education, type AdminTemplate,
} from "@/lib/storage";
import { generateSummary } from "@/lib/ai";
import { exportElementToPdf } from "@/lib/pdf";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2, Download, Sparkles, Lock, Save, Check } from "lucide-react";

const STEPS = ["Personal", "Summary", "Skills", "Experience", "Education"] as const;
type Step = typeof STEPS[number];

export default function ResumeBuilder() {
  const { user, profile, refresh } = useAuth();
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [premiumTemplates, setPremiumTemplates] = useState<AdminTemplate[]>([]);
  const [step, setStep] = useState<Step>("Personal");
  const [skillDraft, setSkillDraft] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string | undefined>(undefined);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const r = Resumes.get(user.id) ?? emptyResume(user.name, user.email);
    setResume(r);
    setPremiumTemplates(TplStore.list());
  }, [user]);

  // Autosave
  useEffect(() => {
    if (user && resume) {
      const t = setTimeout(() => Resumes.set(user.id, resume), 250);
      return () => clearTimeout(t);
    }
  }, [resume, user]);

  const isPro = profile?.plan === "pro";

  const update = (patch: Partial<Resume>) => setResume((r) => (r ? { ...r, ...patch } : r));
  const updatePersonal = (patch: Partial<Resume["personal"]>) =>
    setResume((r) => (r ? { ...r, personal: { ...r.personal, ...patch } } : r));

  const addExperience = () =>
    setResume((r) => r ? { ...r, experience: [...r.experience, { id: newId(), title: "", company: "", start: "", end: "", bullets: [""] }] } : r);
  const updateExperience = (id: string, patch: Partial<Experience>) =>
    setResume((r) => r ? { ...r, experience: r.experience.map((e) => e.id === id ? { ...e, ...patch } : e) } : r);
  const removeExperience = (id: string) =>
    setResume((r) => r ? { ...r, experience: r.experience.filter((e) => e.id !== id) } : r);
  const updateBullet = (eId: string, idx: number, val: string) =>
    setResume((r) => r ? { ...r, experience: r.experience.map((e) => e.id === eId ? { ...e, bullets: e.bullets.map((b, i) => i === idx ? val : b) } : e) } : r);
  const addBullet = (eId: string) =>
    setResume((r) => r ? { ...r, experience: r.experience.map((e) => e.id === eId ? { ...e, bullets: [...e.bullets, ""] } : e) } : r);
  const removeBullet = (eId: string, idx: number) =>
    setResume((r) => r ? { ...r, experience: r.experience.map((e) => e.id === eId ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e) } : r);

  const addEducation = () =>
    setResume((r) => r ? { ...r, education: [...r.education, { id: newId(), school: "", degree: "", start: "", end: "" }] } : r);
  const updateEducation = (id: string, patch: Partial<Education>) =>
    setResume((r) => r ? { ...r, education: r.education.map((e) => e.id === id ? { ...e, ...patch } : e) } : r);
  const removeEducation = (id: string) =>
    setResume((r) => r ? { ...r, education: r.education.filter((e) => e.id !== id) } : r);

  const addSkill = () => {
    const v = skillDraft.trim();
    if (!v || !resume) return;
    if (resume.skills.includes(v)) { setSkillDraft(""); return; }
    update({ skills: [...resume.skills, v] });
    setSkillDraft("");
  };
  const removeSkill = (s: string) => resume && update({ skills: resume.skills.filter((x) => x !== s) });

  const generateSummaryAI = () => {
    if (!resume) return;
    const role = resume.experience[0]?.title || "professional";
    const years = String(Math.max(1, resume.experience.length * 2));
    const summary = generateSummary(role, years, resume.skills, isPro);
    update({ summary });
    toast({ title: "Summary generated", description: "Edit it to make it sound more like you." });
  };

  const stepIndex = STEPS.indexOf(step);

  const pickTemplate = (t: Resume["template"], customId?: string) => {
    if (!isPro && t !== "classic") {
      setUpgradeReason(t === "custom" ? "Premium templates are part of Pro." : "Modern and Minimal templates are part of Pro.");
      setUpgradeOpen(true);
      return;
    }
    update({ template: t, customTemplateId: customId });
  };

  const onDownload = async () => {
    if (!user || !profile || !resume || !previewRef.current) return;
    if (!isPro && profile.downloadsToday >= FREE_DOWNLOAD_LIMIT) {
      setUpgradeReason(`Free plan is limited to ${FREE_DOWNLOAD_LIMIT} downloads per day.`);
      setUpgradeOpen(true);
      return;
    }
    try {
      setDownloading(true);
      await exportElementToPdf({
        element: previewRef.current,
        filename: `${(resume.personal.name || "resume").replace(/\s+/g, "_")}.pdf`,
        watermark: isPro ? undefined : "Made with Resume & Career Tools — Free",
      });
      Profiles.recordDownload(user.id);
      refresh();
      toast({ title: "Downloaded", description: "Your resume PDF is saved." });
    } catch (err) {
      toast({ title: "Download failed", description: "Try again or simplify your resume.", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  if (!resume) return <AppShell><div /></AppShell>;

  return (
    <AppShell>
      <Seo title="Resume Builder" description="Build your resume with a live preview." />
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Editor */}
        <div className="xl:w-[460px] xl:flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-serif text-3xl font-semibold">Resume Builder</h1>
              <div className="text-sm text-muted-foreground mt-1">Autosaves as you type.</div>
            </div>
            <Badge variant="outline" className="hidden sm:inline-flex"><Save className="h-3 w-3 mr-1" />Saved</Badge>
          </div>

          {/* Template picker */}
          <div className="rounded-xl border border-card-border bg-card p-4 mb-4">
            <div className="text-sm font-medium mb-3">Template</div>
            <div className="grid grid-cols-3 gap-2">
              {(["classic", "modern", "minimal"] as const).map((t) => {
                const locked = !isPro && t !== "classic";
                const active = resume.template === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => pickTemplate(t)}
                    className={`relative rounded-lg border p-3 text-left text-xs hover-elevate ${active ? "border-primary ring-1 ring-primary" : "border-border"}`}
                    data-testid={`button-template-${t}`}
                  >
                    <div className="capitalize font-medium">{t}</div>
                    <div className="text-muted-foreground mt-0.5">{t === "classic" ? "Timeless" : t === "modern" ? "Sidebar layout" : "Editorial"}</div>
                    {locked && <Lock className="h-3.5 w-3.5 absolute top-2 right-2 text-muted-foreground" />}
                    {active && <Check className="h-3.5 w-3.5 absolute top-2 right-2 text-primary" />}
                  </button>
                );
              })}
            </div>
            {premiumTemplates.length > 0 && (
              <>
                <div className="flex items-center gap-2 mt-4 mb-2">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Premium</div>
                  <div className="text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-accent font-medium">Pro</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {premiumTemplates.map((t) => {
                    const locked = !isPro;
                    const active = resume.template === "custom" && resume.customTemplateId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => pickTemplate("custom", t.id)}
                        className={`relative rounded-lg border p-3 text-left text-xs hover-elevate ${active ? "border-primary ring-1 ring-primary" : "border-border"}`}
                        data-testid={`button-template-custom-${t.id}`}
                      >
                        <div className="font-medium truncate">{t.name}</div>
                        <div className="text-muted-foreground mt-0.5 line-clamp-1">{t.description || "Premium template"}</div>
                        {locked && <Lock className="h-3.5 w-3.5 absolute top-2 right-2 text-muted-foreground" />}
                        {active && <Check className="h-3.5 w-3.5 absolute top-2 right-2 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Step nav */}
          <div className="flex gap-1 mb-4 overflow-x-auto">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap hover-elevate ${step === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                data-testid={`button-step-${s.toLowerCase()}`}
              >
                <span className="opacity-60 mr-1">{i + 1}.</span>{s}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-card-border bg-card p-5 space-y-4">
            {step === "Personal" && (
              <>
                <Field label="Full name"><Input value={resume.personal.name} onChange={(e) => updatePersonal({ name: e.target.value })} data-testid="input-name" /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email"><Input value={resume.personal.email} onChange={(e) => updatePersonal({ email: e.target.value })} data-testid="input-email" /></Field>
                  <Field label="Phone"><Input value={resume.personal.phone} onChange={(e) => updatePersonal({ phone: e.target.value })} data-testid="input-phone" /></Field>
                </div>
                <Field label="Location"><Input value={resume.personal.location} onChange={(e) => updatePersonal({ location: e.target.value })} placeholder="City, Country" data-testid="input-location" /></Field>
                <Field label="Website / LinkedIn"><Input value={resume.personal.website} onChange={(e) => updatePersonal({ website: e.target.value })} placeholder="linkedin.com/in/you" data-testid="input-website" /></Field>
              </>
            )}

            {step === "Summary" && (
              <>
                <Field label="Professional summary">
                  <Textarea
                    rows={6}
                    value={resume.summary}
                    onChange={(e) => update({ summary: e.target.value })}
                    placeholder="A few sentences about who you are and what you do best."
                    data-testid="input-summary"
                  />
                </Field>
                <Button variant="outline" onClick={generateSummaryAI} className="w-full" data-testid="button-generate-summary">
                  <Sparkles className="h-4 w-4 mr-2" />Generate with AI
                </Button>
                {!isPro && <div className="text-xs text-muted-foreground">Pro unlocks longer, richer suggestions.</div>}
              </>
            )}

            {step === "Skills" && (
              <>
                <Field label="Add a skill">
                  <div className="flex gap-2">
                    <Input
                      value={skillDraft}
                      onChange={(e) => setSkillDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                      placeholder="e.g. React, Public Speaking"
                      data-testid="input-skill"
                    />
                    <Button onClick={addSkill} data-testid="button-add-skill">Add</Button>
                  </div>
                </Field>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.length === 0 && <div className="text-sm text-muted-foreground">No skills yet. Add 5–12 for the best resume.</div>}
                  {resume.skills.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="pl-3 pr-1 py-1 hover-elevate cursor-pointer"
                      onClick={() => removeSkill(s)}
                      data-testid={`badge-skill-${s.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {s}
                      <span className="ml-1 inline-flex items-center justify-center h-4 w-4 rounded hover:bg-foreground/10">×</span>
                    </Badge>
                  ))}
                </div>
              </>
            )}

            {step === "Experience" && (
              <>
                {resume.experience.length === 0 && (
                  <div className="text-sm text-muted-foreground">No experience yet. Add your most recent role first.</div>
                )}
                <div className="space-y-4">
                  {resume.experience.map((e) => (
                    <div key={e.id} className="rounded-lg border border-border p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-medium">Role</div>
                        <button onClick={() => removeExperience(e.id)} className="text-muted-foreground hover:text-destructive" data-testid={`button-remove-exp-${e.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Title"><Input value={e.title} onChange={(ev) => updateExperience(e.id, { title: ev.target.value })} placeholder="Senior Engineer" /></Field>
                        <Field label="Company"><Input value={e.company} onChange={(ev) => updateExperience(e.id, { company: ev.target.value })} placeholder="Northwind" /></Field>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Start (YYYY-MM)"><Input value={e.start} onChange={(ev) => updateExperience(e.id, { start: ev.target.value })} placeholder="2022-01" /></Field>
                        <Field label="End (YYYY-MM or blank)"><Input value={e.end} onChange={(ev) => updateExperience(e.id, { end: ev.target.value })} placeholder="Present" /></Field>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Bullet points</div>
                        <div className="space-y-2">
                          {e.bullets.map((b, i) => (
                            <div key={i} className="flex gap-2">
                              <Input value={b} onChange={(ev) => updateBullet(e.id, i, ev.target.value)} placeholder="What did you ship, lead, or improve?" />
                              <button onClick={() => removeBullet(e.id, i)} className="text-muted-foreground hover:text-destructive p-2" aria-label="Remove bullet">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={() => addBullet(e.id)}><Plus className="h-3 w-3 mr-1" />Add bullet</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={addExperience} className="w-full" data-testid="button-add-experience"><Plus className="h-4 w-4 mr-2" />Add experience</Button>
              </>
            )}

            {step === "Education" && (
              <>
                {resume.education.length === 0 && <div className="text-sm text-muted-foreground">No education yet.</div>}
                <div className="space-y-4">
                  {resume.education.map((ed) => (
                    <div key={ed.id} className="rounded-lg border border-border p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-medium">Education</div>
                        <button onClick={() => removeEducation(ed.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="School"><Input value={ed.school} onChange={(ev) => updateEducation(ed.id, { school: ev.target.value })} /></Field>
                        <Field label="Degree"><Input value={ed.degree} onChange={(ev) => updateEducation(ed.id, { degree: ev.target.value })} /></Field>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Start (YYYY-MM)"><Input value={ed.start} onChange={(ev) => updateEducation(ed.id, { start: ev.target.value })} /></Field>
                        <Field label="End (YYYY-MM)"><Input value={ed.end} onChange={(ev) => updateEducation(ed.id, { end: ev.target.value })} /></Field>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={addEducation} className="w-full" data-testid="button-add-education"><Plus className="h-4 w-4 mr-2" />Add education</Button>
              </>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <Button
              variant="ghost"
              disabled={stepIndex === 0}
              onClick={() => setStep(STEPS[Math.max(0, stepIndex - 1)])}
            >Back</Button>
            {stepIndex < STEPS.length - 1 ? (
              <Button onClick={() => setStep(STEPS[stepIndex + 1])} data-testid="button-next-step">Next</Button>
            ) : (
              <Button onClick={onDownload} disabled={downloading} data-testid="button-download">
                <Download className="h-4 w-4 mr-2" />{downloading ? "Preparing…" : "Download PDF"}
              </Button>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground">Live preview · {resume.template.charAt(0).toUpperCase() + resume.template.slice(1)} template</div>
            <Button onClick={onDownload} disabled={downloading} className="hidden xl:inline-flex" data-testid="button-download-top">
              <Download className="h-4 w-4 mr-2" />{downloading ? "Preparing…" : "Download PDF"}
            </Button>
          </div>
          <div className="overflow-auto rounded-xl bg-secondary/50 p-4">
            <div style={{ transform: "scale(0.78)", transformOrigin: "top left", width: "8.5in" }}>
              <ResumePreview ref={previewRef} resume={resume} />
            </div>
          </div>
        </div>
      </div>
      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} reason={upgradeReason} />
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
