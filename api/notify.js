// === /api/notify.js ===
// Serverless-Funktion auf Vercel: schickt dir bei erfolgreichem Login eine Telegram-Nachricht
export default async function handler(req, res) {
  try {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // IP aus Headers (Vercel / Proxies)
    const fwd = req.headers['x-forwarded-for'] || '';
    const ip = (Array.isArray(fwd) ? fwd[0] : fwd.split(',')[0] || '').trim() || req.socket?.remoteAddress || 'unbekannt';

    // User-Agent (Browser)
    const ua = req.headers['user-agent'] || 'Unbekannt';

    // Grobe Geo (Stadt, Land) – gratis Endpoint (Rate-Limit beachten)
    let city = '—', country = '—';
    try {
      if (ip && ip !== 'unbekannt' && !ip.startsWith('::ffff:127.') && ip !== '127.0.0.1') {
        const geoResp = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, { cache: 'no-store' });
        if (geoResp.ok) {
          const g = await geoResp.json();
          city = g.city || '—';
          country = g.country_name || g.country || '—';
        }
      }
    } catch(_) { /* Geo-Lookup optional */ }

    const time = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

    const message =
`🌀 Is it HER? 🙃
🕓 ${time}
🌐 IP: ${ip}
📍 Ort: ${city}, ${country}
💻 Browser: ${ua}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
