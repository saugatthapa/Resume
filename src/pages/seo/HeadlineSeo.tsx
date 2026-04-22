import { useState } from "react";
import { SeoLayout } from "./SeoLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateHeadline } from "@/lib/ai";

export default function HeadlineSeo() {
  const [role, setRole] = useState("");
  const [strength, setStrength] = useState("");
  const [out, setOut] = useState("");

  return (
    <SeoLayout
      title="Resume Headline Generator — Free"
      description="Get a punchy resume headline in seconds. Perfect for the top of your resume or your LinkedIn profile."
      h1="Free Resume Headline Generator"
      intro="Your resume headline is the first impression. Tell us your role and your strongest selling point — get a tight, memorable headline that earns the next ten seconds of attention."
      tool={
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Role</Label><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Backend Engineer" /></div>
            <div><Label>Your top strength</Label><Input value={strength} onChange={(e) => setStrength(e.target.value)} placeholder="Reliability" /></div>
          </div>
          <Button onClick={() => setOut(generateHeadline(role, strength))}>Generate headline</Button>
          {out && <div className="rounded-md bg-secondary p-4 font-serif text-xl">{out}</div>}
        </div>
      }
      body={
        <>
          <h2>Why your resume headline matters</h2>
          <p>
            Recruiters scan resumes the way readers scan articles — they look at the top, decide if it's worth more
            attention, and either keep going or move on. A strong headline tells them in seven words or fewer who you
            are and why you might be the person they're looking for. A weak headline ("Hard-working professional
            seeking new opportunity") tells them nothing and gets you nothing.
          </p>
          <h2>What makes a good headline</h2>
          <ul>
            <li>It contains your role. "Frontend Engineer" beats "Engineer".</li>
            <li>It contains a specialty or strength. "Performance" or "Design Systems" or "Growth".</li>
            <li>It's short. Under ten words. No filler.</li>
            <li>It avoids cliches. "Self-starter," "go-getter," and "team player" earn nothing.</li>
            <li>It's true. Exaggeration shows up in the interview.</li>
          </ul>
          <h2>How to use this generator</h2>
          <p>
            Type your target role and your strongest selling point. The generator will produce a few formats you can
            adapt. Test the result by reading it as if it weren't yours — does it tell you something specific in a
            single glance? If yes, ship it. If no, swap in a sharper word and try again.
          </p>
          <h2>Where to use your headline</h2>
          <p>
            The obvious spot is right under your name on your resume. But the same headline doubles as a great LinkedIn
            tagline, the first line of your email signature, or the opening line of your portfolio. Use it everywhere
            you want to be remembered. When you're ready to put together a full resume around it, our free builder
            handles the layout, the templates, and the PDF export.
          </p>
        </>
      }
    />
  );
}
