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
    caracter: "一",
    trazos: 1,
    significado: "Uno",
    onyomi: ["イチ", "イツ"],
    kunyomi: ["ひと-", "ひと.つ"],
    nivel: "N5",
    ejemplos: [
      { palabra: "一つ", lectura: "ひとつ", significado: "Uno (objeto)" },
      { palabra: "一月", lectura: "いちがつ", significado: "Enero" },
      { palabra: "一日", lectura: "ついたち", significado: "Día 1 del mes" }
    ]
  },
  // ... aquí sigues pegando el resto de kanjis
];
