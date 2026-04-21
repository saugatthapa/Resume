import { MarketingShell } from "@/components/MarketingShell";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Check } from "lucide-react";

export default function Signup() {
  const { signup } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signup(name, email, password);
    if (result.ok) setLocation("/dashboard");
    else setError(result.error);
  };

  return (
    <MarketingShell>
      <Seo title="Create your account" description="Sign up free for Resume & Career Tools — no credit card required." />
      <div className="bg-grain min-h-[calc(100vh-160px)]">
        <div className="mx-auto max-w-5xl px-5 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold">Make your next application your best.</h1>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Free forever — no credit card required",
                "Live preview as you type",
                "Export to PDF in one click",
                "Cover letters, headlines, and AI nudges",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5 text-primary" />{f}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-card border border-card-border p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-semibold">Create your account</h2>
            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => { setName(e.target.value); setError(null); }} data-testid="input-name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} data-testid="input-email" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} data-testid="input-password" />
                <div className="text-xs text-muted-foreground mt-1">At least 6 characters.</div>
              </div>
              {error && <div className="text-sm text-destructive" data-testid="text-error">{error}</div>}
              <Button type="submit" className="w-full" data-testid="button-submit-signup">Create account</Button>
            </form>
            <div className="mt-5 text-sm text-muted-foreground text-center">
              Already have an account? <Link href="/login" className="text-foreground font-medium hover:underline">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
