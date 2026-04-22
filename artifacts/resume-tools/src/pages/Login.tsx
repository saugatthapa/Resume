import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MarketingShell } from "@/components/MarketingShell";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) setLocation("/dashboard");
    else setError(result.error);
  };

  return (
    <MarketingShell>
      <Seo title="Log in" description="Sign in to continue building your resume and cover letters." />
      <div className="bg-grain min-h-[calc(100vh-160px)]">
        <div className="mx-auto max-w-5xl px-5 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold">Pick up where you left off.</h1>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Access your saved resume, tailor cover letters faster, and keep your job search materials in one place.
            </p>
          </div>

          <div className="rounded-2xl bg-card border border-card-border p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-semibold">Welcome back</h2>
            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  data-testid="input-email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground underline hover:text-foreground"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  data-testid="input-password"
                />
              </div>

              {error && <div className="text-sm text-destructive" data-testid="text-error">{error}</div>}

              <Button type="submit" className="w-full" disabled={loading} data-testid="button-submit-login">
                {loading ? "Signing in..." : "Log in"}
              </Button>
            </form>

            <div className="mt-5 text-sm text-muted-foreground text-center">
              New here?{" "}
              <Link href="/signup" className="text-foreground font-medium hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
