import { env } from "@/env";
import { logger } from "@/lib/logger";

/**
 * Transactional email via the Resend HTTP API (plain fetch — no SDK dependency).
 * All templates obey the voice rules in content/00-content-guide.md: no urgency,
 * no shame, unsubscribe visible at full size.
 */

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<void> {
  if (!env.RESEND_API_KEY) {
    // Local development: log instead of send.
    logger.info({ to: "[redacted]", subject }, "email_skipped_no_api_key");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.EMAIL_FROM, to, subject, html, text }),
  });
  if (!res.ok) {
    const detail = await res.text();
    logger.error({ status: res.status, detail }, "email_send_failed");
    throw new Error(`Email delivery failed (${res.status})`);
  }
}

const shell = (inner: string) => `
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;font-family:Georgia,serif;color:#161512;background:#FAF8F4;">
    <p style="font-family:ui-monospace,monospace;font-size:12px;letter-spacing:0.08em;color:#6B665C;">SELV</p>
    ${inner}
    <hr style="border:none;border-top:1px solid #E7E2D8;margin:32px 0;" />
    <p style="font-size:13px;color:#6B665C;">You're receiving this because you asked to sign in or subscribed at selv.
    Not you? Ignore this email and nothing happens.</p>
  </div>`;

export async function sendMagicLinkEmail(to: string, url: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Your door in — expires in 10 minutes",
    html: shell(`
      <h1 style="font-size:24px;font-weight:normal;">The chair is ready.</h1>
      <p style="font-size:17px;line-height:1.6;">Tap the button and you're in. No password — we don't believe in making you remember one.</p>
      <p style="margin:32px 0;">
        <a href="${url}" style="background:#0E0D0B;color:#FAF8F4;padding:14px 24px;border-radius:10px;text-decoration:none;font-family:system-ui,sans-serif;">Sign in to SELV</a>
      </p>
      <p style="font-size:14px;color:#6B665C;">This link works once and expires in 10 minutes.</p>`),
    text: `Sign in to SELV: ${url}\n\nThis link works once and expires in 10 minutes. Not you? Ignore this email and nothing happens.`,
  });
}

export async function sendLapseEmail(to: string, firstName: string | null): Promise<void> {
  const name = firstName ?? "there";
  await sendEmail({
    to,
    subject: "The chair is still there",
    html: shell(`
      <p style="font-size:17px;line-height:1.6;">Hi ${name},</p>
      <p style="font-size:17px;line-height:1.6;">A few days without practice isn't a failure — it's data. The restart is the actual skill, and the smallest restart we have takes three minutes.</p>
      <p style="margin:32px 0;"><a href="${env.NEXT_PUBLIC_APP_URL}/today" style="background:#0E0D0B;color:#FAF8F4;padding:14px 24px;border-radius:10px;text-decoration:none;font-family:system-ui,sans-serif;">The 3-minute rep</a></p>
      <p style="font-size:17px;line-height:1.6;">No streak was broken. Streaks don't break here.</p>`),
    text: `Hi ${name},\n\nA few days without practice isn't a failure — it's data. The restart is the actual skill: ${env.NEXT_PUBLIC_APP_URL}/today\n\nNo streak was broken. Streaks don't break here.`,
  });
}
