import {
  AlertCircle,
  CheckCircle2,
  Eraser,
  Mic,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react';
import { buildGuestSrsCards } from '../data/seedCatalog';
import { formatT } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import { api, playBase64Audio } from '../lib/api';
import {
  createUserSrsCard,
  fetchUserSrsCards,
  recordStudyProgress,
  reviewUserSrsCard,
} from '../lib/firestoreService';
import type {
  AuthUser,
  JlptLevel,
  OralTurnResponse,
  SrsCard,
  WritingEvaluation,
} from '../types/kotonoha';

export type PracticeMode = 'oral' | 'srs' | 'escritura';

interface PracticeViewProps {
  initialMode?: PracticeMode;
  user: AuthUser | null;
  onRefreshDashboard: () => void;
  onRequireAuth: () => void;
}

const LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

const WRITING_SETS: Record<
  'hiragana' | 'katakana' | 'kanji',
  { char: string; reading: string; meaning: string; strokes: number }[]
> = {
    hiragana: [
    { char: 'あ', reading: 'a', meaning: 'あ (a)', strokes: 3 },
    { char: 'い', reading: 'i', meaning: 'い (i)', strokes: 2 },
    { char: 'う', reading: 'u', meaning: 'う (u)', strokes: 2 },
    { char: 'え', reading: 'e', meaning: 'え (e)', strokes: 2 },
    { char: 'お', reading: 'o', meaning: 'お (o)', strokes: 3 },
    { char: 'か', reading: 'ka', meaning: 'か (ka)', strokes: 3 },
    { char: 'き', reading: 'ki', meaning: 'き (ki)', strokes: 4 },
    { char: 'く', reading: 'ku', meaning: 'く (ku)', strokes: 1 },
    { char: 'け', reading: 'ke', meaning: 'け (ke)', strokes: 3 },
    { char: 'こ', reading: 'ko', meaning: 'こ (ko)', strokes: 2 },
    { char: 'さ', reading: 'sa', meaning: 'さ (sa)', strokes: 3 },
    { char: 'し', reading: 'shi', meaning: 'し (shi)', strokes: 1 },
    { char: 'す', reading: 'su', meaning: 'す (su)', strokes: 2 },
    { char: 'せ', reading: 'se', meaning: 'せ (se)', strokes: 3 },
    { char: 'そ', reading: 'so', meaning: 'そ (so)', strokes: 1 },
    { char: 'た', reading: 'ta', meaning: 'た (ta)', strokes: 4 },
    { char: 'ち', reading: 'chi', meaning: 'ち (chi)', strokes: 2 },
    { char: 'つ', reading: 'tsu', meaning: 'つ (tsu)', strokes: 1 },
    { char: 'て', reading: 'te', meaning: 'て (te)', strokes: 1 },
    { char: 'と', reading: 'to', meaning: 'と (to)', strokes: 2 },
    { char: 'な', reading: 'na', meaning: 'な (na)', strokes: 4 },
    { char: 'に', reading: 'ni', meaning: 'に (ni)', strokes: 3 },
    { char: 'ぬ', reading: 'nu', meaning: 'ぬ (nu)', strokes: 2 },
    { char: 'ね', reading: 'ne', meaning: 'ね (ne)', strokes: 2 },
    { char: 'の', reading: 'no', meaning: 'の (no)', strokes: 1 },
    { char: 'は', reading: 'ha / wa', meaning: 'は (ha / wa)', strokes: 3 },
    { char: 'ひ', reading: 'hi', meaning: 'ひ (hi)', strokes: 1 },
    { char: 'ふ', reading: 'fu', meaning: 'ふ (fu)', strokes: 4 },
    { char: 'へ', reading: 'he / e', meaning: 'へ (he / e)', strokes: 1 },
    { char: 'ほ', reading: 'ho', meaning: 'ほ (ho)', strokes: 4 },
    { char: 'ま', reading: 'ma', meaning: 'ま (ma)', strokes: 3 },
    { char: 'み', reading: 'mi', meaning: 'み (mi)', strokes: 2 },
    { char: 'む', reading: 'mu', meaning: 'む (mu)', strokes: 3 },
    { char: 'め', reading: 'me', meaning: 'め (me)', strokes: 2 },
    { char: 'も', reading: 'mo', meaning: 'も (mo)', strokes: 3 },
    { char: 'や', reading: 'ya', meaning: 'や (ya)', strokes: 3 },
    { char: 'ゆ', reading: 'yu', meaning: 'ゆ (yu)', strokes: 2 },
    { char: 'よ', reading: 'yo', meaning: 'よ (yo)', strokes: 2 },
    { char: 'ら', reading: 'ra', meaning: 'ら (ra)', strokes: 2 },
    { char: 'り', reading: 'ri', meaning: 'り (ri)', strokes: 2 },
    { char: 'る', reading: 'ru', meaning: 'る (ru)', strokes: 1 },
    { char: 'れ', reading: 're', meaning: 'れ (re)', strokes: 2 },
    { char: 'ろ', reading: 'ro', meaning: 'ろ (ro)', strokes: 1 },
    { char: 'わ', reading: 'wa', meaning: 'わ (wa)', strokes: 2 },
    { char: 'を', reading: 'wo (o)', meaning: 'を (wo / o)', strokes: 3 },
    { char: 'ん', reading: 'n', meaning: 'ん (n)', strokes: 1 },
  ],

   katakana: [
    { char: 'ア', reading: 'a', meaning: 'ア (a)', strokes: 2 },
    { char: 'イ', reading: 'i', meaning: 'イ (i)', strokes: 2 },
    { char: 'ウ', reading: 'u', meaning: 'ウ (u)', strokes: 3 },
    { char: 'エ', reading: 'e', meaning: 'エ (e)', strokes: 3 },
    { char: 'オ', reading: 'o', meaning: 'オ (o)', strokes: 3 },
    { char: 'カ', reading: 'ka', meaning: 'カ (ka)', strokes: 2 },
    { char: 'キ', reading: 'ki', meaning: 'キ (ki)', strokes: 3 },
    { char: 'ク', reading: 'ku', meaning: 'ク (ku)', strokes: 2 },
    { char: 'ケ', reading: 'ke', meaning: 'ケ (ke)', strokes: 3 },
    { char: 'コ', reading: 'ko', meaning: 'コ (ko)', strokes: 2 },
    { char: 'サ', reading: 'sa', meaning: 'サ (sa)', strokes: 3 },
    { char: 'シ', reading: 'shi', meaning: 'シ (shi)', strokes: 3 },
    { char: 'ス', reading: 'su', meaning: 'ス (su)', strokes: 2 },
    { char: 'セ', reading: 'se', meaning: 'セ (se)', strokes: 2 },
    { char: 'ソ', reading: 'so', meaning: 'ソ (so)', strokes: 2 },
    { char: 'タ', reading: 'ta', meaning: 'タ (ta)', strokes: 3 },
    { char: 'チ', reading: 'chi', meaning: 'チ (chi)', strokes: 3 },
    { char: 'ツ', reading: 'tsu', meaning: 'ツ (tsu)', strokes: 3 },
    { char: 'テ', reading: 'te', meaning: 'テ (te)', strokes: 3 },
    { char: 'ト', reading: 'to', meaning: 'ト (to)', strokes: 2 },
    { char: 'ナ', reading: 'na', meaning: 'ナ (na)', strokes: 2 },
    { char: 'ニ', reading: 'ni', meaning: 'ニ (ni)', strokes: 2 },
    { char: 'ヌ', reading: 'nu', meaning: 'ヌ (nu)', strokes: 2 },
    { char: 'ネ', reading: 'ne', meaning: 'ネ (ne)', strokes: 4 },
    { char: 'ノ', reading: 'no', meaning: 'ノ (no)', strokes: 1 },
    { char: 'ハ', reading: 'ha', meaning: 'ハ (ha)', strokes: 2 },
    { char: 'ヒ', reading: 'hi', meaning: 'ヒ (hi)', strokes: 2 },
    { char: 'フ', reading: 'fu', meaning: 'フ (fu)', strokes: 1 },
    { char: 'ヘ', reading: 'he', meaning: 'ヘ (he)', strokes: 1 },
    { char: 'ホ', reading: 'ho', meaning: 'ホ (ho)', strokes: 4 },
    { char: 'マ', reading: 'ma', meaning: 'マ (ma)', strokes: 2 },
    { char: 'ミ', reading: 'mi', meaning: 'ミ (mi)', strokes: 3 },
    { char: 'ム', reading: 'mu', meaning: 'ム (mu)', strokes: 2 },
    { char: 'メ', reading: 'me', meaning: 'メ (me)', strokes: 2 },
    { char: 'モ', reading: 'mo', meaning: 'モ (mo)', strokes: 3 },
    { char: 'ヤ', reading: 'ya', meaning: 'ヤ (ya)', strokes: 2 },
    { char: 'ユ', reading: 'yu', meaning: 'ユ (yu)', strokes: 2 },
    { char: 'ヨ', reading: 'yo', meaning: 'ヨ (yo)', strokes: 3 },
    { char: 'ラ', reading: 'ra', meaning: 'ラ (ra)', strokes: 2 },
    { char: 'リ', reading: 'ri', meaning: 'リ (ri)', strokes: 2 },
    { char: 'ル', reading: 'ru', meaning: 'ル (ru)', strokes: 2 },
    { char: 'レ', reading: 're', meaning: 'レ (re)', strokes: 1 },
    { char: 'ロ', reading: 'ro', meaning: 'ロ (ro)', strokes: 3 },
    { char: 'ワ', reading: 'wa', meaning: 'ワ (wa)', strokes: 2 },
    { char: 'ヲ', reading: 'wo (o)', meaning: 'ヲ (wo / o)', strokes: 3 },
    { char: 'ン', reading: 'n', meaning: 'ン (n)', strokes: 2 },
  ],

      kanji: [
    // --- NIVEL JLPT N5 ---
    { char: '一', reading: 'ichi / hito', meaning: '[N5] uno', strokes: 1 },
    { char: '二', reading: 'ni / futa', meaning: '[N5] dos', strokes: 2 },
    { char: '三', reading: 'san / mi', meaning: '[N5] tres', strokes: 3 },
    { char: '日', reading: 'nichi / hi', meaning: '[N5] día / sol', strokes: 4 },
    { char: '月', reading: 'getsu / tsuki', meaning: '[N5] mes / luna', strokes: 4 },
    { char: '火', reading: 'ka / hi', meaning: '[N5] fuego', strokes: 4 },
    { char: '水', reading: 'sui / mizu', meaning: '[N5] agua', strokes: 4 },
    { char: '木', reading: 'moku / ki', meaning: '[N5] árbol / madera', strokes: 4 },
    { char: '金', reading: 'kin / kane', meaning: '[N5] oro / dinero', strokes: 8 },
    { char: '土', reading: 'do / tsuchi', meaning: '[N5] tierra / suelo', strokes: 3 },
    { char: '山', reading: 'san / yama', meaning: '[N5] montaña', strokes: 3 },
    { char: '川', reading: 'sen / kawa', meaning: '[N5] río', strokes: 3 },
    { char: '人', reading: 'jin / hito', meaning: '[N5] persona', strokes: 2 },
    { char: '本', reading: 'hon / moto', meaning: '[N5] libro / origen', strokes: 5 },
    { char: '学', reading: 'gaku / mana', meaning: '[N5] estudio / ciencia', strokes: 8 },

    // --- NIVEL JLPT N4 ---
    { char: '会', reading: 'kai / a', meaning: '[N4] reunirse / asociación', strokes: 6 },
    { char: '社', reading: 'sha / yashiro', meaning: '[N4] empresa / santuario', strokes: 7 },
    { char: '駅', reading: 'eki', meaning: '[N4] estación de tren', strokes: 14 },
    { char: '電', reading: 'den', meaning: '[N4] electricidad', strokes: 13 },
    { char: '車', reading: 'sha / kuruma', meaning: '[N4] coche / vehículo', strokes: 7 },
    { char: '道', reading: 'dō / michi', meaning: '[N4] camino / vía', strokes: 12 },
    { char: '旅', reading: 'ryo / tabi', meaning: '[N4] viaje', strokes: 10 },
    { char: '海', reading: 'kai / umi', meaning: '[N4] mar / océano', strokes: 9 },
    { char: '空', reading: 'kū / sora', meaning: '[N4] cielo / vacío', strokes: 8 },
    { char: '花', reading: 'ka / hana', meaning: '[N4] flor', strokes: 7 },
    { char: '春', reading: 'shun / haru', meaning: '[N4] primavera', strokes: 9 },
    { char: '夏', reading: 'ka / natsu', meaning: '[N4] verano', strokes: 10 },
    { char: '秋', reading: 'shū / aki', meaning: '[N4] otoño', strokes: 9 },
    { char: '冬', reading: 'tō / fuyu', meaning: '[N4] invierno', strokes: 5 },
    { char: '心', reading: 'shin / kokoro', meaning: '[N4] corazón / mente', strokes: 4 },

    // --- NIVEL JLPT N3 ---
    { char: '愛', reading: 'ai', meaning: '[N3] amor / afecto', strokes: 13 },
    { char: '夢', reading: 'mu / yume', meaning: '[N3] sueño / ilusión', strokes: 13 },
    { char: '希', reading: 'ki', meaning: '[N3] esperanza / deseo', strokes: 7 },
    { char: '望', reading: 'bō / nozo', meaning: '[N3] anhelo / observar', strokes: 11 },
    { char: '和', reading: 'wa / yawa', meaning: '[N3] armonía / paz / Japón', strokes: 8 },
    { char: '平', reading: 'hei / tai', meaning: '[N3] plano / paz', strokes: 5 },
    { char: '幸', reading: 'kō / shiawa', meaning: '[N3] felicidad / fortuna', strokes: 8 },
    { char: '感', reading: 'kan', meaning: '[N3] sentimiento / emoción', strokes: 13 },
    { char: '情', reading: 'jō / nasa', meaning: '[N3] emoción / información', strokes: 11 },
    { char: '信', reading: 'shin', meaning: '[N3] fe / confianza', strokes: 9 },
    { char: '努', reading: 'do / tsuto', meaning: '[N3] esfuerzo', strokes: 7 },
    { char: '力', reading: 'ryoku / chikara', meaning: '[N3] fuerza / poder', strokes: 2 },
    { char: '美', reading: 'bi / utsuku', meaning: '[N3] belleza', strokes: 9 },
    { char: '自然', reading: 'shizen', meaning: '[N3] naturaleza', strokes: 15 },
    { char: '未来', reading: 'mirai', meaning: '[N3] futuro', strokes: 12 },

    // --- NIVEL JLPT N2 ---
    { char: '経', reading: 'kei / he', meaning: '[N2] economía / transcurrir', strokes: 11 },
    { char: '済', reading: 'sai / su', meaning: '[N2] terminar / aliviar', strokes: 11 },
    { char: '環', reading: 'kan', meaning: '[N2] entorno / anillo', strokes: 17 },
    { char: '境', reading: 'kyō / sakai', meaning: '[N2] frontera / ambiente', strokes: 14 },
    { char: '創', reading: 'sō / tsuku', meaning: '[N2] crear / fundar', strokes: 12 },
    { char: '造', reading: 'zō / tsuku', meaning: '[N2] construir / fabricar', strokes: 10 },
    { char: '挑', reading: 'chō / ido', meaning: '[N2] desafiar / retar', strokes: 9 },
    { char: '戦', reading: 'sen / tataka', meaning: '[N2] lucha / batalla', strokes: 13 },
    { char: '優', reading: 'yū / yasa', meaning: '[N2] amable / superior', strokes: 17 },
    { char: '雅', reading: 'ga / miya', meaning: '[N2] elegancia / gracia', strokes: 13 },
    { char: '響', reading: 'kyō / hibi', meaning: '[N2] eco / resonar', strokes: 20 },
    { char: '輝', reading: 'ki / kagaya', meaning: '[N2] brillar / resplandor', strokes: 15 },
    { char: '誠', reading: 'sei / makoto', meaning: '[N2] sinceridad / verdad', strokes: 13 },
    { char: '絆', reading: 'han / kizuna', meaning: '[N2] vínculo / lazo', strokes: 11 },
    { char: '極', reading: 'kyoku / kiwa', meaning: '[N2] extremo / polo', strokes: 12 },

    // --- NIVEL JLPT N1 ---
    { char: '哲', reading: 'tetsu', meaning: '[N1] filosofía / sabiduría', strokes: 10 },
    { char: '魂', reading: 'kon / tamashii', meaning: '[N1] alma / espíritu', strokes: 14 },
    { char: '凛', reading: 'rin', meaning: '[N1] digno / sereno / frío', strokes: 15 },
    { char: '悠', reading: 'yū', meaning: '[N1] eterno / tranquilo', strokes: 11 },
    { char: '翠', reading: 'sui / midori', meaning: '[N1] verde jade / esmeralda', strokes: 14 },
    { char: '蒼', reading: 'sō / ao', meaning: '[N1] azul profundo', strokes: 13 },
    { char: '玄', reading: 'gen', meaning: '[N1] misterioso / profundo', strokes: 5 },
    { char: '幽', reading: 'yū', meaning: '[N1] sutil / recóndito', strokes: 9 },
    { char: '暁', reading: 'gyō / akatsuki', meaning: '[N1] amanecer / alba', strokes: 12 },
    { char: '宵', reading: 'shō / yoi', meaning: '[N1] anochecer / víspera', strokes: 10 },
    { char: '雅', reading: 'ga / miya', meaning: '[N1] refinamiento', strokes: 13 },
    { char: '瞬', reading: 'shun / matata', meaning: '[N1] instante / parpadeo', strokes: 18 },
    { char: '煌', reading: 'kō / kirame', meaning: '[N1] destello / centelleo', strokes: 13 },
    { char: '奏', reading: 'sō / kana', meaning: '[N1] interpretar música', strokes: 9 },
    { char: '翔', reading: 'shō / kake', meaning: '[N1] volar alto / planear', strokes: 12 },
  ],
};


interface ChatTurnItem {
  id: string;
  role: 'user' | 'sensei';
  ja: string;
  reading?: string;
  romaji?: string;
  es?: string;
  audioBase64?: string | null;
  audioMimeType?: string | null;
  evaluation?: OralTurnResponse;
}

export function PracticeView({
  initialMode = 'oral',
  user,
  onRefreshDashboard,
  onRequireAuth,
}: PracticeViewProps) {
  const { lang, t } = useLanguage();
  const p = t.practice;
  const scenarios = p.scenarios;

  const [mode, setMode] = useState<PracticeMode>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // 1. ORAL TUTOR STATE
  const [scenario, setScenario] = useState(scenarios[0].id);
  const [oralLevel, setOralLevel] = useState<JlptLevel>(user?.jlptLevel || 'N5');
  const [voiceName, setVoiceName] = useState<'Kore' | 'Puck' | 'Zephyr'>('Kore');
  const [pace, setPace] = useState<'slow' | 'natural'>('slow');
  const [oralInput, setOralInput] = useState('');
  const [oralLoading, setOralLoading] = useState(false);
  const [oralError, setOralError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const currentScenarioObj = scenarios.find((s) => s.id === scenario) || scenarios[0];
  const [turns, setTurns] = useState<ChatTurnItem[]>([
    { id: 'welcome', role: 'sensei', ja: scenarios[0].openingJa, es: scenarios[0].openingSub },
  ]);

  const handleScenarioChange = (nextId: string) => {
    setScenario(nextId);
    const sc = scenarios.find((s) => s.id === nextId) || scenarios[0];
    setTurns([{ id: `welcome-${Date.now()}`, role: 'sensei', ja: sc.openingJa, es: sc.openingSub }]);
    setOralError(null);
  };

  const playSenseiLine = async (ja: string, cachedB64?: string | null, cachedMime?: string | null) => {
    try {
      if (cachedB64) {
        await playBase64Audio(cachedB64, cachedMime || 'audio/wav');
        return;
      }
      const tts = await api.synthesizeSpeech(ja, voiceName, pace);
      await playBase64Audio(tts.audioBase64, tts.mimeType);
    } catch (err) {
      setOralError(err instanceof Error ? err.message : p.audioPlayError);
    }
  };

  const submitOralPayload = async (payload: { audioBase64?: string; audioMimeType?: string; userText?: string }) => {
    setOralLoading(true);
    setOralError(null);
    try {
      const history = turns.map((turn) => ({ role: turn.role, text: turn.ja }));
      const res = await api.sendOralTurn({
        ...payload,
        scenario: currentScenarioObj.label,
        jlptLevel: oralLevel,
        voiceName,
        pace,
        history,
        uiLang: lang,
      });

      const userTurn: ChatTurnItem = {
        id: `u-${Date.now()}`,
        role: 'user',
        ja: res.userTranscriptJa,
        reading: res.userTranscriptReading,
        es: res.userMeaningEs,
        evaluation: res,
      };
      const senseiTurn: ChatTurnItem = {
        id: `s-${Date.now() + 1}`,
        role: 'sensei',
        ja: res.senseiReplyJa,
        reading: res.senseiReplyReading,
        romaji: res.senseiReplyRomaji,
        es: res.senseiReplyEs,
        audioBase64: res.audioBase64,
        audioMimeType: res.audioMimeType,
      };
      setTurns((prev) => [...prev, userTurn, senseiTurn]);
      setOralInput('');

      if (user) {
        await recordStudyProgress(
          user.uid,
          'oral',
          res.pronunciationScore,
          45,
          Math.max(12, Math.round(res.pronunciationScore * 0.25)),
          `${p.tabOral} (${oralLevel}): ${res.userTranscriptJa.slice(0, 60)}`
        );
      }
      onRefreshDashboard();

      if (res.audioBase64) {
        await playBase64Audio(res.audioBase64, res.audioMimeType || 'audio/wav').catch(() => {});
      }
    } catch (err) {
      setOralError(err instanceof Error ? err.message : p.oralProcessError);
    } finally {
      setOralLoading(false);
    }
  };

  const startRecording = async () => {
    setOralError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((tr) => tr.stop());
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRecordSeconds(0);
        const blob = new Blob(chunksRef.current, { type: mimeType.split(';')[0] });
        if (blob.size < 400) {
          setOralError(p.shortRecordingError);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = String(reader.result || '');
          const base64 = dataUrl.split(',')[1];
          if (base64) {
            submitOralPayload({ audioBase64: base64, audioMimeType: mimeType.split(';')[0] });
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      timerRef.current = window.setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch {
      setOralError(p.micBlockedError);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleTextOralSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!oralInput.trim() || oralLoading) return;
    submitOralPayload({ userText: oralInput.trim() });
  };

  // 2. SRS SPACED REPETITION STATE
  const [srsCards, setSrsCards] = useState<SrsCard[]>([]);
  const [srsGuest, setSrsGuest] = useState(false);
  const [srsLoading, setSrsLoading] = useState(false);
  const [srsIndex, setSrsIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [srsCombo, setSrsCombo] = useState(0);
  const [srsSessionXp, setSrsSessionXp] = useState(0);
  const [srsFeedback, setSrsFeedback] = useState<string | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newReading, setNewReading] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newLevel, setNewLevel] = useState<JlptLevel>('N5');

  const loadSrs = () => {
    if (!user) {
      setSrsCards(buildGuestSrsCards());
      setSrsGuest(true);
      setSrsIndex(0);
      setFlipped(false);
      return;
    }
    setSrsLoading(true);
    fetchUserSrsCards(user.uid)
      .then((cards) => {
        setSrsCards(cards);
        setSrsGuest(false);
        setSrsIndex(0);
        setFlipped(false);
      })
      .catch((err) => setSrsFeedback(err instanceof Error ? err.message : t.errors.fallbackMsg))
      .finally(() => setSrsLoading(false));
  };

  useEffect(() => {
    if (mode === 'srs') {
      loadSrs();
    }
  }, [mode, user]);

  const activeCard = srsCards[srsIndex] || null;

  const handleRateCard = async (quality: 1 | 3 | 4 | 5) => {
    if (!activeCard) return;
    const isPass = quality >= 3;
    setSrsCombo((c) => (isPass ? c + 1 : 0));

    if (!user || srsGuest || activeCard.id.startsWith('guest-')) {
      const gained = quality === 5 ? 15 : quality === 4 ? 12 : quality === 3 ? 8 : 4;
      setSrsSessionXp((x) => x + gained);
      setSrsFeedback(p.guestSrsNotice);
      setFlipped(false);
      setSrsIndex((idx) => (idx + 1) % srsCards.length);
      return;
    }

    try {
      const res = await reviewUserSrsCard(user.uid, activeCard, quality);
      setSrsSessionXp((x) => x + res.xpEarned);
      setSrsFeedback(formatT(p.nextReviewMsg, { days: res.intervalDays, xp: res.xpEarned }));
      setFlipped(false);
      if (srsIndex + 1 < srsCards.length) {
        setSrsIndex((i) => i + 1);
      } else {
        loadSrs();
      }
      onRefreshDashboard();
    } catch (err) {
      setSrsFeedback(err instanceof Error ? err.message : t.errors.fallbackMsg);
    }
  };

  const handleAddCustomCard = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }
    try {
      await createUserSrsCard(user.uid, {
        cardType: 'vocab',
        front: newFront,
        reading: newReading,
        back: newBack,
        jlptLevel: newLevel,
      });
      setNewFront('');
      setNewReading('');
      setNewBack('');
      setShowNewCardForm(false);
      loadSrs();
      onRefreshDashboard();
    } catch (err) {
      setSrsFeedback(err instanceof Error ? err.message : t.errors.fallbackMsg);
    }
  };

  // 3. SHODO WRITING CANVAS STATE
  const [scriptType, setScriptType] = useState<'hiragana' | 'katakana' | 'kanji'>('hiragana');
  const [selectedCharIdx, setSelectedCharIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [writingEval, setWritingEval] = useState<WritingEvaluation | null>(null);
  const [writingLoading, setWritingLoading] = useState(false);
  const [writingError, setWritingError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  const currentCharList = WRITING_SETS[scriptType];
  const currentChar = currentCharList[selectedCharIdx] || currentCharList[0];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
    setWritingEval(null);
    setWritingError(null);
  };

  useEffect(() => {
    clearCanvas();
  }, [scriptType, selectedCharIdx]);

  const getCanvasCoords = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    drawingRef.current = true;
    setHasStrokes(true);
    ctx.strokeStyle = '#1A1D21';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
  };

  const handleEvaluateWriting = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasStrokes) {
      setWritingError(p.drawFirstError);
      return;
    }
    setWritingLoading(true);
    setWritingError(null);
    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const ectx = exportCanvas.getContext('2d')!;
      ectx.fillStyle = '#FFFFFF';
      ectx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      ectx.drawImage(canvas, 0, 0);
      const pngDataUrl = exportCanvas.toDataURL('image/png');

      const res = await api.evaluateWriting({
        targetCharacter: currentChar.char,
        characterType: scriptType,
        imageBase64: pngDataUrl,
        uiLang: lang,
      });
      setWritingEval(res);
      if (user) {
        await recordStudyProgress(
          user.uid,
          'writing',
          res.score,
          40,
          Math.max(10, Math.round(res.score * 0.2)),
          `${p.tabWriting}: ${currentChar.char}`
        );
      }
      onRefreshDashboard();
    } catch (err) {
      setWritingError(err instanceof Error ? err.message : p.strokeError);
    } finally {
      setWritingLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFD9CD] dark:border-[#262C36] pb-6">
        <div>
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{p.eyebrow}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-1">
            {p.title}
          </h1>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#ECE8DF] dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] self-start">
          {(
            [
              { id: 'oral', label: p.tabOral },
              { id: 'srs', label: p.tabSrs },
              { id: 'escritura', label: p.tabWriting },
            ] as { id: PracticeMode; label: string }[]
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === m.id
                  ? 'bg-white dark:bg-[#272D38] text-[#C9372C] dark:text-[#E04F44] shadow-xs'
                  : 'text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'oral' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-[#ECE8DF] dark:border-[#262C36] flex flex-wrap items-center justify-between gap-4 bg-[#F7F5F0]/70 dark:bg-[#151820]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#C9372C] flex items-center justify-center text-white font-jp-serif text-lg shrink-0">
                  春
                </div>
                <div>
                  <h2 className="font-semibold text-base text-[#1A1D21] dark:text-[#F2EFE9]">{p.senseiHeader}</h2>
                  <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                    {p.scenarioPrefix} {currentScenarioObj.label} <span aria-hidden="true">·</span> {p.levelPrefix}{' '}
                    {oralLevel} <span aria-hidden="true">·</span> {p.paceLabel}{' '}
                    {pace === 'slow' ? p.paceSlow : p.paceNatural}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleScenarioChange(scenario)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#DFD9CD] dark:border-[#2C323E] text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {p.resetDialogue}
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[520px] overflow-y-auto">
              {turns.map((turn) => (
                <div key={turn.id} className="space-y-3">
                  {turn.role === 'sensei' ? (
                    <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#F7F5F0] dark:bg-[#111317]">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-[#C9372C] dark:text-[#E04F44]">Haruka-sensei</p>
                        <p className="font-jp text-base font-medium text-[#1A1D21] dark:text-[#F2EFE9]">{turn.ja}</p>
                        {turn.reading && (
                          <p className="font-jp text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                            {turn.reading} {turn.romaji ? `· ${turn.romaji}` : ''}
                          </p>
                        )}
                        {turn.es && <p className="text-sm text-[#4A505A] dark:text-[#B3B8C4]">{turn.es}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => playSenseiLine(turn.ja, turn.audioBase64, turn.audioMimeType)}
                        aria-label={p.senseiHeader}
                        className="p-2.5 rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-white dark:bg-[#191C22] text-[#1E3A5F] dark:text-[#7FAEE3] hover:border-[#C9372C] hover:text-[#C9372C] shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl border border-[#1E3A5F]/25 dark:border-[#5B8CC4]/30 bg-white dark:bg-[#1C212B]">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-medium text-[#1E3A5F] dark:text-[#7FAEE3]">{p.youLabel}</p>
                          {turn.evaluation && (
                            <span
                              className={`text-xs font-mono-num font-semibold ${
                                turn.evaluation.pronunciationScore >= 80
                                  ? 'text-[#2E6F52] dark:text-[#5DC293]'
                                  : 'text-[#C9372C] dark:text-[#F06B60]'
                              }`}
                            >
                              {p.pronunciationPrefix} {turn.evaluation.pronunciationScore}/100 ·{' '}
                              {turn.evaluation.pronunciationScore >= 80
                                ? p.clearPronunciation
                                : p.inProgressPronunciation}
                            </span>
                          )}
                        </div>
                        <p className="font-jp text-base text-[#1A1D21] dark:text-[#F2EFE9] mt-1">{turn.ja}</p>
                        {turn.es && <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-0.5">{turn.es}</p>}

                        {turn.evaluation && (
                          <div className="mt-4 pt-3.5 border-t border-[#ECE8DF] dark:border-[#2A303B] space-y-2.5">
                            <p className="text-xs text-[#3B404A] dark:text-[#C4C9D4]">
                              {turn.evaluation.pronunciationSummary}
                            </p>
                            {turn.evaluation.correctedJapanese && (
                              <div className="flex items-center justify-between gap-3 bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 rounded-lg">
                                <div className="text-xs">
                                  <span className="text-[#5A606B] dark:text-[#9BA1AE]">{p.suggestedNatural} </span>
                                  <span className="font-jp font-medium text-[#1A1D21] dark:text-[#F2EFE9]">
                                    {turn.evaluation.correctedJapanese}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => playSenseiLine(turn.evaluation!.correctedJapanese)}
                                  aria-label={p.suggestedNatural}
                                  className="p-1.5 text-[#1E3A5F] dark:text-[#7FAEE3] hover:text-[#C9372C] cursor-pointer"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                            <ul className="space-y-1.5">
                              {turn.evaluation.pronunciationDetails.map((d, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs">
                                  {d.status === 'correcto' ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6F52] dark:text-[#5DC293] shrink-0 mt-0.5" />
                                  ) : (
                                    <AlertCircle className="w-3.5 h-3.5 text-[#C9372C] dark:text-[#F06B60] shrink-0 mt-0.5" />
                                  )}
                                  <span className="text-[#3B404A] dark:text-[#C4C9D4]">
                                    <strong className="font-medium text-[#1A1D21] dark:text-[#F2EFE9]">
                                      {d.aspect}:
                                    </strong>{' '}
                                    {d.feedback}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {oralLoading && <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{p.analyzingOral}</p>}
            </div>

            {oralError && (
              <div className="mx-6 mb-4 p-3 rounded-lg border border-[#C9372C]/40 bg-[#C9372C]/5 text-xs text-[#C9372C] dark:text-[#F06B60]">
                {oralError}
              </div>
            )}

            <div className="p-5 border-t border-[#ECE8DF] dark:border-[#262C36] bg-[#F7F5F0]/60 dark:bg-[#151820] space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={oralLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#C9372C] hover:bg-[#AE2D23] dark:bg-[#D9463B] text-white transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    {p.speakJa}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#1A1D21] dark:bg-[#F2EFE9] text-white dark:text-[#111317] transition-colors cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    {formatT(p.stopAndEvaluate, { sec: recordSeconds })}
                  </button>
                )}
                <span className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                  {isRecording ? p.recordingHint : p.micHint}
                </span>
              </div>

              <form onSubmit={handleTextOralSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={oralInput}
                  onChange={(e) => setOralInput(e.target.value)}
                  placeholder={p.oralInputPlaceholder}
                  className="flex-1 rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-white dark:bg-[#111317] px-3.5 py-2.5 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                />
                <button
                  type="submit"
                  disabled={oralLoading || !oralInput.trim()}
                  aria-label={p.send}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#1E3A5F] hover:bg-[#162C49] dark:bg-[#4978B0] text-white disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {p.send}
                </button>
              </form>
            </div>
          </div>

          <aside className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 space-y-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                {p.oralSettingsTitle}
              </h3>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">{p.oralSettingsSub}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                  {p.scenarioSelectLabel}
                </label>
                <div className="space-y-1.5">
                  {scenarios.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => handleScenarioChange(sc.id)}
                      className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        scenario === sc.id
                          ? 'border-[#C9372C] dark:border-[#E04F44] bg-[#C9372C]/5 text-[#C9372C] dark:text-[#E04F44]'
                          : 'border-[#DFD9CD] dark:border-[#262C36] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#1E3A5F]'
                      }`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                    {p.jlptLevelLabel}
                  </label>
                  <select
                    value={oralLevel}
                    onChange={(e) => setOralLevel(e.target.value as JlptLevel)}
                    className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-xs text-[#1A1D21] dark:text-[#F2EFE9]"
                  >
                    {LEVELS.map((lv) => (
                      <option key={lv} value={lv}>
                        {lv}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                    {p.voicePaceLabel}
                  </label>
                  <select
                    value={pace}
                    onChange={(e) => setPace(e.target.value as 'slow' | 'natural')}
                    className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-xs text-[#1A1D21] dark:text-[#F2EFE9]"
                  >
                    <option value="slow">{p.paceOptionSlow}</option>
                    <option value="natural">{p.paceOptionNatural}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                  {p.voiceTimbreLabel}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'Kore', label: 'Haruka' },
                      { id: 'Puck', label: 'Kenji' },
                      { id: 'Zephyr', label: 'Aoi' },
                    ] as const
                  ).map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVoiceName(v.id)}
                      className={`py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        voiceName === v.id
                          ? 'border-[#1E3A5F] dark:border-[#7FAEE3] bg-[#1E3A5F]/10 text-[#1E3A5F] dark:text-[#7FAEE3]'
                          : 'border-[#DFD9CD] dark:border-[#262C36] text-[#5A606B] dark:text-[#9BA1AE]'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#ECE8DF] dark:border-[#262C36] text-xs text-[#5A606B] dark:text-[#9BA1AE] space-y-1.5">
              <p className="font-medium text-[#1A1D21] dark:text-[#F2EFE9]">{p.phoneticTipTitle}</p>
              <p>{p.phoneticTipBody}</p>
            </div>
          </aside>
        </div>
      )}

      {mode === 'srs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5A606B] dark:text-[#9BA1AE]">
              <span>
                {formatT(p.cardCounter, { cur: srsCards.length ? srsIndex + 1 : 0, total: srsCards.length })}{' '}
                <span aria-hidden="true">·</span> {p.sessionStreak}{' '}
                <strong className="font-mono-num text-[#1A1D21] dark:text-[#F2EFE9]">{srsCombo}</strong>{' '}
                <span aria-hidden="true">·</span>{' '}
                <strong className="font-mono-num text-[#2E6F52] dark:text-[#5DC293]">+{srsSessionXp} XP</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowNewCardForm((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#C9372C] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {p.addCardBtn}
              </button>
            </div>

            {showNewCardForm && (
              <form
                onSubmit={handleAddCustomCard}
                className="p-5 rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <input
                  required
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder={p.newFrontPlaceholder}
                  className="rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                />
                <input
                  required
                  value={newReading}
                  onChange={(e) => setNewReading(e.target.value)}
                  placeholder={p.newReadingPlaceholder}
                  className="rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                />
                <input
                  required
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder={p.newBackPlaceholder}
                  className="rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                />
                <div className="flex gap-2">
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as JlptLevel)}
                    className="rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                  >
                    {LEVELS.map((lv) => (
                      <option key={lv} value={lv}>
                        {lv}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-[#1E3A5F] text-white cursor-pointer"
                  >
                    {p.saveCardBtn}
                  </button>
                </div>
              </form>
            )}

            {srsLoading ? (
              <div className="py-20 text-center text-sm text-[#5A606B] dark:text-[#9BA1AE]">{p.loadingDeck}</div>
            ) : activeCard ? (
              <div className="rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-8 sm:p-12 min-h-[340px] flex flex-col justify-between text-center">
                <div className="flex items-center justify-between text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                  <span>
                    {activeCard.jlptLevel} <span aria-hidden="true">·</span> {activeCard.cardType}
                  </span>
                  <button
                    type="button"
                    onClick={() => playSenseiLine(activeCard.front)}
                    className="inline-flex items-center gap-1.5 text-[#1E3A5F] dark:text-[#7FAEE3] hover:text-[#C9372C] cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    {p.listenCard}
                  </button>
                </div>

                <div className="py-10 space-y-4">
                  <p className="font-jp-serif text-5xl sm:text-6xl font-medium text-[#1A1D21] dark:text-[#F2EFE9]">
                    {activeCard.front}
                  </p>
                  {flipped ? (
                    <div className="space-y-2 pt-4 border-t border-[#ECE8DF] dark:border-[#262C36] max-w-md mx-auto">
                      <p className="font-jp text-lg text-[#C9372C] dark:text-[#E04F44]">{activeCard.reading}</p>
                      <p className="text-base font-medium text-[#1A1D21] dark:text-[#F2EFE9]">{activeCard.back}</p>
                      {activeCard.hint && (
                        <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{activeCard.hint}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{p.revealHint}</p>
                  )}
                </div>

                <div>
                  {!flipped ? (
                    <button
                      type="button"
                      onClick={() => setFlipped(true)}
                      className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#1E3A5F] hover:bg-[#162C49] dark:bg-[#4978B0] text-white transition-colors cursor-pointer"
                    >
                      {p.showAnswer}
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleRateCard(1)}
                        className="py-2.5 px-3 rounded-lg border border-[#C9372C]/40 text-xs font-medium text-[#C9372C] dark:text-[#F06B60] hover:bg-[#C9372C]/10 cursor-pointer"
                      >
                        {p.rateAgain}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRateCard(3)}
                        className="py-2.5 px-3 rounded-lg border border-[#B06D22]/40 text-xs font-medium text-[#8C5416] dark:text-[#E0A765] hover:bg-[#B06D22]/10 cursor-pointer"
                      >
                        {p.rateHard}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRateCard(4)}
                        className="py-2.5 px-3 rounded-lg border border-[#1E3A5F]/40 text-xs font-medium text-[#1E3A5F] dark:text-[#7FAEE3] hover:bg-[#1E3A5F]/10 cursor-pointer"
                      >
                        {p.rateGood}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRateCard(5)}
                        className="py-2.5 px-3 rounded-lg border border-[#2E6F52]/40 text-xs font-medium text-[#2E6F52] dark:text-[#5DC293] hover:bg-[#2E6F52]/10 cursor-pointer"
                      >
                        {p.rateEasy}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-10 text-center rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36]">
                <p className="text-sm text-[#5A606B] dark:text-[#9BA1AE]">{p.noCards}</p>
              </div>
            )}

            {srsFeedback && <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{srsFeedback}</p>}
          </div>

          <aside className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 space-y-4">
            <h3 className="font-display text-xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">{p.sm2Title}</h3>
            <p className="text-xs text-[#4A505A] dark:text-[#B3B8C4] leading-relaxed">{p.sm2Desc}</p>
            <div className="pt-3 border-t border-[#ECE8DF] dark:border-[#262C36] space-y-2 text-xs text-[#5A606B] dark:text-[#9BA1AE]">
              <p>
                {p.totalDeck}{' '}
                <strong className="font-mono-num text-[#1A1D21] dark:text-[#F2EFE9]">{srsCards.length}</strong>
              </p>
              <p>
                {p.deckStateLabel}{' '}
                <strong className="text-[#1A1D21] dark:text-[#F2EFE9]">
                  {srsGuest ? p.deckGuestState : p.deckSyncedState}
                </strong>
              </p>
            </div>
            {srsGuest && (
              <button
                type="button"
                onClick={onRequireAuth}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-medium bg-[#C9372C] text-white cursor-pointer"
              >
                {p.signInToSaveDeck}
              </button>
            )}
          </aside>
        </div>
      )}

      {mode === 'escritura' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                  {p.scripts[scriptType]} <span aria-hidden="true">·</span> {currentChar.strokes} {p.strokesSuffix}{' '}
                  <span aria-hidden="true">·</span> {p.readingLabel} {currentChar.reading}
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                  {p.targetCharLabel}{' '}
                  <span className="font-jp-serif text-[#C9372C] dark:text-[#E04F44]">{currentChar.char}</span> (
                  {currentChar.meaning})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => playSenseiLine(currentChar.char)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#DFD9CD] dark:border-[#2C323E] text-[#1E3A5F] dark:text-[#7FAEE3] cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                {p.listenChar}
              </button>
            </div>

            <div className="relative mx-auto w-full max-w-[360px] aspect-square rounded-xl border-2 border-[#1A1D21]/20 dark:border-[#DFD9CD]/30 bg-[#FBF9F5] overflow-hidden touch-none select-none">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 360" aria-hidden="true">
                <line x1="180" y1="0" x2="180" y2="360" stroke="#C9372C" strokeOpacity="0.22" strokeDasharray="6 6" />
                <line x1="0" y1="180" x2="360" y2="180" stroke="#C9372C" strokeOpacity="0.22" strokeDasharray="6 6" />
              </svg>

              {showGuide && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center pointer-events-none font-jp-serif text-[220px] leading-none text-[#1A1D21]/12 select-none"
                >
                  {currentChar.char}
                </div>
              )}

              <canvas
                ref={canvasRef}
                width={360}
                height={360}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="relative z-10 w-full h-full cursor-crosshair"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-[#DFD9CD] dark:border-[#2C323E] text-[#1A1D21] dark:text-[#F2EFE9] cursor-pointer"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  {p.clearCanvas}
                </button>
                <button
                  type="button"
                  onClick={() => setShowGuide((v) => !v)}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium border border-[#DFD9CD] dark:border-[#2C323E] text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9] cursor-pointer"
                >
                  {showGuide ? p.hideGuide : p.showGuide}
                </button>
              </div>

              <button
                type="button"
                onClick={handleEvaluateWriting}
                disabled={writingLoading || !hasStrokes}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-[#C9372C] hover:bg-[#AE2D23] dark:bg-[#D9463B] text-white disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {writingLoading ? p.evaluatingStroke : p.evaluateStrokeBtn}
              </button>
            </div>

            {writingError && <p className="text-xs text-[#C9372C] dark:text-[#F06B60]">{writingError}</p>}

            {writingEval && (
              <div className="p-4 rounded-xl bg-[#F7F5F0] dark:bg-[#111317] space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">{writingEval.verdict}</p>
                  <span className="font-mono-num text-sm font-semibold text-[#2E6F52] dark:text-[#5DC293]">
                    {writingEval.score}/100
                  </span>
                </div>
                <ul className="space-y-1 text-xs text-[#3B404A] dark:text-[#C4C9D4]">
                  {writingEval.strokeFeedback.map((tip, idx) => (
                    <li key={idx}>· {tip}</li>
                  ))}
                </ul>
                <p className="text-xs text-[#1E3A5F] dark:text-[#7FAEE3] pt-1">{writingEval.encouragement}</p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 space-y-5">
            <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[#ECE8DF] dark:bg-[#111317]">
              {(['hiragana', 'katakana', 'kanji'] as const).map((scType) => (
                <button
                  key={scType}
                  type="button"
                  onClick={() => {
                    setScriptType(scType);
                    setSelectedCharIdx(0);
                  }}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    scriptType === scType
                      ? 'bg-white dark:bg-[#22262F] text-[#1A1D21] dark:text-[#F2EFE9] shadow-xs'
                      : 'text-[#5A606B] dark:text-[#9BA1AE]'
                  }`}
                >
                  {p.scripts[scType]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {currentCharList.map((item, idx) => (
                <button
                  key={item.char}
                  type="button"
                  onClick={() => setSelectedCharIdx(idx)}
                  className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                    selectedCharIdx === idx
                      ? 'border-[#C9372C] dark:border-[#E04F44] bg-[#C9372C]/5'
                      : 'border-[#DFD9CD] dark:border-[#262C36] hover:border-[#1E3A5F]'
                  }`}
                >
                  <span className="block font-jp-serif text-2xl text-[#1A1D21] dark:text-[#F2EFE9]">
                    {item.char}
                  </span>
                  <span className="block text-[11px] text-[#5A606B] dark:text-[#9BA1AE] mt-0.5 truncate">
                    {item.reading}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#ECE8DF] dark:border-[#262C36] text-xs text-[#5A606B] dark:text-[#9BA1AE] space-y-1">
              <p className="font-medium text-[#1A1D21] dark:text-[#F2EFE9]">{p.strokeRuleTitle}</p>
              <p>{p.strokeRuleBody}</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
