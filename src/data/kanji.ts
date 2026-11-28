export interface EjemploKanji {
  palabra: string;
  lectura: string;
  significado: string;
}

export interface KanjiItem {
  id: number;
  caracter: string;
  trazos: number;
  significado: string;
  onyomi: string[];
  kunyomi: string[];
  nivel: string;
  ejemplos: EjemploKanji[];
}

export const kanjiData: KanjiItem[] = [
  {
    id: 1,
    caracter: '一',
    trazos: 1,
    significado: 'Uno',
    onyomi: ['イチ', 'イツ'],
    kunyomi: ['ひと-', 'ひと.つ'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '一つ', lectura: 'ひとつ', significado: 'Uno (objeto)' },
      { palabra: '一月', lectura: 'いちがつ', significado: 'Enero' },
      { palabra: '一日', lectura: 'ついたち', significado: 'Día 1 del mes' }
    ]
  },
  {
    id: 2,
    caracter: '二',
    trazos: 2,
    significado: 'Dos',
    onyomi: ['ニ'],
    kunyomi: ['ふた', 'ふた.つ'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '二つ', lectura: 'ふたつ', significado: 'Dos (objetos)' },
      { palabra: '二月', lectura: 'にがつ', significado: 'Febrero' },
      { palabra: '二人', lectura: 'ふたり', significado: 'Dos personas' }
    ]
  },
  {
    id: 3,
    caracter: '三',
    trazos: 3,
    significado: 'Tres',
    onyomi: ['サン'],
    kunyomi: ['み', 'み.つ', 'みっ.つ'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '三つ', lectura: 'みっつ', significado: 'Tres (objetos)' },
      { palabra: '三月', lectura: 'さんがつ', significado: 'Marzo' }
    ]
  },
  {
    id: 4,
    caracter: '四',
    trazos: 5,
    significado: 'Cuatro',
    onyomi: ['シ'],
    kunyomi: ['よ', 'よ.つ', 'よっ.つ', 'よん'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '四つ', lectura: 'よっつ', significado: 'Cuatro (objetos)' },
      { palabra: '四月', lectura: 'しがつ', significado: 'Abril' }
    ]
  },
  {
    id: 5,
    caracter: '五',
    trazos: 4,
    significado: 'Cinco',
    onyomi: ['ゴ'],
    kunyomi: ['いつ', 'いつ.つ'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '五つ', lectura: 'いつつ', significado: 'Cinco (objetos)' },
      { palabra: '五月', lectura: 'ごがつ', significado: 'Mayo' }
    ]
  },
  {
    id: 6,
    caracter: '六',
    trazos: 4,
    significado: 'Seis',
    onyomi: ['ロク'],
    kunyomi: ['む', 'む.つ', 'むっ.つ'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '六つ', lectura: 'むっつ', significado: 'Seis (objetos)' },
      { palabra: '六月', lectura: 'ろくがつ', significado: 'Junio' }
    ]
  },
  {
    id: 7,
    caracter: '七',
    trazos: 2,
    significado: 'Siete',
    onyomi: ['シチ'],
    kunyomi: ['なな', 'なな.つ', 'なの'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '七つ', lectura: 'ななつ', significado: 'Siete (objetos)' },
      { palabra: '七月', lectura: 'しちがつ', significado: 'Julio' }
    ]
  },
  {
    id: 8,
    caracter: '八',
    trazos: 2,
    significado: 'Ocho',
    onyomi: ['ハチ'],
    kunyomi: ['や', 'や.つ', 'やっ.つ', 'よう'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '八つ', lectura: 'やっつ', significado: 'Ocho (objetos)' },
      { palabra: '八月', lectura: 'はちがつ', significado: 'Agosto' }
    ]
  },
  {
    id: 9,
    caracter: '九',
    trazos: 2,
    significado: 'Nueve',
    onyomi: ['キュウ', 'ク'],
    kunyomi: ['ここの', 'ここの.つ'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '九つ', lectura: 'ここのつ', significado: 'Nueve (objetos)' },
      { palabra: '九月', lectura: 'くがつ', significado: 'Septiembre' }
    ]
  },
  {
    id: 10,
    caracter: '十',
    trazos: 2,
    significado: 'Diez',
    onyomi: ['ジュウ', 'ジッ'],
    kunyomi: ['とお', 'と'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '十月', lectura: 'じゅうがつ', significado: 'Octubre' },
      { palabra: '十分', lectura: 'じゅっぷん', significado: 'Diez minutos / Suficiente' }
    ]
  },
  {
    id: 11,
    caracter: '日',
    trazos: 4,
    significado: 'Día / Sol',
    onyomi: ['ニチ', 'ジツ'],
    kunyomi: ['ひ', '-び', '-か'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '日本', lectura: 'にほん', significado: 'Japón' },
      { palabra: '日曜日', lectura: 'にちようび', significado: 'Domingo' }
    ]
  },
  {
    id: 12,
    caracter: '月',
    trazos: 4,
    significado: 'Mes / Luna',
    onyomi: ['ゲツ', 'ガツ'],
    kunyomi: ['つき'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '月曜日', lectura: 'げつようび', significado: 'Lunes' },
      { palabra: '今月', lectura: 'こんげつ', significado: 'Este mes' }
    ]
  },
  {
    id: 13,
    caracter: '火',
    trazos: 4,
    significado: 'Fuego',
    onyomi: ['カ'],
    kunyomi: ['ひ', '-び', 'ほ-'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '火曜日', lectura: 'かようび', significado: 'Martes' },
      { palabra: '火山', lectura: 'かざん', significado: 'Volcán' }
    ]
  },
  {
    id: 14,
    caracter: '水',
    trazos: 4,
    significado: 'Agua',
    onyomi: ['スイ'],
    kunyomi: ['みず', 'みず-'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '水曜日', lectura: 'すいようび', significado: 'Miércoles' },
      { palabra: '水', lectura: 'みず', significado: 'Agua' }
    ]
  },
  {
    id: 15,
    caracter: '木',
    trazos: 4,
    significado: 'Árbol / Madera',
    onyomi: ['ボク', 'モク'],
    kunyomi: ['き', 'こ-'],
    nivel: 'N5',
    ejemplos: [
      { palabra: '木曜日', lectura: 'もくようび', significado: 'Jueves' },
      { palabra: '木', lectura: 'き', significado: 'Árbol' }
    ]
  }
];
