import { Link } from "wouter";
import { MarketingShell } from "@/components/MarketingShell";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <MarketingShell>
      <Seo
        title="Terms of Service — Resume & Career Tools"
        description="The terms and conditions for using Resume & Career Tools."
      />

      <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <Link href="/">
          <Button variant="ghost" className="mb-8 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Button>
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-4 text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="mt-10 space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By accessing or using Resume & Career Tools ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p className="mt-3">
              Resume & Career Tools provides an online resume builder, cover letter generator, and related career tools. The Service includes both free and paid (Pro) tiers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">3. Account Registration</h2>
            <p className="mt-3">
              You must register for an account to access certain features. You are responsible for maintaining the confidentiality of your password and for all activities under your account. You must be at least 16 years old to create an account.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">4. Subscription and Payments</h2>
            <p className="mt-3">
              Pro subscriptions are billed at $5/month through PayPal. You authorize automatic renewal unless cancelled. You can cancel anytime from the Settings page. No refunds for partial months.
            </p>
            <p className="mt-3">
              Free tier includes: 2 PDF downloads/day, 3 cover letters/day. Pro tier includes: unlimited downloads and cover letters, watermark-free exports.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">5. Acceptable Use</h2>
            <p className="mt-3">You agree not to:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Use the Service for any illegal purpose</li>
              <li>Submit false or misleading information</li>
              <li>Attempt to gain unauthorized access to other accounts</li>
              <li>Use automated tools to scrape or bulk-generate content</li>
              <li>Resell or redistribute the Service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">6. Intellectual Property</h2>
            <p className="mt-3">
              You retain ownership of content you create. The Service's templates and underlying technology are owned by us or our licensors. We claim no ownership of your resume content.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">7. Disclaimer of Warranty</h2>
            <p className="mt-3">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We do not guarantee employment results, interview success, or any specific outcome from using the Service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
            <p className="mt-3">
              To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">9. Termination</h2>
            <p className="mt-3">
              We may terminate or suspend your account at any time for violation of these terms. You may delete your account from the Settings page. Upon termination, your right to use the Service ceases.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">10. Changes to Terms</h2>
            <p className="mt-3">
              We may modify these terms at any time. We will notify you of significant changes by email. Your continued use after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">11. Governing Law</h2>
            <p className="mt-3">
              These terms are governed by the laws of the United States. Any disputes shall be resolved in the courts of the United States.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground">12. Contact</h2>
            <p className="mt-3">
              Questions about these terms? Contact us at: support@resumeandcareertools.com
            </p>
          </section>
        </div>
      </div>
    </MarketingShell>
  );
}