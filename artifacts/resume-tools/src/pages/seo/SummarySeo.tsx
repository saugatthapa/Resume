import { useState } from "react";
import { SeoLayout } from "./SeoLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateSummary } from "@/lib/ai";

export default function SummarySeo() {
  const [role, setRole] = useState("");
  const [years, setYears] = useState("3");
  const [skills, setSkills] = useState("");
  const [out, setOut] = useState("");

  return (
    <SeoLayout
      title="Resume Summary Generator — Free, no signup needed"
      description="Generate a professional resume summary in seconds. Free, instant, and tailored to your role and experience."
      h1="Free Resume Summary Generator"
      intro="Stuck on the first paragraph of your resume? Type your role, years of experience, and a couple of skills — get a polished summary you can paste straight in."
      tool={
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Role</Label><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Frontend Engineer" /></div>
            <div><Label>Years of experience</Label><Input value={years} onChange={(e) => setYears(e.target.value)} /></div>
          </div>
          <div><Label>Top skills (comma separated)</Label><Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, design systems" /></div>
          <Button onClick={() => setOut(generateSummary(role, years, skills.split(",").map((s) => s.trim()).filter(Boolean)))}>Generate summary</Button>
          {out && <Textarea value={out} onChange={(e) => setOut(e.target.value)} rows={5} className="font-serif" />}
        </div>
      }
      body={
        <>
          <h2>What makes a great resume summary?</h2>
          <p>
            A resume summary is the first thing recruiters read — and often the only thing they read in full before
            deciding whether to keep going. A strong one accomplishes three things in two or three sentences: it tells
            them <em>who you are</em>, <em>what you're best at</em>, and <em>what kind of value you create</em>. Vague
            adjectives like "passionate" and "hard-working" don't move the needle. Specific roles, named skills, and
            tangible outcomes do.
          </p>
          <h2>How to use this generator</h2>
          <p>
            Type the title you want to be hired for (not necessarily your current title), the years of experience you
            actually have, and two or three skills that are most relevant to the role. The generator will produce a
            polished, professional sentence pattern you can adapt. Treat the output as a strong first draft — swap in
            your actual achievements, replace generic verbs with stronger ones, and trim anything that feels like filler.
          </p>
          <h2>Tips that consistently work</h2>
          <ul>
            <li>Mirror the job description's language. If the posting says "growth marketing", your summary should too.</li>
            <li>Lead with your strongest credential — years, a notable employer, or a well-known specialty.</li>
            <li>Quantify when you can. "Shipped a redesign" becomes "Led a redesign that lifted activation 14%."</li>
            <li>Cut every word that doesn't earn its place. Three tight sentences beat five fluffy ones.</li>
            <li>Read it out loud. If it sounds like a robot or a cover letter, rewrite it.</li>
          </ul>
          <h2>What to do after you have a summary</h2>
          <p>
            A summary is the door, not the whole house. Pair it with a clean resume layout, a focused experience section
            (each bullet should describe an outcome, not a duty), and a cover letter that explains why <em>this</em>{" "}
            company. Our full app gives you all three — sign up free and you'll have a complete application in about
            fifteen minutes.
          </p>
        </>
      }
    />
  );
}
