export interface EntradaDiccionario {
  id: number;
  japones: string;
  lectura: string;
  romaji: string;
  espanol: string[];
  categoria: 'sustantivo' | 'verbo' | 'adjetivo' | 'expresion' | 'particula';
  ejemplo?: {
    jp: string;
    lectura: string;
    es: string;
  };
}

export const diccionarioData: EntradaDiccionario[] = [
  {
    id: 1,
    japones: '水',
    lectura: 'みず',
    romaji: 'mizu',
    espanol: ['agua', 'agua fría'],
    categoria: 'sustantivo',
    ejemplo: {
      jp: '水を飲みます。',
      lectura: 'みずをのみます。',
      es: 'Bebo agua.'
    }
  },
  {
    id: 2,
    japones: '食べる',
    lectura: 'たべる',
    romaji: 'taberu',
    espanol: ['comer'],
    categoria: 'verbo',
    ejemplo: {
      jp: '寿司を食べます。',
      lectura: 'すしをたべます。',
      es: 'Como sushi.'
    }
  },
  {
    id: 3,
    japones: '大きい',
    lectura: 'おおきい',
    romaji: 'ookii',
    espanol: ['grande'],
    categoria: 'adjetivo',
    ejemplo: {
      jp: '大きい犬ですね。',
      lectura: 'おおきいいぬですね。',
      es: 'Es un perro grande, ¿verdad?'
    }
  },
  {
    id: 4,
    japones: '先生',
    lectura: 'せんせい',
    romaji: 'sensei',
    espanol: ['profesor', 'profesora', 'maestro', 'doctor'],
    categoria: 'sustantivo',
    ejemplo: {
      jp: '田中先生は優しいです。',
      lectura: 'たなかせんせいはやさしいです。',
      es: 'El profesor Tanaka es amable.'
    }
  },
  {
    id: 5,
    japones: 'ありがとう',
    lectura: 'ありがとう',
    romaji: 'arigatou',
    espanol: ['gracias'],
    categoria: 'expresion',
    ejemplo: {
      jp: '手伝ってくれてありがとう。',
      lectura: 'てつだってくれてありがとう。',
      es: 'Gracias por ayudarme.'
    }
  }
];
