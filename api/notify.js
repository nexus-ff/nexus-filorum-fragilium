// === /api/notify.js ===
// Wird von deiner Website aufgerufen, wenn das Passwort korrekt war.

export default async function handler(req, res) {
  try {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const time = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
    const ua = req.headers["user-agent"] || "Unbekannt";

    const message = `🔔 Neue Anmeldung!\n🕓 ${time}\n💻 Browser: ${ua}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
