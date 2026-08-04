// Receives contact form submissions and relays them to the clinic by email via
// Resend. Nothing is written to a database or logged: the form asks people to
// describe medical complaints, so that content lives in email and nowhere else.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const TO = process.env.CONTACT_TO || "info@mvmntcultr.com";
const FROM = process.env.CONTACT_FROM || "MVMNT CULTR Website <onboarding@resend.dev>";

const FIELDS = [
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["reason", "Reason for reaching out"],
  ["message", "Message"]
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;

  if (typeof req.body === "string") {
    const raw = req.body.trim();
    if (!raw) return {};
    if (raw.startsWith("{")) {
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    }
    return Object.fromEntries(new URLSearchParams(raw));
  }

  return {};
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  const body = parseBody(req);

  // A browser form post (JavaScript disabled or failed) expects a page back,
  // not JSON.
  const wantsRedirect = !String(req.headers.accept || "").includes("application/json");

  // Honeypot. Bots tick this; humans never see it. Answer as if it worked so
  // the bot has nothing to learn, but send nothing.
  if (body.botcheck) {
    return wantsRedirect
      ? res.redirect(303, "/contact/?sent=1")
      : res.status(200).json({ success: true });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const reason = String(body.reason || "").trim();

  if (!name || !email || !email.includes("@")) {
    return wantsRedirect
      ? res.redirect(303, "/contact/?error=1")
      : res.status(400).json({ success: false, message: "Please provide your name and a valid email address." });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set; cannot deliver contact form submission.");
    return wantsRedirect
      ? res.redirect(303, "/contact/?error=1")
      : res.status(500).json({ success: false, message: "The form is not configured correctly." });
  }

  const rows = FIELDS.map(([key, label]) => {
    const value = String(body[key] || "").trim();
    return value ? { label, value } : null;
  }).filter(Boolean);

  const text = rows.map((row) => `${row.label}:\n${row.value}`).join("\n\n");
  const html = rows
    .map(
      (row) =>
        `<p style="margin:0 0 18px"><strong style="display:block;font:600 12px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#657071">${escapeHtml(
          row.label
        )}</strong><span style="font:400 15px/1.5 Helvetica,Arial,sans-serif;color:#080808;white-space:pre-wrap">${escapeHtml(
          row.value
        )}</span></p>`
    )
    .join("");

  const subject = `New website inquiry from ${name}${reason ? ` - ${reason}` : ""}`;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject,
        text,
        html
      })
    });

    if (!response.ok) {
      // Log the status only. The response can echo submission content back.
      console.error(`Resend rejected the submission with status ${response.status}`);
      throw new Error(`Resend responded ${response.status}`);
    }

    return wantsRedirect
      ? res.redirect(303, "/contact/?sent=1")
      : res.status(200).json({ success: true });
  } catch (error) {
    console.error("Contact form delivery failed:", error.message);
    return wantsRedirect
      ? res.redirect(303, "/contact/?error=1")
      : res.status(502).json({ success: false, message: "Delivery failed." });
  }
};
