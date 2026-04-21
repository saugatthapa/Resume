import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Profiles } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export function UpgradeModal({
  open,
  onOpenChange,
  reason,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  reason?: string;
}) {
  const { user, refresh } = useAuth();
  const { toast } = useToast();

  const upgrade = () => {
    if (!user) return;
    Profiles.upgrade(user.id);
    refresh();
    onOpenChange(false);
    toast({
      title: "Welcome to Pro",
      description: "All templates unlocked. Unlimited downloads. No watermark.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-upgrade">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Upgrade to Pro</DialogTitle>
          <DialogDescription>
            {reason ?? "Unlock everything Resume & Career Tools has to offer."}
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg bg-secondary/50 p-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-serif font-semibold">$5</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              "All 3 resume templates",
              "Unlimited PDF downloads",
              "Watermark-free exports",
              "Unlimited cover letters",
              "Richer AI suggestions",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-primary" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} data-testid="button-cancel-upgrade">
            Maybe later
          </Button>
          <Button onClick={upgrade} className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-confirm-upgrade">
            Upgrade now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
