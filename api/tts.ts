export default async function handler(req: any, res: any) {
  const { text = '', voiceName = 'Puck' } = req.body || req.query || {};
  if (!text) return res.status(400).json({ error: 'Falta texto' });

  try {
    const baseUrl = 'https://' + '://soundoftext.com';

    const createRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        engine: 'Google',
        data: { text: String(text).slice(0, 200), voice: 'ja-JP' },
      }),
    });
    const created = await createRes.json();
    if (!created?.id) throw new Error('No se pudo generar ID de audio');

    await new Promise((r) => setTimeout(r, 800));
    const statusRes = await fetch(baseUrl + '/' + created.id);
    const statusData = await statusRes.json();
    if (!statusData?.location) throw new Error('Audio aún no disponible');

    const mp3Res = await fetch(statusData.location);
    const arrayBuffer = await mp3Res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return res.status(200).json({ audioBase64: base64, mimeType: 'audio/mpeg', voiceName });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Error TTS' });
  }
}
