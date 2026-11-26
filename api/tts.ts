export default async function handler(req: any, res: any) {
  const { text = '', voiceName = 'Puck', pace = 'natural' } = req.body || req.query || {};
  if (!text) return res.status(400).json({ error: 'Falta texto' });

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Falta GEMINI_API_KEY en Vercel' });

  try {
    const endpoint =
      ['https:/', '://googleapis.com', 'v1beta', 'models', 'gemini-2.5-flash-preview-tts:generateContent'].join('/') +
      '?key=' +
      apiKey;

    const prompt =
      (pace === 'slow' ? 'Lee en japonés de forma clara y pausada: ' : 'Lee en japonés con voz natural y humana: ') +
      String(text).slice(0, 220);

    const apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      }),
    });

    const data = await apiRes.json();
    const inlineData = data?.candidates?.at(0)?.content?.parts?.at(0)?.inlineData;
    if (!inlineData?.data) {
      return res.status(502).json({ error: data?.error?.message || 'Sin audio devuelto por Gemini' });
    }

    const pcmBuffer = Buffer.from(inlineData.data, 'base64');
    const wavHeader = Buffer.alloc(44);
    wavHeader.write('RIFF', 0);
    wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
    wavHeader.write('WAVE', 8);
    wavHeader.write('fmt ', 12);
    wavHeader.writeUInt32LE(16, 16);
    wavHeader.writeUInt16LE(1, 20);
    wavHeader.writeUInt16LE(1, 22);
    wavHeader.writeUInt32LE(24000, 24);
    wavHeader.writeUInt32LE(48000, 28);
    wavHeader.writeUInt16LE(2, 32);
    wavHeader.writeUInt16LE(16, 34);
    wavHeader.write('data', 36);
    wavHeader.writeUInt32LE(pcmBuffer.length, 40);

    const wavBase64 = Buffer.concat([wavHeader, pcmBuffer]).toString('base64');
    return res.status(200).json({ audioBase64: wavBase64, mimeType: 'audio/wav' });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Error interno en TTS' });
  }
}
