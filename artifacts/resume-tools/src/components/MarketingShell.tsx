import { Link, useLocation } from "wouter";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Helmet } from "react-helmet-async";

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;

const NAV = [
  { href: "/pricing", label: "Pricing" },
  { href: "/resume-summary-generator", label: "Summary Tool" },
  { href: "/cover-letter-generator-free", label: "Cover Letters" },
  { href: "/resume-headline-generator", label: "Headlines" },
  { href: "/skills-for-resume-generator", label: "Skills" },
];

export function MarketingShell({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <>
      {PLAUSIBLE_DOMAIN && (
        <Helmet>
          <script defer data-domain={PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.tagged-events.js" />
        </Helmet>
      )}
      <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center" data-testid="link-home">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-2 text-sm rounded-md hover-elevate text-muted-foreground hover:text-foreground"
                data-testid={`link-nav-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <Button onClick={() => setLocation("/dashboard")} data-testid="button-dashboard">
                Open dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setLocation("/login")} data-testid="button-login">
                  Log in
                </Button>
                <Button onClick={() => setLocation("/signup")} data-testid="button-signup">
                  Get started free
                </Button>
              </>
            )}
          </div>
          <button
            className="md:hidden p-2 rounded-md hover-elevate"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            data-testid="button-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-5 py-3 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-md hover-elevate text-sm"
                >
                  {n.label}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              {session ? (
                <Button onClick={() => { setLocation("/dashboard"); setOpen(false); }}>
                  Open dashboard
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" className="flex-1" onClick={() => { setLocation("/login"); setOpen(false); }}>
                    Log in
                  </Button>
                  <Button className="flex-1" onClick={() => { setLocation("/signup"); setOpen(false); }}>
                    Get started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5 py-12 grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              Build a resume you'll actually be proud to send. Free templates, AI tools, and cover letters
              that don't sound like a robot wrote them.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/resume-summary-generator" className="hover:text-foreground">Resume Summary</Link></li>
              <li><Link href="/cover-letter-generator-free" className="hover:text-foreground">Cover Letters</Link></li>
              <li><Link href="/resume-headline-generator" className="hover:text-foreground">Headlines</Link></li>
              <li><Link href="/skills-for-resume-generator" className="hover:text-foreground">Skills Suggestions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-foreground">Log in</Link></li>
              <li><Link href="/signup" className="hover:text-foreground">Sign up</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-6xl px-5 py-4 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
            <span>© {new Date().getFullYear()} Resume & Career Tools</span>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-foreground">Terms of Service</Link>
            </div>
          </div>
        </div>
</footer>
    </>
  );
}
