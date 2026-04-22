import type { Resume, AdminTemplate } from "./storage";

const formatDate = (s: string) => {
  if (!s) return "";
  const [y, m] = s.split("-");
  if (!y) return s;
  if (!m) return y;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1] ?? ""} ${y}`.trim();
};

const escape = (s: string) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function experienceHtml(resume: Resume): string {
  return resume.experience
    .map(
      (e) => `
      <div class="rct-exp">
        <div class="rct-exp-head">
          <div><strong>${escape(e.title)}</strong>${e.company ? ` — ${escape(e.company)}` : ""}</div>
          <div class="rct-dates">${escape(formatDate(e.start))}${e.start || e.end ? " — " : ""}${escape(formatDate(e.end) || (e.start ? "Present" : ""))}</div>
        </div>
        <ul class="rct-bullets">${e.bullets.filter(Boolean).map((b) => `<li>${escape(b)}</li>`).join("")}</ul>
      </div>`,
    )
    .join("");
}

function educationHtml(resume: Resume): string {
  return resume.education
    .map(
      (ed) => `
      <div class="rct-edu">
        <div><strong>${escape(ed.school)}</strong>${ed.degree ? ` — ${escape(ed.degree)}` : ""}</div>
        <div class="rct-dates">${escape(formatDate(ed.start))} — ${escape(formatDate(ed.end))}</div>
      </div>`,
    )
    .join("");
}

function skillsHtml(resume: Resume): string {
  return resume.skills.map((s) => `<span class="rct-skill">${escape(s)}</span>`).join("");
}

export function renderCustomTemplate(template: AdminTemplate, resume: Resume): string {
  const p = resume.personal;
  const tokens: Record<string, string> = {
    name: escape(p.name || "Your Name"),
    email: escape(p.email),
    phone: escape(p.phone),
    location: escape(p.location),
    website: escape(p.website),
    summary: escape(resume.summary),
    skills: skillsHtml(resume),
    skillsList: resume.skills.map(escape).join(" · "),
    experience: experienceHtml(resume),
    education: educationHtml(resume),
  };
  let html = template.html;
  for (const key of Object.keys(tokens)) {
    html = html.replaceAll(`{{${key}}}`, tokens[key]);
  }
  return html;
}

export const STARTER_TEMPLATE_HTML = `<div class="page">
  <header class="header">
    <h1>{{name}}</h1>
    <div class="meta">{{email}} · {{phone}} · {{location}} · {{website}}</div>
  </header>

  <section>
    <h2>Summary</h2>
    <p>{{summary}}</p>
  </section>

  <section>
    <h2>Experience</h2>
    {{experience}}
  </section>

  <section>
    <h2>Skills</h2>
    <div class="skills">{{skills}}</div>
  </section>

  <section>
    <h2>Education</h2>
    {{education}}
  </section>
</div>`;

export const STARTER_TEMPLATE_CSS = `.page { font-family: 'Inter', system-ui, sans-serif; color: #1a1a1a; font-size: 11px; line-height: 1.5; }
.header { border-bottom: 3px solid #6B21A8; padding-bottom: 14px; margin-bottom: 18px; }
.header h1 { font-family: 'Fraunces', Georgia, serif; font-size: 30px; margin: 0; color: #6B21A8; }
.meta { font-size: 11px; color: #555; margin-top: 6px; }
section { margin-bottom: 18px; }
section h2 { font-family: 'Fraunces', Georgia, serif; font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; color: #6B21A8; margin: 0 0 8px; }
.rct-exp { margin-bottom: 12px; }
.rct-exp-head { display: flex; justify-content: space-between; align-items: baseline; }
.rct-dates { font-size: 10.5px; color: #777; }
.rct-bullets { margin: 4px 0 0 18px; padding: 0; }
.rct-bullets li { margin-bottom: 2px; }
.rct-edu { display: flex; justify-content: space-between; margin-bottom: 4px; }
.skills { display: flex; flex-wrap: wrap; gap: 6px; }
.rct-skill { background: #F3E8FF; color: #6B21A8; padding: 3px 10px; border-radius: 999px; font-size: 10.5px; }`;
