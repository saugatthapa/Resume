import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import {
  AdminTemplates as TplStore, newId, type AdminTemplate, emptyResume,
} from "@/lib/storage";
import { STARTER_TEMPLATE_HTML, STARTER_TEMPLATE_CSS, renderCustomTemplate } from "@/lib/templateRender";
import { useEffect, useMemo, useRef, useState } from "react";
import { Redirect } from "wouter";
import { Plus, Trash2, Eye, Pencil, Save, Sparkles } from "lucide-react";

const SAMPLE_RESUME = (() => {
  const r = emptyResume("Alex Rivera", "alex@example.com");
  r.personal.phone = "+1 415 555 0188";
  r.personal.location = "San Francisco, CA";
  r.personal.website = "linkedin.com/in/alex";
  r.summary = "Product-minded engineer with 6+ years shipping consumer apps. Lives at the intersection of craft and outcomes.";
  r.skills = ["TypeScript", "React", "System Design", "Mentorship", "Product Thinking"];
  r.experience = [
    { id: "1", title: "Senior Engineer", company: "Northwind", start: "2022-01", end: "", bullets: ["Led migration to a unified design system, cutting build time by 38%.", "Mentored four engineers from junior to mid-level."] },
    { id: "2", title: "Engineer", company: "Lumen Labs", start: "2019-06", end: "2021-12", bullets: ["Shipped a checkout redesign that lifted conversion 12%."] },
  ];
  r.education = [{ id: "1", school: "UC Berkeley", degree: "BS Computer Science", start: "2014-08", end: "2018-05" }];
  return r;
})();

export default function AdminTemplatesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [list, setList] = useState<AdminTemplate[]>([]);
  const [editing, setEditing] = useState<AdminTemplate | null>(null);
  const [previewing, setPreviewing] = useState<AdminTemplate | null>(null);

  useEffect(() => setList(TplStore.list()), []);

  if (!user) return <Redirect to="/login" />;
  if (!user.isAdmin) return <Redirect to="/dashboard" />;

  const refresh = () => setList(TplStore.list());

  const startNew = () => {
    setEditing({
      id: newId(),
      name: "New premium template",
      description: "",
      html: STARTER_TEMPLATE_HTML,
      css: STARTER_TEMPLATE_CSS,
      createdAt: new Date().toISOString(),
    });
  };

  const remove = (id: string) => {
    if (!confirm("Delete this template? Resumes already using it will fall back to Classic.")) return;
    TplStore.remove(id);
    refresh();
    toast({ title: "Template deleted" });
  };

  const save = (t: AdminTemplate) => {
    if (!t.name.trim()) {
      toast({ title: "Add a name", variant: "destructive" });
      return;
    }
    const exists = TplStore.get(t.id);
    if (exists) TplStore.update(t.id, t);
    else TplStore.add(t);
    refresh();
    setEditing(null);
    toast({ title: "Template saved", description: "Pro users will see it in the resume builder." });
  };

  return (
    <AppShell>
      <Seo title="Admin · Premium templates" description="Manage premium resume templates available to Pro users." />
      <div className="flex items-end justify-between gap-3 flex-wrap mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-semibold">Premium templates</h1>
            <Badge className="bg-accent text-accent-foreground">Admin</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Upload custom templates that Pro users can pick from in the resume builder.
          </p>
        </div>
        <Button onClick={startNew} data-testid="button-new-template"><Plus className="h-4 w-4 mr-2" />New template</Button>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <Sparkles className="h-6 w-6 mx-auto text-muted-foreground" />
          <div className="font-serif text-xl mt-3">No premium templates yet</div>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Create your first template. Use HTML with placeholders like <code className="text-foreground">{"{{name}}"}</code>,{" "}
            <code className="text-foreground">{"{{summary}}"}</code>, <code className="text-foreground">{"{{experience}}"}</code>.
          </p>
          <Button className="mt-4" onClick={startNew}><Plus className="h-4 w-4 mr-2" />Create template</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((t) => (
            <div key={t.id} className="rounded-xl border border-card-border bg-card overflow-hidden flex flex-col">
              <button
                onClick={() => setPreviewing(t)}
                className="bg-secondary/60 aspect-[8.5/11] relative overflow-hidden hover-elevate"
                data-testid={`thumb-${t.id}`}
                aria-label={`Preview ${t.name}`}
              >
                <div className="absolute inset-0 origin-top-left" style={{ transform: "scale(0.32)", width: "8.5in" }}>
                  <TemplateThumb template={t} />
                </div>
              </button>
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-serif text-lg font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">{t.description || "No description"}</div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => setPreviewing(t)} className="flex-1" data-testid={`button-preview-${t.id}`}>
                    <Eye className="h-3.5 w-3.5 mr-1" />Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditing(t)} className="flex-1" data-testid={`button-edit-${t.id}`}>
                    <Pencil className="h-3.5 w-3.5 mr-1" />Edit
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(t.id)} aria-label="Delete" data-testid={`button-delete-${t.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <EditorDialog template={editing} onClose={() => setEditing(null)} onSave={save} />}
      {previewing && (
        <Dialog open onOpenChange={(o) => !o && setPreviewing(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="font-serif">{previewing.name}</DialogTitle>
            </DialogHeader>
            <div className="bg-secondary/40 p-4 rounded-lg">
              <div className="resume-paper mx-auto" style={{ width: "8.5in", minHeight: "11in", padding: "0.6in" }}>
                <TemplateThumb template={previewing} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AppShell>
  );
}

function TemplateThumb({ template }: { template: AdminTemplate }) {
  const html = useMemo(() => renderCustomTemplate(template, SAMPLE_RESUME), [template]);
  return (
    <div data-rct-tpl={template.id}>
      <style>{template.css}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function EditorDialog({
  template, onClose, onSave,
}: {
  template: AdminTemplate; onClose: () => void; onSave: (t: AdminTemplate) => void;
}) {
  const [draft, setDraft] = useState<AdminTemplate>(template);
  const [tab, setTab] = useState<"html" | "css">("html");
  const html = useMemo(() => renderCustomTemplate(draft, SAMPLE_RESUME), [draft]);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-serif">Edit premium template</DialogTitle>
        </DialogHeader>
        <div className="grid lg:grid-cols-2 gap-4 overflow-hidden flex-1 min-h-0">
          <div className="flex flex-col gap-3 min-h-0">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Name</Label>
                <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} data-testid="input-template-name" />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Bold accent · serif" data-testid="input-template-desc" />
              </div>
            </div>
            <div>
              <div className="flex gap-1 mb-2">
                <button
                  onClick={() => setTab("html")}
                  className={`px-3 py-1.5 text-xs rounded-md hover-elevate ${tab === "html" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                >HTML</button>
                <button
                  onClick={() => setTab("css")}
                  className={`px-3 py-1.5 text-xs rounded-md hover-elevate ${tab === "css" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                >CSS</button>
              </div>
              {tab === "html" ? (
                <Textarea
                  rows={18}
                  value={draft.html}
                  onChange={(e) => setDraft({ ...draft, html: e.target.value })}
                  className="font-mono text-xs"
                  data-testid="textarea-html"
                />
              ) : (
                <Textarea
                  rows={18}
                  value={draft.css}
                  onChange={(e) => setDraft({ ...draft, css: e.target.value })}
                  className="font-mono text-xs"
                  data-testid="textarea-css"
                />
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Available placeholders: <code>{"{{name}}"}</code>, <code>{"{{email}}"}</code>, <code>{"{{phone}}"}</code>,{" "}
                <code>{"{{location}}"}</code>, <code>{"{{website}}"}</code>, <code>{"{{summary}}"}</code>,{" "}
                <code>{"{{skills}}"}</code>, <code>{"{{skillsList}}"}</code>, <code>{"{{experience}}"}</code>,{" "}
                <code>{"{{education}}"}</code>.
              </p>
            </div>
          </div>
          <div className="flex flex-col min-h-0">
            <Label className="mb-2">Live preview</Label>
            <div className="overflow-auto rounded-lg bg-secondary/40 p-3 flex-1">
              <div style={{ transform: "scale(0.62)", transformOrigin: "top left", width: "8.5in" }}>
                <div className="resume-paper" style={{ width: "8.5in", minHeight: "11in", padding: "0.6in" }} data-rct-tpl={draft.id}>
                  <style>{draft.css}</style>
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} data-testid="button-cancel-edit">Cancel</Button>
          <Button onClick={() => onSave(draft)} data-testid="button-save-template"><Save className="h-4 w-4 mr-2" />Save template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
