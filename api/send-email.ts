import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = req.headers["x-internal-secret"];
  if (secret !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { to, subject, template, data } = req.body as {
    to: string;
    subject: string;
    template: string;
    data: Record<string, unknown>;
  };

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey) {
    console.log("[send-email] No RESEND_API_KEY set. Would send:", { to, subject, template, data });
    return res.status(200).json({ success: true, dev: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html: `<p>Template: ${template}</p><pre>${JSON.stringify(data, null, 2)}</pre>`,
    });
    return res.status(200).json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error("[send-email] Error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
