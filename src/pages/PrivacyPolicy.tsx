import { Link } from "wouter";
import { MarketingShell } from "@/components/MarketingShell";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <MarketingShell>
      <Seo
        title="Privacy Policy — Resume & Career Tools"
        description="How Resume & Career Tools collects, uses, and protects your personal information."
      />

      <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <Link href="/">
          <Button variant="ghost" className="mb-8 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Button>
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="mt-10 space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p className="mt-3">
              We collect information you provide directly: name, email address, and resume content you enter into our service. We also collect basic usage data like pages visited and features used, which is stored anonymously.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p className="mt-3">
              We use your information to: provide and improve our services, process payments through PayPal, send service-related emails (account confirmation, password reset), and generate the resumes and cover letters you request.
            </p>
            <p className="mt-3">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">3. Data Storage and Security</h2>
            <p className="mt-3">
              Your data is stored on secure servers in the United States. We use industry-standard encryption and access controls to protect your data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">4. Cookies</h2>
            <p className="mt-3">
              We use essential cookies for authentication and session management. These are necessary for the service to function. We may also use analytics cookies from third-party services to understand how users interact with our site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">5. Third-Party Services</h2>
            <p className="mt-3">
              Our service uses third parties for: payments (PayPal), email delivery (Resend), and analytics. These services have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">6. Your Rights</h2>
            <p className="mt-3">
              You can export or delete your account data at any time from the Settings page. You may also contact us to request a copy of your data or ask questions about how we process your information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">7. Children's Privacy</h2>
            <p className="mt-3">
              Our service is not intended for children under 16. We do not knowingly collect information from children under 16.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this policy from time to time. We will notify you of material changes by email or posting a notice on our site. Your continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">9. Contact</h2>
            <p className="mt-3">
              For privacy-related questions, contact us at: privacy@resumeandcareertools.com
            </p>
          </section>
        </div>
      </div>
    </MarketingShell>
  );
}