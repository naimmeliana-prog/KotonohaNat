import { BookOpen, Sparkles, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { api, playBase64Audio } from '../lib/api';

interface KanaCell {
  kana: string;
  romaji: string;
  mnemonic?: string;
  exampleWord?: string;
  exampleMeaning?: string;
}

const BASIC_ROWS: (KanaCell | null)[][] = [
  [
    { kana: 'あ', romaji: 'a', mnemonic: 'Como un atún con una espada', exampleWord: 'あめ (ame)', exampleMeaning: 'lluvia' },
    { kana: 'い', romaji: 'i', mnemonic: 'Como dos líneas de un insecto', exampleWord: 'いぬ (inu)', exampleMeaning: 'perro' },
    { kana: 'う', romaji: 'u', mnemonic: 'Como una uña de perfil', exampleWord: 'うみ (umi)', exampleMeaning: 'mar' },
    { kana: 'え', romaji: 'e', mnemonic: 'Como alguien empujando', exampleWord: 'えき (eki)', exampleMeaning: 'estación' },
    { kana: 'お', romaji: 'o', mnemonic: 'Como un orangután', exampleWord: 'おと (oto)', exampleMeaning: 'sonido' },
  ],
  [
    { kana: 'か', romaji: 'ka', mnemonic: 'Como una carta doblada', exampleWord: 'かさ (kasa)', exampleMeaning: 'paraguas' },
    { kana: 'き', romaji: 'ki', mnemonic: 'Como un kimono o llave', exampleWord: 'きもの (kimono)', exampleMeaning: 'kimono' },
    { kana: 'く', romaji: 'ku', mnemonic: 'Como el arco de Cupido', exampleWord: 'くち (kuchi)', exampleMeaning: 'boca' },
    { kana: 'け', romaji: 'ke', mnemonic: 'Como leña quemándose', exampleWord: 'けさ (kesa)', exampleMeaning: 'esta mañana' },
    { kana: 'こ', romaji: 'ko', mnemonic: 'Como una boca abierta comiendo', exampleWord: 'こえ (koe)', exampleMeaning: 'voz' },
  ],
  [
    { kana: 'さ', romaji: 'sa', mnemonic: 'Como alguien saltando', exampleWord: 'さかな (sakana)', exampleMeaning: 'pez' },
    { kana: 'し', romaji: 'shi', mnemonic: 'Como la cola de una sirena', exampleWord: 'しお (shio)', exampleMeaning: 'sal' },
    { kana: 'す', romaji: 'su', mnemonic: 'Como subir un escalón', exampleWord: 'すし (sushi)', exampleMeaning: 'sushi' },
    { kana: 'せ', romaji: 'se', mnemonic: 'Como un señor con sombrero', exampleWord: 'せかい (sekai)', exampleMeaning: 'mundo' },
    { kana: 'そ', romaji: 'so', mnemonic: 'Como un soldado de perfil', exampleWord: 'そら (sora)', exampleMeaning: 'cielo' },
  ],
  [
    { kana: 'た', romaji: 'ta', mnemonic: 'Como tocar el tambor', exampleWord: 'たこ (tako)', exampleMeaning: 'pulpo' },
    { kana: 'ち', romaji: 'chi', mnemonic: 'Como reírse de un chiste', exampleWord: 'ちず (chizu)', exampleMeaning: 'mapa' },
    { kana: 'つ', romaji: 'tsu', mnemonic: 'Como una ola de tsunami', exampleWord: 'つき (tsuki)', exampleMeaning: 'luna' },
    { kana: 'て', romaji: 'te', mnemonic: 'Como el asa de una tetera', exampleWord: 'てがみ (tegami)', exampleMeaning: 'carta' },
    { kana: 'と', romaji: 'to', mnemonic: 'Como una tortuga marina', exampleWord: 'とけい (tokei)', exampleMeaning: 'reloj' },
  ],
  [
    { kana: 'な', romaji: 'na', mnemonic: 'Como una nana cuidando al bebé', exampleWord: 'なつ (natsu)', exampleMeaning: 'verano' },
    { kana: 'に', romaji: 'ni', mnemonic: 'Como un pájaro junto a su nido', exampleWord: 'にく (niku)', exampleMeaning: 'carne' },
    { kana: 'ぬ', romaji: 'nu', mnemonic: 'Como un nudo enrollado', exampleWord: 'ぬの (nuno)', exampleMeaning: 'tela' },
    { kana: 'ね', romaji: 'ne', mnemonic: 'Como el tridente de Neptuno', exampleWord: 'ねこ (neko)', exampleMeaning: 'gato' },
    { kana: 'の', romaji: 'no', mnemonic: 'Como una señal de no fumar', exampleWord: 'のり (nori)', exampleMeaning: 'alga nori' },
  ],
  [
    { kana: 'は', romaji: 'ha', mnemonic: 'Como flores en un jardín', exampleWord: 'はな (hana)', exampleMeaning: 'flor' },
    { kana: 'ひ', romaji: 'hi', mnemonic: 'Como la cara de una jirafa', exampleWord: 'ひと (hito)', exampleMeaning: 'persona' },
    { kana: 'ふ', romaji: 'fu', mnemonic: 'Como un abuelo fumando pipa', exampleWord: 'ふね (fune)', exampleMeaning: 'barco' },
    { kana: 'へ', romaji: 'he', mnemonic: 'Como las cejas de un jefe gruñón', exampleWord: 'へや (heya)', exampleMeaning: 'habitación' },
    { kana: 'ほ', romaji: 'ho', mnemonic: 'Como la letra Jota adornada', exampleWord: 'ほし (hoshi)', exampleMeaning: 'estrella' },
  ],
  [
    { kana: 'ま', romaji: 'ma', mnemonic: 'Como el mástil de un barco', exampleWord: 'まど (mado)', exampleMeaning: 'ventana' },
    { kana: 'み', romaji: 'mi', mnemonic: 'Como una abejita buscando miel', exampleWord: 'みず (mizu)', exampleMeaning: 'agua' },
    { kana: 'む', romaji: 'mu', mnemonic: 'Como el perfil de una mujer', exampleWord: 'むし (mushi)', exampleMeaning: 'insecto' },
    { kana: 'め', romaji: 'me', mnemonic: 'Como medio nudo sin lazo', exampleWord: 'めがね (megane)', exampleMeaning: 'gafas' },
    { kana: 'も', romaji: 'mo', mnemonic: 'Como un monstruo con brazos', exampleWord: 'もり (mori)', exampleMeaning: 'bosque' },
  ],
  [
    { kana: 'や', romaji: 'ya', mnemonic: 'Como un paraguas bajo la lluvia', exampleWord: 'やま (yama)', exampleMeaning: 'montaña' },
    null,
    { kana: 'ゆ', romaji: 'yu', mnemonic: 'Como una araña viuda negra', exampleWord: 'ゆき (yuki)', exampleMeaning: 'nieve' },
    null,
    { kana: 'よ', romaji: 'yo', mnemonic: 'Como la cabina de un camión', exampleWord: 'よる (yoru)', exampleMeaning: 'noche' },
  ],
  [
    { kana: 'ら', romaji: 'ra', mnemonic: 'Como la concha de un caracol', exampleWord: 'らいねん (rainen)', exampleMeaning: 'próximo año' },
    { kana: 'り', romaji: 'ri', mnemonic: 'Como dos hojas de zanahoria', exampleWord: 'りんご (ringo)', exampleMeaning: 'manzana' },
    { kana: 'る', romaji: 'ru', mnemonic: 'Como Caperucita Roja', exampleWord: 'るす (rusu)', exampleMeaning: 'ausencia' },
    { kana: 'れ', romaji: 're', mnemonic: 'Como un relámpago', exampleWord: 'れきし (rekishi)', exampleMeaning: 'historia' },
    { kana: 'ろ', romaji: 'ro', mnemonic: 'Como un pájaro volando', exampleWord: 'ろく (roku)', exampleMeaning: 'seis' },
  ],
  [
    { kana: 'わ', romaji: 'wa', mnemonic: 'Como ondas en el agua', exampleWord: 'わたし (watashi)', exampleMeaning: 'yo' },
    null,
    null,
    null,
    { kana: 'を', romaji: 'wo (o)', mnemonic: 'Como saltar a la piscina', exampleWord: 'みずをのむ', exampleMeaning: 'partícula de objeto' },
  ],
  [
    { kana: 'ん', romaji: 'n', mnemonic: 'Como tomar una malteada (mmm)', exampleWord: 'ほん (hon)', exampleMeaning: 'libro' },
    null,
    null,
    null,
    null,
  ],
];
const DAKUTEN_ROWS: KanaCell[][] = [
  [
    { kana: 'が', romaji: 'ga' },
    { kana: 'ぎ', romaji: 'gi (gui)' },
    { kana: 'ぐ', romaji: 'gu' },
    { kana: 'げ', romaji: 'ge (gue)' },
    { kana: 'ご', romaji: 'go' },
  ],
  [
    { kana: 'ざ', romaji: 'za' },
    { kana: 'じ', romaji: 'ji (yi)' },
    { kana: 'ず', romaji: 'zu' },
    { kana: 'ぜ', romaji: 'ze' },
    { kana: 'ぞ', romaji: 'zo' },
  ],
  [
    { kana: 'だ', romaji: 'da' },
    { kana: 'ぢ', romaji: 'ji' },
    { kana: 'づ', romaji: 'zu' },
    { kana: 'で', romaji: 'de' },
    { kana: 'ど', romaji: 'do' },
  ],
  [
    { kana: 'ば', romaji: 'ba' },
    { kana: 'び', romaji: 'bi' },
    { kana: 'ぶ', romaji: 'bu' },
    { kana: 'べ', romaji: 'be' },
    { kana: 'ぼ', romaji: 'bo' },
  ],
  [
    { kana: 'ぱ', romaji: 'pa' },
    { kana: 'ぴ', romaji: 'pi' },
    { kana: 'ぷ', romaji: 'pu' },
    { kana: 'ぺ', romaji: 'pe' },
    { kana: 'ぽ', romaji: 'po' },
  ],
];

const YOON_ROWS: KanaCell[][] = [
  [{ kana: 'きゃ', romaji: 'kya' }, { kana: 'きゅ', romaji: 'kyu' }, { kana: 'きょ', romaji: 'kyo' }],
  [{ kana: 'しゃ', romaji: 'sha' }, { kana: 'しゅ', romaji: 'shu' }, { kana: 'しょ', romaji: 'sho' }],
  [{ kana: 'ちゃ', romaji: 'cha' }, { kana: 'ちゅ', romaji: 'chu' }, { kana: 'ちょ', romaji: 'cho' }],
  [{ kana: 'にゃ', romaji: 'nya' }, { kana: 'にゅ', romaji: 'nyu' }, { kana: 'にょ', romaji: 'nyo' }],
  [{ kana: 'ひゃ', romaji: 'hya' }, { kana: 'ひゅ', romaji: 'hyu' }, { kana: 'ひょ', romaji: 'hyo' }],
  [{ kana: 'みゃ', romaji: 'mya' }, { kana: 'みゅ', romaji: 'myu' }, { kana: 'みょ', romaji: 'myo' }],
  [{ kana: 'りゃ', romaji: 'rya' }, { kana: 'りゅ', romaji: 'ryu' }, { kana: 'りょ', romaji: 'ryo' }],
  [{ kana: 'ぎゃ', romaji: 'gya' }, { kana: 'ぎゅ', romaji: 'gyu' }, { kana: 'ぎょ', romaji: 'gyo' }],
  [{ kana: 'じゃ', romaji: 'ja' }, { kana: 'じゅ', romaji: 'ju' }, { kana: 'じょ', romaji: 'jo' }],
  [{ kana: 'びゃ', romaji: 'bya' }, { kana: 'びゅ', romaji: 'byu' }, { kana: 'びょ', romaji: 'byo' }],
  [{ kana: 'ぴゃ', romaji: 'pya' }, { kana: 'ぴゅ', romaji: 'pyu' }, { kana: 'ぴょ', romaji: 'pyo' }],
];

interface HiraganaViewProps {
  onGoToWritingPractice?: () => void;
}

export function HiraganaView({ onGoToWritingPractice }: HiraganaViewProps) {
  const { lang } = useLanguage();
  const isJa = lang === 'ja';

  const [tab, setTab] = useState<'basic' | 'dakuten' | 'yoon' | 'rules'>('basic');
  const [selected, setSelected] = useState<KanaCell>(BASIC_ROWS.at(0)?.at(0) as KanaCell);
  const [playingKana, setPlayingKana] = useState<string | null>(null);

  const handleSpeak = async (cell: KanaCell) => {
    setSelected(cell);
    setPlayingKana(cell.kana);
    try {
      const tts = await api.synthesizeSpeech(cell.kana, 'Puck', 'slow');
      await playBase64Audio(tts.audioBase64, tts.mimeType);
    } catch {
      // Silencio si el usuario pulsa muy rápido
    } finally {
      setPlayingKana(null);
    }
  };
  return (
    <div className="pb-16 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFD9CD] dark:border-[#252A34] pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C9372C] dark:text-[#E04F44]">
            <BookOpen className="w-3.5 h-3.5" />
            {isJa ? 'ひらがな基本表' : 'Silabario Fundamental · ひらがな'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-1">
            {isJa ? 'ひらがな・発音テーブル' : 'Tabla Interactiva de Hiragana'}
          </h1>
          <p className="text-sm text-[#5A606B] dark:text-[#9BA1AE] mt-1 max-w-2xl">
            {isJa
              ? '文字をクリックするとネイティブ発音と覚え方が表示されます。'
              : 'Pulsa cualquier símbolo para escuchar su pronunciación nativa, ver su equivalencia en romaji y descubrir su truco visual para memorizarlo.'}
          </p>
        </div>

        {onGoToWritingPractice && (
          <button
            type="button"
            onClick={onGoToWritingPractice}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9372C] hover:bg-[#AE2D23] text-white text-sm font-medium transition-colors cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            {isJa ? '書き取り練習へ' : 'Practicar trazos en lienzo'}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'basic', label: isJa ? '清音 (46文字)' : '1. Sonidos Puros (46)' },
          { id: 'dakuten', label: isJa ? '濁音・半濁音' : '2. Tenten y Maru (が・ぱ)' },
          { id: 'yoon', label: isJa ? '拗音 (きゃ・しゃ)' : '3. Combinaciones (きゃ・しゃ)' },
          { id: 'rules', label: isJa ? '発音と助詞のルール' : '4. Reglas y Partículas' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              tab === item.id
                ? 'bg-[#1A1D21] dark:bg-[#F2EFE9] text-white dark:text-[#111317]'
                : 'bg-[#ECE8DF] dark:bg-[#191C22] text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab !== 'rules' && selected && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#171A21] border border-[#DFD9CD] dark:border-[#252A34] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => handleSpeak(selected)}
              className="w-20 h-20 rounded-2xl bg-[#F7F5F0] dark:bg-[#1E222B] border border-[#DFD9CD] dark:border-[#2C323E] flex flex-col items-center justify-center hover:border-[#C9372C] transition-colors cursor-pointer"
            >
              <span className="text-4xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">{selected.kana}</span>
              <span className="text-xs font-mono text-[#C9372C] dark:text-[#E04F44] mt-0.5">{selected.romaji}</span>
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                  {selected.kana} = <span className="text-[#C9372C] dark:text-[#E04F44]">{selected.romaji}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSpeak(selected)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ECE8DF] dark:bg-[#232833] text-xs font-medium text-[#1A1D21] dark:text-[#F2EFE9] hover:bg-[#DFD9CD] cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#C9372C]" />
                  {playingKana === selected.kana ? '...' : isJa ? '再生' : 'Escuchar'}
                </button>
              </div>
              {selected.mnemonic && (
                <p className="text-sm text-[#5A606B] dark:text-[#9BA1AE]">
                  <strong className="text-[#1A1D21] dark:text-[#F2EFE9]">Truco visual:</strong> {selected.mnemonic}
                </p>
              )}
              {selected.exampleWord && (
                <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                  <strong>Ejemplo:</strong> {selected.exampleWord} — {selected.exampleMeaning}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'basic' && (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center text-xs font-semibold text-[#5A606B] dark:text-[#9BA1AE] px-1">
            <span>A</span>
            <span>I</span>
            <span>U</span>
            <span>E</span>
            <span>O</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {BASIC_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-5 gap-2 sm:gap-3">
                {row.map((cell, cIdx) =>
                  cell ? (
                    <button
                      key={cell.kana}
                      type="button"
                      onClick={() => handleSpeak(cell)}
                      className={`p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        selected.kana === cell.kana
                          ? 'bg-[#C9372C]/10 border-[#C9372C] dark:border-[#E04F44]'
                          : 'bg-white dark:bg-[#171A21] border-[#DFD9CD] dark:border-[#252A34] hover:border-[#C9372C]/60'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                        {cell.kana}
                      </span>
                      <span className="text-xs font-mono text-[#5A606B] dark:text-[#9BA1AE] mt-1">
                        {cell.romaji}
                      </span>
                    </button>
                  ) : (
                    <div
                      key={cIdx}
                      className="p-3 sm:p-4 rounded-xl border border-dashed border-[#DFD9CD]/50 dark:border-[#252A34]/50"
                    />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'dakuten' && (
        <div className="space-y-4">
          <p className="text-sm text-[#5A606B] dark:text-[#9BA1AE]">
            En japonés, las dos comillas (<strong>゛ ten-ten</strong>) y el círculo (<strong>゜ maru</strong>) suavizan o transforman el sonido de las filas K, S, T y H. Recuerda: <strong>gi</strong> y <strong>ge</strong> suenan como <em>gui</em> y <em>gue</em> en español.
          </p>
          <div className="space-y-2 sm:space-y-3">
            {DAKUTEN_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-5 gap-2 sm:gap-3">
                {row.map((cell) => (
                  <button
                    key={cell.kana}
                    type="button"
                    onClick={() => handleSpeak(cell)}
                    className={`p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selected.kana === cell.kana
                        ? 'bg-[#C9372C]/10 border-[#C9372C]'
                        : 'bg-white dark:bg-[#171A21] border-[#DFD9CD] dark:border-[#252A34] hover:border-[#C9372C]/60'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                      {cell.kana}
                    </span>
                    <span className="text-xs font-mono text-[#5A606B] dark:text-[#9BA1AE] mt-1">{cell.romaji}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'yoon' && (
        <div className="space-y-4">
          <p className="text-sm text-[#5A606B] dark:text-[#9BA1AE]">
            Se forman uniendo una sílaba terminada en <strong>i</strong> con <strong>ゃ (ya), ゅ (yu) o ょ (yo)</strong> en tamaño pequeño. Se pronuncian en un solo golpe de voz.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {YOON_ROWS.map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2">
                {row.map((cell) => (
                  <button
                    key={cell.kana}
                    type="button"
                    onClick={() => handleSpeak(cell)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selected.kana === cell.kana
                        ? 'bg-[#C9372C]/10 border-[#C9372C]'
                        : 'bg-white dark:bg-[#171A21] border-[#DFD9CD] dark:border-[#252A34] hover:border-[#C9372C]/60'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                      {cell.kana}
                    </div>
                    <div className="text-xs font-mono text-[#5A606B] dark:text-[#9BA1AE] mt-0.5">{cell.romaji}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

            {tab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#171A21] border border-[#DFD9CD] dark:border-[#252A34] space-y-2">
            <h3 className="font-semibold text-base text-[#1A1D21] dark:text-[#F2EFE9]">
              1. Partículas con lectura especial (は・へ・を)
            </h3>
            <ul className="text-sm text-[#5A606B] dark:text-[#9BA1AE] space-y-1.5 list-disc pl-5">
              <li>
                <strong>は (ha) → se lee «wa»</strong> cuando marca el tema de la oración (ej. わたし<strong>は</strong>).
              </li>
              <li>
                <strong>へ (he) → se lee «e»</strong> cuando indica dirección hacia un lugar (ej. がっこう<strong>へ</strong>).
              </li>
              <li>
                <strong>を (wo) → se lee «o»</strong> cuando marca el objeto directo (ej. みず<strong>を</strong>のみます).
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#171A21] border border-[#DFD9CD] dark:border-[#252A34] space-y-2">
            <h3 className="font-semibold text-base text-[#1A1D21] dark:text-[#F2EFE9]">
              2. Doble consonante (っ pequeña) y vocales largas
            </h3>
            <ul className="text-sm text-[#5A606B] dark:text-[#9BA1AE] space-y-1.5 list-disc pl-5">
              <li>
                <strong>っ (tsu pequeña):</strong> Duplica la consonante siguiente haciendo una breve pausa (ej. き<strong>っ</strong>て = <em>kitte</em>, sello).
              </li>
              <li>
                <strong>Vocales alargadas:</strong> La <strong>o</strong> se alarga con <strong>う</strong> (ひこ<strong>う</strong>き = <em>hikōki</em>) y la <strong>e</strong> con <strong>い</strong> (とけ<strong>い</strong> = <em>tokei</em>).
              </li>
              <li>
                <strong>Sonidos diferentes:</strong> No existen <em>si, ti, tu</em>; en su lugar se usan <strong>し (shi), ち (chi), つ (tsu)</strong>.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
