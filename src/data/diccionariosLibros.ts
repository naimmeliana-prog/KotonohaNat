export interface EntradaDiccionario {
  id: string;
  japones: string;
  lectura: string;
  romaji: string;
  espanol: string;
  categoria: 'Verbos' | 'Adjetivos' | 'Sustantivos' | 'Expresiones y Modismos' | 'Viajes y Lugares' | 'Comida y Bebida';
  tipoGramatical: string;
  fuente: 'Diccionario RUI' | 'Diccionario Feri';
  nota?: string;
}

export const entradasDiccionarioData: EntradaDiccionario[] = [
  // ================= VERBOS ESENCIALES (RUI & FERI) =================
  {
    id: 'dic-1',
    japones: '食べる',
    lectura: 'たべる',
    romaji: 'taberu',
    espanol: 'comer',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Ichidan (Grupo II)',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-2',
    japones: '飲む',
    lectura: 'のむ',
    romaji: 'nomu',
    espanol: 'beber, tomar, tragar',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-3',
    japones: '行く',
    lectura: 'いく',
    romaji: 'iku / yuku',
    espanol: 'ir',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario RUI',
    nota: 'Su forma -te es 行って (itte).'
  },
  {
    id: 'dic-4',
    japones: '来る',
    lectura: 'くる',
    romaji: 'kuru',
    espanol: 'venir',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Irregular (Grupo III)',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-5',
    japones: '帰る',
    lectura: 'かえる',
    romaji: 'kaeru',
    espanol: 'volver, regresar a casa',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-6',
    japones: '見る',
    lectura: 'みる',
    romaji: 'miru',
    espanol: 'ver, mirar',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Ichidan (Grupo II)',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-7',
    japones: '聞く',
    lectura: 'きく',
    romaji: 'kiku',
    espanol: 'oír, escuchar, preguntar',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario RUI',
    nota: 'Con la partícula に significa "preguntar a alguien".'
  },
  {
    id: 'dic-8',
    japones: '話す',
    lectura: 'はなす',
    romaji: 'hanasu',
    espanol: 'hablar, decir, conversar',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-9',
    japones: '書く',
    lectura: 'かく',
    romaji: 'kaku',
    espanol: 'escribir',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-10',
    japones: '読む',
    lectura: 'よむ',
    romaji: 'yomu',
    espanol: 'leer',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-11',
    japones: '買う',
    lectura: 'かう',
    romaji: 'kau',
    espanol: 'comprar',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-12',
    japones: '売る',
    lectura: 'うる',
    romaji: 'uru',
    espanol: 'vender',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-13',
    japones: '学ぶ',
    lectura: 'まなぶ',
    romaji: 'manabu',
    espanol: 'aprender, estudiar',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-14',
    japones: '教える',
    lectura: 'おしえる',
    romaji: 'oshieru',
    espanol: 'enseñar, instruir, informar',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Ichidan (Grupo II)',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-15',
    japones: '分かる',
    lectura: 'わかる',
    romaji: 'wakaru',
    espanol: 'entender, comprender, saber',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-16',
    japones: '出来る',
    lectura: 'できる',
    romaji: 'dekiru',
    espanol: 'poder, saber hacer, ser capaz de, estar listo',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Ichidan (Grupo II)',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-17',
    japones: 'ある',
    lectura: 'ある',
    romaji: 'aru',
    espanol: 'haber, estar, existir (objetos inanimados)',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario RUI',
    nota: 'Para seres vivos (personas o animales) se usa いる (iru).'
  },
  {
    id: 'dic-18',
    japones: 'いる',
    lectura: 'いる',
    romaji: 'iru',
    espanol: 'haber, estar, existir (personas y animales)',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Ichidan (Grupo II)',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-19',
    japones: '働く',
    lectura: 'はたらく',
    romaji: 'hataraku',
    espanol: 'trabajar',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-20',
    japones: '休む',
    lectura: 'やすむ',
    romaji: 'yasumu',
    espanol: 'descansar, faltar a clase/trabajo',
    categoria: 'Verbos',
    tipoGramatical: 'Verbo Godan (Grupo I)',
    fuente: 'Diccionario Feri'
  },

  // ================= ADJETIVOS (-I / -NA) =================
  {
    id: 'dic-21',
    japones: '大きい',
    lectura: 'おおきい',
    romaji: 'ōkii',
    espanol: 'grande, amplio',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -i',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-22',
    japones: '小さい',
    lectura: 'ちいさい',
    romaji: 'chiisai',
    espanol: 'pequeño, chiquito',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -i',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-23',
    japones: '新しい',
    lectura: 'あたらしい',
    romaji: 'atarashii',
    espanol: 'nuevo',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -i',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-24',
    japones: '古い',
    lectura: 'ふるい',
    romaji: 'furui',
    espanol: 'viejo, antiguo (cosas)',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -i',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-25',
    japones: '高い',
    lectura: 'たかい',
    romaji: 'takai',
    espanol: 'alto, elevado, caro',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -i',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-26',
    japones: '安い',
    lectura: 'やすい',
    romaji: 'yasui',
    espanol: 'barato, económico',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -i',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-27',
    japones: '美味しい',
    lectura: 'おいしい',
    romaji: 'oishii',
    espanol: 'delicioso, sabroso, rico',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -i',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-28',
    japones: '難しい',
    lectura: 'むずかしい',
    romaji: 'muzukashii',
    espanol: 'difícil, complicado',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -i',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-29',
    japones: '易しい',
    lectura: 'やさしい',
    romaji: 'yasashii',
    espanol: 'fácil, sencillo (homófono de 優しい amable)',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -i',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-30',
    japones: '面白い',
    lectura: 'おもしろい',
    romaji: 'omoshiroi',
    espanol: 'interesante, divertido',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -i',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-31',
    japones: '静か',
    lectura: 'しずか',
    romaji: 'shizuka',
    espanol: 'silencioso, calmado, tranquilo, sereno',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -na',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-32',
    japones: '賑やか',
    lectura: 'にぎやか',
    romaji: 'nigiyaka',
    espanol: 'animado, bullicioso, concurrido',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -na',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-33',
    japones: '便利',
    lectura: 'べんり',
    romaji: 'benri',
    espanol: 'útil, cómodo, conveniente, práctico',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -na',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-34',
    japones: '綺麗',
    lectura: 'きれい',
    romaji: 'kirei',
    espanol: 'hermoso, bonito, limpio, ordenado',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -na',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-35',
    japones: '元気',
    lectura: 'げんき',
    romaji: 'genki',
    espanol: 'sano, con ánimo, vigor, buena salud',
    categoria: 'Adjetivos',
    tipoGramatical: 'Adjetivo en -na / Sustantivo',
    fuente: 'Diccionario RUI'
  },
  // ================= SUSTANTIVOS COTIDIANOS (RUI & FERI) =================
  {
    id: 'dic-36',
    japones: '先生',
    lectura: 'せんせい',
    romaji: 'sensei',
    espanol: 'maestro, profesor, doctor',
    categoria: 'Sustantivos',
    tipoGramatical: 'Sustantivo / Sufijo honorífico',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-37',
    japones: '学生',
    lectura: 'がくせい',
    romaji: 'gakusei',
    espanol: 'estudiante',
    categoria: 'Sustantivos',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-38',
    japones: '友達',
    lectura: 'ともだち',
    romaji: 'tomodachi',
    espanol: 'amigo, amiga',
    categoria: 'Sustantivos',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-39',
    japones: '家族',
    lectura: 'かぞく',
    romaji: 'kazoku',
    espanol: 'familia',
    categoria: 'Sustantivos',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-40',
    japones: '時間',
    lectura: 'じかん',
    romaji: 'jikan',
    espanol: 'tiempo, hora (de duración)',
    categoria: 'Sustantivos',
    tipoGramatical: 'Sustantivo / Sufijo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-41',
    japones: 'お金',
    lectura: 'おかね',
    romaji: 'okane',
    espanol: 'dinero',
    categoria: 'Sustantivos',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-42',
    japones: '本',
    lectura: 'ほん',
    romaji: 'hon',
    espanol: 'libro (también contador de objetos alargados)',
    categoria: 'Sustantivos',
    tipoGramatical: 'Sustantivo / Contador',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-43',
    japones: '辞書',
    lectura: 'じしょ',
    romaji: 'jisho',
    espanol: 'diccionario',
    categoria: 'Sustantivos',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-44',
    japones: '仕事',
    lectura: 'しごと',
    romaji: 'shigoto',
    espanol: 'trabajo, empleo, ocupación',
    categoria: 'Sustantivos',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-45',
    japones: '天気',
    lectura: 'てんき',
    romaji: 'tenki',
    espanol: 'clima, tiempo atmosférico',
    categoria: 'Sustantivos',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },

  // ================= VIAJES Y LUGARES (RUI & FERI) =================
  {
    id: 'dic-46',
    japones: '駅',
    lectura: 'えき',
    romaji: 'eki',
    espanol: 'estación (de tren)',
    categoria: 'Viajes y Lugares',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-47',
    japones: '空港',
    lectura: 'くうこう',
    romaji: 'kūkō',
    espanol: 'aeropuerto',
    categoria: 'Viajes y Lugares',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-48',
    japones: '電車',
    lectura: 'でんしゃ',
    romaji: 'densha',
    espanol: 'tren eléctrico',
    categoria: 'Viajes y Lugares',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-49',
    japones: '切符',
    lectura: 'きっぷ',
    romaji: 'kippu',
    espanol: 'billete, boleto, entrada, ticket',
    categoria: 'Viajes y Lugares',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-50',
    japones: '図書館',
    lectura: 'としょかん',
    romaji: 'toshokan',
    espanol: 'biblioteca',
    categoria: 'Viajes y Lugares',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-51',
    japones: '病院',
    lectura: 'びょういん',
    romaji: 'byōin',
    espanol: 'hospital, clínica',
    categoria: 'Viajes y Lugares',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-52',
    japones: '銀行',
    lectura: 'ぎんこう',
    romaji: 'ginkō',
    espanol: 'banco (institución bancaria)',
    categoria: 'Viajes y Lugares',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-53',
    japones: '旅館',
    lectura: 'りょかん',
    romaji: 'ryokan',
    espanol: 'posada tradicional japonesa',
    categoria: 'Viajes y Lugares',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-54',
    japones: 'お土産',
    lectura: 'おみやげ',
    romaji: 'omiyage',
    espanol: 'souvenir, recuerdo o regalo de viaje',
    categoria: 'Viajes y Lugares',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-55',
    japones: '旅行',
    lectura: 'りょこう',
    romaji: 'ryokō',
    espanol: 'viaje (りょこうする = viajar)',
    categoria: 'Viajes y Lugares',
    tipoGramatical: 'Sustantivo / Verbo suru',
    fuente: 'Diccionario Feri'
  },

  // ================= COMIDA Y BEBIDA (RUI & FERI) =================
  {
    id: 'dic-56',
    japones: '水',
    lectura: 'みず',
    romaji: 'mizu',
    espanol: 'agua (fría / del tiempo)',
    categoria: 'Comida y Bebida',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-57',
    japones: 'お茶',
    lectura: 'おちゃ',
    romaji: 'ocha',
    espanol: 'té (especialmente té verde japonés)',
    categoria: 'Comida y Bebida',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-58',
    japones: 'ご飯',
    lectura: 'ごはん',
    romaji: 'gohan',
    espanol: 'arroz cocido, comida',
    categoria: 'Comida y Bebida',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-59',
    japones: '朝ご飯',
    lectura: 'あさごはん',
    romaji: 'asagohan',
    espanol: 'desayuno',
    categoria: 'Comida y Bebida',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-60',
    japones: '魚',
    lectura: 'さかな',
    romaji: 'sakana',
    espanol: 'pescado, pez',
    categoria: 'Comida y Bebida',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-61',
    japones: '肉',
    lectura: 'にく',
    romaji: 'niku',
    espanol: 'carne',
    categoria: 'Comida y Bebida',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-62',
    japones: '野菜',
    lectura: 'やさい',
    romaji: 'yasai',
    espanol: 'verdura, hortaliza',
    categoria: 'Comida y Bebida',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-63',
    japones: '果物',
    lectura: 'くだもの',
    romaji: 'kudamono',
    espanol: 'fruta',
    categoria: 'Comida y Bebida',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-64',
    japones: 'お弁当',
    lectura: 'おべんとう',
    romaji: 'obentō',
    espanol: 'comida preparada para llevar en caja',
    categoria: 'Comida y Bebida',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-65',
    japones: '醤油',
    lectura: 'しょうゆ',
    romaji: 'shōyu',
    espanol: 'salsa de soja',
    categoria: 'Comida y Bebida',
    tipoGramatical: 'Sustantivo',
    fuente: 'Diccionario RUI'
  },

  // ================= EXPRESIONES Y MODISMOS (RUI & FERI) =================
  {
    id: 'dic-66',
    japones: '大丈夫',
    lectura: 'だいじょうぶ',
    romaji: 'daijōbu',
    espanol: 'estar bien, sin problema, todo correcto',
    categoria: 'Expresiones y Modismos',
    tipoGramatical: 'Adjetivo en -na / Expresión',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-67',
    japones: '仕方がない',
    lectura: 'しかたがない',
    romaji: 'shikata ga nai',
    espanol: 'no hay remedio, qué se le va a hacer',
    categoria: 'Expresiones y Modismos',
    tipoGramatical: 'Modismo / Expresión',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-68',
    japones: '久しぶり',
    lectura: 'ひさしぶり',
    romaji: 'hisashiburi',
    espanol: '¡cuánto tiempo sin vernos!',
    categoria: 'Expresiones y Modismos',
    tipoGramatical: 'Expresión',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-69',
    japones: '一生懸命',
    lectura: 'いっしょうけんめい',
    romaji: 'isshōkenmei',
    espanol: 'con todo el empeño, esforzándose al máximo',
    categoria: 'Expresiones y Modismos',
    tipoGramatical: 'Adverbio / Yojijukugo',
    fuente: 'Diccionario RUI'
  },
  {
    id: 'dic-70',
    japones: 'おかげさまで',
    lectura: 'おかげさまで',
    romaji: 'okagesama de',
    espanol: 'gracias a usted / por suerte, todo bien',
    categoria: 'Expresiones y Modismos',
    tipoGramatical: 'Expresión de cortesía',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-71',
    japones: 'お大事に',
    lectura: 'おだいじに',
    romaji: 'odaiji ni',
    espanol: '¡que te mejores! / cuídese mucho',
    categoria: 'Expresiones y Modismos',
    tipoGramatical: 'Expresión',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-72',
    japones: 'なるほど',
    lectura: 'なるほど',
    romaji: 'naruhodo',
    espanol: 'ya veo, efectivamente, tiene sentido',
    categoria: 'Expresiones y Modismos',
    tipoGramatical: 'Expresión / Adverbio',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-73',
    japones: 'やっぱり / やはり',
    lectura: 'やっぱり / やはり',
    romaji: 'yappari / yahari',
    espanol: 'tal como pensaba, después de todo, al fin y al cabo',
    categoria: 'Expresiones y Modismos',
    tipoGramatical: 'Adverbio',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-74',
    japones: '勿論',
    lectura: 'もちろん',
    romaji: 'mochiron',
    espanol: 'por supuesto, naturalmente',
    categoria: 'Expresiones y Modismos',
    tipoGramatical: 'Adverbio',
    fuente: 'Diccionario Feri'
  },
  {
    id: 'dic-75',
    japones: '頑張って',
    lectura: 'がんばって',
    romaji: 'ganbatte',
    espanol: '¡ánimo!, ¡esfuérzate! (de 頑張る ganbaru)',
    categoria: 'Expresiones y Modismos',
    tipoGramatical: 'Expresión / Verbo',
    fuente: 'Diccionario RUI'
  }
];
export const DICCIONARIOS_LIBROS = entradasDiccionarioData;
