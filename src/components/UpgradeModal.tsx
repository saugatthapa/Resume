import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { PayPalApi } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export function UpgradeModal({
  open, onOpenChange, reason,
}: {
  open: boolean; onOpenChange: (b: boolean) => void; reason?: string;
}) {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"plan" | "checkout">("plan");
  const [paypalConfig, setPaypalConfig] = useState<{ clientId: string; mode: "sandbox" | "live" } | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (paypalConfig || configError) return;
    PayPalApi.config()
      .then((c) => {
        if (!c.clientId) { setConfigError("PayPal isn't configured. Please contact support."); return; }
        setPaypalConfig(c);
      })
      .catch((e) => setConfigError(e?.message ?? "Could not load PayPal."));
  }, [open, paypalConfig, configError]);

  const reset = () => { setStep("plan"); setProcessing(false); };
  const close = (b: boolean) => { if (!b) reset(); onOpenChange(b); };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden" data-testid="dialog-upgrade">
        <div className="bg-[#003087] text-white px-6 pt-6 pb-5">
          <div className="flex items-center gap-2">
            <PayPalLogo />
            <span className="text-xs uppercase tracking-widest opacity-80 ml-auto">Secure checkout</span>
          </div>
          <DialogHeader className="mt-4 space-y-1 text-left">
            <DialogTitle className="font-serif text-2xl text-white">
              {step === "plan" ? "Upgrade to Pro" : "Complete your payment"}
            </DialogTitle>
            <DialogDescription className="text-white/80">
              {step === "plan"
                ? (reason ?? "Unlock everything Resume & Career Tools has to offer.")
                : "Pay $5.00 USD to Resume & Career Tools — 30 days of Pro."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {step === "plan" ? (
          <div className="p-6">
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif font-semibold">$5</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  "All resume templates including premium",
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
            <div className="flex gap-2 mt-5 justify-end">
              <Button variant="ghost" onClick={() => close(false)} data-testid="button-cancel-upgrade">Maybe later</Button>
              <Button onClick={() => setStep("checkout")}
                disabled={!user}
                className="bg-[#FFC439] text-[#003087] hover:bg-[#FFB800] font-semibold"
                data-testid="button-confirm-upgrade">
                Continue with PayPal
              </Button>
            </div>
            {!user && <div className="text-xs text-muted-foreground mt-3 text-right">Log in to upgrade.</div>}
          </div>
        ) : (
          <div className="p-6 max-h-[70vh] overflow-auto">
            <div className="rounded-lg bg-secondary/40 p-3 mb-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Resume & Career Tools — Pro plan (30 days)</span>
              <span className="font-semibold">$5.00 USD</span>
            </div>

            {configError && <div className="text-sm text-destructive mb-3">{configError}</div>}

            {!paypalConfig && !configError && (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading PayPal…
              </div>
            )}

            {paypalConfig && (
              <PayPalScriptProvider
                options={{
                  clientId: paypalConfig.clientId,
                  currency: "USD",
                  intent: "capture",
                  components: "buttons,funding-eligibility",
                  enableFunding: "card,paypal",
                }}
              >
                <PayPalButtons
                  style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                  disabled={processing}
                  createOrder={async () => {
                    try {
                      const { orderId } = await PayPalApi.createOrder();
                      return orderId;
                    } catch (e: any) {
                      toast({ title: "Could not start payment", description: e?.message, variant: "destructive" });
                      throw e;
                    }
                  }}
                  onApprove={async (data) => {
                    setProcessing(true);
                    try {
                      await PayPalApi.captureOrder(data.orderID);
                      await refresh();
                      close(false);
                      toast({ title: "Welcome to Pro", description: "Payment confirmed. You now have 30 days of Pro." });
                    } catch (e: any) {
                      toast({ title: "Payment capture failed", description: e?.message, variant: "destructive" });
                    } finally {
                      setProcessing(false);
                    }
                  }}
                  onCancel={() => toast({ title: "Payment cancelled" })}
                  onError={(err: any) =>
                    toast({ title: "PayPal error", description: String(err?.message ?? err), variant: "destructive" })
                  }
                />
                {paypalConfig.mode === "sandbox" && (
                  <div className="text-[11px] text-muted-foreground text-center mt-2">
                    Sandbox mode — use a PayPal sandbox buyer account for testing.
                  </div>
                )}
              </PayPalScriptProvider>
            )}

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-4">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secured by PayPal. Pay with your PayPal balance, debit/credit card, or bank account.
            </div>

            <div className="flex justify-start mt-5">
              <Button variant="ghost" onClick={() => setStep("plan")} disabled={processing} data-testid="button-back-checkout">
                Back
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PayPalLogo() {
  return (
    <span className="font-bold text-lg leading-none select-none">
      <span className="text-white">Pay</span><span className="text-[#009cde]">Pal</span>
    </span>
  );
}
