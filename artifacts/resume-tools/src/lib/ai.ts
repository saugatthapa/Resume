// Deterministic "AI" generators with variety via slot-filling.

function pick<T>(arr: T[], seed: string): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return arr[Math.abs(h) % arr.length];
}

const SUMMARY_OPENERS = [
  "Results-driven {role} with {years}+ years of experience",
  "Versatile {role} bringing {years} years of hands-on experience",
  "Detail-oriented {role} with a {years}-year track record",
  "Collaborative {role} with {years}+ years",
];

const SUMMARY_MIDDLES = [
  "delivering measurable outcomes across {skill1} and {skill2}",
  "leading initiatives spanning {skill1}, {skill2}, and cross-functional collaboration",
  "shipping high-impact work in {skill1} and {skill2}",
  "translating business needs into {skill1}-driven solutions",
];

const SUMMARY_CLOSERS = [
  "Known for clear communication, ownership, and a bias for shipping.",
  "Recognized for raising the quality bar and mentoring teammates.",
  "Trusted partner for stakeholders and a steady hand under pressure.",
  "Comfortable in ambiguity, fast to learn, and relentlessly user-focused.",
];

export function generateSummary(role: string, years: string, skills: string[], rich = false): string {
  const r = role.trim() || "professional";
  const y = (years || "3").toString().trim();
  const s1 = skills[0] || "modern best practices";
  const s2 = skills[1] || "team leadership";
  const seed = `${r}|${y}|${s1}|${s2}`;
  const opener = pick(SUMMARY_OPENERS, seed)
    .replace("{role}", r)
    .replace("{years}", y);
  const middle = pick(SUMMARY_MIDDLES, seed + "m")
    .replace("{skill1}", s1)
    .replace("{skill2}", s2);
  const closer = pick(SUMMARY_CLOSERS, seed + "c");
  const base = `${opener}, ${middle}. ${closer}`;
  if (!rich) return base;
  const richTail = pick(
    [
      "Eager to bring this same momentum to a team building something meaningful.",
      "Looking for a role where craft, autonomy, and impact intersect.",
      "Most energized when partnering with thoughtful teammates on hard problems.",
    ],
    seed + "r",
  );
  return `${base} ${richTail}`;
}

const HEADLINE_TEMPLATES = [
  "{role} | {strength} | Always Shipping",
  "{role} who turns {strength} into outcomes",
  "{strength}-focused {role} building things that last",
  "{role} obsessed with {strength}",
];

export function generateHeadline(role: string, strength: string): string {
  const r = role.trim() || "Builder";
  const s = strength.trim() || "Craft";
  return pick(HEADLINE_TEMPLATES, r + s)
    .replace(/\{role\}/g, r)
    .replace(/\{strength\}/g, s);
}

const SKILL_MAP: Record<string, string[]> = {
  "software engineer": [
    "TypeScript", "React", "Node.js", "REST APIs", "PostgreSQL",
    "Git", "Unit Testing", "CI/CD", "System Design", "Code Review", "Agile", "Debugging",
  ],
  "frontend engineer": [
    "React", "TypeScript", "CSS", "Accessibility (a11y)", "Performance Optimization",
    "Responsive Design", "Vite", "Testing Library", "Design Systems", "Tailwind", "Web Vitals", "Storybook",
  ],
  "backend engineer": [
    "Node.js", "PostgreSQL", "REST APIs", "GraphQL", "Docker",
    "Redis", "AWS", "Authentication", "API Design", "Observability", "Message Queues", "Linux",
  ],
  "product manager": [
    "Roadmapping", "User Research", "Stakeholder Management", "A/B Testing", "Analytics",
    "OKRs", "Prioritization", "Specs Writing", "Customer Discovery", "Cross-functional Leadership",
    "SQL", "Go-to-Market",
  ],
  "data analyst": [
    "SQL", "Python", "Tableau", "Excel", "Statistics",
    "Data Cleaning", "Dashboarding", "A/B Testing", "Looker", "ETL", "Communication", "Storytelling",
  ],
  "marketing manager": [
    "Content Strategy", "SEO", "Email Marketing", "Paid Media", "Brand Positioning",
    "Analytics", "Copywriting", "Campaign Management", "Lifecycle Marketing", "HubSpot",
    "Cross-functional Leadership", "A/B Testing",
  ],
  "designer": [
    "Figma", "Design Systems", "Prototyping", "User Research", "Visual Design",
    "Interaction Design", "Accessibility", "Wireframing", "Typography", "Color Theory",
    "Cross-functional Collaboration", "Design Critique",
  ],
  "sales": [
    "Pipeline Management", "Cold Outreach", "Salesforce", "Discovery Calls", "Negotiation",
    "Forecasting", "MEDDIC", "Account Planning", "Proposal Writing", "Demo Skills",
    "Customer Empathy", "Closing",
  ],
  "teacher": [
    "Lesson Planning", "Classroom Management", "Differentiated Instruction", "Curriculum Design",
    "Parent Communication", "Assessment Design", "Educational Technology", "Conflict Resolution",
    "Public Speaking", "Mentorship", "Patience", "Empathy",
  ],
  "nurse": [
    "Patient Care", "EMR (Epic)", "Triage", "Medication Administration", "IV Therapy",
    "Vital Signs Monitoring", "Care Plans", "BLS / ACLS", "Patient Advocacy",
    "Wound Care", "HIPAA", "Team Communication",
  ],
};

const GENERIC_SKILLS = [
  "Communication", "Problem Solving", "Time Management", "Collaboration",
  "Adaptability", "Critical Thinking", "Project Management", "Leadership",
  "Attention to Detail", "Prioritization", "Stakeholder Management", "Initiative",
];

export function suggestSkills(jobTitle: string): string[] {
  const key = jobTitle.trim().toLowerCase();
  if (!key) return GENERIC_SKILLS.slice(0, 10);
  for (const k of Object.keys(SKILL_MAP)) {
    if (key.includes(k) || k.includes(key)) return SKILL_MAP[k];
  }
  // Fuzzy: any word match
  for (const k of Object.keys(SKILL_MAP)) {
    const tokens = k.split(" ");
    if (tokens.some((t) => key.includes(t))) return SKILL_MAP[k];
  }
  return GENERIC_SKILLS.slice(0, 10);
}

const TONES = {
  professional: {
    opener: "I am writing to express my strong interest in the {role} position at {company}.",
    bridge: "With my background in {skill1} and {skill2}, I am confident I can contribute meaningfully from day one.",
    closer: "I would welcome the opportunity to discuss how my experience aligns with your team's goals. Thank you for your consideration.",
  },
  warm: {
    opener: "I was genuinely excited to come across the {role} opening at {company} — it feels like the right next chapter for me.",
    bridge: "My experience with {skill1} and {skill2} has shaped me into someone who pairs craft with care, and I'd love to bring that to your team.",
    closer: "Thank you for taking the time to read this. I'd love the chance to learn more about what you're building.",
  },
  confident: {
    opener: "I'm applying for the {role} role at {company} because I believe I can move the needle on the work that matters most to your team.",
    bridge: "Across years of {skill1} and {skill2}, I've consistently shipped outcomes that compound — and I'm ready to do the same here.",
    closer: "I'd welcome a conversation to walk you through specifics. Looking forward to it.",
  },
};

export function generateCoverLetter(opts: {
  role: string;
  company: string;
  skills: string[];
  tone: keyof typeof TONES;
  applicantName?: string;
}): string {
  const role = opts.role.trim() || "open";
  const company = opts.company.trim() || "your company";
  const s1 = opts.skills[0] || "core fundamentals";
  const s2 = opts.skills[1] || "cross-functional collaboration";
  const tone = TONES[opts.tone] || TONES.professional;
  const opener = tone.opener.replace("{role}", role).replace("{company}", company);
  const bridge = tone.bridge.replace("{skill1}", s1).replace("{skill2}", s2);
  const middle = `In recent roles I have driven projects from idea to delivery, partnered closely with stakeholders, and stayed close to the user. What draws me to ${company} specifically is the chance to apply that same focus on a team that values both craft and outcomes.`;
  const closer = tone.closer;
  const sign = opts.applicantName?.trim() ? `\n\nSincerely,\n${opts.applicantName.trim()}` : "\n\nSincerely,";
  return `Dear Hiring Team at ${company},\n\n${opener}\n\n${bridge}\n\n${middle}\n\n${closer}${sign}`;
}

export const TONE_OPTIONS: { value: keyof typeof TONES; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "warm", label: "Warm" },
  { value: "confident", label: "Confident" },
];
