import { Link, useLocation, Redirect } from "wouter";
import { type ReactNode, useState } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, FileText, Mail, Sparkles, Settings as SettingsIcon, LogOut, Menu, X, Shield,
} from "lucide-react";

const BASE_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/resume", label: "Resume Builder", icon: FileText },
  { href: "/dashboard/cover-letter", label: "Cover Letter", icon: Mail },
  { href: "/dashboard/ai-tools", label: "AI Tools", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];
const ADMIN_ITEM = { href: "/admin/templates", label: "Premium Templates", icon: Shield };

export function AppShell({ children }: { children: ReactNode }) {
  const { session, user, profile, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  if (!session || !user) return <Redirect to="/login" />;

  const items = user.isAdmin ? [...BASE_ITEMS, ADMIN_ITEM] : BASE_ITEMS;
  const isActive = (href: string) =>
    href === "/dashboard" ? location === "/dashboard" : location.startsWith(href);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="px-5 py-5">
          <Link href="/" data-testid="link-home-app">
            <Logo variant="light" />
          </Link>
        </div>
        <div className="px-4 pb-2">
          <div className="rounded-lg p-3 bg-sidebar-accent">
            <div className="text-xs text-sidebar-foreground/70">Signed in as</div>
            <div className="text-sm font-medium truncate">{user.name}</div>
            <div className="mt-2">
              <Badge
                variant="outline"
                className={`border-sidebar-foreground/20 ${profile?.plan === "pro" ? "bg-accent text-accent-foreground border-transparent" : "bg-sidebar-foreground/5"}`}
                data-testid="badge-plan"
              >
                {profile?.plan === "pro" ? "Pro plan" : "Free plan"}
              </Badge>
            </div>
          </div>
        </div>
        <nav className="px-3 py-4 flex-1 flex flex-col gap-1">
          {items.map((it) => {
            const Icon = it.icon;
            const active = isActive(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover-elevate ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/85"}`}
                data-testid={`link-${it.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-sidebar-border">
          <button
            onClick={() => { logout(); setLocation("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/85 hover-elevate"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
        <div className="h-14 px-4 flex items-center justify-between">
          <Link href="/"><Logo variant="light" /></Link>
          <button
            className="p-2 rounded-md hover-elevate"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-sidebar-border px-3 py-3 flex flex-col gap-1">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover-elevate"
                >
                  <Icon className="h-4 w-4" />
                  {it.label}
                </Link>
              );
            })}
            <button
              onClick={() => { logout(); setLocation("/"); }}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover-elevate"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        )}
      </div>

      <main className="flex-1 md:pt-0 pt-14 min-w-0">
        <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
      </main>
    </div>
  );
}

export function UpgradeBanner({ onUpgrade }: { onUpgrade: () => void }) {
  const { profile } = useAuth();
  if (profile?.plan === "pro") return null;
  return (
    <div className="rounded-xl border border-accent/30 bg-accent/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="font-medium">You're on the Free plan</div>
        <div className="text-sm text-muted-foreground">
          Unlock all 3 templates, unlimited downloads, and watermark-free PDFs for $5/month.
        </div>
      </div>
      <Button onClick={onUpgrade} className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-upgrade-banner">
        Upgrade to Pro
      </Button>
    </div>
  );
}
