import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Wallet, CreditCard, Landmark, ShieldCheck, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Profiles } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type Method = "balance" | "card" | "bank";
type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

const detectBrand = (digits: string): CardBrand => {
  const d = digits.replace(/\D/g, "");
  if (/^4/.test(d)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  if (/^(6011|65|64[4-9])/.test(d)) return "discover";
  return "unknown";
};

const formatCardNumber = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 19);
  return d.replace(/(.{4})/g, "$1 ").trim();
};

const formatExp = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
};

export function UpgradeModal({
  open, onOpenChange, reason,
}: {
  open: boolean; onOpenChange: (b: boolean) => void; reason?: string;
}) {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"plan" | "checkout">("plan");
  const [method, setMethod] = useState<Method>("balance");
  const [processing, setProcessing] = useState(false);

  // Card fields
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardZip, setCardZip] = useState("");
  const cardType: "credit" | "debit" = "credit";

  // Bank fields
  const [routing, setRouting] = useState("");
  const [account, setAccount] = useState("");

  const brand = detectBrand(cardNumber);

  const reset = () => {
    setStep("plan"); setMethod("balance"); setProcessing(false);
    setCardName(""); setCardNumber(""); setCardExp(""); setCardCvc(""); setCardZip("");
    setRouting(""); setAccount("");
  };

  const close = (b: boolean) => {
    if (!b) reset();
    onOpenChange(b);
  };

  const validateCard = () => {
    const digits = cardNumber.replace(/\s/g, "");
    if (!cardName.trim()) return "Enter the cardholder name.";
    if (digits.length < 13) return "Enter a valid card number.";
    if (brand === "unknown") return "We accept Visa, Mastercard, Amex, and Discover.";
    if (!/^\d{2}\/\d{2}$/.test(cardExp)) return "Enter expiry as MM/YY.";
    const expectedCvc = brand === "amex" ? 4 : 3;
    if (cardCvc.length !== expectedCvc) return `CVC must be ${expectedCvc} digits.`;
    if (!cardZip.trim()) return "Enter your billing ZIP / postal code.";
    return null;
  };

  const validateBank = () => {
    if (!/^\d{9}$/.test(routing)) return "Routing number must be 9 digits.";
    if (!/^\d{4,17}$/.test(account)) return "Enter a valid account number.";
    return null;
  };

  const pay = async () => {
    if (!user) return;
    let err: string | null = null;
    if (method === "card") err = validateCard();
    if (method === "bank") err = validateBank();
    if (err) {
      toast({ title: "Check your payment details", description: err, variant: "destructive" });
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1100));
    Profiles.upgrade(user.id);
    refresh();
    setProcessing(false);
    close(false);
    toast({
      title: "Payment successful",
      description: `Charged $5.00 via ${methodLabel(method, brand)}. Welcome to Pro.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden" data-testid="dialog-upgrade">
        {/* PayPal-styled header */}
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
                : "Pay $5.00 USD to Resume & Career Tools."}
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
              <Button
                onClick={() => setStep("checkout")}
                className="bg-[#FFC439] text-[#003087] hover:bg-[#FFB800] font-semibold"
                data-testid="button-confirm-upgrade"
              >
                <Wallet className="h-4 w-4 mr-2" />Continue with PayPal
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 max-h-[60vh] overflow-auto">
            <div className="text-xs text-muted-foreground mb-3">Choose how to pay</div>
            <div className="grid grid-cols-3 gap-2 mb-5">
              <MethodTile active={method === "balance"} onClick={() => setMethod("balance")} icon={<Wallet className="h-4 w-4" />} label="PayPal balance" testId="method-balance" />
              <MethodTile active={method === "card"} onClick={() => setMethod("card")} icon={<CreditCard className="h-4 w-4" />} label="Credit / Debit" testId="method-card" />
              <MethodTile active={method === "bank"} onClick={() => setMethod("bank")} icon={<Landmark className="h-4 w-4" />} label="Bank account" testId="method-bank" />
            </div>

            {method === "balance" && (
              <div className="rounded-lg border border-card-border bg-secondary/30 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">PayPal balance</div>
                    <div className="font-serif text-lg font-semibold">$248.50 USD</div>
                  </div>
                  <Wallet className="h-6 w-6 text-[#003087]" />
                </div>
                <div className="text-xs text-muted-foreground mt-3">Pay instantly from your linked PayPal wallet.</div>
              </div>
            )}

            {method === "card" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Accepted:</span>
                  <BrandPill label="Visa" active={brand === "visa"} />
                  <BrandPill label="Mastercard" active={brand === "mastercard"} />
                  <BrandPill label="Amex" active={brand === "amex"} />
                  <BrandPill label="Discover" active={brand === "discover"} />
                </div>
                <div>
                  <Label htmlFor="card-name">Cardholder name</Label>
                  <Input id="card-name" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="As shown on card" data-testid="input-card-name" />
                </div>
                <div>
                  <Label htmlFor="card-number">Card number</Label>
                  <div className="relative">
                    <Input
                      id="card-number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      data-testid="input-card-number"
                    />
                    {brand !== "unknown" && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                        {brand}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="card-exp">Expiry</Label>
                    <Input id="card-exp" value={cardExp} onChange={(e) => setCardExp(formatExp(e.target.value))} placeholder="MM/YY" inputMode="numeric" autoComplete="cc-exp" data-testid="input-card-exp" />
                  </div>
                  <div>
                    <Label htmlFor="card-cvc">CVC</Label>
                    <Input id="card-cvc" value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder={brand === "amex" ? "4 digits" : "3 digits"} inputMode="numeric" autoComplete="cc-csc" data-testid="input-card-cvc" />
                  </div>
                  <div>
                    <Label htmlFor="card-zip">ZIP / Postal</Label>
                    <Input id="card-zip" value={cardZip} onChange={(e) => setCardZip(e.target.value)} placeholder="94103" data-testid="input-card-zip" />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" />Your card supports both credit and debit. Card type is detected automatically.
                </p>
              </div>
            )}

            {method === "bank" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="routing">Routing number</Label>
                  <Input id="routing" value={routing} onChange={(e) => setRouting(e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="9 digits" inputMode="numeric" data-testid="input-routing" />
                </div>
                <div>
                  <Label htmlFor="account">Account number</Label>
                  <Input id="account" value={account} onChange={(e) => setAccount(e.target.value.replace(/\D/g, "").slice(0, 17))} placeholder="Up to 17 digits" inputMode="numeric" data-testid="input-account" />
                </div>
                <p className="text-[11px] text-muted-foreground">We'll send a one-time micro-deposit to verify your bank.</p>
              </div>
            )}

            <div className="rounded-lg bg-secondary/40 p-3 mt-5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Resume & Career Tools — Pro plan</span>
              <span className="font-semibold">$5.00 USD</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-3">
              <ShieldCheck className="h-3.5 w-3.5" />Encrypted by PayPal. You can cancel anytime in Settings.
            </div>

            <div className="flex gap-2 mt-5 justify-between">
              <Button variant="ghost" onClick={() => setStep("plan")} disabled={processing} data-testid="button-back-checkout">Back</Button>
              <Button
                onClick={pay}
                disabled={processing}
                className="bg-[#0070BA] hover:bg-[#005ea6] text-white font-semibold"
                data-testid="button-pay"
              >
                {processing ? "Processing…" : `Pay $5.00`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function methodLabel(m: Method, brand: CardBrand) {
  if (m === "balance") return "PayPal balance";
  if (m === "bank") return "bank account";
  return brand === "unknown" ? "card" : `${brand[0].toUpperCase()}${brand.slice(1)} card`;
}

function MethodTile({
  active, onClick, icon, label, testId,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; testId: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-3 text-xs hover-elevate flex flex-col items-start gap-2 ${active ? "border-primary ring-1 ring-primary bg-primary/5" : "border-border"}`}
      data-testid={`button-${testId}`}
    >
      <span className={active ? "text-primary" : "text-muted-foreground"}>{icon}</span>
      <span className="font-medium text-left leading-tight">{label}</span>
    </button>
  );
}

function BrandPill({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide border ${active ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground"}`}
    >
      {label}
    </span>
  );
}

function PayPalLogo() {
  return (
    <span className="font-bold text-lg leading-none select-none">
      <span className="text-white">Pay</span><span className="text-[#009cde]">Pal</span>
    </span>
  );
}
