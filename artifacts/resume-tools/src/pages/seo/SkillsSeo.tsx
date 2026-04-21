import { useState } from "react";
import { SeoLayout } from "./SeoLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { suggestSkills } from "@/lib/ai";

export default function SkillsSeo() {
  const [job, setJob] = useState("");
  const [out, setOut] = useState<string[]>([]);

  return (
    <SeoLayout
      title="Skills for Resume Generator — Free"
      description="Get the right skills for any job title in seconds. Tailored, role-specific lists that recruiters and ATS systems actually look for."
      h1="Skills for Resume Generator"
      intro="Type a job title — we'll suggest the skills recruiters and applicant tracking systems are scanning for. Pick the ones that fit you and drop them straight onto your resume."
      tool={
        <div className="space-y-4">
          <div><Label>Job title</Label><Input value={job} onChange={(e) => setJob(e.target.value)} placeholder="Data Analyst" /></div>
          <Button onClick={() => setOut(suggestSkills(job))}>Suggest skills</Button>
          {out.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {out.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          )}
        </div>
      }
      body={
        <>
          <h2>Why skills matter so much in 2026</h2>
          <p>
            Most resumes today are read by an applicant tracking system before they ever reach a human. Those systems
            look for keyword matches between your skills and the job description. If the description mentions "SQL" and
            your resume doesn't, your application can be filtered out before anyone even sees your name. The skills
            section is your easiest, highest-leverage opportunity to stay in the running.
          </p>
          <h2>How to use this generator</h2>
          <p>
            Type the exact title from the job posting you're applying for. The generator will return the skills most
            commonly associated with that role. Compare the list to the job description, pick the ones that genuinely
            apply to you, and add them to your resume's skills section. Don't pad with skills you don't have — anything
            on your resume is fair game in the interview.
          </p>
          <h2>How many skills should you list?</h2>
          <p>
            Most strong resumes include between eight and twelve skills, organized in a single line or grid near the
            top of the page. Mix hard skills (tools, languages, frameworks, methods) with two or three soft skills that
            are clearly relevant to the role. Avoid generic filler like "Microsoft Word" unless the job genuinely
            requires it. Every skill should pull its weight.
          </p>
          <h2>Beyond keywords: showing the skill in action</h2>
          <p>
            A skill in the skills section is a claim. The same skill mentioned inside an experience bullet — with a
            verb and an outcome — is evidence. The strongest resumes do both. List the skill at the top, then prove it
            in your experience. Sign up free to use our resume builder and we'll keep both sides in sync as you type.
          </p>
        </>
      }
    />
  );
}
