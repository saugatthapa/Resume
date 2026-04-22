// Typed API client + shared types. All persistence is server-side now.

export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
};

export type AdminTemplate = {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  createdAt: string;
};

export type Plan = "free" | "pro";

export type Profile = {
  userId: string;
  plan: Plan;
  proUntil: string | null;
  downloadsToday: number;
  downloadsResetAt: string;
  coverLettersToday: number;
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  start: string;
  end: string;
  bullets: string[];
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  start: string;
  end: string;
};

export type Resume = {
  template: "classic" | "modern" | "minimal" | "custom";
  customTemplateId?: string;
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website: string;
  };
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
};

export const FREE_DOWNLOAD_LIMIT = 2;
export const FREE_COVER_LETTER_LIMIT = 3;

export function emptyResume(name: string, email: string): Resume {
  return {
    template: "classic",
    personal: { name, email, phone: "", location: "", website: "" },
    summary: "",
    skills: [],
    experience: [],
    education: [],
  };
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Resolve API URL under the artifact's base path so requests don't escape into
// other artifacts that own `/api` at the workspace level. On Vercel the base
// is `/` so this becomes plain `/api/...`.
function apiUrl(path: string): string {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/+$/, "/");
  return `${base}${path.replace(/^\/+/, "")}`;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = (json && (json.error as string)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return json as T;
}

export const Auth = {
  signup: (name: string, email: string, password: string) =>
    api<{ user: User }>("/api/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string) =>
    api<{ user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => api<{ ok: true }>("/api/auth/logout", { method: "POST" }),
  me: () => api<{ user: User | null; profile: Profile | null }>("/api/auth/me"),
  toggleAdmin: () => api<{ user: User }>("/api/profile/toggle-admin", { method: "POST" }),
  forgotPassword: (email: string) => api<{ ok: true }>("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
};

export const ProfileApi = {
  recordDownload: () => api<{ profile: Profile }>("/api/profile/record-download", { method: "POST" }),
  recordCoverLetter: () => api<{ profile: Profile }>("/api/profile/record-cover-letter", { method: "POST" }),
  downgrade: () => api<{ profile: Profile }>("/api/profile/downgrade", { method: "POST" }),
};

export const ResumeApi = {
  get: () => api<{ resume: Resume | null }>("/api/resume"),
  save: (resume: Resume) => api<{ ok: true }>("/api/resume", { method: "PUT", body: JSON.stringify({ resume }) }),
};

export const CoverLetterApi = {
  get: () => api<{ text: string }>("/api/cover-letter"),
  save: (text: string) => api<{ ok: true }>("/api/cover-letter", { method: "PUT", body: JSON.stringify({ text }) }),
};

export const AdminTemplatesApi = {
  list: () => api<{ templates: AdminTemplate[] }>("/api/admin/templates"),
  get: (id: string) => api<{ template: AdminTemplate }>(`/api/admin/templates/${id}`),
  create: (t: Omit<AdminTemplate, "id" | "createdAt">) =>
    api<{ template: AdminTemplate }>("/api/admin/templates", { method: "POST", body: JSON.stringify(t) }),
  update: (id: string, t: Omit<AdminTemplate, "id" | "createdAt">) =>
    api<{ template: AdminTemplate }>(`/api/admin/templates/${id}`, { method: "PUT", body: JSON.stringify(t) }),
  remove: (id: string) => api<{ ok: true }>(`/api/admin/templates/${id}`, { method: "DELETE" }),
};

export const PayPalApi = {
  config: () => api<{ clientId: string; mode: "sandbox" | "live" }>("/api/paypal/config"),
  createOrder: () => api<{ orderId: string }>("/api/paypal/orders", { method: "POST" }),
  captureOrder: (orderId: string) =>
    api<{ ok: true; profile: Profile }>(`/api/paypal/orders/${orderId}/capture`, { method: "POST" }),
};
