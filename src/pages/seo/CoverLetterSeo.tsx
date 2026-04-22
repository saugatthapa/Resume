import { useState } from "react";
import { SeoLayout } from "./SeoLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter, TONE_OPTIONS } from "@/lib/ai";

export default function CoverLetterSeo() {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState<typeof TONE_OPTIONS[number]["value"]>("professional");
  const [out, setOut] = useState("");

  return (
    <SeoLayout
      title="Free Cover Letter Generator — No signup needed"
      description="Generate a tailored, 3-paragraph cover letter in seconds. Free and instant — pick your tone and let us do the heavy lifting."
      h1="Free Cover Letter Generator"
      intro="Tell us the role and company. Pick a tone. Get a complete cover letter you can edit and send in minutes."
      tool={
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Job title</Label><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Marketing Manager" /></div>
            <div><Label>Company</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme" /></div>
          </div>
          <div><Label>Key skills (comma separated)</Label><Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="content strategy, SEO, lifecycle marketing" /></div>
          <div className="flex gap-2">
            {TONE_OPTIONS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={`px-3 py-1.5 text-sm rounded-md border hover-elevate ${tone === t.value ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <Button onClick={() => setOut(generateCoverLetter({ role, company, skills: skills.split(",").map((s) => s.trim()).filter(Boolean), tone }))}>Generate cover letter</Button>
          {out && <Textarea value={out} onChange={(e) => setOut(e.target.value)} rows={14} className="font-serif text-base leading-relaxed" />}
        </div>
      }
      body={
        <>
          <h2>The shape of a cover letter that works</h2>
          <p>
            Recruiters spend roughly 30 seconds on a cover letter on the first pass. So the structure matters more than
            you'd think. The version that consistently performs is short — about 250 words — and follows a predictable
            arc: who you are and why you're applying, what you'd bring, and a friendly close. That's it. No epic
            origin story, no breathless adjectives, no thank-yous so effusive they raise suspicion.
          </p>
          <h2>How to use this free generator</h2>
          <p>
            Enter the role you're applying for and the company name. Add two or three skills that map directly to the
            job posting. Pick a tone — Professional is a safe bet for most roles, Warm fits agencies and small teams,
            and Confident works when the role asks for leadership. Click generate, then read the draft out loud. If a
            sentence sounds like a template, rewrite it in your own voice. That's where the magic happens.
          </p>
          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Don't restate your resume. The cover letter exists to add color, not repeat the timeline.</li>
            <li>Don't open with "My name is…". The header already tells them.</li>
            <li>Don't address it to "To whom it may concern." Find a name. If you can't, "Hiring Team at &lt;company&gt;" works.</li>
            <li>Don't write more than one page. Half a page is even better.</li>
            <li>Don't apologize for what you don't have. Lead with what you do.</li>
          </ul>
          <h2>What happens after you generate one</h2>
          <p>
            Edit it. Treat the draft as a scaffold — keep the structure, replace generic phrases with specific
            anecdotes, and end with a sentence that invites a conversation. When you're happy, copy it into your email
            or upload it as a PDF. If you also want a matching resume, sign up free and you can have both ready in
            under twenty minutes.
          </p>
        </>
      }
    />
  );
}
