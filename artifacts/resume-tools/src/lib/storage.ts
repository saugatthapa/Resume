export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

export type Session = { userId: string; email: string } | null;

export type Plan = "free" | "pro";

export type Profile = {
  plan: Plan;
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
  template: "classic" | "modern" | "minimal";
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

const KEY_USERS = "rct.users";
const KEY_SESSION = "rct.session";
const profileKey = (id: string) => `rct.profile.${id}`;
const resumeKey = (id: string) => `rct.resume.${id}`;
const coverLetterKey = (id: string) => `rct.coverLetter.${id}`;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const Users = {
  list: () => read<User[]>(KEY_USERS, []),
  add: (u: User) => {
    const list = Users.list();
    list.push(u);
    write(KEY_USERS, list);
  },
  findByEmail: (email: string) =>
    Users.list().find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null,
  findById: (id: string) => Users.list().find((u) => u.id === id) ?? null,
};

export const SessionStore = {
  get: (): Session => read<Session>(KEY_SESSION, null),
  set: (s: Session) => write(KEY_SESSION, s),
  clear: () => localStorage.removeItem(KEY_SESSION),
};

function todayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function ensureFreshProfile(p: Profile): Profile {
  const today = todayISO();
  if (p.downloadsResetAt !== today) {
    return { ...p, downloadsResetAt: today, downloadsToday: 0, coverLettersToday: 0 };
  }
  return p;
}

export const Profiles = {
  get: (id: string): Profile => {
    const stored = read<Profile | null>(profileKey(id), null);
    const base: Profile = stored ?? {
      plan: "free",
      downloadsToday: 0,
      downloadsResetAt: todayISO(),
      coverLettersToday: 0,
    };
    const fresh = ensureFreshProfile(base);
    if (fresh !== base) write(profileKey(id), fresh);
    return fresh;
  },
  set: (id: string, p: Profile) => write(profileKey(id), p),
  upgrade: (id: string) => {
    const p = Profiles.get(id);
    Profiles.set(id, { ...p, plan: "pro" });
  },
  downgrade: (id: string) => {
    const p = Profiles.get(id);
    Profiles.set(id, { ...p, plan: "free" });
  },
  recordDownload: (id: string) => {
    const p = Profiles.get(id);
    Profiles.set(id, { ...p, downloadsToday: p.downloadsToday + 1 });
  },
  recordCoverLetter: (id: string) => {
    const p = Profiles.get(id);
    Profiles.set(id, { ...p, coverLettersToday: p.coverLettersToday + 1 });
  },
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

export const Resumes = {
  get: (id: string): Resume | null => read<Resume | null>(resumeKey(id), null),
  set: (id: string, r: Resume) => write(resumeKey(id), r),
};

export const CoverLetters = {
  get: (id: string): string => read<string>(coverLetterKey(id), ""),
  set: (id: string, text: string) => write(coverLetterKey(id), text),
};

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
