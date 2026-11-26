export default async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const text = body.text || req.query?.text || '';
    const voiceName = body.voiceName || req.query?.voiceName || 'Puck';
    const pace = body.pace || req.query?.pace || 'natural';

    if (!text) return res.status(400).json({ error: 'Falta texto' });

    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Falta GEMINI_API_KEY en Vercel' });

    const host = 'generativelanguage' + '.googleapis.com';
    const url = 'https://' + host + '/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=' + apiKey;


    const prompt =
      (pace === 'slow' ? 'Lee en japonés despacio y claro: ' : 'Lee en japonés natural: ') +
      String(text).slice(0, 220);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Error API Gemini' });
    }

    const part = data.candidates?.at(0)?.content?.parts?.at(0);
    if (!part?.inlineData?.data) {
      return res.status(502).json({ error: 'Gemini no devolvió audio' });
    }

    const pcm = Buffer.from(part.inlineData.data, 'base64');
    const wav = Buffer.alloc(44 + pcm.length);
    wav.write('RIFF', 0);
    wav.writeUInt32LE(36 + pcm.length, 4);
    wav.write('WAVE', 8);
    wav.write('fmt ', 12);
    wav.writeUInt32LE(16, 16);
    wav.writeUInt16LE(1, 20);
    wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(24000, 24);
    wav.writeUInt32LE(48000, 28);
    wav.writeUInt16LE(2, 32);
    wav.writeUInt16LE(16, 34);
    wav.write('data', 36);
    wav.writeUInt32LE(pcm.length, 40);
    pcm.copy(wav, 44);

    return res.status(200).json({ audioBase64: wav.toString('base64'), mimeType: 'audio/wav' });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
}
