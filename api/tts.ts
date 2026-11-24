export default async function handler(req: any, res: any) {
  const { text = '', pace = 'natural' } = req.body || req.query || {};
  if (!text) return res.status(400).json({ error: 'Falta texto' });

  try {
    const speed = pace === 'slow' ? '0.75' : '1.0';
    const url =
      'https://google.com' +
      speed +
      '&q=' +
      encodeURIComponent(String(text).slice(0, 200));

    const audioRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!audioRes.ok) throw new Error('TTS no disponible');

    const arrayBuffer = await audioRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return res.status(200).json({ audioBase64: base64, mimeType: 'audio/mpeg' });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Error TTS' });
  }
}
