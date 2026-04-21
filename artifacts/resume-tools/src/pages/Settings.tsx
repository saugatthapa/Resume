import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Profiles, Users } from "@/lib/storage";
import { Link } from "wouter";
import { Shield } from "lucide-react";
import { useState } from "react";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useToast } from "@/hooks/use-toast";
import { Crown } from "lucide-react";

export default function Settings() {
  const { user, profile, refresh } = useAuth();
  const { toast } = useToast();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  if (!user || !profile) return null;
  const isPro = profile.plan === "pro";

  const downgrade = () => {
    if (!confirm("Downgrade to the Free plan?")) return;
    Profiles.downgrade(user.id);
    refresh();
    toast({ title: "Switched to Free", description: "You can upgrade again any time." });
  };

  return (
    <AppShell>
      <Seo title="Settings" description="Manage your account and plan." />
      <h1 className="font-serif text-3xl font-semibold">Settings</h1>

      <div className="rounded-xl border border-card-border bg-card p-6 mt-6">
        <h2 className="font-serif text-xl font-semibold">Account</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
          <div><div className="text-muted-foreground">Name</div><div className="font-medium mt-1">{user.name}</div></div>
          <div><div className="text-muted-foreground">Email</div><div className="font-medium mt-1">{user.email}</div></div>
          <div><div className="text-muted-foreground">Member since</div><div className="font-medium mt-1">{new Date(user.createdAt).toLocaleDateString()}</div></div>
        </div>
      </div>

      <div className="rounded-xl border border-card-border bg-card p-6 mt-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-serif text-xl font-semibold flex items-center gap-2">
              Current plan
              <Badge className={isPro ? "bg-accent text-accent-foreground" : ""} variant={isPro ? undefined : "outline"}>
                {isPro ? "Pro" : "Free"}
              </Badge>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isPro ? "Thanks for supporting us. You have access to everything." : "Upgrade to unlock all templates, unlimited downloads, and watermark-free PDFs."}
            </p>
          </div>
          {isPro ? (
            <Button variant="outline" onClick={downgrade} data-testid="button-downgrade">Switch to Free</Button>
          ) : (
            <Button onClick={() => setUpgradeOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-upgrade">
              <Crown className="h-4 w-4 mr-2" />Upgrade to Pro
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-card-border bg-card p-6 mt-6">
        <h2 className="font-serif text-xl font-semibold">Today's usage</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">PDF downloads</div>
            <div className="font-serif text-2xl mt-1">{profile.downloadsToday}{!isPro && " / 2"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Cover letters</div>
            <div className="font-serif text-2xl mt-1">{profile.coverLettersToday}{!isPro && " / 3"}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-card-border bg-card p-6 mt-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-serif text-xl font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />Admin access
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user.isAdmin
                ? "You can manage premium templates that Pro users can pick from."
                : "Demo only — toggle admin to manage premium templates."}
            </p>
          </div>
          <div className="flex gap-2">
            {user.isAdmin && (
              <Link href="/admin/templates">
                <Button variant="outline" data-testid="button-open-admin">Open admin</Button>
              </Link>
            )}
            <Button
              variant={user.isAdmin ? "ghost" : "outline"}
              onClick={() => {
                Users.update(user.id, { isAdmin: !user.isAdmin });
                refresh();
                toast({ title: user.isAdmin ? "Admin disabled" : "Admin enabled" });
              }}
              data-testid="button-toggle-admin"
            >
              {user.isAdmin ? "Turn off admin" : "Become admin"}
            </Button>
          </div>
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </AppShell>
  );
}
