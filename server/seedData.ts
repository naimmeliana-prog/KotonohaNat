import type { JlptLevel } from '../src/types/kotonoha.ts';

export interface SeedLesson {
  level: JlptLevel;
  unitNumber: number;
  title: string;
  subtitle: string;
  sourceBook: string;
  grammarPoints: {
    pattern: string;
    reading: string;
    meaning: string;
    explanation: string;
    formation: string;
    examples: { ja: string; reading: string; romaji: string; es: string }[];
  }[];
  vocabulary: {
    word: string;
    reading: string;
    romaji: string;
    meaning: string;
    pos: string;
    exampleJa?: string;
    exampleEs?: string;
  }[];
  kanjiList: {
    character: string;
    meaning: string;
    onyomi: string;
    kunyomi: string;
    strokes: number;
    mnemonic: string;
    compounds: string[];
  }[];
  dialogue: {
    speaker: string;
    ja: string;
    reading: string;
    romaji: string;
    es: string;
  }[];
  exercises: {
    id: string;
    type: 'choice' | 'fill' | 'translate';
    prompt: string;
    promptJa?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  unitExam: {
    id: string;
    type: 'choice' | 'fill' | 'translate';
    prompt: string;
    promptJa?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface SeedDictionaryEntry {
  word: string;
  reading: string;
  romaji: string;
  meaningEs: string;
  partOfSpeech: string;
  jlptLevel: JlptLevel;
  exampleJa: string;
  exampleReading: string;
  exampleEs: string;
  dictionarySource: string;
  tags: string[];
}

export const SEED_LESSONS: SeedLesson[] = [
  {
    level: 'N5',
    unitNumber: 1,
    title: 'Presentaciones, silabarios y estructura A は B です',
    subtitle: 'Fundamentos del japonés cortés, partícula de tema は y preguntas con か',
    sourceBook: 'Curso Base Kotonoha · N5 Vol. 1',
    grammarPoints: [
      {
        pattern: 'A は B です',
        reading: 'A wa B desu',
        meaning: 'A es B (estilo cortés)',
        explanation:
          'La partícula は se escribe con el hiragana "ha", pero cuando marca el tema de la oración siempre se pronuncia "wa". です cierra la oración con cortesía equivalente a "ser/estar" en registro educado.',
        formation: 'Sustantivo A + は + Sustantivo B + です',
        examples: [
          {
            ja: 'わたしはエレナです。',
            reading: 'わたし は エレナ です。',
            romaji: 'Watashi wa Erena desu.',
            es: 'Yo soy Elena.',
          },
          {
            ja: 'わたしはスペインじんです。',
            reading: 'わたし は スペインじん です。',
            romaji: 'Watashi wa Supeinjin desu.',
            es: 'Soy española / español.',
          },
        ],
      },
      {
        pattern: 'A は B じゃありません',
        reading: 'A wa B ja arimasen',
        meaning: 'A no es B',
        explanation:
          'Forma negativa cortés de です. En contextos escritos o muy formales se utiliza では ありません (dewa arimasen).',
        formation: 'Sustantivo A + は + Sustantivo B + じゃありません',
        examples: [
          {
            ja: 'たなかさんはがくせいじゃありません。',
            reading: 'たなかさん は がくせい じゃありません。',
            romaji: 'Tanaka-san wa gakusei ja arimasen.',
            es: 'El señor Tanaka no es estudiante.',
          },
        ],
      },
      {
        pattern: '〜ですか (Partícula か)',
        reading: '~desu ka',
        meaning: '¿Es ~? (oración interrogativa)',
        explanation:
          'Añadir か al final convierte cualquier oración afirmativa en pregunta sin cambiar el orden de las palabras y con entonación ascendente al final.',
        formation: 'Oración + か',
        examples: [
          {
            ja: 'にほんごのがくせいですか。',
            reading: 'にほんご の がくせい です か。',
            romaji: 'Nihongo no gakusei desu ka.',
            es: '¿Eres estudiante de japonés?',
          },
        ],
      },
    ],
    vocabulary: [
      { word: '私', reading: 'わたし', romaji: 'watashi', meaning: 'yo', pos: 'pronombre', exampleJa: '私は学生です。', exampleEs: 'Yo soy estudiante.' },
      { word: '学生', reading: 'がくせい', romaji: 'gakusei', meaning: 'estudiante', pos: 'sustantivo' },
      { word: '先生', reading: 'せんせい', romaji: 'sensei', meaning: 'profesor / maestro', pos: 'sustantivo' },
      { word: '日本語', reading: 'にほんご', romaji: 'nihongo', meaning: 'idioma japonés', pos: 'sustantivo' },
      { word: '初めまして', reading: 'はじめまして', romaji: 'hajimemashite', meaning: 'mucho gusto (primera vez)', pos: 'expresión' },
      { word: 'お願いします', reading: 'おねがいします', romaji: 'onegaishimasu', meaning: 'por favor / cuento contigo', pos: 'expresión' },
      { word: 'はい', reading: 'はい', romaji: 'hai', meaning: 'sí', pos: 'interjección' },
      { word: 'いいえ', reading: 'いいえ', romaji: 'iie', meaning: 'no', pos: 'interjección' },
    ],
    kanjiList: [
      { character: '日', meaning: 'sol, día', onyomi: 'ニチ, ジツ', kunyomi: 'ひ, か', strokes: 4, mnemonic: 'Una ventana cuadrada con una raya central que divide el sol naciente.', compounds: ['日本 (にほん) Japón', '今日 (きょう) hoy'] },
      { character: '本', meaning: 'libro, origen', onyomi: 'ホン', kunyomi: 'もと', strokes: 5, mnemonic: 'El kanji de árbol (木) con una marca en la raíz indicando el origen.', compounds: ['日本語 (にほんご) japonés', '本 (ほん) libro'] },
      { character: '人', meaning: 'persona', onyomi: 'ジン, ニン', kunyomi: 'ひと', strokes: 2, mnemonic: 'Dos piernas caminando en equilibrio.', compounds: ['日本人 (にほんじん) persona japonesa', '一人 (ひとり) una persona'] },
    ],
    dialogue: [
      { speaker: 'さくら', ja: 'はじめまして。さくらです。にほんじんです。', reading: 'はじめまして。さくら です。にほんじん です。', romaji: 'Hajimemashite. Sakura desu. Nihonjin desu.', es: 'Mucho gusto. Soy Sakura. Soy japonesa.' },
      { speaker: 'エレナ', ja: 'はじめまして。エレナです。にほんごのがくせいです。', reading: 'はじめまして。エレナ です。にほんご の がくせい です。', romaji: 'Hajimemashite. Erena desu. Nihongo no gakusei desu.', es: 'Mucho gusto. Soy Elena. Soy estudiante de japonés.' },
      { speaker: 'さくら', ja: 'よろしくおねがいします。', reading: 'よろしく おねがいします。', romaji: 'Yoroshiku onegaishimasu.', es: 'Encantada de conocerte.' },
    ],
    exercises: [
      {
        id: 'n5-1-ex1',
        type: 'choice',
        prompt: '¿Qué partícula marca el tema de la oración en "私は学生です"?',
        options: ['は (wa)', 'を (o)', 'に (ni)', 'で (de)'],
        correctIndex: 0,
        explanation: 'は se pronuncia "wa" y señala el tema principal de la oración.',
      },
      {
        id: 'n5-1-ex2',
        type: 'choice',
        prompt: 'Elige la traducción correcta de "No soy profesor".',
        options: ['先生です。', '先生じゃありません。', '先生ですか。', '先生のです。'],
        correctIndex: 1,
        explanation: 'じゃありません niega sustantivos en registro cortés.',
      },
      {
        id: 'n5-1-ex3',
        type: 'choice',
        prompt: '¿Cómo preguntas "¿Eres estudiante?" en japonés cortés?',
        options: ['学生です。', '学生じゃありません。', '学生ですか。', '学生はか。'],
        correctIndex: 2,
        explanation: 'Solo añadimos la partícula interrogativa か al final de です.',
      },
    ],
    unitExam: [
      {
        id: 'n5-1-exam1',
        type: 'choice',
        prompt: 'Completa: わたし ___ にほんご ___ がくせいです。',
        options: ['は / の', 'の / は', 'か / は', 'は / か'],
        correctIndex: 0,
        explanation: 'は marca el tema (わたし) y の conecta dos sustantivos ("estudiante de japonés").',
      },
      {
        id: 'n5-1-exam2',
        type: 'choice',
        prompt: '¿Qué significa el compuesto 日本人 (にほんじん)?',
        options: ['Libro de Japón', 'Idioma japonés', 'Persona japonesa', 'Profesor de Japón'],
        correctIndex: 2,
        explanation: '日本 (Japón) + 人 (persona) significa persona japonesa.',
      },
      {
        id: 'n5-1-exam3',
        type: 'choice',
        prompt: 'Al conocer a alguien por primera vez en Japón, ¿qué expresión dices al inicio?',
        options: ['さようなら', 'はじめまして', 'ありがとう', 'いいえ'],
        correctIndex: 1,
        explanation: 'はじめまして se usa exclusivamente la primera vez que conoces a alguien.',
      },
      {
        id: 'n5-1-exam4',
        type: 'choice',
        prompt: 'Selecciona la lectura correcta de 先生:',
        options: ['がくせい', 'せんせい', 'にほんご', 'わたし'],
        correctIndex: 1,
        explanation: '先生 se lee せんせい (sensei).',
      },
    ],
  },
  {
    level: 'N5',
    unitNumber: 2,
    title: 'Verbos en forma ます, partículas を・に・で y rutina diaria',
    subtitle: 'Acciones cotidianas, objeto directo, destino y lugar de acción',
    sourceBook: 'Curso Base Kotonoha · N5 Vol. 1',
    grammarPoints: [
      {
        pattern: 'Objeto + を + Verbo ます',
        reading: 'o + verb-masu',
        meaning: 'Realizar una acción sobre un objeto directo',
        explanation:
          'La partícula を (escrita "wo", pronunciada "o") señala el objeto directo del verbo transitivo. En japonés el verbo siempre va al final de la frase.',
        formation: 'Sustantivo + を + Verbo en forma ます',
        examples: [
          {
            ja: '毎朝コーヒーを飲みます。',
            reading: 'まいあさ コーヒー を のみます。',
            romaji: 'Maiasa koohii o nomimasu.',
            es: 'Todas las mañanas bebo café.',
          },
          {
            ja: '図書館で本を読みます。',
            reading: 'としょかん で ほん を よみます。',
            romaji: 'Toshokan de hon o yomimasu.',
            es: 'Leo libros en la biblioteca.',
          },
        ],
      },
      {
        pattern: 'Lugar + で vs Lugar + に / へ',
        reading: 'de vs ni / e',
        meaning: 'Lugar de acción (で) frente a destino de movimiento (に / へ)',
        explanation:
          'Usa で para indicar dónde ocurre una acción dinámica (estudiar, comer, trabajar). Usa に o へ (pronunciado "e") con verbos de desplazamiento como 行きます (ir), 来ます (venir) y 帰ります (volver).',
        formation: 'Lugar + で + Acción / Lugar + に + 行きます',
        examples: [
          {
            ja: '駅へ行きます。',
            reading: 'えき へ いきます。',
            romaji: 'Eki e ikimasu.',
            es: 'Voy a la estación.',
          },
          {
            ja: 'カフェで日本語を勉強します。',
            reading: 'カフェ で にほんご を べんきょうします。',
            romaji: 'Kafe de nihongo o benkyoushimasu.',
            es: 'Estudio japonés en la cafetería.',
          },
        ],
      },
    ],
    vocabulary: [
      { word: '食べます', reading: 'たべます', romaji: 'tabemasu', meaning: 'comer', pos: 'verbo Ichidan' },
      { word: '飲みます', reading: 'のみます', romaji: 'nomimasu', meaning: 'beber', pos: 'verbo Godan' },
      { word: '行きます', reading: 'いきます', romaji: 'ikimasu', meaning: 'ir', pos: 'verbo Godan' },
      { word: '勉強します', reading: 'べんきょうします', romaji: 'benkyoushimasu', meaning: 'estudiar', pos: 'verbo irregular' },
      { word: '毎朝', reading: 'まいあさ', romaji: 'maiasa', meaning: 'todas las mañanas', pos: 'sustantivo temporal' },
      { word: '図書館', reading: 'としょかん', romaji: 'toshokan', meaning: 'biblioteca', pos: 'sustantivo' },
      { word: '駅', reading: 'えき', romaji: 'eki', meaning: 'estación de tren', pos: 'sustantivo' },
      { word: '時間', reading: 'じかん', romaji: 'jikan', meaning: 'tiempo / hora', pos: 'sustantivo' },
    ],
    kanjiList: [
      { character: '食', meaning: 'comer, comida', onyomi: 'ショク', kunyomi: 'た(べる)', strokes: 9, mnemonic: 'Un techo cubriendo comida buena (良) sobre la mesa.', compounds: ['食事 (しょくじ) comida', '食べる (たべる) comer'] },
      { character: '行', meaning: 'ir, fila', onyomi: 'コウ, ギョウ', kunyomi: 'い(く)', strokes: 6, mnemonic: 'Un cruce de calles visto desde arriba.', compounds: ['銀行 (ぎんこう) banco', '旅行 (りょこう) viaje'] },
      { character: '学', meaning: 'estudio, ciencia', onyomi: 'ガク', kunyomi: 'まな(ぶ)', strokes: 8, mnemonic: 'Un niño (子) bajo un techo absorbiendo chispas de conocimiento.', compounds: ['大学 (だいがく) universidad', '学生 (がくせい) estudiante'] },
    ],
    dialogue: [
      { speaker: 'けんじ', ja: 'エレナさんは毎朝何時に起きますか。', reading: 'エレナさん は まいあさ なんじ に おきます か。', romaji: 'Erena-san wa maiasa nanji ni okimasu ka.', es: 'Elena, ¿a qué hora te levantas todas las mañanas?' },
      { speaker: 'エレナ', ja: '七時に起きます。それから、うちでコーヒーを飲みます。', reading: 'しちじ に おきます。それから、うち で コーヒー を のみます。', romaji: 'Shichiji ni okimasu. Sorekara, uchi de koohii o nomimasu.', es: 'Me levanto a las siete. Después tomo café en casa.' },
      { speaker: 'けんじ', ja: 'いいですね。午後どこへ行きますか。', reading: 'いい です ね。ごご どこ へ いきます か。', romaji: 'Ii desu ne. Gogo doko e ikimasu ka.', es: 'Qué bien. ¿Adónde vas por la tarde?' },
      { speaker: 'エレナ', ja: '図書館へ行きます。そこで日本語を勉強します。', reading: 'としょかん へ いきます。そこ で にほんご を べんきょうします。', romaji: 'Toshokan e ikimasu. Soko de nihongo o benkyoushimasu.', es: 'Voy a la biblioteca. Estudio japonés allí.' },
    ],
    exercises: [
      {
        id: 'n5-2-ex1',
        type: 'choice',
        prompt: 'Completa con la partícula correcta: レストラン ___ ラーメンを食べます。',
        options: ['で', 'へ', 'を', 'か'],
        correctIndex: 0,
        explanation: 'Comer es una acción en un lugar, por lo que corresponde la partícula で.',
      },
      {
        id: 'n5-2-ex2',
        type: 'choice',
        prompt: '¿Qué partícula indica el objeto directo en "水を飲みます" (Bebo agua)?',
        options: ['に', 'で', 'を', 'は'],
        correctIndex: 2,
        explanation: 'を marca el objeto directo (agua) sobre el que recae el verbo beber.',
      },
    ],
    unitExam: [
      {
        id: 'n5-2-exam1',
        type: 'choice',
        prompt: 'Elige la oración gramaticalmente correcta para "Voy a Tokio en tren":',
        options: ['東京で電車を行きます。', '電車で東京へ行きます。', '電車に東京で行きます。', '東京を電車で行きます。'],
        correctIndex: 1,
        explanation: 'で indica el medio de transporte (電車で) y へ indica el destino (東京へ).',
      },
      {
        id: 'n5-2-exam2',
        type: 'choice',
        prompt: '¿Cómo se dice "a las siete" usando la partícula temporal exacta?',
        options: ['七時で', '七時を', '七時に', '七時は'],
        correctIndex: 2,
        explanation: 'Los puntos exactos en el tiempo (horas, días de la semana) llevan に.',
      },
      {
        id: 'n5-2-exam3',
        type: 'choice',
        prompt: '¿Cuál es el significado de 図書館 (としょかん)?',
        options: ['Estación', 'Restaurante', 'Biblioteca', 'Universidad'],
        correctIndex: 2,
        explanation: '図書館 significa biblioteca.',
      },
    ],
  },
  {
    level: 'N5',
    unitNumber: 3,
    title: 'Forma て, peticiones (〜てください) y acción en progreso (〜ています)',
    subtitle: 'El motor de la conjugación japonesa para conectar acciones y pedir favores',
    sourceBook: 'Curso Base Kotonoha · N5 Vol. 2',
    grammarPoints: [
      {
        pattern: 'Forma て + ください',
        reading: '~te kudasai',
        meaning: 'Por favor, haz ~',
        explanation:
          'La forma て permite enlazar verbos y construir peticiones corteses. Para verbos Ichidan se cambia る por て; para Godan depende de la terminación (う・つ・る → って; む・ぶ・ぬ → んで; く → いて; ぐ → いで; す → して).',
        formation: 'Verbo (forma て) + ください',
        examples: [
          {
            ja: 'もう少しゆっくり話してください。',
            reading: 'もう すこし ゆっくり はなして ください。',
            romaji: 'Mou sukoshi yukkuri hanashite kudasai.',
            es: 'Por favor, habla un poco más despacio.',
          },
          {
            ja: 'ここに名前を書いてください。',
            reading: 'ここ に なまえ を かいて ください。',
            romaji: 'Koko ni namae o kaite kudasai.',
            es: 'Por favor, escribe tu nombre aquí.',
          },
        ],
      },
      {
        pattern: 'Verbo て + います',
        reading: '~te imasu',
        meaning: 'Estar haciendo ~ / estado resultante',
        explanation:
          'Expresa una acción en curso en este instante o un estado habitual/resultante (por ejemplo, vivir en una ciudad: 東京に住んでいます).',
        formation: 'Verbo (forma て) + います',
        examples: [
          {
            ja: '今、漢字を練習しています。',
            reading: 'いま、かんじ を れんしゅうして います。',
            romaji: 'Ima, kanji o renshuushite imasu.',
            es: 'Ahora estoy practicando kanji.',
          },
        ],
      },
    ],
    vocabulary: [
      { word: '書きます', reading: 'かきます', romaji: 'kakimasu', meaning: 'escribir (て → 書いて)', pos: 'verbo Godan' },
      { word: '話します', reading: 'はなします', romaji: 'hanashimasu', meaning: 'hablar (て → 話して)', pos: 'verbo Godan' },
      { word: '待ちます', reading: 'まちます', romaji: 'machimasu', meaning: 'esperar (て → 待って)', pos: 'verbo Godan' },
      { word: 'ゆっくり', reading: 'ゆっくり', romaji: 'yukkuri', meaning: 'despacio, con calma', pos: 'adverbio' },
      { word: '練習', reading: 'れんしゅう', romaji: 'renshuu', meaning: 'práctica', pos: 'sustantivo' },
      { word: '名前', reading: 'なまえ', romaji: 'namae', meaning: 'nombre', pos: 'sustantivo' },
    ],
    kanjiList: [
      { character: '書', meaning: 'escribir', onyomi: 'ショ', kunyomi: 'か(く)', strokes: 10, mnemonic: 'Una mano sosteniendo un pincel sobre una hoja del día (日).', compounds: ['辞書 (じしょ) diccionario', '読書 (どくしょ) lectura'] },
      { character: '話', meaning: 'hablar, historia', onyomi: 'ワ', kunyomi: 'はな(す), はなし', strokes: 13, mnemonic: 'Palabras (言) pronunciadas por la lengua (舌).', compounds: ['電話 (でんわ) teléfono', '会話 (かいわ) conversación'] },
    ],
    dialogue: [
      { speaker: '先生', ja: 'この漢字を読んでください。', reading: 'この かんじ を よんで ください。', romaji: 'Kono kanji o yonde kudasai.', es: 'Por favor, lee este kanji.' },
      { speaker: 'エレナ', ja: 'すみません、もう一度ゆっくり言ってください。', reading: 'すみません、もう いちど ゆっくり いって ください。', romaji: 'Sumimasen, mou ichido yukkuri itte kudasai.', es: 'Disculpe, por favor dígalo una vez más despacio.' },
    ],
    exercises: [
      {
        id: 'n5-3-ex1',
        type: 'choice',
        prompt: '¿Cuál es la forma て correcta del verbo 書く (escribir)?',
        options: ['書って', '書いて', '書んで', '書して'],
        correctIndex: 1,
        explanation: 'Los verbos terminados en く forman て cambiando く por いて (書く → 書いて).',
      },
      {
        id: 'n5-3-ex2',
        type: 'choice',
        prompt: '¿Cómo se dice "Estoy esperando en la estación"?',
        options: ['駅で待っています。', '駅で待ってください。', '駅へ待ちます。', '駅で待てます。'],
        correctIndex: 0,
        explanation: '待つ → 待って + います expresa acción en progreso.',
      },
    ],
    unitExam: [
      {
        id: 'n5-3-exam1',
        type: 'choice',
        prompt: 'Selecciona la forma て irregular correcta de 行く (ir):',
        options: ['行いて', '行って', '行んで', '行して'],
        correctIndex: 1,
        explanation: '行く es la excepción clásica de los verbos en く: su forma て es 行って.',
      },
      {
        id: 'n5-3-exam2',
        type: 'choice',
        prompt: '¿Qué significa "今、音楽を聞いています"?',
        options: ['Escucharé música mañana.', 'Por favor escucha música.', 'Ahora estoy escuchando música.', 'No escucho música.'],
        correctIndex: 2,
        explanation: '今 (ahora) + 聞いています (forma progresiva de escuchar).',
      },
      {
        id: 'n5-3-exam3',
        type: 'choice',
        prompt: 'El compuesto 会話 (かいわ) significa:',
        options: ['Teléfono', 'Conversación', 'Diccionario', 'Lectura'],
        correctIndex: 1,
        explanation: '会 (reunirse) + 話 (hablar) = conversación.',
      },
    ],
  },
  {
    level: 'N5',
    unitNumber: 4,
    title: 'Partículas estructurales básicas (I): は (wa), が (ga), を (o), に (ni) y で (de)',
    subtitle: 'El esqueleto de la oración japonesa: tema, sujeto nuevo, objeto directo, destino y medio',
    sourceBook: 'Partículas del Japonés — Japonés a Fondo',
    grammarPoints: [
      {
        pattern: 'は (wa) — Marcador del tema y contraste',
        reading: 'wa (escrito は / ha)',
        meaning: 'En cuanto a ~ / contraste entre dos elementos',
        explanation:
          'Se escribe con el hiragana "ha", pero como partícula siempre se pronuncia "wa". Introduce o enfatiza un tema conocido diferenciándolo del sujeto gramatical, establece contrastes claros y aporta énfasis en estructuras verbales. Suele omitirse en diálogo si el tema ya es evidente.',
        formation: 'Tema conocido + は + Comentario / Contraste',
        examples: [
          { ja: '今日は忙しいです。', reading: 'きょう は いそがしい です。', romaji: 'Kyō wa isogashii desu.', es: 'En cuanto a hoy, estoy ocupado.' },
          { ja: '日本は大きいですが、シンガポールは小さいです。', reading: 'にほん は おおきい です が、シンガポール は ちいさい です。', romaji: 'Nihon wa ōkii desu ga, Shingapōru wa chīsai desu.', es: 'Japón es grande, pero Singapur es pequeño.' },
          { ja: '彼はギターを弾いてはいますが、上手ではありません。', reading: 'かれ は ギター を ひいて は います が、じょうず では ありません。', romaji: 'Kare wa gitā o hiite wa imasu ga, jōzu de wa arimasen.', es: 'Él toca la guitarra, pero no es bueno.' },
        ],
      },
      {
        pattern: 'が (ga) — Sujeto nuevo, gustos, capacidad y "pero"',
        reading: 'ga',
        meaning: 'Identificar sujeto nuevo o enfatizado / conjunción "pero"',
        explanation:
          'Introduce información nueva, enfatiza al sujeto frente a otros ("yo iré"), acompaña gustos y preferencias (好き), marca el objeto de verbos de capacidad (話せる, できる) y al final de cláusula funciona como "pero".',
        formation: 'Sujeto nuevo / habilidad + が + Predicado | Cláusula 1 + が、Cláusula 2',
        examples: [
          { ja: 'あそこに猫がいます。', reading: 'あそこ に ねこ が います。', romaji: 'Asoko ni neko ga imasu.', es: 'Hay un gato allí.' },
          { ja: '私が行きます。', reading: 'わたし が いきます。', romaji: 'Watashi ga ikimasu.', es: 'Yo iré (enfatizando quién va).' },
          { ja: '雨が降っていますが、出かけます。', reading: 'あめ が ふって います が、でかけます。', romaji: 'Ame ga futte imasu ga, dekakemasu.', es: 'Está lloviendo, pero saldré.' },
        ],
      },
      {
        pattern: 'を (o) — Objeto directo y espacio recorrido',
        reading: 'o (escrito を / wo)',
        meaning: 'Recibir directamente la acción transitiva o atravesar un espacio',
        explanation:
          'Se escribe con el hiragana を ("wo") pero en japonés moderno se pronuncia "o". Marca el objeto directo de verbos transitivos y también indica el lugar a través del cual se desplaza una acción (pasear por el parque).',
        formation: 'Objeto directo / Espacio recorrido + を + Verbo transitivo o de desplazamiento',
        examples: [
          { ja: 'リンゴを食べます。', reading: 'リンゴ を たべます。', romaji: 'Ringo o tabemasu.', es: 'Como una manzana.' },
          { ja: '公園を散歩します。', reading: 'こうえん を さんぽ します。', romaji: 'Kōen o sanpo shimasu.', es: 'Paseo por el parque.' },
        ],
      },
      {
        pattern: 'に (ni) — Destino, tiempo exacto, objeto indirecto y propósito',
        reading: 'ni',
        meaning: 'Hacia un punto final, a una hora/día concreto, a alguien o con un propósito',
        explanation:
          'Partícula polivalente que fija el destino final con verbos de movimiento o existencia, marca un punto temporal específico (horas, días de la semana), señala al receptor de una acción (dar, preguntar) e introduce el propósito del desplazamiento.',
        formation: 'Destino / Hora exacta / Receptor / Propósito + に + Verbo',
        examples: [
          { ja: '三時に会います。', reading: 'さんじ に あいます。', romaji: 'San-ji ni aimasu.', es: 'Nos encontraremos a las tres.' },
          { ja: '彼にプレゼントをあげます。', reading: 'かれ に プレゼント を あげます。', romaji: 'Kare ni purezento o agemasu.', es: 'Le daré un regalo a él.' },
          { ja: '勉強に図書館に行きます。', reading: 'べんきょう に としょかん に いきます。', romaji: 'Benkyō ni toshokan ni ikimasu.', es: 'Voy a la biblioteca para estudiar.' },
        ],
      },
      {
        pattern: 'で (de) — Lugar de acción, medio/instrumento y causa',
        reading: 'de',
        meaning: 'Dónde ocurre una acción, con qué herramienta/medio se hace o por qué motivo',
        explanation:
          'A diferencia de に (ubicación/destino), で marca el escenario donde se desarrolla una acción activa, el instrumento o medio utilizado (palillos, teléfono) y la causa involuntaria de un suceso (enfermedad, tráfico).',
        formation: 'Lugar / Instrumento / Causa + で + Acción',
        examples: [
          { ja: '箸で食べます。', reading: 'はし で たべます。', romaji: 'Hashi de tabemasu.', es: 'Como con palillos.' },
          { ja: '病気で休みました。', reading: 'びょうき で やすみました。', romaji: 'Byōki de yasumimashita.', es: 'Descansé debido a una enfermedad.' },
        ],
      },
    ],
    vocabulary: [
      { word: '助詞', reading: 'じょし', romaji: 'joshi', meaning: 'partícula gramatical', pos: 'sustantivo' },
      { word: '忙しい', reading: 'いそがしい', romaji: 'isogashii', meaning: 'ocupado', pos: 'adjetivo-i' },
      { word: '散歩', reading: 'さんぽ', romaji: 'sanpo', meaning: 'paseo', pos: 'sustantivo / suru' },
      { word: '手紙', reading: 'てがみ', romaji: 'tegami', meaning: 'carta', pos: 'sustantivo' },
      { word: '質問', reading: 'しつもん', romaji: 'shitsumon', meaning: 'pregunta', pos: 'sustantivo' },
      { word: '箸', reading: 'はし', romaji: 'hashi', meaning: 'palillos', pos: 'sustantivo' },
      { word: '病気', reading: 'びょうき', romaji: 'byōki', meaning: 'enfermedad', pos: 'sustantivo' },
      { word: '遅れる', reading: 'おくれる', romaji: 'okureru', meaning: 'retrasarse', pos: 'verbo Ichidan' },
    ],
    kanjiList: [
      { character: '忙', meaning: 'ocupado', onyomi: 'ボウ', kunyomi: 'いそが(しい)', strokes: 6, mnemonic: 'El corazón (忄) perdido (亡) entre demasiadas tareas.', compounds: ['忙しい (いそがしい) ocupado', '多忙 (たぼう) muy ocupado'] },
      { character: '病', meaning: 'enfermedad', onyomi: 'ビョウ', kunyomi: 'や(む)', strokes: 10, mnemonic: 'Una persona en cama con fiebre en el tercer nivel.', compounds: ['病気 (びょうき) enfermedad', '病院 (びょういん) hospital'] },
    ],
    dialogue: [
      { speaker: 'エレナ', ja: '今日は学校に日本語の勉強に行きます。', reading: 'きょう は がっこう に にほんご の べんきょう に いきます。', romaji: 'Kyō wa gakkō ni nihongo no benkyō ni ikimasu.', es: 'Hoy voy a la escuela a estudiar japonés.' },
      { speaker: 'けんじ', ja: 'いいですね！三時に図書館で会いましょう。電車で行きますか。', reading: 'いい です ね！さんじ に としょかん で あいましょう。でんしゃ で いきます か。', romaji: 'Ii desu ne! San-ji ni toshokan de aimashō. Densha de ikimasu ka.', es: '¡Qué bien! Quedemos a las tres en la biblioteca. ¿Vas en tren?' },
      { speaker: 'エレナ', ja: '雨が降っていますが、公園を歩いて行きます。', reading: 'あめ が ふって います が、こうえん を あるいて いきます。', romaji: 'Ame ga futte imasu ga, kōen o aruite ikimasu.', es: 'Está lloviendo, pero iré caminando por el parque.' },
    ],
    exercises: [
      {
        id: 'n5-4-ex1',
        type: 'choice',
        prompt: 'Completa con la partícula correcta: 箸 ___ ご飯を食べます。(Como arroz con palillos)',
        options: ['で', 'に', 'を', 'が'],
        correctIndex: 0,
        explanation: 'で indica el instrumento o medio utilizado (palillos).',
      },
      {
        id: 'n5-4-ex2',
        type: 'choice',
        prompt: 'Elige la partícula que expresa el espacio por el que paseas: 公園 ___ 散歩します。',
        options: ['を', 'は', 'に', 'か'],
        correctIndex: 0,
        explanation: 'Con verbos de movimiento por un espacio abierto (散歩する, 歩く), を señala el recorrido.',
      },
      {
        id: 'n5-4-ex3',
        type: 'choice',
        prompt: '¿Qué matiz aporta が en "雨が降っていますが、出かけます"?',
        options: ['Instrumento', 'Conjunción adversativa ("pero")', 'Objeto directo', 'Hora exacta'],
        correctIndex: 1,
        explanation: 'Al final de una cláusula, が conecta dos ideas contrastantes equivalente a "pero".',
      },
    ],
    unitExam: [
      {
        id: 'n5-4-exam1',
        type: 'choice',
        prompt: 'Completa: 彼 ___ 手紙を送りました。(Le envié una carta a él)',
        options: ['に', 'で', 'を', 'は'],
        correctIndex: 0,
        explanation: 'に marca al receptor o destinatario de la acción (objeto indirecto).',
      },
      {
        id: 'n5-4-exam2',
        type: 'choice',
        prompt: '¿Cómo se pronuncian correctamente las partículas は y を?',
        options: ['ha y wo', 'wa y o', 'ba y o', 'wa y wo'],
        correctIndex: 1,
        explanation: 'Históricamente は como partícula se lee "wa" y を se lee "o".',
      },
      {
        id: 'n5-4-exam3',
        type: 'choice',
        prompt: 'Selecciona la partícula de causa en: 交通渋滞 ___ 遅れました。(Me retrasé por el tráfico)',
        options: ['で', 'が', 'に', 'を'],
        correctIndex: 0,
        explanation: 'で introduce la causa o motivo involuntario de un retraso o ausencia.',
      },
      {
        id: 'n5-4-exam4',
        type: 'choice',
        prompt: 'Para presentar un sujeto nuevo en "あそこに猫 ___ います", ¿qué partícula corresponde?',
        options: ['は', 'を', 'が', 'で'],
        correctIndex: 2,
        explanation: 'が introduce nueva información o el sujeto que existe con います / あります.',
      },
    ],
  },
  {
    level: 'N5',
    unitNumber: 5,
    title: 'Partículas estructurales básicas (II): も (mo), の (no), へ (e) y か (ka)',
    subtitle: 'Inclusión ("también / ni"), posesión y nominalización, trayectoria y preguntas',
    sourceBook: 'Partículas del Japonés — Japonés a Fondo',
    grammarPoints: [
      {
        pattern: 'も (mo) — Inclusión, acuerdo y refuerzo negativo ("ni")',
        reading: 'mo',
        meaning: 'También / Tampoco / Ni',
        explanation:
          'Reemplaza directamente a は, が o を para añadir elementos en similitud o acuerdo ("yo también opino igual"). Combinada con un verbo negativo equivale a "tampoco" o "ni".',
        formation: 'Sustantivo + も + Predicado (afirmativo o negativo)',
        examples: [
          { ja: '彼も来ます。', reading: 'かれ も きます。', romaji: 'Kare mo kimasu.', es: 'Él también viene.' },
          { ja: '彼女も知りません。', reading: 'かのじょ も しりません。', romaji: 'Kanojo mo shirimasen.', es: 'Ella tampoco lo sabe.' },
          { ja: '私も同じ意見です。', reading: 'わたし も おなじ いけん です。', romaji: 'Watashi mo onaji iken desu.', es: 'Yo también tengo la misma opinión.' },
        ],
      },
      {
        pattern: 'の (no) — Posesión, cualidad, nominalizador y pregunta suave',
        reading: 'no',
        meaning: 'De / El hecho de ~ / ¿~? (coloquial)',
        explanation:
          'Conecta sustantivos por pertenencia o cualidad ("la cultura japonesa"), convierte verbos en sustantivos nominalizando acciones ("hablar japonés me gusta") y al final de frase coloquial formula preguntas con tono suave y cercano.',
        formation: 'Sustantivo A + の + Sustantivo B | Verbo simple + の + が/は',
        examples: [
          { ja: '日本語を話すのが好きです。', reading: 'にほんご を はなす の が すき です。', romaji: 'Nihongo o hanasu no ga suki desu.', es: 'Me gusta hablar japonés.' },
          { ja: '日本の文化。', reading: 'にほん の ぶんか。', romaji: 'Nihon no bunka.', es: 'La cultura japonesa.' },
          { ja: 'どうしてそんなに遅いの？', reading: 'どうして そんなに おそい の？', romaji: 'Dōshite sonna ni osoi no?', es: '¿Por qué llegas tan tarde?' },
        ],
      },
      {
        pattern: 'へ (e) — Dirección y trayectoria emotiva',
        reading: 'e (escrito へ / he)',
        meaning: 'Hacia (énfasis en el camino o rumbo)',
        explanation:
          'Aunque el hiragana へ se lee "he", como partícula se pronuncia siempre "e". A diferencia de に (foco en la meta exacta), へ enfatiza la dirección o trayectoria, por lo que abunda en expresiones poéticas o de viaje.',
        formation: 'Dirección / Meta + へ + Verbo de movimiento (o + の + Sustantivo)',
        examples: [
          { ja: '日本へ旅行します。', reading: 'にほん へ りょこう します。', romaji: 'Nihon e ryokō shimasu.', es: 'Viajo hacia Japón.' },
          { ja: '夢への一歩。', reading: 'ゆめ へ の いっぽ。', romaji: 'Yume e no ippo.', es: 'Un paso hacia el sueño.' },
        ],
      },
      {
        pattern: 'か (ka) — Interrogación y elección entre alternativas',
        reading: 'ka',
        meaning: '¿~? / ¿A o B?',
        explanation:
          'Convierte declaraciones en preguntas formales o corteses con entonación ascendente. Colocada entre elementos lista alternativas excluyentes ("¿café o té?") o expresa incertidumbre en medio de la frase.',
        formation: 'Oración + か | Opción A + か + Opción B + (か)',
        examples: [
          { ja: 'これはあなたの本ですか。', reading: 'これ は あなた の ほん です か。', romaji: 'Kore wa anata no hon desu ka.', es: '¿Es este tu libro?' },
          { ja: 'コーヒーかお茶か、どちらにしますか？', reading: 'コーヒー か おちゃ か、どちら に します か？', romaji: 'Kōhī ka ocha ka, dochira ni shimasu ka?', es: '¿Café o té, cuál prefieres?' },
        ],
      },
    ],
    vocabulary: [
      { word: '意見', reading: 'いけん', romaji: 'iken', meaning: 'opinión', pos: 'sustantivo' },
      { word: '夢', reading: 'ゆめ', romaji: 'yume', meaning: 'sueño, anhelo', pos: 'sustantivo' },
      { word: '一歩', reading: 'いっぽ', romaji: 'ippo', meaning: 'un paso', pos: 'sustantivo' },
      { word: '希望', reading: 'きぼう', romaji: 'kibō', meaning: 'esperanza', pos: 'sustantivo' },
      { word: '青い', reading: 'あおい', romaji: 'aoi', meaning: 'azul', pos: 'adjetivo-i' },
      { word: '空', reading: 'そら', romaji: 'sora', meaning: 'cielo', pos: 'sustantivo' },
      { word: '同じ', reading: 'おなじ', romaji: 'onaji', meaning: 'igual, mismo', pos: 'sustantivo / adj' },
      { word: '難しい', reading: 'むずかしい', romaji: 'muzukashii', meaning: 'difícil', pos: 'adjetivo-i' },
    ],
    kanjiList: [
      { character: '夢', meaning: 'sueño', onyomi: 'ム', kunyomi: 'ゆめ', strokes: 13, mnemonic: 'Ojos dormidos bajo el techo de la noche (夕).', compounds: ['夢 (ゆめ) sueño', '悪夢 (あくむ) pesadilla'] },
      { character: '空', meaning: 'cielo, vacío', onyomi: 'クウ', kunyomi: 'そら, あ(く)', strokes: 8, mnemonic: 'Una cueva (穴) abierta hacia el trabajo (工) infinito del cielo.', compounds: ['青い空 (あおいそら) cielo azul', '空港 (くうこう) aeropuerto'] },
    ],
    dialogue: [
      { speaker: 'さくら', ja: 'エレナさんも日本の文化に興味がありますか。', reading: 'エレナさん も にほん の ぶんか に きょうみ が あります か。', romaji: 'Erena-san mo Nihon no bunka ni kyōmi ga arimasu ka.', es: 'Elena, ¿tú también tienes interés en la cultura japonesa?' },
      { speaker: 'エレナ', ja: 'はい！日本語を話すのが好きです。来年は京都か奈良へ旅行したいです。', reading: 'はい！にほんご を はなす の が すき です。らいねん は きょうと か なら へ りょこう したい です。', romaji: 'Hai! Nihongo o hanasu no ga suki desu. Rainen wa Kyōto ka Nara e ryokō shitai desu.', es: '¡Sí! Me gusta hablar japonés. El año que viene quiero viajar a Kioto o Nara.' },
    ],
    exercises: [
      {
        id: 'n5-5-ex1',
        type: 'choice',
        prompt: 'Completa: 私も同じ意見です。¿Qué partícula sustituye a は para decir "yo también"?',
        options: ['も', 'の', 'へ', 'か'],
        correctIndex: 0,
        explanation: 'も reemplaza a は, が y を para expresar inclusión o acuerdo.',
      },
      {
        id: 'n5-5-ex2',
        type: 'choice',
        prompt: '¿Qué función cumple の en "日本語を話すのが好きです"?',
        options: ['Indicar dirección', 'Nominalizar el verbo 話す para que actúe como sustantivo', 'Formular una pregunta formal', 'Expresar causa'],
        correctIndex: 1,
        explanation: 'の convierte la cláusula verbal 日本語を話す en el sustantivo "el hablar japonés".',
      },
    ],
    unitExam: [
      {
        id: 'n5-5-exam1',
        type: 'choice',
        prompt: 'Elige la opción correcta para "¿Café o té, cuál prefieres?":',
        options: ['コーヒーかお茶か、どちらにしますか。', 'コーヒーもお茶も、どちらにしますか。', 'コーヒーへお茶へ、どちらにしますか。', 'コーヒーのお茶の、どちらにしますか。'],
        correctIndex: 0,
        explanation: 'か entre opciones presenta alternativas excluyentes para elegir una.',
      },
      {
        id: 'n5-5-exam2',
        type: 'choice',
        prompt: 'En contextos coloquiales suaves entre amigos, ¿qué partícula final sustituye a か para preguntar?',
        options: ['へ', 'も', 'の', 'を'],
        correctIndex: 2,
        explanation: 'の al final con entonación ascendente suaviza las preguntas en conversación informal.',
      },
      {
        id: 'n5-5-exam3',
        type: 'choice',
        prompt: '¿Cómo se pronuncia el carácter へ cuando actúa como partícula de dirección?',
        options: ['he', 'e', 'ha', 'wa'],
        correctIndex: 1,
        explanation: 'Como partícula de dirección, へ se pronuncia siempre "e".',
      },
    ],
  },

  {
    level: 'N4',
    unitNumber: 1,
    title: 'Forma potencial (〜られる / 〜える) y expresión de planes (〜つもり)',
    subtitle: 'Hablar de habilidades, posibilidades y proyectos personales',
    sourceBook: 'Manual Intermedio Inicial · JLPT N4',
    grammarPoints: [
      {
        pattern: 'Forma potencial (できる / 〜える / 〜られる)',
        reading: 'kanoukei',
        meaning: 'Poder hacer / ser capaz de ~',
        explanation:
          'Los verbos Godan cambian su vocal final -u a -e + る (話す → 話せる). Los verbos Ichidan cambian る por られる (食べる → 食べられる). El objeto suele marcarse con が en lugar de を.',
        formation: 'Sustantivo + が + Verbo potencial',
        examples: [
          {
            ja: '日本語が少し話せます。',
            reading: 'にほんご が すこし はなせます。',
            romaji: 'Nihongo ga sukoshi hanasemasu.',
            es: 'Puedo hablar un poco de japonés.',
          },
          {
            ja: 'このアプリで漢字が書けるようになりました。',
            reading: 'この アプリ で かんじ が かける よう に なりました。',
            romaji: 'Kono apuri de kanji ga kakeru you ni narimashita.',
            es: 'Con esta app he llegado a poder escribir kanji.',
          },
        ],
      },
      {
        pattern: 'Verbo diccionario / ない + つもりです',
        reading: '~tsumori desu',
        meaning: 'Tener la intención de / planear ~',
        explanation: 'Expresa una intención firme ya decidida por el hablante.',
        formation: 'Verbo (forma diccionario / ない) + つもりです',
        examples: [
          {
            ja: '来年、日本へ旅行するつもりです。',
            reading: 'らいねん、にほん へ りょこうする つもり です。',
            romaji: 'Rainen, Nihon e ryokou suru tsumori desu.',
            es: 'El año que viene planeo viajar a Japón.',
          },
        ],
      },
    ],
    vocabulary: [
      { word: '来年', reading: 'らいねん', romaji: 'rainen', meaning: 'el año que viene', pos: 'sustantivo' },
      { word: '旅行', reading: 'りょこう', romaji: 'ryokou', meaning: 'viaje', pos: 'sustantivo' },
      { word: '予定', reading: 'よてい', romaji: 'yotei', meaning: 'plan, agenda', pos: 'sustantivo' },
      { word: '慣れる', reading: 'なれる', romaji: 'nareru', meaning: 'acostumbrarse', pos: 'verbo Ichidan' },
      { word: '発音', reading: 'はつおん', romaji: 'hatsuon', meaning: 'pronunciación', pos: 'sustantivo' },
    ],
    kanjiList: [
      { character: '旅', meaning: 'viaje', onyomi: 'リョ', kunyomi: 'たび', strokes: 10, mnemonic: 'Una bandera de grupo guiando a viajeros por el camino.', compounds: ['旅行 (りょこう) viaje', '旅館 (りょかん) posada tradicional'] },
      { character: '発', meaning: 'partir, emitir', onyomi: 'ハツ, ホツ', kunyomi: '—', strokes: 9, mnemonic: 'Dos pies saliendo de un arco para lanzar sonido o partir.', compounds: ['発音 (はつおん) pronunciación', '出発 (しゅっぱつ) salida'] },
    ],
    dialogue: [
      { speaker: 'ゆうた', ja: 'エレナさん、もう日本語の新聞が読めますか。', reading: 'エレナさん、もう にほんご の しんぶん が よめます か。', romaji: 'Erena-san, mou nihongo no shinbun ga yomemasu ka.', es: 'Elena, ¿ya puedes leer el periódico en japonés?' },
      { speaker: 'エレナ', ja: 'まだ難しいですが、簡単な記事なら読めます。来年は京都へ行くつもりです。', reading: 'まだ むずかしい です が、かんたん な きじ なら よめます。らいねん は きょうと へ いく つもり です。', romaji: 'Mada muzukashii desu ga, kantan na kiji nara yomemasu. Rainen wa Kyouto e iku tsumori desu.', es: 'Todavía es difícil, pero si son artículos sencillos sí puedo leerlos. El año que viene planeo ir a Kioto.' },
    ],
    exercises: [
      {
        id: 'n4-1-ex1',
        type: 'choice',
        prompt: 'Forma potencial correcta de 読む (leer):',
        options: ['読める', '読まれる', '読ける', '読える'],
        correctIndex: 0,
        explanation: '読む es verbo Godan: む pasa a め + る → 読める.',
      },
      {
        id: 'n4-1-ex2',
        type: 'choice',
        prompt: 'Completa: 毎日30分練習する ___ です。(Planeo practicar 30 minutos cada día)',
        options: ['つもり', 'ことが', 'ため', 'ながら'],
        correctIndex: 0,
        explanation: 'Verbo forma diccionario + つもりです indica intención personal.',
      },
    ],
    unitExam: [
      {
        id: 'n4-1-exam1',
        type: 'choice',
        prompt: '¿Qué partícula se prefiere para el objeto con verbos potenciales como 話せる?',
        options: ['が', 'へ', 'まで', 'より'],
        correctIndex: 0,
        explanation: 'Los verbos potenciales marcan la capacidad con が (日本語が話せる).',
      },
      {
        id: 'n4-1-exam2',
        type: 'choice',
        prompt: '¿Qué significa 発音 (はつおん)?',
        options: ['Vocabulario', 'Pronunciación', 'Escritura', 'Gramática'],
        correctIndex: 1,
        explanation: '発音 significa pronunciación.',
      },
      {
        id: 'n4-1-exam3',
        type: 'choice',
        prompt: 'Elige la opción correcta para "No planeo rendirme":',
        options: ['あきらめないつもりです。', 'あきらめるつもりです。', 'あきらめてつもりです。', 'あきらめたつもりです。'],
        correctIndex: 0,
        explanation: 'Forma ない + つもりです expresa la intención de no hacer algo.',
      },
    ],
  },
  {
    level: 'N4',
    unitNumber: 2,
    title: 'Condicionales (〜たら・〜ば・〜なら) y dar/recibir favores',
    subtitle: 'Matices de condición y cortesía social con 〜てあげる・〜てもらう・〜てくれる',
    sourceBook: 'Manual Intermedio Inicial · JLPT N4',
    grammarPoints: [
      {
        pattern: 'Verbo pasado (た) + ら (Condicional たら)',
        reading: '~tara',
        meaning: 'Si ~ / Cuando ~',
        explanation:
          'Es el condicional más versátil del japonés. Sirve tanto para hipótesis ("si llueve") como para eventos secuenciales ("cuando llegues a casa, llámame").',
        formation: 'Forma た + ら',
        examples: [
          {
            ja: '日本へ行ったら、富士山を見たいです。',
            reading: 'にほん へ いったら、ふじさん を みたい です。',
            romaji: 'Nihon e ittara, Fujisan o mitai desu.',
            es: 'Cuando vaya a Japón, quiero ver el Monte Fuji.',
          },
        ],
      },
      {
        pattern: '〜てくれる / 〜てもらう',
        reading: '~te kureru / ~te morau',
        meaning: 'Alguien hace un favor para mí / Recibo el favor de alguien',
        explanation:
          'Usa てくれる cuando el sujeto es quien te ayuda con amabilidad; usa てもらう cuando el sujeto eres tú recibiendo esa ayuda.',
        formation: 'Verbo て + くれます / もらいます',
        examples: [
          {
            ja: '日本人の友達が発音を直してくれました。',
            reading: 'にほんじん の ともだち が はつおん を なおして くれました。',
            romaji: 'Nihonjin no tomodachi ga hatsuon o naoshite kuremashita.',
            es: 'Mi amigo japonés me corrigió la pronunciación.',
          },
        ],
      },
    ],
    vocabulary: [
      { word: '直す', reading: 'なおす', romaji: 'naosu', meaning: 'corregir, reparar', pos: 'verbo Godan' },
      { word: '富士山', reading: 'ふじさん', romaji: 'Fujisan', meaning: 'Monte Fuji', pos: 'nombre propio' },
      { word: '助ける', reading: 'たすける', romaji: 'tasukeru', meaning: 'ayudar, socorrer', pos: 'verbo Ichidan' },
      { word: '意味', reading: 'いみ', romaji: 'imi', meaning: 'significado', pos: 'sustantivo' },
    ],
    kanjiList: [
      { character: '山', meaning: 'montaña', onyomi: 'サン', kunyomi: 'やま', strokes: 3, mnemonic: 'Tres picos montañosos elevándose hacia el cielo.', compounds: ['富士山 (ふじさん) Monte Fuji', '登山 (とざん) montañismo'] },
      { character: '直', meaning: 'corregir, recto', onyomi: 'チョク, ジキ', kunyomi: 'なお(す), ただ(ちに)', strokes: 8, mnemonic: 'Un ojo mirando en línea recta para corregir errores.', compounds: ['正直 (しょうじき) honesto', '直す (なおす) corregir'] },
    ],
    dialogue: [
      { speaker: 'エレナ', ja: '分からない言葉があったら、教えてくれますか。', reading: 'わからない ことば が あったら、おしえて くれます か。', romaji: 'Wakaranai kotoba ga attara, oshiete kuremasu ka.', es: 'Si hay palabras que no entiendo, ¿me las enseñarías?' },
      { speaker: 'さくら', ja: 'もちろんです！いつでも聞いてくださいね。', reading: 'もちろん です！いつでも きいて ください ね。', romaji: 'Mochiron desu! Itsudemo kiite kudasai ne.', es: '¡Por supuesto! Pregúntame siempre que quieras.' },
    ],
    exercises: [
      {
        id: 'n4-2-ex1',
        type: 'choice',
        prompt: 'Completa: 時間があったら、映画を ___。(Si tengo tiempo, veré una película)',
        options: ['見ます', '見てください', '見ました', '見るなら'],
        correctIndex: 0,
        explanation: 'Con condicional futuro あったら, la cláusula principal va en presente/futuro 見ます.',
      },
    ],
    unitExam: [
      {
        id: 'n4-2-exam1',
        type: 'choice',
        prompt: 'Elige la frase correcta para "Mi amiga me enseñó kanji":',
        options: ['友達が漢字を教えてくれました。', '友達が漢字を教えてあげました。', '私が漢字を教えてくれました。', '友達に漢字を教えてくれました。'],
        correctIndex: 0,
        explanation: 'Cuando otra persona realiza un favor hacia mí, usamos が + 〜てくれました.',
      },
      {
        id: 'n4-2-exam2',
        type: 'choice',
        prompt: 'Forma たら del verbo 食べる (comer):',
        options: ['食べたら', '食べてら', '食べったら', '食べだら'],
        correctIndex: 0,
        explanation: 'Forma た (食べた) + ら → 食べたら.',
      },
    ],
  },
  {
    level: 'N4',
    unitNumber: 3,
    title: 'Partículas de conexión y fin de oración: と, や, ね, よ, ぞ y ぜ',
    subtitle: 'Citas directas, listas abiertas o cerradas y matices expresivos al cerrar una frase',
    sourceBook: 'Partículas del Japonés — Japonés a Fondo',
    grammarPoints: [
      {
        pattern: 'と (to) — Lista exhaustiva, compañía, cita directa y condicional natural',
        reading: 'to',
        meaning: 'Y (completo) / Con / Dijo que "..." / Consecuencia natural',
        explanation:
          'Conecta elementos de forma cerrada y definitiva ("café y pastel"), indica compañía ("con un amigo"), introduce citas o pensamientos exactos ante 言う・思う y expresa resultados automáticos.',
        formation: 'A + と + B | 「Cita」 + と + 言います / 決めています',
        examples: [
          { ja: '友達と映画を見ます。', reading: 'ともだち と えいが を みます。', romaji: 'Tomodachi to eiga o mimasu.', es: 'Veo una película con un amigo.' },
          { ja: '彼は「元気です」と言いました。', reading: 'かれ は 「げんき です」 と いいました。', romaji: 'Kare wa "genki desu" to iimashita.', es: 'Él dijo "estoy bien".' },
        ],
      },
      {
        pattern: 'や (ya) — Enumeración no exhaustiva (con など)',
        reading: 'ya',
        meaning: 'Entre otras cosas / Como A, B, etc.',
        explanation:
          'A diferencia de と (lista cerrada), や enumera ejemplos representativos dejando abierto que existen otros más. Suele acompañarse de など (nado) al final.',
        formation: 'A + や + B + (など)',
        examples: [
          { ja: '趣味は読書や映画鑑賞です。', reading: 'しゅみ は どくしょ や えいが かんしょう です。', romaji: 'Shumi wa dokusho ya eiga kanshō desu.', es: 'Mis pasatiempos incluyen leer y ver películas.' },
          { ja: 'このレストランは寿司や刺身などを提供しています。', reading: 'この レストラン は すし や さしみ など を ていきょう しています。', romaji: 'Kono resutoran wa sushi ya sashimi nado o teikyō shite imasu.', es: 'Este restaurante ofrece sushi, sashimi, y más.' },
        ],
      },
      {
        pattern: 'ね (ne) vs よ (yo) — Armonía y confirmación frente a certeza e información nueva',
        reading: 'ne / yo',
        meaning: '¿verdad? / ¿vale? (ね) vs te aseguro / ya sabes (よ)',
        explanation:
          'ね busca acuerdo, empatía o suaviza peticiones manteniendo la armonía de la conversación. よ transmite certeza e informa al oyente de algo que probablemente no sabía (conviene modularla según el grado de confianza).',
        formation: 'Oración + ね / よ',
        examples: [
          { ja: '今日は寒いですね。少し待ってね。', reading: 'きょう は さむい です ね。すこし まって ね。', romaji: 'Kyō wa samui desu ne. Sukoshi matte ne.', es: 'Hace frío hoy, ¿verdad? Espera un poco, ¿vale?' },
          { ja: '明日は雨が降るよ。', reading: 'あした は あめ が ふる よ。', romaji: 'Ashita wa ame ga furu yo.', es: 'Lloverá mañana, te lo aseguro.' },
        ],
      },
      {
        pattern: 'ぞ (zo) y ぜ (ze) — Énfasis enérgico, determinación y camaradería',
        reading: 'zo / ze',
        meaning: 'Fuerte determinación, advertencia (ぞ) o entusiasmo asertivo (ぜ)',
        explanation:
          'Partículas finales de registro coloquial, enérgico y tradicionalmente masculino (muy frecuentes en manga, anime y literatura). ぞ proyecta fuerza o advertencia directa ("¡No lo olvides!"), mientras ぜ suena ligeramente más ligero, juvenil y de camaradería.',
        formation: 'Oración informal / imperativo + ぞ / ぜ',
        examples: [
          { ja: 'これが最後の警告だぞ。忘れるなぞ。', reading: 'これ が さいご の けいこく だ ぞ。わすれる な ぞ。', romaji: 'Kore ga saigo no keikoku da zo. Wasureru na zo.', es: 'Esta es la última advertencia. No lo olvides.' },
          { ja: '絶対に勝つぜ。やってみせるぜ。', reading: 'ぜったい に かつ ぜ。やって みせる ぜ。', romaji: 'Zettai ni katsu ze. Yatte miseru ze.', es: 'Definitivamente ganaré. Te mostraré cómo se hace.' },
        ],
      },
    ],
    vocabulary: [
      { word: '趣味', reading: 'しゅみ', romaji: 'shumi', meaning: 'afición, pasatiempo', pos: 'sustantivo' },
      { word: '読書', reading: 'どくしょ', romaji: 'dokusho', meaning: 'lectura', pos: 'sustantivo' },
      { word: '宿題', reading: 'しゅくだい', romaji: 'shukudai', meaning: 'deberes, tarea', pos: 'sustantivo' },
      { word: '注文', reading: 'ちゅうもん', romaji: 'chūmon', meaning: 'pedido', pos: 'sustantivo / suru' },
      { word: '忘れ物', reading: 'わすれもの', romaji: 'wasuremono', meaning: 'objeto olvidado', pos: 'sustantivo' },
      { word: '絶対', reading: 'ぜったい', romaji: 'zettai', meaning: 'absolutamente, sin falta', pos: 'adverbio' },
    ],
    kanjiList: [
      { character: '趣', meaning: 'afición, matiz', onyomi: 'シュ', kunyomi: 'おもむき', strokes: 15, mnemonic: 'Correr (走) tras aquello que te atrapa (取) el interés.', compounds: ['趣味 (しゅみ) pasatiempo', '趣旨 (しゅし) propósito'] },
      { character: '読', meaning: 'leer', onyomi: 'ドク, トク', kunyomi: 'よ(む)', strokes: 14, mnemonic: 'Palabras (言) que se venden (売) en libros para leer.', compounds: ['読書 (どくしょ) lectura', '読む (よむ) leer'] },
    ],
    dialogue: [
      { speaker: 'ゆうた', ja: '週末は友達と新宿で寿司や天ぷらを食べましたよ。', reading: 'しゅうまつ は ともだち と しんじゅく で すし や てんぷら を たべました よ。', romaji: 'Shūmatsu wa tomodachi to Shinjuku de sushi ya tenpura o tabemashita yo.', es: 'El fin de semana comí sushi, tempura y más con un amigo en Shinjuku, ¿sabes?' },
      { speaker: 'エレナ', ja: 'わあ、美味しそうですね！先生も「その店はおいしい」と言っていましたね。', reading: 'わあ、おいしそう です ね！せんせい も 「その みせ は おいしい」 と いって いました ね。', romaji: 'Wā, oishisō desu ne! Sensei mo "sono mise wa oishii" to itte imashita ne.', es: '¡Qué rico suena! El profesor también decía "ese restaurante es delicioso", ¿verdad?' },
    ],
    exercises: [
      {
        id: 'n4-3-ex1',
        type: 'choice',
        prompt: 'Elige la partícula para enumerar ejemplos de forma abierta ("manzanas, plátanos, entre otras cosas"):',
        options: ['リンゴやバナナを買いました。', 'リンゴぞバナナを買いました。', 'リンゴねバナナを買いました。', 'リンゴぜバナナを買いました。'],
        correctIndex: 0,
        explanation: 'や enumera ejemplos no exhaustivos dejando abierta la lista.',
      },
      {
        id: 'n4-3-ex2',
        type: 'choice',
        prompt: '¿Qué diferencia clave hay entre terminar una frase con ね y terminarla con よ?',
        options: [
          'ね busca acuerdo/confirmación empática; よ aporta certeza o información nueva al oyente.',
          'ね es para advertencias bruscas; よ solo se usa en preguntas.',
          'Ambas son partículas de cita directa.',
          'よ solo aparece con listas no exhaustivas.',
        ],
        correctIndex: 0,
        explanation: 'ね invita al asentimiento ("¿verdad?") mientras よ afirma con seguridad algo nuevo para quien escucha.',
      },
    ],
    unitExam: [
      {
        id: 'n4-3-exam1',
        type: 'choice',
        prompt: 'Completa la cita directa: 先生は「宿題を忘れないで」 ___ 言った。',
        options: ['と', 'や', 'ね', 'ぞ'],
        correctIndex: 0,
        explanation: 'と marca citas directas y pensamientos antes de verbos como 言う o 思う.',
      },
      {
        id: 'n4-3-exam2',
        type: 'choice',
        prompt: '¿En qué contexto es apropiado usar las partículas finales ぞ o ぜ?',
        options: [
          'En entrevistas de trabajo formales y lenguaje honorífico.',
          'En habla muy coloquial, enérgica o de camaradería (frecuente en manga y anime).',
          'Exclusivamente para marcar la hora exacta.',
          'Para sustituir a la partícula de posesión の.',
        ],
        correctIndex: 1,
        explanation: 'ぞ y ぜ transmiten determinación o actitud asertiva en registro informal; deben evitarse en trato formal.',
      },
      {
        id: 'n4-3-exam3',
        type: 'choice',
        prompt: 'Si pides exactamente dos cosas concretas (café y pastel), ¿qué partícula usas?',
        options: ['コーヒーとケーキ', 'コーヒーやケーキ', 'コーヒーかケーキ', 'コーヒーもケーキ'],
        correctIndex: 0,
        explanation: 'と conecta listas cerradas y exactas ("café y pastel").',
      },
    ],
  },
  {
    level: 'N3',
    unitNumber: 1,
    title: 'Matices intermedios: 〜ようにする, 〜わけだ y voz pasiva',
    subtitle: 'Expresar hábitos conscientes, deducciones lógicas y perspectiva pasiva',
    sourceBook: 'Gramática Intermedia Completa · JLPT N3',
    grammarPoints: [
      {
        pattern: '〜ようにする',
        reading: '~you ni suru',
        meaning: 'Procurar / esforzarse por mantener un hábito',
        explanation:
          'Indica un esfuerzo consciente y constante por hacer (o evitar hacer con ない) determinada acción en la vida diaria.',
        formation: 'Verbo (diccionario / ない) + ようにする',
        examples: [
          {
            ja: '毎日日本語で日記を書くようにしています。',
            reading: 'まいにち にほんご で にっき を かく よう に しています。',
            romaji: 'Mainichi nihongo de nikki o kaku you ni shite imasu.',
            es: 'Procuro escribir un diario en japonés todos los días.',
          },
        ],
      },
      {
        pattern: '〜わけではない',
        reading: '~wake dewa nai',
        meaning: 'No es que ~ / No significa necesariamente que ~',
        explanation:
          'Suaviza una negación evitando absolutos. Muy común en japonés natural para sonar diplomático y preciso.',
        formation: 'Forma simple + わけではない',
        examples: [
          {
            ja: '漢字が嫌いなわけではないですが、覚えるのに時間がかかります。',
            reading: 'かんじ が きらい な わけ ではない です が、おぼえる の に じかん が かかります。',
            romaji: 'Kanji ga kirai na wake dewa nai desu ga, oboeru no ni jikan ga kakarimasu.',
            es: 'No es que odie los kanji, pero lleva tiempo memorizarlos.',
          },
        ],
      },
    ],
    vocabulary: [
      { word: '日記', reading: 'にっき', romaji: 'nikki', meaning: 'diario personal', pos: 'sustantivo' },
      { word: '習慣', reading: 'しゅうかん', romaji: 'shuukan', meaning: 'hábito, costumbre', pos: 'sustantivo' },
      { word: '表現', reading: 'ひょうげん', romaji: 'hyougen', meaning: 'expresión', pos: 'sustantivo' },
      { word: '自然', reading: 'しぜん', romaji: 'shizen', meaning: 'natural / naturaleza', pos: 'sustantivo / adj-na' },
    ],
    kanjiList: [
      { character: '習', meaning: 'aprender, practicar', onyomi: 'シュウ', kunyomi: 'なら(う)', strokes: 11, mnemonic: 'Plumas (羽) practicando el vuelo cada día blanco (白).', compounds: ['練習 (れんしゅう) práctica', '習慣 (しゅうかん) hábito'] },
      { character: '現', meaning: 'aparecer, actual', onyomi: 'ゲン', kunyomi: 'あらわ(れる)', strokes: 11, mnemonic: 'Una joya (王) que se deja ver (見) con claridad.', compounds: ['表現 (ひょうげん) expresión', '現在 (げんざい) actualidad'] },
    ],
    dialogue: [
      { speaker: '先生', ja: '自然な発音を身につけるために、何をしていますか。', reading: 'しぜん な はつおん を みにつける ため に、なに を しています か。', romaji: 'Shizen na hatsuon o mi ni tsukeru tame ni, nani o shite imasu ka.', es: '¿Qué haces para adquirir una pronunciación natural?' },
      { speaker: 'エレナ', ja: '寝る前に十分だけ音読するようにしています。完璧なわけではないですが、少し慣れてきました。', reading: 'ねる まえ に じゅっぷん だけ おんどくする よう に しています。かんぺき な わけ ではない です が、すこし なれて きました。', romaji: 'Neru mae ni juppun dake ondoku suru you ni shite imasu. Kanpeki na wake dewa nai desu ga, sukoshi narete kimashita.', es: 'Procuro leer en voz alta diez minutos antes de dormir. No es que sea perfecto, pero me he ido acostumbrando.' },
    ],
    exercises: [
      {
        id: 'n3-1-ex1',
        type: 'choice',
        prompt: 'Elige la estructura correcta para "Procuro no olvidar los repasos":',
        options: ['復習を忘れないようにしています。', '復習を忘れるわけではないです。', '復習を忘れたつもりです。', '復習を忘れてしまいます。'],
        correctIndex: 0,
        explanation: 'Forma ない + ようにしています expresa un esfuerzo continuo por evitar algo.',
      },
    ],
    unitExam: [
      {
        id: 'n3-1-exam1',
        type: 'choice',
        prompt: '¿Qué matiz aporta "高いからといって、おいしいわけではない"?',
        options: ['Porque es caro, seguro está bueno.', 'No por ser caro significa necesariamente que esté bueno.', 'Intento comer cosas caras.', 'Es caro y además está bueno.'],
        correctIndex: 1,
        explanation: 'わけではない niega una conclusión automática o absoluta.',
      },
      {
        id: 'n3-1-exam2',
        type: 'choice',
        prompt: 'Lectura correcta de 習慣 (hábito):',
        options: ['れんしゅう', 'しゅうかん', 'ひょうげん', 'にっき'],
        correctIndex: 1,
        explanation: '習慣 se lee しゅうかん (shuukan).',
      },
    ],
  },
  {
    level: 'N3',
    unitNumber: 2,
    title: 'Keigo esencial: lenguaje honorífico (尊敬語) y humilde (謙譲語)',
    subtitle: 'Comunicación respetuosa en contextos profesionales y culturales de Japón',
    sourceBook: 'Gramática Intermedia Completa · JLPT N3',
    grammarPoints: [
      {
        pattern: 'お + Raíz ます + になる (Sonkeigo)',
        reading: 'o + stem + ni naru',
        meaning: 'Elevar la acción del interlocutor con respeto',
        explanation:
          'Se usa para hablar de las acciones de superiores, clientes o personas a quienes mostramos respeto. Nunca se aplica a uno mismo.',
        formation: 'お + raíz ます + になります',
        examples: [
          {
            ja: '先生はもうお帰りになりました。',
            reading: 'せんせい は もう おかえり に なりました。',
            romaji: 'Sensei wa mou okaeri ni narimashita.',
            es: 'El profesor ya se ha marchado a casa.',
          },
        ],
      },
      {
        pattern: 'お + Raíz ます + する (Kenjougo)',
        reading: 'o + stem + suru',
        meaning: 'Humillar la propia acción para honrar al oyente',
        explanation: 'Se utiliza exclusivamente para nuestras propias acciones dirigidas a alguien a quien respetamos.',
        formation: 'お + raíz ます + します / いたします',
        examples: [
          {
            ja: 'お荷物をお持ちしましょうか。',
            reading: 'おにもつ を おもち しましょう か。',
            romaji: 'Onimotsu o omochi shimashou ka.',
            es: '¿Le llevo su equipaje?',
          },
        ],
      },
    ],
    vocabulary: [
      { word: 'いらっしゃる', reading: 'いらっしゃる', romaji: 'irassharu', meaning: 'estar / ir / venir (honorífico)', pos: 'verbo Keigo' },
      { word: '参る', reading: 'まいる', romaji: 'mairu', meaning: 'ir / venir (humilde)', pos: 'verbo Keigo' },
      { word: 'おっしゃる', reading: 'おっしゃる', romaji: 'ossharu', meaning: 'decir (honorífico)', pos: 'verbo Keigo' },
      { word: '申す', reading: 'もうす', romaji: 'mousu', meaning: 'llamarse / decir (humilde)', pos: 'verbo Keigo' },
    ],
    kanjiList: [
      { character: '敬', meaning: 'respeto, reverencia', onyomi: 'ケイ', kunyomi: 'うやま(う)', strokes: 12, mnemonic: 'Inclinar la postura con atención y respeto.', compounds: ['敬語 (けいご) lenguaje honorífico', '尊敬 (そんけい) respeto'] },
    ],
    dialogue: [
      { speaker: '受付', ja: 'いらっしゃいませ。ご予約のお名前をお伺いしてもよろしいでしょうか。', reading: 'いらっしゃいませ。ごよやく の おなまえ を おうかがい しても よろしい でしょうか。', romaji: 'Irasshaimase. Goyoyaku no onamae o oukagai shitemo yoroshii deshou ka.', es: 'Bienvenida. ¿Podría preguntarle el nombre de su reserva?' },
      { speaker: 'エレナ', ja: 'エレナと申します。三時に予約いたしました。', reading: 'エレナ と もうします。さんじ に よやく いたしました。', romaji: 'Erena to moushimasu. Sanji ni yoyaku itashimashita.', es: 'Me llamo Elena. Hice una reserva para las tres.' },
    ],
    exercises: [
      {
        id: 'n3-2-ex1',
        type: 'choice',
        prompt: '¿Qué verbo humilde (Kenjougo) usas para presentarte formalmente: "エレナと ___"?',
        options: ['申します', 'おっしゃいます', 'いらっしゃいます', 'ご覧になります'],
        correctIndex: 0,
        explanation: '申します (moushimasu) es la forma humilde de 言う para referirse al propio nombre.',
      },
    ],
    unitExam: [
      {
        id: 'n3-2-exam1',
        type: 'choice',
        prompt: '¿Cuál de estas frases aplica correctamente el lenguaje honorífico hacia un cliente?',
        options: ['私がいらっしゃいました。', 'お客様がお読みになりました。', 'お客様がお持ちします。', '私がおっしゃいました。'],
        correctIndex: 1,
        explanation: 'お + raíz ます + になる eleva respetuosamente la acción del cliente (お客様).',
      },
    ],
  },
  {
    level: 'N2',
    unitNumber: 1,
    title: 'Conectores argumentativos: 〜にもかかわらず, 〜に関して y 〜に応じて',
    subtitle: 'Comprensión de prensa, ensayos y discurso estructurado de nivel avanzado',
    sourceBook: 'Compendio JLPT N2 · Lectura y Gramática',
    grammarPoints: [
      {
        pattern: '〜にもかかわらず',
        reading: '~ni mo kakawarazu',
        meaning: 'A pesar de ~ / Sin importar ~',
        explanation:
          'Conecta una condición previa con un resultado inesperado o contradictorio. Registro más formal que のに.',
        formation: 'Sustantivo / Forma simple + にもかかわらず',
        examples: [
          {
            ja: '忙しいにもかかわらず、わざわざ来てくださってありがとうございます。',
            reading: 'いそがしい にもかかわらず、わざわざ きて くださって ありがとうございます。',
            romaji: 'Isogashii ni mo kakawarazu, wazawaza kite kudasatte arigatou gozaimasu.',
            es: 'Muchas gracias por venir expresamente a pesar de estar ocupado.',
          },
        ],
      },
      {
        pattern: '〜に応じて',
        reading: '~ni oujite',
        meaning: 'De acuerdo con / en función de ~',
        explanation: 'Expresa adaptación proporcional o flexible a un criterio (nivel, presupuesto, estación).',
        formation: 'Sustantivo + に応じて / に応じた + Sustantivo',
        examples: [
          {
            ja: 'レベルに応じて、会話のスピードを調整できます。',
            reading: 'レベル に おうじて、かいわ の スピード を ちょうせい できます。',
            romaji: 'Reberu ni oujite, kaiwa no supiido o chousei dekimasu.',
            es: 'Se puede ajustar la velocidad de la conversación según el nivel.',
          },
        ],
      },
    ],
    vocabulary: [
      { word: '調整', reading: 'ちょうせい', romaji: 'chousei', meaning: 'ajuste, regulación', pos: 'sustantivo' },
      { word: '影響', reading: 'えいきょう', romaji: 'eikyou', meaning: 'influencia, impacto', pos: 'sustantivo' },
      { word: '判断', reading: 'はんだん', romaji: 'handan', meaning: 'juicio, decisión', pos: 'sustantivo' },
      { word: '傾向', reading: 'けいこう', romaji: 'keikou', meaning: 'tendencia', pos: 'sustantivo' },
    ],
    kanjiList: [
      { character: '応', meaning: 'responder, adaptarse', onyomi: 'オウ', kunyomi: 'こた(える)', strokes: 7, mnemonic: 'El corazón (心) respondiendo desde un amplio edificio (广).', compounds: ['対応 (たいおう) respuesta', '応用 (おうよう) aplicación práctica'] },
      { character: '響', meaning: 'resonar, eco', onyomi: 'キョウ', kunyomi: 'ひび(く)', strokes: 20, mnemonic: 'El sonido (音) que resuena a través de una aldea entera.', compounds: ['影響 (えいきょう) influencia', '交響曲 (こうきょうきょく) sinfonía'] },
    ],
    dialogue: [
      { speaker: '司会者', ja: '最近の学習者の傾向に関して、どのような変化を感じますか。', reading: 'さいきん の がくしゅうしゃ の けいこう に かんして、どの ような へんか を かんじます か。', romaji: 'Saikin no gakushuusha no keikou ni kanshite, dono you na henka o kanjimasu ka.', es: 'Con respecto a las tendencias recientes de los estudiantes, ¿qué cambios nota?' },
      { speaker: '講師', ja: '独学であるにもかかわらず、発音や会話力が高い方が増えています。', reading: 'どくがく で ある にもかかわらず、はつおん や かいわりょく が たかい かた が ふえています。', romaji: 'Dokugaku de aru ni mo kakawarazu, hatsuon ya kaiwaryoku ga takai kata ga fuete imasu.', es: 'A pesar de estudiar de forma autodidacta, cada vez hay más personas con excelente pronunciación y fluidez.' },
    ],
    exercises: [
      {
        id: 'n2-1-ex1',
        type: 'choice',
        prompt: 'Completa: 季節の気温 ___ 服装を変えます。(Cambiar de ropa según la temperatura de la estación)',
        options: ['に応じて', 'にもかかわらず', 'にかけて', 'をめぐって'],
        correctIndex: 0,
        explanation: 'に応じて indica adaptación en función de una variable cambiante.',
      },
    ],
    unitExam: [
      {
        id: 'n2-1-exam1',
        type: 'choice',
        prompt: 'Elige el conector correcto: 雨が強い ___、祭りは予定通り行われた。',
        options: ['にもかかわらず', 'に応じて', 'にしたがって', 'に際して'],
        correctIndex: 0,
        explanation: 'Se contrasta la lluvia intensa con el hecho de que el festival se celebró igualmente.',
      },
    ],
  },
  {
    level: 'N1',
    unitNumber: 1,
    title: 'Discurso literario y matices clásicos: 〜ざるを得ない, 〜をもって y 〜極まりない',
    subtitle: 'Precisión estilística, retórica formal y comprensión de textos de alto nivel',
    sourceBook: 'Compendio Superior JLPT N1 · Estilo y Retórica',
    grammarPoints: [
      {
        pattern: '〜ざるを得ない',
        reading: '~zaru o enai',
        meaning: 'No tener más remedio que ~ / Verse obligado a ~',
        explanation:
          'Conserva el auxiliar negativo clásico ざる. Se emplea en registro culto o profesional cuando las circunstancias impiden otra alternativa.',
        formation: 'Raíz ない (する → せ) + ざるを得ない',
        examples: [
          {
            ja: 'このデータを見れば、計画を見直さざるを得ない。',
            reading: 'この データ を みれば、けいかく を みなおさざる を えない。',
            romaji: 'Kono deeta o mireba, keikaku o minaosa zaru o enai.',
            es: 'A la vista de estos datos, no queda más remedio que revisar el plan.',
          },
        ],
      },
      {
        pattern: '〜をもって',
        reading: '~o motte',
        meaning: 'Mediante / Con fecha de (cierre solemne o medio formal)',
        explanation:
          'Frecuente en comunicados oficiales, ceremonias y textos académicos para marcar el límite temporal exacto o el instrumento empleado.',
        formation: 'Sustantivo + をもって',
        examples: [
          {
            ja: '本日をもって、第一期の講座を終了いたします。',
            reading: 'ほんじつ を もって、だいいっき の こうざ を しゅうりょう いたします。',
            romaji: 'Honjitsu o motte, daiikki no kouza o shuuryou itashimasu.',
            es: 'Con fecha de hoy damos por concluido el curso del primer periodo.',
          },
        ],
      },
    ],
    vocabulary: [
      { word: '見直す', reading: 'みなおす', romaji: 'minaosu', meaning: 'revisar, reconsiderar', pos: 'verbo Godan' },
      { word: '言の葉', reading: 'ことのは', romaji: 'kotonoha', meaning: 'palabras, lenguaje (poético)', pos: 'sustantivo' },
      { word: '趣', reading: 'おもむき', romaji: 'omomuki', meaning: 'encanto sutil, sabor estético', pos: 'sustantivo' },
      { word: '培う', reading: 'つちかう', romaji: 'tsuchikau', meaning: 'cultivar, fomentar', pos: 'verbo Godan' },
    ],
    kanjiList: [
      { character: '趣', meaning: 'esencia, encanto', onyomi: 'シュ', kunyomi: 'おもむき', strokes: 15, mnemonic: 'Avanzar (走) para recoger (取) el matiz estético de las cosas.', compounds: ['趣味 (しゅみ) afición', '趣旨 (しゅし) propósito'] },
      { character: '培', meaning: 'cultivar', onyomi: 'バイ', kunyomi: 'つちか(う)', strokes: 11, mnemonic: 'Cuidar la tierra (土) para que crezcan frutos duraderos.', compounds: ['栽培 (さいばい) cultivo', '培養 (ばいよう) crianza'] },
    ],
    dialogue: [
      { speaker: '教授', ja: '古来の「言の葉」には、四季の移ろいを映す深い趣があります。', reading: 'こらい の 「ことのは」 に は、しき の うつろい を うつす ふかい おもむき が あります。', romaji: 'Korai no kotonoha ni wa, shiki no utsuroi o utsusu fukai omomuki ga arimasu.', es: 'En las antiguas "hojas de palabras" reside un profundo encanto que refleja el paso de las cuatro estaciones.' },
      { speaker: 'エレナ', ja: 'まさにそうですね。言葉の背景にある文化まで理解せずにはいられません。', reading: 'まさに そう です ね。ことば の はいけい に ある ぶんか まで りかい せず に は いられません。', romaji: 'Masani sou desu ne. Kotoba no haikei ni aru bunka made rikai sezu ni wa iraremasen.', es: 'Exactamente. Uno no puede evitar querer comprender hasta la cultura que subyace tras las palabras.' },
    ],
    exercises: [
      {
        id: 'n1-1-ex1',
        type: 'choice',
        prompt: 'Forma correcta de する antes de ざるを得ない:',
        options: ['せざるを得ない', 'しざるを得ない', 'すざるを得ない', 'さざるを得ない'],
        correctIndex: 0,
        explanation: 'Con el auxiliar clásico ざる, el verbo する adopta la forma irregular せざるを得ない.',
      },
    ],
    unitExam: [
      {
        id: 'n1-1-exam1',
        type: 'choice',
        prompt: 'Completa el anuncio formal: ただいま ___、閉会とさせていただきます。',
        options: ['をもって', 'にかけて', 'に反して', 'をよそに'],
        correctIndex: 0,
        explanation: 'をもって marca el momento solemne de cierre en ceremonias y comunicados.',
      },
    ],
  },
];

export const SEED_DICTIONARY: SeedDictionaryEntry[] = [
  // Diccionario Esencial JLPT
  { word: 'おはよう', reading: 'おはよう', romaji: 'ohayou', meaningEs: 'buenos días (informal; cortés: おはようございます)', partOfSpeech: 'expresión', jlptLevel: 'N5', exampleJa: 'おはようございます、先生。', exampleReading: 'おはようございます、せんせい。', exampleEs: 'Buenos días, profesor.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['saludos', 'diario'] },
  { word: 'ありがとう', reading: 'ありがとう', romaji: 'arigatou', meaningEs: 'gracias (cortés: ありがとうございます)', partOfSpeech: 'expresión', jlptLevel: 'N5', exampleJa: '教えてくれてありがとうございます。', exampleReading: 'おしえて くれて ありがとうございます。', exampleEs: 'Muchas gracias por enseñarme.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['saludos', 'cortesía'] },
  { word: 'すみません', reading: 'すみません', romaji: 'sumimasen', meaningEs: 'disculpe, perdón, con permiso', partOfSpeech: 'expresión', jlptLevel: 'N5', exampleJa: 'すみません、駅はどこですか。', exampleReading: 'すみません、えき は どこ です か。', exampleEs: 'Disculpe, ¿dónde está la estación?', dictionarySource: 'Diccionario Esencial JLPT', tags: ['cortesía', 'viajes'] },
  { word: '水', reading: 'みず', romaji: 'mizu', meaningEs: 'agua (fría / natural)', partOfSpeech: 'sustantivo', jlptLevel: 'N5', exampleJa: '冷たい水をください。', exampleReading: 'つめたい みず を ください。', exampleEs: 'Agua fría, por favor.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['comida', 'básico'] },
  { word: 'お茶', reading: 'おちゃ', romaji: 'ocha', meaningEs: 'té (especialmente té verde japonés)', partOfSpeech: 'sustantivo', jlptLevel: 'N5', exampleJa: '温かいお茶を飲みましょう。', exampleReading: 'あたたかい おちゃ を のみましょう。', exampleEs: 'Tomemos un té caliente.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['comida', 'cultura'] },
  { word: '電車', reading: 'でんしゃ', romaji: 'densha', meaningEs: 'tren eléctrico', partOfSpeech: 'sustantivo', jlptLevel: 'N5', exampleJa: '電車で新宿へ行きます。', exampleReading: 'でんしゃ で しんじゅく へ いきます。', exampleEs: 'Voy a Shinjuku en tren.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['transporte', 'ciudad'] },
  { word: '友達', reading: 'ともだち', romaji: 'tomodachi', meaningEs: 'amigo, amiga', partOfSpeech: 'sustantivo', jlptLevel: 'N5', exampleJa: '日本人の友達と会話します。', exampleReading: 'にほんじん の ともだち と かいわ します。', exampleEs: 'Converso con mi amigo japonés.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['personas'] },
  { word: '天気', reading: 'てんき', romaji: 'tenki', meaningEs: 'tiempo atmosférico, clima', partOfSpeech: 'sustantivo', jlptLevel: 'N5', exampleJa: '今日はいい天気ですね。', exampleReading: 'きょう は いい てんき です ね。', exampleEs: 'Hoy hace buen tiempo, ¿verdad?', dictionarySource: 'Diccionario Esencial JLPT', tags: ['naturaleza'] },
  { word: '桜', reading: 'さくら', romaji: 'sakura', meaningEs: 'flor de cerezo', partOfSpeech: 'sustantivo', jlptLevel: 'N4', exampleJa: '春になると桜が咲きます。', exampleReading: 'はる に なる と さくら が さきます。', exampleEs: 'Cuando llega la primavera florecen los cerezos.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['cultura', 'naturaleza'] },
  { word: '富士山', reading: 'ふじさん', romaji: 'Fujisan', meaningEs: 'Monte Fuji', partOfSpeech: 'nombre propio', jlptLevel: 'N4', exampleJa: '新幹線から富士山が見えました。', exampleReading: 'しんかんせん から ふじさん が みえました。', exampleEs: 'Se vio el Monte Fuji desde el tren bala.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['geografía', 'cultura'] },
  { word: '文化', reading: 'ぶんか', romaji: 'bunka', meaningEs: 'cultura', partOfSpeech: 'sustantivo', jlptLevel: 'N4', exampleJa: '日本の伝統文化に興味があります。', exampleReading: 'にほん の でんとう ぶんか に きょうみ が あります。', exampleEs: 'Tengo interés en la cultura tradicional japonesa.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['cultura'] },
  { word: '発音', reading: 'はつおん', romaji: 'hatsuon', meaningEs: 'pronunciación', partOfSpeech: 'sustantivo', jlptLevel: 'N4', exampleJa: '長音の発音に気をつけましょう。', exampleReading: 'ちょうおん の はつおん に き を つけましょう。', exampleEs: 'Prestemos atención a la pronunciación de las vocales largas.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['estudio', 'oral'] },
  { word: '会話', reading: 'かいわ', romaji: 'kaiwa', meaningEs: 'conversación, diálogo', partOfSpeech: 'sustantivo', jlptLevel: 'N4', exampleJa: '毎日少しずつ会話の練習をします。', exampleReading: 'まいにち すこしずつ かいわ の れんしゅう を します。', exampleEs: 'Practico conversación poco a poco cada día.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['estudio', 'oral'] },
  { word: '経験', reading: 'けいけん', romaji: 'keiken', meaningEs: 'experiencia', partOfSpeech: 'sustantivo', jlptLevel: 'N4', exampleJa: '日本に住んだ経験がありますか。', exampleReading: 'にほん に すんだ けいけん が あります か。', exampleEs: '¿Tienes experiencia viviendo en Japón?', dictionarySource: 'Diccionario Esencial JLPT', tags: ['vida'] },
  { word: '習慣', reading: 'しゅうかん', romaji: 'shuukan', meaningEs: 'hábito, costumbre', partOfSpeech: 'sustantivo', jlptLevel: 'N4', exampleJa: '毎朝復習する習慣をつけました。', exampleReading: 'まいあさ ふくしゅう する しゅうかん を つけました。', exampleEs: 'Adquirí el hábito de repasar todas las mañanas.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['estudio'] },
  { word: '目的', reading: 'もくてき', romaji: 'mokuteki', meaningEs: 'propósito, objetivo', partOfSpeech: 'sustantivo', jlptLevel: 'N3', exampleJa: '日本語を学ぶ目的は何ですか。', exampleReading: 'にほんご を まなぶ もくてき は なん です か。', exampleEs: '¿Cuál es tu objetivo al estudiar japonés?', dictionarySource: 'Diccionario Esencial JLPT', tags: ['abstracto'] },
  { word: '雰囲気', reading: 'ふんいき', romaji: 'funiki', meaningEs: 'ambiente, atmósfera', partOfSpeech: 'sustantivo', jlptLevel: 'N3', exampleJa: 'この喫茶店は落ち着いた雰囲気ですね。', exampleReading: 'この きっさてん は おちついた ふんいき です ね。', exampleEs: 'Esta cafetería tiene un ambiente muy tranquilo.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['sensaciones'] },
  { word: '感動', reading: 'かんどう', romaji: 'kandou', meaningEs: 'emoción profunda, conmoción', partOfSpeech: 'sustantivo', jlptLevel: 'N3', exampleJa: '浮世絵の美しさに感動しました。', exampleReading: 'うきよえ の うつくしさ に かんどう しました。', exampleEs: 'Me conmovió la belleza del grabado ukiyo-e.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['emociones', 'arte'] },
  { word: '影響', reading: 'えいきょう', romaji: 'eikyou', meaningEs: 'influencia, efecto', partOfSpeech: 'sustantivo', jlptLevel: 'N3', exampleJa: '北斎の波は西洋美術に大きな影響を与えた。', exampleReading: 'ほくさい の なみ は せいよう びじゅつ に おおきな えいきょう を あたえた。', exampleEs: 'La ola de Hokusai tuvo una gran influencia en el arte occidental.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['cultura', 'historia'] },
  { word: '洗練', reading: 'せんれん', romaji: 'senren', meaningEs: 'refinamiento, elegancia depurada', partOfSpeech: 'sustantivo', jlptLevel: 'N1', exampleJa: '洗練されたデザインですね。', exampleReading: 'せんれん された デザイン です ね。', exampleEs: 'Es un diseño sumamente refinado.', dictionarySource: 'Diccionario Esencial JLPT', tags: ['estética'] },

  // Diccionario de Verbos y Conjugaciones
  { word: '食べる', reading: 'たべる', romaji: 'taberu', meaningEs: 'comer (Ichidan · ます: 食べます · て: 食べて)', partOfSpeech: 'verbo Ichidan', jlptLevel: 'N5', exampleJa: '朝ごはんを食べましたか。', exampleReading: 'あさごはん を たべました か。', exampleEs: '¿Has desayunado?', dictionarySource: 'Diccionario de Verbos y Conjugaciones', tags: ['verbos', 'ichidan'] },
  { word: '飲む', reading: 'のむ', romaji: 'nomu', meaningEs: 'beber (Godan · ます: 飲みます · て: 飲んで)', partOfSpeech: 'verbo Godan', jlptLevel: 'N5', exampleJa: '抹茶を飲んでみたいです。', exampleReading: 'まっちゃ を のんで みたい です。', exampleEs: 'Quiero probar el té matcha.', dictionarySource: 'Diccionario de Verbos y Conjugaciones', tags: ['verbos', 'godan'] },
  { word: '行く', reading: 'いく', romaji: 'iku', meaningEs: 'ir (Godan · ます: 行きます · て: 行って)', partOfSpeech: 'verbo Godan', jlptLevel: 'N5', exampleJa: '週末に京都へ行きます。', exampleReading: 'しゅうまつ に きょうと へ いきます。', exampleEs: 'El fin de semana voy a Kioto.', dictionarySource: 'Diccionario de Verbos y Conjugaciones', tags: ['verbos', 'movimiento'] },
  { word: '聞く', reading: 'きく', romaji: 'kiku', meaningEs: 'escuchar, preguntar (Godan · て: 聞いて)', partOfSpeech: 'verbo Godan', jlptLevel: 'N5', exampleJa: 'ネイティブの発音をよく聞いてください。', exampleReading: 'ネイティブ の はつおん を よく きいて ください。', exampleEs: 'Escucha con atención la pronunciación nativa.', dictionarySource: 'Diccionario de Verbos y Conjugaciones', tags: ['verbos', 'oral'] },
  { word: '話す', reading: 'はなす', romaji: 'hanasu', meaningEs: 'hablar, conversar (Godan · て: 話して)', partOfSpeech: 'verbo Godan', jlptLevel: 'N5', exampleJa: 'ゆっくり話しても大丈夫です。', exampleReading: 'ゆっくり はなしても だいじょうぶ です。', exampleEs: 'No pasa nada si hablas despacio.', dictionarySource: 'Diccionario de Verbos y Conjugaciones', tags: ['verbos', 'oral'] },
  { word: '覚える', reading: 'おぼえる', romaji: 'oboeru', meaningEs: 'memorizar, recordar (Ichidan · て: 覚えて)', partOfSpeech: 'verbo Ichidan', jlptLevel: 'N5', exampleJa: '毎日十個の単語を覚えます。', exampleReading: 'まいにち じゅっこ の たんご を おぼえます。', exampleEs: 'Memorizo diez palabras cada día.', dictionarySource: 'Diccionario de Verbos y Conjugaciones', tags: ['verbos', 'estudio'] },
  { word: '忘れる', reading: 'わすれる', romaji: 'wasureru', meaningEs: 'olvidar (Ichidan · て: 忘れて)', partOfSpeech: 'verbo Ichidan', jlptLevel: 'N5', exampleJa: '間隔反復を使えば忘れにくくなります。', exampleReading: 'かんかく はんぷく を つかえば わすれにくく なります。', exampleEs: 'Si usas repetición espaciada cuesta más olvidar.', dictionarySource: 'Diccionario de Verbos y Conjugaciones', tags: ['verbos', 'estudio'] },
  { word: '続ける', reading: 'つづける', romaji: 'tsuzukeru', meaningEs: 'continuar, perseverar (Ichidan)', partOfSpeech: 'verbo Ichidan', jlptLevel: 'N4', exampleJa: '楽しく勉強を続けることが大切です。', exampleReading: 'たのしく べんきょう を つづける こと が たいせつ です。', exampleEs: 'Lo más importante es continuar estudiando con disfrute.', dictionarySource: 'Diccionario de Verbos y Conjugaciones', tags: ['verbos'] },
  { word: '直す', reading: 'なおす', romaji: 'naosu', meaningEs: 'corregir, enmendar, reparar (Godan)', partOfSpeech: 'verbo Godan', jlptLevel: 'N4', exampleJa: 'イントネーションを直してもらいました。', exampleReading: 'イントネーション を なおして もらいました。', exampleEs: 'Me corrigieron la entonación.', dictionarySource: 'Diccionario de Verbos y Conjugaciones', tags: ['verbos', 'oral'] },
  { word: '身につける', reading: 'みにつける', romaji: 'mi ni tsukeru', meaningEs: 'adquirir una habilidad, dominar', partOfSpeech: 'locución verbal', jlptLevel: 'N3', exampleJa: '自然な敬語を身につけたいです。', exampleReading: 'しぜん な けいご を みにつけたい です。', exampleEs: 'Quiero llegar a dominar el keigo natural.', dictionarySource: 'Diccionario de Verbos y Conjugaciones', tags: ['verbos', 'estudio'] },
  { word: '見直す', reading: 'みなおす', romaji: 'minaosu', meaningEs: 'revisar, reevaluar (Godan)', partOfSpeech: 'verbo Godan', jlptLevel: 'N2', exampleJa: '学習計画を見直す時期です。', exampleReading: 'がくしゅう けいかく を みなおす じき です。', exampleEs: 'Es momento de revisar el plan de estudio.', dictionarySource: 'Diccionario de Verbos y Conjugaciones', tags: ['verbos'] },
  { word: '培う', reading: 'つちかう', romaji: 'tsuchikau', meaningEs: 'cultivar, nutrir una capacidad', partOfSpeech: 'verbo Godan', jlptLevel: 'N1', exampleJa: '対話を通じて語学力を培う。', exampleReading: 'たいわ を つうじて ごがくりょく を つちかう。', exampleEs: 'Cultivar la competencia lingüística mediante el diálogo.', dictionarySource: 'Diccionario de Verbos y Conjugaciones', tags: ['verbos', 'formal'] },

  // Diccionario de Kanji y Compuestos
  { word: '言の葉', reading: 'ことのは', romaji: 'kotonoha', meaningEs: 'palabras, hojas del lenguaje (expresión clásica)', partOfSpeech: 'sustantivo', jlptLevel: 'N1', exampleJa: '美しい言の葉を大切にしたい。', exampleReading: 'うつくしい ことのは を たいせつ に したい。', exampleEs: 'Quiero atesorar las palabras hermosas.', dictionarySource: 'Diccionario de Kanji y Compuestos', tags: ['poético', 'kanji'] },
  { word: '書道', reading: 'しょどう', romaji: 'shodou', meaningEs: 'caligrafía japonesa (el camino de la escritura)', partOfSpeech: 'sustantivo', jlptLevel: 'N3', exampleJa: '週末に書道の教室へ通っています。', exampleReading: 'しゅうまつ に しょどう の きょうしつ へ かよっています。', exampleEs: 'Los fines de semana asisto a clases de caligrafía.', dictionarySource: 'Diccionario de Kanji y Compuestos', tags: ['arte', 'escritura'] },
  { word: '浮世絵', reading: 'うきよえ', romaji: 'ukiyoe', meaningEs: 'grabado tradicional japonés (mundo flotante)', partOfSpeech: 'sustantivo', jlptLevel: 'N2', exampleJa: '神奈川沖浪裏は最も有名な浮世絵です。', exampleReading: 'かながわおきなみうら は もっとも ゆうめい な うきよえ です。', exampleEs: 'La gran ola de Kanagawa es el ukiyo-e más famoso.', dictionarySource: 'Diccionario de Kanji y Compuestos', tags: ['arte', 'cultura'] },
  { word: '和紙', reading: 'わし', romaji: 'washi', meaningEs: 'papel tradicional japonés hecho a mano', partOfSpeech: 'sustantivo', jlptLevel: 'N3', exampleJa: '和紙は柔らかくて丈夫です。', exampleReading: 'わし は やわらかくて じょうぶ です。', exampleEs: 'El papel washi es suave y resistente.', dictionarySource: 'Diccionario de Kanji y Compuestos', tags: ['artesanía', 'cultura'] },
  { word: '語彙', reading: 'ごい', romaji: 'goi', meaningEs: 'vocabulario, léxico', partOfSpeech: 'sustantivo', jlptLevel: 'N2', exampleJa: '読書をすると語彙が増えます。', exampleReading: 'どくしょ を する と ごい が ふえます。', exampleEs: 'Al leer aumenta el vocabulario.', dictionarySource: 'Diccionario de Kanji y Compuestos', tags: ['estudio'] },
  { word: '文法', reading: 'ぶんぽう', romaji: 'bunpou', meaningEs: 'gramática', partOfSpeech: 'sustantivo', jlptLevel: 'N4', exampleJa: '文法の基礎をしっかり固めましょう。', exampleReading: 'ぶんぽう の きそ を しっかり かためましょう。', exampleEs: 'Consolidemos bien las bases de la gramática.', dictionarySource: 'Diccionario de Kanji y Compuestos', tags: ['estudio'] },
  { word: '復習', reading: 'ふくしゅう', romaji: 'fukushuu', meaningEs: 'repaso, revisión de lo estudiado', partOfSpeech: 'sustantivo', jlptLevel: 'N4', exampleJa: '今日の復習カードは十五枚です。', exampleReading: 'きょう の ふくしゅう カード は じゅうごまい です。', exampleEs: 'Las tarjetas de repaso de hoy son quince.', dictionarySource: 'Diccionario de Kanji y Compuestos', tags: ['estudio', 'srs'] },
  { word: '国際交流', reading: 'こくさいこうりゅう', romaji: 'kokusai kouryuu', meaningEs: 'intercambio cultural internacional', partOfSpeech: 'sustantivo', jlptLevel: 'N3', exampleJa: '国際交流のイベントで日本の友達ができました。', exampleReading: 'こくさい こうりゅう の イベント で にほん の ともだち が できました。', exampleEs: 'Hice amigos japoneses en un evento de intercambio internacional.', dictionarySource: 'Diccionario de Kanji y Compuestos', tags: ['comunidad', 'intercambio'] },

  // Expresiones Cotidianas y Onomatopeyas
  { word: 'なるほど', reading: 'なるほど', romaji: 'naruhodo', meaningEs: 'ya veo, claro, tiene sentido', partOfSpeech: 'expresión', jlptLevel: 'N3', exampleJa: 'なるほど、だからこの助詞を使うんですね。', exampleReading: 'なるほど、だから この じょし を つかう ん です ね。', exampleEs: 'Ya veo, por eso se usa esta partícula.', dictionarySource: 'Expresiones Cotidianas y Onomatopeyas', tags: ['conversación', 'natural'] },
  { word: 'お疲れ様です', reading: 'おつかれさまです', romaji: 'otsukaresama desu', meaningEs: 'buen trabajo / gracias por tu esfuerzo', partOfSpeech: 'expresión', jlptLevel: 'N4', exampleJa: '今日も勉強お疲れ様でした！', exampleReading: 'きょう も べんきょう おつかれさま でした！', exampleEs: '¡Buen trabajo con el estudio de hoy!', dictionarySource: 'Expresiones Cotidianas y Onomatopeyas', tags: ['cortesía', 'conversación'] },
  { word: 'わくわく', reading: 'わくわく', romaji: 'wakuwaku', meaningEs: 'estar emocionado, ilusionado (onomatopeya)', partOfSpeech: 'adverbio onomatopéyico', jlptLevel: 'N3', exampleJa: '日本旅行を思うとわくわくします。', exampleReading: 'にほん りょこう を おもう と わくわく します。', exampleEs: 'Me emociono al pensar en el viaje a Japón.', dictionarySource: 'Expresiones Cotidianas y Onomatopeyas', tags: ['onomatopeya', 'emociones'] },
  { word: 'ぺらぺら', reading: 'ぺらぺら', romaji: 'perapera', meaningEs: 'hablar con total fluidez un idioma', partOfSpeech: 'adverbio onomatopéyico', jlptLevel: 'N3', exampleJa: 'いつか日本語がぺらぺらになりたいです。', exampleReading: 'いつか にほんご が ぺらぺら に なりたい です。', exampleEs: 'Algún día quiero hablar japonés con fluidez.', dictionarySource: 'Expresiones Cotidianas y Onomatopeyas', tags: ['onomatopeya', 'oral'] },
  { word: 'コツコツ', reading: 'コツコツ', romaji: 'kotsukotsu', meaningEs: 'con constancia, paso a paso sin rendirse', partOfSpeech: 'adverbio onomatopéyico', jlptLevel: 'N2', exampleJa: '毎日コツコツ続ければ必ず上達します。', exampleReading: 'まいにち コツコツ つづければ かならず じょうたつ します。', exampleEs: 'Si sigues con constancia cada día, mejorarás sin duda.', dictionarySource: 'Expresiones Cotidianas y Onomatopeyas', tags: ['onomatopeya', 'motivación'] },
  { word: '一期一会', reading: 'いちごいちえ', romaji: 'ichigo ichie', meaningEs: 'cada encuentro es único e irrepetible', partOfSpeech: 'yojijukugo', jlptLevel: 'N2', exampleJa: '一期一会の心で人との出会いを大切にします。', exampleReading: 'いちごいちえ の こころ で ひと と の であい を たいせつ に します。', exampleEs: 'Valoro cada encuentro humano con el espíritu de ichigo ichie.', dictionarySource: 'Expresiones Cotidianas y Onomatopeyas', tags: ['cultura', 'proverbio'] },
  { word: '木漏れ日', reading: 'こもれび', romaji: 'komorebi', meaningEs: 'luz del sol filtrándose entre las hojas de los árboles', partOfSpeech: 'sustantivo', jlptLevel: 'N2', exampleJa: '公園の木漏れ日の下で本を読みます。', exampleReading: 'こうえん の こもれび の した で ほん を よみます。', exampleEs: 'Leo un libro bajo la luz filtrada entre los árboles del parque.', dictionarySource: 'Expresiones Cotidianas y Onomatopeyas', tags: ['poético', 'naturaleza'] },
  { word: '懐かしい', reading: 'なつかしい', romaji: 'natsukashii', meaningEs: 'nostálgico, entrañable', partOfSpeech: 'adjetivo-i', jlptLevel: 'N3', exampleJa: 'この曲を聞くと懐かしい気持ちになります。', exampleReading: 'この きょく を きく と なつかしい きもち に なります。', exampleEs: 'Al escuchar esta canción siento nostalgia.', dictionarySource: 'Expresiones Cotidianas y Onomatopeyas', tags: ['emociones'] },

  // Partículas del Japonés — Japonés a Fondo (15 partículas completas)
  { word: 'は (partícula)', reading: 'は (wa)', romaji: 'wa', meaningEs: 'marcador del tema de la oración y contraste', partOfSpeech: 'partícula estructural', jlptLevel: 'N5', exampleJa: '今日は忙しいです。', exampleReading: 'きょう は いそがしい です。', exampleEs: 'En cuanto a hoy, estoy ocupado.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'gramática'] },
  { word: 'が (partícula)', reading: 'が (ga)', romaji: 'ga', meaningEs: 'marcador de sujeto nuevo, gustos, capacidad o conjunción "pero"', partOfSpeech: 'partícula estructural', jlptLevel: 'N5', exampleJa: 'あそこに猫がいます。', exampleReading: 'あそこ に ねこ が います。', exampleEs: 'Hay un gato allí.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'gramática'] },
  { word: 'を (partícula)', reading: 'を (o)', romaji: 'o', meaningEs: 'marcador de objeto directo y espacio recorrido', partOfSpeech: 'partícula estructural', jlptLevel: 'N5', exampleJa: '公園を散歩します。', exampleReading: 'こうえん を さんぽ します。', exampleEs: 'Paseo por el parque.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'gramática'] },
  { word: 'に (partícula)', reading: 'に (ni)', romaji: 'ni', meaningEs: 'destino, tiempo específico, objeto indirecto y propósito', partOfSpeech: 'partícula estructural', jlptLevel: 'N5', exampleJa: '三時に会います。', exampleReading: 'さんじ に あいます。', exampleEs: 'Nos encontraremos a las tres.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'gramática'] },
  { word: 'で (partícula)', reading: 'で (de)', romaji: 'de', meaningEs: 'lugar de acción, instrumento/medio y causa', partOfSpeech: 'partícula estructural', jlptLevel: 'N5', exampleJa: '箸で食べます。', exampleReading: 'はし で たべます。', exampleEs: 'Como con palillos.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'gramática'] },
  { word: 'も (partícula)', reading: 'も (mo)', romaji: 'mo', meaningEs: 'inclusión ("también") y refuerzo negativo ("tampoco / ni")', partOfSpeech: 'partícula estructural', jlptLevel: 'N5', exampleJa: '私も同じ意見です。', exampleReading: 'わたし も おなじ いけん です。', exampleEs: 'Yo también tengo la misma opinión.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'gramática'] },
  { word: 'の (partícula)', reading: 'の (no)', romaji: 'no', meaningEs: 'posesión ("de"), nominalizador y pregunta suave coloquial', partOfSpeech: 'partícula estructural', jlptLevel: 'N5', exampleJa: '日本語を話すのが好きです。', exampleReading: 'にほんご を はなす の が すき です。', exampleEs: 'Me gusta hablar japonés.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'gramática'] },
  { word: 'へ (partícula)', reading: 'へ (e)', romaji: 'e', meaningEs: 'marcador de dirección o rumbo hacia un destino', partOfSpeech: 'partícula estructural', jlptLevel: 'N5', exampleJa: '夢への一歩。', exampleReading: 'ゆめ へ の いっぽ。', exampleEs: 'Un paso hacia el sueño.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'gramática'] },
  { word: 'か (partícula)', reading: 'か (ka)', romaji: 'ka', meaningEs: 'marcador de interrogación y alternativas excluyentes ("o")', partOfSpeech: 'partícula estructural', jlptLevel: 'N5', exampleJa: 'コーヒーかお茶か、どちらにしますか。', exampleReading: 'コーヒー か おちゃ か、どちら に します か。', exampleEs: '¿Café o té, cuál prefieres?', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'gramática'] },
  { word: 'と (partícula)', reading: 'と (to)', romaji: 'to', meaningEs: 'cita directa, compañía ("con"), lista cerrada ("y") y condición', partOfSpeech: 'partícula de conexión', jlptLevel: 'N4', exampleJa: '友達と映画を見ます。', exampleReading: 'ともだち と えいが を みます。', exampleEs: 'Veo una película con un amigo.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'gramática'] },
  { word: 'や (partícula)', reading: 'や (ya)', romaji: 'ya', meaningEs: 'listado no exhaustivo ("entre otras cosas, etc.")', partOfSpeech: 'partícula de conexión', jlptLevel: 'N4', exampleJa: '趣味は読書や映画鑑賞です。', exampleReading: 'しゅみ は どくしょ や えいが かんしょう です。', exampleEs: 'Mis pasatiempos incluyen leer y ver películas.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'gramática'] },
  { word: 'ね (partícula)', reading: 'ね (ne)', romaji: 'ne', meaningEs: 'asentimiento y solicitud de confirmación ("¿verdad?")', partOfSpeech: 'partícula final', jlptLevel: 'N5', exampleJa: '今日は寒いですね。', exampleReading: 'きょう は さむい です ね。', exampleEs: 'Hace frío hoy, ¿verdad?', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'conversación'] },
  { word: 'よ (partícula)', reading: 'よ (yo)', romaji: 'yo', meaningEs: 'énfasis, certeza e información nueva ("te lo aseguro")', partOfSpeech: 'partícula final', jlptLevel: 'N5', exampleJa: '明日は雨が降るよ。', exampleReading: 'あした は あめ が ふる よ。', exampleEs: 'Lloverá mañana, te lo aseguro.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'conversación'] },
  { word: 'ぞ (partícula)', reading: 'ぞ (zo)', romaji: 'zo', meaningEs: 'énfasis fuerte, determinación o advertencia enérgica', partOfSpeech: 'partícula final', jlptLevel: 'N4', exampleJa: '忘れるなぞ。', exampleReading: 'わすれる な ぞ。', exampleEs: 'No lo olvides.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'manga'] },
  { word: 'ぜ (partícula)', reading: 'ぜ (ze)', romaji: 'ze', meaningEs: 'énfasis asertivo, entusiasta o de camaradería informal', partOfSpeech: 'partícula final', jlptLevel: 'N4', exampleJa: '絶対に勝つぜ。', exampleReading: 'ぜったい に かつ ぜ。', exampleEs: 'Definitivamente ganaré.', dictionarySource: 'Partículas del Japonés — Japonés a Fondo', tags: ['partículas', 'manga'] },
];

export const STARTER_SRS_CARDS: {
  cardType: 'vocab' | 'kanji' | 'grammar';
  front: string;
  reading: string;
  back: string;
  hint: string;
  jlptLevel: JlptLevel;
}[] = [
  { cardType: 'vocab', front: '初めまして', reading: 'はじめまして (hajimemashite)', back: 'Mucho gusto (primera vez que conoces a alguien)', hint: 'Saludo inicial de presentación', jlptLevel: 'N5' },
  { cardType: 'kanji', front: '日', reading: 'ニチ · ひ', back: 'Sol, día', hint: 'Presente en 日本 (Japón) y 今日 (hoy)', jlptLevel: 'N5' },
  { cardType: 'vocab', front: '図書館', reading: 'としょかん (toshokan)', back: 'Biblioteca', hint: 'Lugar donde estudias y lees libros (で)', jlptLevel: 'N5' },
  { cardType: 'grammar', front: '〜てください', reading: 'forma て + kudasai', back: 'Por favor, haz ~ (petición cortés)', hint: 'Ej: ゆっくり話してください', jlptLevel: 'N5' },
  { cardType: 'grammar', front: 'は vs が', reading: 'wa (tema) vs ga (sujeto nuevo)', back: 'は marca tema conocido/contraste; が introduce sujeto nuevo o habilidad', hint: 'Libro Partículas del Japonés', jlptLevel: 'N5' },
  { cardType: 'grammar', front: 'と vs や', reading: 'to (cerrado) vs ya (abierto)', back: 'と enumera todos los elementos; や da ejemplos ("etc.")', hint: 'Libro Partículas del Japonés', jlptLevel: 'N4' },
  { cardType: 'vocab', front: '発音', reading: 'はつおん (hatsuon)', back: 'Pronunciación', hint: 'Clave en las sesiones orales', jlptLevel: 'N4' },
  { cardType: 'kanji', front: '山', reading: 'サン · やま', back: 'Montaña', hint: '富士山 (ふじさん) = Monte Fuji', jlptLevel: 'N5' },
  { cardType: 'vocab', front: 'なるほど', reading: 'naruhodo', back: 'Ya veo / Claro, tiene sentido', hint: 'Reacción natural durante una conversación', jlptLevel: 'N3' },
  { cardType: 'vocab', front: 'コツコツ', reading: 'kotsukotsu', back: 'Con constancia, paso a paso', hint: 'Onomatopeya del estudio diario', jlptLevel: 'N2' },
];
