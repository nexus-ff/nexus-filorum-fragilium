// === /api/notify.js ===

export default async function handler(req, res) {
  try {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const time = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
    const ua = req.headers["user-agent"] || "Unbekannt";

    const country = req.headers["x-vercel-ip-country"] || "unbekanntes Land";
    const city = req.headers["x-vercel-ip-city"] || "unbekannte Stadt";

    const message =
`🌀 Is It Her?
🕓 ${time}
🌍 Standort: ${country}, ${city}
💻 Browser: ${ua}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
