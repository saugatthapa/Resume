import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Auth, type Profile, type User } from "./storage";

type AuthCtx = {
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  session: { userId: string; email: string } | null;
  signup: (name: string, email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const refresh = useCallback(async () => {
    try {
      const { user, profile } = await Auth.me();
      setUser(user);
      setProfile(profile);
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const signup: AuthCtx["signup"] = async (name, email, password) => {
    try {
      await Auth.signup(name, email, password);
      await refresh();
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Could not sign you up." };
    }
  };

  const login: AuthCtx["login"] = async (email, password) => {
    try {
      await Auth.login(email, password);
      await refresh();
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Could not sign you in." };
    }
  };

  const logout = async () => {
    try { await Auth.logout(); } catch {}
    setUser(null);
    setProfile(null);
  };

  const session = user ? { userId: user.id, email: user.email } : null;

  return (
    <Ctx.Provider value={{ loading, user, profile, session, signup, login, logout, refresh }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
