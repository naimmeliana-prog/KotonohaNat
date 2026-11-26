import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export default async function handler(req: any, res: any) {
  const { text = '', voiceName = 'Puck', pace = 'natural' } = req.body || req.query || {};
  if (!text) return res.status(400).json({ error: 'Falta texto' });

  try {
    const tts = new MsEdgeTTS();

    // Kenji (Puck) -> voz masculina neuronal Keita
    // Haruka (Kore) / Aoi (Zephyr) -> voz femenina neuronal Nanami
    const neuralVoice = voiceName === 'Puck' ? 'ja-JP-KeitaNeural' : 'ja-JP-NanamiNeural';
    await tts.setMetadata(neuralVoice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const rate = pace === 'slow' ? '-20%' : '+0%';
    const pitch = voiceName === 'Zephyr' ? '+8Hz' : '+0Hz';

    const { audioStream } = tts.toStream(String(text).slice(0, 250), { rate, pitch });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }

    const base64 = Buffer.concat(chunks).toString('base64');
    return res.status(200).json({ audioBase64: base64, mimeType: 'audio/mpeg' });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Error en voz neuronal' });
  }
}
