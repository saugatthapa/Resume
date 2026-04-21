import { MarketingShell } from "@/components/MarketingShell";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.ok) setLocation("/dashboard");
    else setError(result.error);
  };

  return (
    <MarketingShell>
      <Seo title="Log in" description="Log in to your Resume & Career Tools account." />
      <div className="bg-grain min-h-[calc(100vh-160px)] flex items-center">
        <div className="mx-auto w-full max-w-md px-5 py-16">
          <div className="rounded-2xl bg-card border border-card-border p-8 shadow-sm">
            <h1 className="font-serif text-3xl font-semibold">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Log in to keep building.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  data-testid="input-email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  data-testid="input-password"
                />
              </div>
              {error && <div className="text-sm text-destructive" data-testid="text-error">{error}</div>}
              <Button type="submit" className="w-full" data-testid="button-submit-login">Log in</Button>
            </form>
            <div className="mt-6 text-sm text-muted-foreground text-center">
              No account? <Link href="/signup" className="text-foreground font-medium hover:underline">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
