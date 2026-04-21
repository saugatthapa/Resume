import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  SessionStore,
  Users,
  Profiles,
  Resumes,
  emptyResume,
  newId,
  type Session,
  type User,
  type Profile,
} from "./storage";

type AuthCtx = {
  session: Session;
  user: User | null;
  profile: Profile | null;
  signup: (name: string, email: string, password: string) => { ok: true } | { ok: false; error: string };
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  refresh: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(() => SessionStore.get());
  const [tick, setTick] = useState(0);

  const user = session ? Users.findById(session.userId) : null;
  const profile = session ? Profiles.get(session.userId) : null;

  useEffect(() => {
    void tick;
  }, [tick]);

  const refresh = () => setTick((t) => t + 1);

  const signup: AuthCtx["signup"] = (name, email, password) => {
    if (!name.trim() || !email.trim() || !password) return { ok: false, error: "All fields are required." };
    if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "Enter a valid email." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    if (Users.findByEmail(email)) return { ok: false, error: "An account with that email already exists." };
    const isFirstUser = Users.list().length === 0;
    const u: User = {
      id: newId(),
      name: name.trim(),
      email: email.trim(),
      password,
      createdAt: new Date().toISOString(),
      isAdmin: isFirstUser,
    };
    Users.add(u);
    Profiles.set(u.id, {
      plan: "free",
      downloadsToday: 0,
      downloadsResetAt: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      coverLettersToday: 0,
    });
    Resumes.set(u.id, emptyResume(u.name, u.email));
    const s = { userId: u.id, email: u.email };
    SessionStore.set(s);
    setSession(s);
    return { ok: true };
  };

  const login: AuthCtx["login"] = (email, password) => {
    const u = Users.findByEmail(email);
    if (!u || u.password !== password) return { ok: false, error: "Email or password is incorrect." };
    const s = { userId: u.id, email: u.email };
    SessionStore.set(s);
    setSession(s);
    return { ok: true };
  };

  const logout = () => {
    SessionStore.clear();
    setSession(null);
  };

  return (
    <Ctx.Provider value={{ session, user, profile, signup, login, logout, refresh }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
