import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Resume & Career Tools <noreply@resumeandcareertools.com>";

function getAppUrl() {
  if (process.env.APP_URL && process.env.APP_URL !== "http://localhost:5173") {
    return process.env.APP_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.APP_URL || "http://localhost:5173";
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${getAppUrl()}/reset-password?token=${token}`;
  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: FROM,
        to: [to],
        subject: "Reset your password — Resume & Career Tools",
        html: `
          <p>Hi,</p>
          <p>You requested a password reset for your Resume & Career Tools account.</p>
          <p><a href="${resetUrl}">Click here to reset your password</a></p>
          <p>This link expires in 1 hour. If you didn't request a reset, ignore this email.</p>
          <p>— The Resume & Career Tools team</p>
        `,
      });
    } else {
      console.log(`[DEV] Password reset email to ${to}: ${resetUrl}`);
    }
  } catch (e) {
    console.error("Failed to send password reset email", e);
    throw new Error("Could not send email. Please try again.");
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: FROM,
        to: [to],
        subject: "Welcome to Resume & Career Tools!",
        html: `
          <p>Hi ${name},</p>
          <p>Welcome to Resume & Career Tools! Start building your resume at <a href="${getAppUrl()}">resumeandcareertools.com</a>.</p>
          <p>— The team</p>
        `,
      });
    } else {
      console.log(`[DEV] Welcome email to ${to}`);
    }
  } catch (e) {
    console.error("Failed to send welcome email", e);
  }
}