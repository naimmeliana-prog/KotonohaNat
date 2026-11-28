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

const HIRAGANA_BASIC_ROWS: (KanaCell | null)[][] = [
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
const HIRAGANA_DAKUTEN_ROWS: KanaCell[][] = [
  [{ kana: 'が', romaji: 'ga' }, { kana: 'ぎ', romaji: 'gi (gui)' }, { kana: 'ぐ', romaji: 'gu' }, { kana: 'げ', romaji: 'ge (gue)' }, { kana: 'ご', romaji: 'go' }],
  [{ kana: 'ざ', romaji: 'za' }, { kana: 'じ', romaji: 'ji (yi)' }, { kana: 'ず', romaji: 'zu' }, { kana: 'ぜ', romaji: 'ze' }, { kana: 'ぞ', romaji: 'zo' }],
  [{ kana: 'だ', romaji: 'da' }, { kana: 'ぢ', romaji: 'ji' }, { kana: 'づ', romaji: 'zu' }, { kana: 'で', romaji: 'de' }, { kana: 'ど', romaji: 'do' }],
  [{ kana: 'ば', romaji: 'ba' }, { kana: 'び', romaji: 'bi' }, { kana: 'ぶ', romaji: 'bu' }, { kana: 'べ', romaji: 'be' }, { kana: 'ぼ', romaji: 'bo' }],
  [{ kana: 'ぱ', romaji: 'pa' }, { kana: 'ぴ', romaji: 'pi' }, { kana: 'ぷ', romaji: 'pu' }, { kana: 'ぺ', romaji: 'pe' }, { kana: 'ぽ', romaji: 'po' }],
];

const HIRAGANA_YOON_ROWS: KanaCell[][] = [
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

const KATAKANA_BASIC_ROWS: (KanaCell | null)[][] = [
  [
    { kana: 'ア', romaji: 'a', mnemonic: 'Como un hacha afilada (Axe)', exampleWord: 'アイス (aisu)', exampleMeaning: 'helado' },
    { kana: 'イ', romaji: 'i', mnemonic: 'Como un caballete inclinado', exampleWord: 'インド (indo)', exampleMeaning: 'India' },
    { kana: 'ウ', romaji: 'u', mnemonic: 'Igual que う pero con trazos rectos', exampleWord: 'ウイルス (uirusu)', exampleMeaning: 'virus' },
    { kana: 'エ', romaji: 'e', mnemonic: 'Como una viga en forma de I', exampleWord: 'エアコン (eakon)', exampleMeaning: 'aire acondicionado' },
    { kana: 'オ', romaji: 'o', mnemonic: 'Como un cantante de Ópera', exampleWord: 'オレンジ (orenji)', exampleMeaning: 'naranja' },
  ],
  [
    { kana: 'カ', romaji: 'ka', mnemonic: 'Igual que か pero sin el trazo derecho', exampleWord: 'カメラ (kamera)', exampleMeaning: 'cámara' },
    { kana: 'キ', romaji: 'ki', mnemonic: 'Como el mango de una llave (Key)', exampleWord: 'キロ (kiro)', exampleMeaning: 'kilo' },
    { kana: 'ク', romaji: 'ku', mnemonic: 'Como el pico de un cuervo', exampleWord: 'クラス (kurasu)', exampleMeaning: 'clase' },
    { kana: 'ケ', romaji: 'ke', mnemonic: 'Como una K abierta hacia la izquierda', exampleWord: 'ケーキ (kēki)', exampleMeaning: 'pastel' },
    { kana: 'コ', romaji: 'ko', mnemonic: 'Como dos esquinas cuadradas (Corner)', exampleWord: 'コーヒー (kōhī)', exampleMeaning: 'café' },
  ],
  [
    { kana: 'サ', romaji: 'sa', mnemonic: 'Como una silla de montar', exampleWord: 'サラダ (sarada)', exampleMeaning: 'ensalada' },
    { kana: 'シ', romaji: 'shi', mnemonic: 'Una cara sonriente mirando hacia arriba', exampleWord: 'シャツ (shatsu)', exampleMeaning: 'camisa' },
    { kana: 'ス', romaji: 'su', mnemonic: 'Como un esquiador bajando', exampleWord: 'スポーツ (supōtsu)', exampleMeaning: 'deporte' },
    { kana: 'セ', romaji: 'se', mnemonic: 'Igual que せ pero anguloso', exampleWord: 'セーター (sētā)', exampleMeaning: 'suéter' },
    { kana: 'ソ', romaji: 'so', mnemonic: 'Una aguja e hilo cosiendo (Sew)', exampleWord: 'ソファー (sofā)', exampleMeaning: 'sofá' },
  ],
  [
    { kana: 'タ', romaji: 'ta', mnemonic: 'Como el kanji de tarde (夕)', exampleWord: 'タクシー (takushī)', exampleMeaning: 'taxi' },
    { kana: 'チ', romaji: 'chi', mnemonic: 'Como una animadora (Cheerleader)', exampleWord: 'チーズ (chīzu)', exampleMeaning: 'queso' },
    { kana: 'ツ', romaji: 'tsu', mnemonic: 'Dos ojos mirando hacia abajo', exampleWord: 'ツアー (tsuā)', exampleMeaning: 'tour' },
    { kana: 'テ', romaji: 'te', mnemonic: 'Como un poste de teléfono', exampleWord: 'テレビ (terebi)', exampleMeaning: 'televisión' },
    { kana: 'ト', romaji: 'to', mnemonic: 'Como un tótem', exampleWord: 'トイレ (toire)', exampleMeaning: 'baño' },
  ],
  [
    { kana: 'ナ', romaji: 'na', mnemonic: 'Como un cuchillo (Knife) y un tenedor', exampleWord: 'ナイフ (naifu)', exampleMeaning: 'cuchillo' },
    { kana: 'ニ', romaji: 'ni', mnemonic: 'Dos líneas iguales al kanji de dos (二)', exampleWord: 'ニュース (nyūsu)', exampleMeaning: 'noticias' },
    { kana: 'ヌ', romaji: 'nu', mnemonic: 'Como unos palillos sujetando fideos (Noodles)', exampleWord: 'カヌー (kanū)', exampleMeaning: 'canoa' },
    { kana: 'ネ', romaji: 'ne', mnemonic: 'Como un nido en un árbol (Nest)', exampleWord: 'ネクタイ (nekutai)', exampleMeaning: 'corbata' },
    { kana: 'ノ', romaji: 'no', mnemonic: 'Una barra diagonal de prohibido (No)', exampleWord: 'ノート (nōto)', exampleMeaning: 'cuaderno' },
  ],
  [
    { kana: 'ハ', romaji: 'ha', mnemonic: 'Como el bigote de un señor riendo (Ha ha)', exampleWord: 'ハム (hamu)', exampleMeaning: 'jamón' },
    { kana: 'ヒ', romaji: 'hi', mnemonic: 'Como una persona sentada de perfil', exampleWord: 'ヒーター (hītā)', exampleMeaning: 'calefactor' },
    { kana: 'フ', romaji: 'fu', mnemonic: 'Como una bandera ondeando (Flag)', exampleWord: 'フォーク (fōku)', exampleMeaning: 'tenedor' },
    { kana: 'ヘ', romaji: 'he', mnemonic: 'Idéntico al hiragana へ', exampleWord: 'ヘルメット (herumetto)', exampleMeaning: 'casco' },
    { kana: 'ホ', romaji: 'ho', mnemonic: 'Como una cruz sagrada (Holy)', exampleWord: 'ホテル (hoteru)', exampleMeaning: 'hotel' },
  ],
  [
    { kana: 'マ', romaji: 'ma', mnemonic: 'Como las matemáticas geométricas', exampleWord: 'マスク (masuku)', exampleMeaning: 'mascarilla' },
    { kana: 'ミ', romaji: 'mi', mnemonic: 'Tres líneas como tres misiles', exampleWord: 'ミルク (miruku)', exampleMeaning: 'leche' },
    { kana: 'ム', romaji: 'mu', mnemonic: 'Como el hocico de una vaca (Muuu)', exampleWord: 'ゲーム (gēmu)', exampleMeaning: 'videojuego' },
    { kana: 'メ', romaji: 'me', mnemonic: 'Como una espada cruzada', exampleWord: 'メール (mēru)', exampleMeaning: 'correo electrónico' },
    { kana: 'モ', romaji: 'mo', mnemonic: 'Como el hiragana も sin curva arriba', exampleWord: 'モデル (moderu)', exampleMeaning: 'modelo' },
  ],
  [
    { kana: 'ヤ', romaji: 'ya', mnemonic: 'Como un yak con cuernos', exampleWord: 'タイヤ (taiya)', exampleMeaning: 'neumático' },
    null,
    { kana: 'ユ', romaji: 'yu', mnemonic: 'Como el periscopio de un submarino (U-boat)', exampleWord: 'ユニーク (yunīku)', exampleMeaning: 'único' },
    null,
    { kana: 'ヨ', romaji: 'yo', mnemonic: 'Como una E al revés', exampleWord: 'ヨーロッパ (yōroppa)', exampleMeaning: 'Europa' },
  ],
  [
    { kana: 'ラ', romaji: 'ra', mnemonic: 'Como un raptor saltando', exampleWord: 'ラジオ (rajio)', exampleMeaning: 'radio' },
    { kana: 'リ', romaji: 'ri', mnemonic: 'Como dos cañas de río', exampleWord: 'リズム (rizumu)', exampleMeaning: 'ritmo' },
    { kana: 'ル', romaji: 'ru', mnemonic: 'Como las raíces de un árbol (Roots)', exampleWord: 'ルール (rūru)', exampleMeaning: 'regla' },
    { kana: 'レ', romaji: 're', mnemonic: 'Como una pierna corriendo', exampleWord: 'レストラン (resutoran)', exampleMeaning: 'restaurante' },
    { kana: 'ロ', romaji: 'ro', mnemonic: 'Como una boca cuadrada o robot', exampleWord: 'ロボット (robotto)', exampleMeaning: 'robot' },
  ],
  [
    { kana: 'ワ', romaji: 'wa', mnemonic: 'Como una copa de vino (Wine)', exampleWord: 'ワイン (wain)', exampleMeaning: 'vino' },
    null,
    null,
    null,
    { kana: 'ヲ', romaji: 'wo (o)', mnemonic: 'Poco usado en katakana moderno', exampleWord: 'ヲ', exampleMeaning: 'partícula o' },
  ],
  [
    { kana: 'ン', romaji: 'n', mnemonic: 'Un ojo mirando hacia arriba (como シ)', exampleWord: 'パン (pan)', exampleMeaning: 'pan' },
    null,
    null,
    null,
    null,
  ],
];
const KATAKANA_DAKUTEN_ROWS: KanaCell[][] = [
  [{ kana: 'ガ', romaji: 'ga' }, { kana: 'ギ', romaji: 'gi (gui)' }, { kana: 'グ', romaji: 'gu' }, { kana: 'ゲ', romaji: 'ge (gue)' }, { kana: 'ゴ', romaji: 'go' }],
  [{ kana: 'ザ', romaji: 'za' }, { kana: 'ジ', romaji: 'ji (yi)' }, { kana: 'ズ', romaji: 'zu' }, { kana: 'ゼ', romaji: 'ze' }, { kana: 'ゾ', romaji: 'zo' }],
  [{ kana: 'ダ', romaji: 'da' }, { kana: 'ヂ', romaji: 'ji' }, { kana: 'ヅ', romaji: 'zu' }, { kana: 'デ', romaji: 'de' }, { kana: 'ド', romaji: 'do' }],
  [{ kana: 'バ', romaji: 'ba' }, { kana: 'ビ', romaji: 'bi' }, { kana: 'ブ', romaji: 'bu' }, { kana: 'ベ', romaji: 'be' }, { kana: 'ボ', romaji: 'bo' }],
  [{ kana: 'パ', romaji: 'pa' }, { kana: 'ピ', romaji: 'pi' }, { kana: 'プ', romaji: 'pu' }, { kana: 'ペ', romaji: 'pe' }, { kana: 'ポ', romaji: 'po' }],
];

const KATAKANA_YOON_ROWS: KanaCell[][] = [
  [{ kana: 'キャ', romaji: 'kya' }, { kana: 'キュ', romaji: 'kyu' }, { kana: 'キョ', romaji: 'kyo' }],
  [{ kana: 'シャ', romaji: 'sha' }, { kana: 'シュ', romaji: 'shu' }, { kana: 'ショ', romaji: 'sho' }],
  [{ kana: 'チャ', romaji: 'cha' }, { kana: 'チュ', romaji: 'chu' }, { kana: 'チョ', romaji: 'cho' }],
  [{ kana: 'ニャ', romaji: 'nya' }, { kana: 'ニュ', romaji: 'nyu' }, { kana: 'ニョ', romaji: 'nyo' }],
  [{ kana: 'ヒャ', romaji: 'hya' }, { kana: 'ヒュ', romaji: 'hyu' }, { kana: 'ヒョ', romaji: 'hyo' }],
  [{ kana: 'ミャ', romaji: 'mya' }, { kana: 'ミュ', romaji: 'myu' }, { kana: 'ミョ', romaji: 'myo' }],
  [{ kana: 'リャ', romaji: 'rya' }, { kana: 'リュ', romaji: 'ryu' }, { kana: 'リョ', romaji: 'ryo' }],
  [{ kana: 'ギャ', romaji: 'gya' }, { kana: 'ギュ', romaji: 'gyu' }, { kana: 'ギョ', romaji: 'gyo' }],
  [{ kana: 'ジャ', romaji: 'ja' }, { kana: 'ジュ', romaji: 'ju' }, { kana: 'ジョ', romaji: 'jo' }],
  [{ kana: 'ビャ', romaji: 'bya' }, { kana: 'ビュ', romaji: 'byu' }, { kana: 'ビョ', romaji: 'byo' }],
  [{ kana: 'ピャ', romaji: 'pya' }, { kana: 'ピュ', romaji: 'pyu' }, { kana: 'ピョ', romaji: 'pyo' }],
];

interface HiraganaViewProps {
  onGoToWritingPractice?: () => void;
}

export function HiraganaView({ onGoToWritingPractice }: HiraganaViewProps) {
  const { lang } = useLanguage();
  const [scriptType, setScriptType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [selectedCell, setSelectedCell] = useState<KanaCell>(HIRAGANA_BASIC_ROWS[0][0]!);
  const [playingKana, setPlayingKana] = useState<string | null>(null);

  const basicRows = scriptType === 'hiragana' ? HIRAGANA_BASIC_ROWS : KATAKANA_BASIC_ROWS;
  const dakutenRows = scriptType === 'hiragana' ? HIRAGANA_DAKUTEN_ROWS : KATAKANA_DAKUTEN_ROWS;
  const yoonRows = scriptType === 'hiragana' ? HIRAGANA_YOON_ROWS : KATAKANA_YOON_ROWS;

  const handleSwitchScript = (type: 'hiragana' | 'katakana') => {
    setScriptType(type);
    setSelectedCell(
      type === 'hiragana' ? HIRAGANA_BASIC_ROWS[0][0]! : KATAKANA_BASIC_ROWS[0][0]!
    );
  };

  const handlePlay = async (cell: KanaCell) => {
    setSelectedCell(cell);
    setPlayingKana(cell.kana);
    try {
      const res = await api.synthesizeSpeech(cell.kana, 'Kore', 'slow');
      await playBase64Audio(res.audioBase64, res.mimeType);
    } catch {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(cell.kana);
        u.lang = 'ja-JP';
        window.speechSynthesis.speak(u);
      }
    } finally {
      setPlayingKana(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Cabecera y selector Hiragana / Katakana */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DFD9CD] dark:border-[#252A34] pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#1A1D21] dark:text-[#F2EFE9] flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-[#C9372C] dark:text-[#E04F44]" />
            {lang === 'ja' ? 'かな表 (ひらがな・カタカナ)' : 'Silabarios Kana'}
          </h1>
          <p className="text-sm text-[#5A606B] dark:text-[#9BA1AE] mt-1">
            {lang === 'ja'
              ? '文字をクリックして発音と覚え方を確認しましょう'
              : 'Pulsa cualquier carácter para escuchar su pronunciación y ver su regla mnemotécnica'}
          </p>
        </div>

        {/* Selector de pestaña Hiragana / Katakana */}
        <div className="inline-flex p-1 rounded-xl bg-[#ECE8DF] dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#2C323E] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleSwitchScript('hiragana')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              scriptType === 'hiragana'
                ? 'bg-white dark:bg-[#272D38] text-[#C9372C] dark:text-[#E04F44] shadow-xs'
                : 'text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9]'
            }`}
          >
            Hiragana (ひらがな)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchScript('katakana')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              scriptType === 'katakana'
                ? 'bg-white dark:bg-[#272D38] text-[#C9372C] dark:text-[#E04F44] shadow-xs'
                : 'text-[#5A606B] dark:text-      {/* Tarjeta destacada del carácter seleccionado */}
      <div className="bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#2C323E] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-[#F7F5F0] dark:bg-[#111317] border border-[#DFD9CD] dark:border-[#2C323E] flex items-center justify-center">
            <span className="text-5xl font-serif font-bold text-[#1A1D21] dark:text-[#F2EFE9]">
              {selectedCell.kana}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#C9372C] dark:text-[#E04F44] uppercase">
                {selectedCell.romaji}
              </span>
              <button
                type="button"
                onClick={() => handlePlay(selectedCell)}
                disabled={playingKana === selectedCell.kana}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#ECE8DF] dark:bg-[#252A34] hover:bg-[#DFD9CD] dark:hover:bg-[#2C323E] transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                {lang === 'ja' ? '発音' : 'Escuchar'}
              </button>
            </div>

            {selectedCell.mnemonic && (
              <p className="text-sm text-[#1A1D21] dark:text-[#F2EFE9] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{selectedCell.mnemonic}</span>
              </p>
            )}

            {selectedCell.exampleWord && (
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                <strong>Ejemplo:</strong> {selectedCell.exampleWord} — {selectedCell.exampleMeaning}
              </p>
            )}
          </div>
        </div>

        {onGoToWritingPractice && (
          <button
            type="button"
            onClick={onGoToWritingPractice}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-[#C9372C] hover:bg-[#AE2D23] dark:bg-[#D9463B] text-white transition-colors shrink-0 cursor-pointer"
          >
            {lang === 'ja' ? '書き取り練習へ' : 'Practicar escritura'}
          </button>
        )}
      </div>

      {/* Tabla 1: Gojūon (Básicos) */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#1A1D21] dark:text-[#F2EFE9]">
          1. Sonidos Básicos (Gojūon)
        </h2>
        <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
          {basicRows.flat().map((cell, idx) =>
            cell ? (
              <button
                key={cell.kana}
                type="button"
                onClick={() => handlePlay(cell)}
                className={`p-3 sm:p-4 rounded-xl border transition-all flex flex-col items-center cursor-pointer ${
                  selectedCell.kana === cell.kana
                    ? 'bg-[#C9372C]/10 border-[#C9372C] dark:border-[#E04F44]'
                    : 'bg-white dark:bg-[#191C22] border-[#DFD9CD] dark:border-[#2C323E] hover:border-[#C9372C]/50'
                }`}
              >
                <span className="text-2xl sm:text-3xl font-serif text-[#1A1D21] dark:text-[#F2EFE9]">
                  {cell.kana}
                </span>
                <span className="text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mt-1">
                  {cell.romaji}
                </span>
              </button>
            ) : (
              <div key={`empty-${idx}`} className="p-3 sm:p-4 rounded-xl bg-transparent" />
            )
          )}
        </div>
      </section>

      {/* Tabla 2: Dakuten y Handakuten (Impuros) */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#1A1D21] dark:text-[#F2EFE9]">
          2. Sonidos Impuros (Dakuten y Handakuten)
        </h2>
        <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
          {dakutenRows.flat().map((cell) => (
            <button
              key={cell.kana}
              type="button"
              onClick={() => handlePlay(cell)}
              className={`p-3 sm:p-4 rounded-xl border transition-all flex flex-col items-center cursor-pointer ${
                selectedCell.kana === cell.kana
                  ? 'bg-[#C9372C]/10 border-[#C9372C] dark:border-[#E04F44]'
                  : 'bg-white dark:bg-[#191C22] border-[#DFD9CD] dark:border-[#2C323E] hover:border-[#C9372C]/50'
              }`}
            >
              <span className="text-2xl sm:text-3xl font-serif text-[#1A1D21] dark:text-[#F2EFE9]">
                {cell.kana}
              </span>
              <span className="text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mt-1">
                {cell.romaji}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Tabla 3: Yōon (Combinaciones) */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#1A1D21] dark:text-[#F2EFE9]">
          3. Combinaciones (Yōon)
        </h2>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {yoonRows.flat().map((cell) => (
            <button
              key={cell.kana}
              type="button"
              onClick={() => handlePlay(cell)}
              className={`p-3 sm:p-4 rounded-xl border transition-all flex flex-col items-center cursor-pointer ${
                selectedCell.kana === cell.kana
                  ? 'bg-[#C9372C]/10 border-[#C9372C] dark:border-[#E04F44]'
                  : 'bg-white dark:bg-[#191C22] border-[#DFD9CD] dark:border-[#2C323E] hover:border-[#C9372C]/50'
              }`}
            >
              <span className="text-xl sm:text-2xl font-serif text-[#1A1D21] dark:text-[#F2EFE9]">
                {cell.kana}
              </span>
              <span className="text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mt-1">
                {cell.romaji}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9]'
            }`}
          >
            Katakana (カタカナ)
          </button>
        </div>
      </div>
