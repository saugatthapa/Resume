import { forwardRef } from "react";
import { type Resume, type AdminTemplate } from "@/lib/storage";
import { renderCustomTemplate } from "@/lib/templateRender";

const formatDate = (s: string) => {
  if (!s) return "";
  const [y, m] = s.split("-");
  if (!y) return s;
  if (!m) return y;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const idx = parseInt(m, 10) - 1;
  return `${months[idx] ?? ""} ${y}`.trim();
};

type Props = {
  resume: Resume;
  customTemplate?: AdminTemplate | null;
};

export const ResumePreview = forwardRef<HTMLDivElement, Props>(
  function ResumePreview({ resume, customTemplate }, ref) {
    return (
      <div ref={ref} className="resume-paper mx-auto" style={{ width: "8.5in", minHeight: "11in", padding: "0.6in" }}>
        {resume.template === "classic" && <Classic resume={resume} />}
        {resume.template === "modern" && <Modern resume={resume} />}
        {resume.template === "minimal" && <Minimal resume={resume} />}
        {resume.template === "custom" && <Custom resume={resume} tpl={customTemplate ?? null} />}
      </div>
    );
  },
);

function Custom({ resume, tpl }: { resume: Resume; tpl: AdminTemplate | null }) {
  if (!tpl) {
    return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>This custom template is no longer available. Pick another template.</div>;
  }
  const html = renderCustomTemplate(tpl, resume);
  return (
    <div data-rct-tpl={tpl.id}>
      <style>{tpl.css}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function Header({ resume }: { resume: Resume }) {
  const p = resume.personal;
  const meta = [p.email, p.phone, p.location, p.website].filter(Boolean).join("  •  ");
  return (
    <div>
      <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 28, fontWeight: 600, letterSpacing: "-0.01em" }}>
        {p.name || "Your Name"}
      </div>
      <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{meta || "email • phone • location"}</div>
    </div>
  );
}

function Classic({ resume }: { resume: Resume }) {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, lineHeight: 1.45, color: "#1f2937" }}>
      <Header resume={resume} />
      <div style={{ borderTop: "2px solid #1F4D3F", marginTop: 12, marginBottom: 14 }} />
      {resume.summary && (
        <Section title="Summary"><div>{resume.summary}</div></Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {resume.skills.map((s) => (
              <span key={s} style={{ background: "#F3EFE7", padding: "2px 8px", borderRadius: 4, fontSize: 10.5 }}>{s}</span>
            ))}
          </div>
        </Section>
      )}
      {resume.experience.length > 0 && (
        <Section title="Experience">
          {resume.experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontWeight: 600 }}>{e.title || "Role"} <span style={{ fontWeight: 400, color: "#555" }}>— {e.company}</span></div>
                <div style={{ fontSize: 10.5, color: "#666" }}>{formatDate(e.start)}{e.start || e.end ? " — " : ""}{formatDate(e.end) || (e.start ? "Present" : "")}</div>
              </div>
              <ul style={{ margin: "4px 0 0 18px", padding: 0 }}>
                {e.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ marginBottom: 2 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}
      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((ed) => (
            <div key={ed.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div><span style={{ fontWeight: 600 }}>{ed.school}</span> — {ed.degree}</div>
              <div style={{ fontSize: 10.5, color: "#666" }}>{formatDate(ed.start)}{ed.start || ed.end ? " — " : ""}{formatDate(ed.end)}</div>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: "Fraunces, Georgia, serif", fontSize: 13, fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.08em", color: "#1F4D3F", marginBottom: 6,
      }}>{title}</div>
      {children}
    </div>
  );
}

function Modern({ resume }: { resume: Resume }) {
  const p = resume.personal;
  const meta = [p.email, p.phone, p.location, p.website].filter(Boolean);
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, lineHeight: 1.5, color: "#1f2937", display: "grid", gridTemplateColumns: "210px 1fr", gap: 24 }}>
      <aside style={{ background: "#1F4D3F", color: "#FBF7F1", padding: "20px 18px", borderRadius: 8, marginLeft: -8 }}>
        <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>{p.name || "Your Name"}</div>
        <div style={{ fontSize: 10, opacity: 0.85, marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {meta.length > 0 ? meta.map((m, i) => <span key={i}>{m}</span>) : <span>email • phone • location</span>}
        </div>
        {resume.skills.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.75, marginBottom: 6 }}>Skills</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 10.5 }}>
              {resume.skills.map((s) => <span key={s}>• {s}</span>)}
            </div>
          </div>
        )}
        {resume.education.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.75, marginBottom: 6 }}>Education</div>
            {resume.education.map((ed) => (
              <div key={ed.id} style={{ marginBottom: 8, fontSize: 10.5 }}>
                <div style={{ fontWeight: 600 }}>{ed.school}</div>
                <div style={{ opacity: 0.85 }}>{ed.degree}</div>
                <div style={{ opacity: 0.7 }}>{formatDate(ed.start)} — {formatDate(ed.end)}</div>
              </div>
            ))}
          </div>
        )}
      </aside>
      <div>
        {resume.summary && (
          <Section title="Profile"><div>{resume.summary}</div></Section>
        )}
        {resume.experience.length > 0 && (
          <Section title="Experience">
            {resume.experience.map((e) => (
              <div key={e.id} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600 }}>{e.title || "Role"}</div>
                <div style={{ fontSize: 10.5, color: "#555", marginBottom: 4 }}>
                  {e.company} · {formatDate(e.start)}{e.start || e.end ? " — " : ""}{formatDate(e.end) || (e.start ? "Present" : "")}
                </div>
                <ul style={{ margin: "0 0 0 18px", padding: 0 }}>
                  {e.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

function Minimal({ resume }: { resume: Resume }) {
  const p = resume.personal;
  const meta = [p.email, p.phone, p.location, p.website].filter(Boolean).join("  ·  ");
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, lineHeight: 1.55, color: "#1f2937" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 26, fontWeight: 500, letterSpacing: "0.02em" }}>
          {p.name || "Your Name"}
        </div>
        <div style={{ fontSize: 10.5, color: "#666", marginTop: 6 }}>{meta || "email · phone · location"}</div>
      </div>
      {resume.summary && <div style={{ marginBottom: 16, textAlign: "center", maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>{resume.summary}</div>}
      {resume.experience.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ textAlign: "center", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: 10 }}>Experience</div>
          {resume.experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><span style={{ fontWeight: 600 }}>{e.title || "Role"}</span>, {e.company}</div>
                <div style={{ color: "#777", fontSize: 10.5 }}>{formatDate(e.start)} — {formatDate(e.end) || (e.start ? "Present" : "")}</div>
              </div>
              <ul style={{ margin: "2px 0 0 16px", padding: 0 }}>
                {e.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
      {resume.skills.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ textAlign: "center", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: 8 }}>Skills</div>
          <div style={{ textAlign: "center" }}>{resume.skills.join("  ·  ")}</div>
        </div>
      )}
      {resume.education.length > 0 && (
        <div>
          <div style={{ textAlign: "center", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: 8 }}>Education</div>
          {resume.education.map((ed) => (
            <div key={ed.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div><span style={{ fontWeight: 600 }}>{ed.school}</span> — {ed.degree}</div>
              <div style={{ color: "#777", fontSize: 10.5 }}>{formatDate(ed.start)} — {formatDate(ed.end)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
