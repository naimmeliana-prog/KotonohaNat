export interface KanaItem {
  caracter: string;
  romaji: string;
  tipo: 'hiragana' | 'katakana';
  categoria: 'basico' | 'impuro' | 'combinacion';
  mnemotecnia?: string;
  ejemplo: { palabra: string; lectura: string; significado: string };
}

export const kanaData: KanaItem[] = [
  // HIRAGANA BÁSICO
  {
    caracter: 'あ',
    romaji: 'a',
    tipo: 'hiragana',
    categoria: 'basico',
    mnemotecnia: 'Parece una "A" con un lazo alrededor.',
    ejemplo: { palabra: 'あめ', lectura: 'ame', significado: 'Lluvia / Caramelo' }
  },
  {
    caracter: 'い',
    romaji: 'i',
    tipo: 'hiragana',
    categoria: 'basico',
    mnemotecnia: 'Dos "i" una al lado de la otra.',
    ejemplo: { palabra: 'いぬ', lectura: 'inu', significado: 'Perro' }
  },
  {
    caracter: 'う',
    romaji: 'u',
    tipo: 'hiragana',
    categoria: 'basico',
    mnemotecnia: 'Una "U" inclinada con un sombrero arriba.',
    ejemplo: { palabra: 'うみ', lectura: 'umi', significado: 'Mar' }
  },
  {
    caracter: 'え',
    romaji: 'e',
    tipo: 'hiragana',
    categoria: 'basico',
    mnemotecnia: 'Un pájaro exótico (Emu) corriendo.',
    ejemplo: { palabra: 'えき', lectura: 'eki', significado: 'Estación de tren' }
  },
  {
    caracter: 'お',
    romaji: 'o',
    tipo: 'hiragana',
    categoria: 'basico',
    mnemotecnia: 'Un golfista golpeando una bola ("O" de hoyo).',
    ejemplo: { palabra: 'おちゃ', lectura: 'ocha', significado: 'Té verde' }
  },
  // KATAKANA BÁSICO
  {
    caracter: 'ア',
    romaji: 'a',
    tipo: 'katakana',
    categoria: 'basico',
    mnemotecnia: 'Un hacha (Axe) afilada.',
    ejemplo: { palabra: 'アイス', lectura: 'aisu', significado: 'Helado' }
  },
  {
    caracter: 'イ',
    romaji: 'i',
    tipo: 'katakana',
    categoria: 'basico',
    mnemotecnia: 'Un caballete inclinado.',
    ejemplo: { palabra: 'インド', lectura: 'indo', significado: 'India' }
  },
  {
    caracter: 'ウ',
    romaji: 'u',
    tipo: 'katakana',
    categoria: 'basico',
    mnemotecnia: 'Igual que el hiragana う pero con trazos rectos.',
    ejemplo: { palabra: 'ウイルス', lectura: 'uirusu', significado: 'Virus' }
  },
  {
    caracter: 'エ',
    romaji: 'e',
    tipo: 'katakana',
    categoria: 'basico',
    mnemotecnia: 'Una viga de ingeniería (Engineering) en forma de I.',
    ejemplo: { palabra: 'エアコン', lectura: 'eakon', significado: 'Aire acondicionado' }
  },
  {
    caracter: 'オ',
    romaji: 'o',
    tipo: 'katakana',
    categoria: 'basico',
    mnemotecnia: 'Un cantante de Ópera con los brazos abiertos.',
    ejemplo: { palabra: 'オレンジ', lectura: 'orenji', significado: 'Naranja' }
  }
];
