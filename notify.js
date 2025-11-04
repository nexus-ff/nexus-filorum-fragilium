// === api/notify.js ===
// Diese Funktion wird automatisch aufgerufen, wenn jemand das Passwort erfolgreich eingibt.
// Sie sendet dir eine Telegram-Nachricht.

export default async function handler(req, res) {
  const token = process.env.TELEGRAM_TOKEN;  // <-- in Vercel eingeben, NICHT hier
  const chatId = process.env.TELEGRAM_CHAT_ID;  // <-- ebenfalls in Vercel
  const time = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

  const message = `🔔 Neue Anmeldung auf deiner Seite\n🕓 ${time}\n🌍 Browser: ${
    req.headers['user-agent']
  }`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  });

  res.status(200).json({ ok: true });
}
