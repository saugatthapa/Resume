import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarketingShell } from "@/components/MarketingShell";
import { Seo } from "@/components/Seo";
import { Auth } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Auth.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketingShell>
      <Seo title="Reset Password" description="Reset your password." />
      <div className="mx-auto max-w-md px-5 py-20 md:py-28">
        <h1 className="font-serif text-3xl font-semibold">Reset your password</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {sent ? (
          <div className="mt-8 rounded-xl border border-card-border bg-card p-6">
            <p className="text-sm">
              If an account with that email exists, we've sent a password reset link.
              Check your inbox (and spam folder).
            </p>
            <Link href="/login" className="mt-4 block">
              <Button variant="outline" className="w-full">Back to login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>
            <Link href="/login">
              <Button variant="ghost" className="w-full">Back to login</Button>
            </Link>
          </form>
        )}
      </div>
    </MarketingShell>
  );
}