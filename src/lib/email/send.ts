export async function sendEmail(params: {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}) {
  const secret = (import.meta.env as Record<string, string>)["INTERNAL_SECRET"];
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Secret": secret ?? "",
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to send email");
  return res.json();
}
