export interface FrasePractica {
  id: string;
  particula: string;
  lecturaParticula: string;
  categoria: 'Estructurales Básicas' | 'Conexión' | 'Fin de Oración';
  uso: string;
  japones: string;
  romaji: string;
  espanol: string;
  nota?: string;
}

export interface ExpresionSuplemento {
  id: string;
  categoria: 'Saludos y Cortesía' | 'En la Mesa y Tiendas' | 'Emergencias y Viajes' | 'Expresiones Cotidianas';
  japones: string;
  romaji: string;
  espanol: string;
  contexto: string;
}

export const frasesParticulasData: FrasePractica[] = [
  // ================= 1. PARTÍCULAS ESTRUCTURALES BÁSICAS =================
  // は (wa)
  {
    id: 'wa-1',
    particula: 'は',
    lecturaParticula: 'wa',
    categoria: 'Estructurales Básicas',
    uso: 'Introducir o enfatizar el tema conocido',
    japones: '今日は忙しいです。',
    romaji: 'Kyō wa isogashii desu.',
    espanol: 'En cuanto a hoy, estoy ocupado.',
    nota: 'Se escribe con el hiragana "ha" (は), pero como partícula de tema se pronuncia "wa".'
  },
  {
    id: 'wa-2',
    particula: 'は',
    lecturaParticula: 'wa',
    categoria: 'Estructurales Básicas',
    uso: 'Introducir o enfatizar el tema conocido',
    japones: '彼女は医者です。',
    romaji: 'Kanojo wa isha desu.',
    espanol: 'En cuanto a ella, es médica.'
  },
  {
    id: 'wa-3',
    particula: 'は',
    lecturaParticula: 'wa',
    categoria: 'Estructurales Básicas',
    uso: 'Mostrar contraste o comparación',
    japones: '日本は大きいですが、シンガポールは小さいです。',
    romaji: 'Nihon wa ōkii desu ga, Shingapōru wa chīsai desu.',
    espanol: 'Japón es grande, pero Singapur es pequeño.',
    nota: 'A menudo se omite en diálogos cuando el tema ya está claro para los interlocutores.'
  },
  {
    id: 'wa-4',
    particula: 'は',
    lecturaParticula: 'wa',
    categoria: 'Estructurales Básicas',
    uso: 'Mostrar contraste o comparación',
    japones: '彼は学生ですが、彼女は教師です。',
    romaji: 'Kare wa gakusei desu ga, kanojo wa kyōshi desu.',
    espanol: 'Él es estudiante, pero ella es profesora.'
  },
  {
    id: 'wa-5',
    particula: 'は',
    lecturaParticula: 'wa',
    categoria: 'Estructurales Básicas',
    uso: 'Uso enfático en estructuras verbales',
    japones: '彼はギターを弾いてはいるが、上手ではない。',
    romaji: 'Kare wa gitā o hiite wa iru ga, jōzu de wa nai.',
    espanol: 'Él toca la guitarra, pero no es bueno.'
  },
  {
    id: 'wa-6',
    particula: 'は',
    lecturaParticula: 'wa',
    categoria: 'Estructurales Básicas',
    uso: 'Uso enfático en estructuras verbales',
    japones: 'この店は開いてはいますが、まだ準備中です。',
    romaji: 'Kono mise wa aite wa imasu ga, mada junbichū desu.',
    espanol: 'Esta tienda está abierta, pero todavía se está preparando.'
  },

  // が (ga)
  {
    id: 'ga-1',
    particula: 'が',
    lecturaParticula: 'ga',
    categoria: 'Estructurales Básicas',
    uso: 'Introducción de un sujeto nuevo o enfatizado',
    japones: 'あそこに猫がいます。',
    romaji: 'Asoko ni neko ga imasu.',
    espanol: 'Hay un gato allí.',
    nota: 'A diferencia de は (tema), が identifica información nueva o enfatiza quién realiza la acción.'
  },
  {
    id: 'ga-2',
    particula: 'が',
    lecturaParticula: 'ga',
    categoria: 'Estructurales Básicas',
    uso: 'Introducción de un sujeto nuevo o enfatizado',
    japones: 'この本が面白いです。',
    romaji: 'Kono hon ga omoshiroi desu.',
    espanol: 'Este libro es interesante.'
  },
  {
    id: 'ga-3',
    particula: 'が',
    lecturaParticula: 'ga',
    categoria: 'Estructurales Básicas',
    uso: 'Enfatizar un sujeto en contraste con otros',
    japones: '私が行きます。',
    romaji: 'Watashi ga ikimasu.',
    espanol: 'Yo iré (precisamente yo).'
  },
  {
    id: 'ga-4',
    particula: 'が',
    lecturaParticula: 'ga',
    categoria: 'Estructurales Básicas',
    uso: 'Como conjunción que significa "pero"',
    japones: '雨が降っていますが、出かけます。',
    romaji: 'Ame ga futte imasu ga, dekakemasu.',
    espanol: 'Está lloviendo, pero saldré.'
  },
  {
    id: 'ga-5',
    particula: 'が',
    lecturaParticula: 'ga',
    categoria: 'Estructurales Básicas',
    uso: 'Uso con verbos de capacidad, gusto o posibilidad',
    japones: 'これができますか？',
    romaji: 'Kore ga dekimasu ka?',
    espanol: '¿Puedes hacer esto?',
    nota: 'Es crucial con verbos potenciales y adjetivos de gusto/preferencia como 好きです (suki desu).'
  },

  // を (o / wo)
  {
    id: 'o-1',
    particula: 'を',
    lecturaParticula: 'o (wo)',
    categoria: 'Estructurales Básicas',
    uso: 'Marcar el objeto directo de acciones transitivas',
    japones: 'リンゴを食べます。',
    romaji: 'Ringo o tabemasu.',
    espanol: 'Como una manzana.',
    nota: 'Se escribe con を (wo), pero en el japonés moderno como partícula se pronuncia simplemente "o".'
  },
  {
    id: 'o-2',
    particula: 'を',
    lecturaParticula: 'o (wo)',
    categoria: 'Estructurales Básicas',
    uso: 'Marcar el objeto directo de acciones transitivas',
    japones: 'その書類を読んでください。',
    romaji: 'Sono shorui o yonde kudasai.',
    espanol: 'Por favor, lee ese documento.'
  },
  {
    id: 'o-3',
    particula: 'を',
    lecturaParticula: 'o (wo)',
    categoria: 'Estructurales Básicas',
    uso: 'Indicar el espacio a través del cual se realiza una acción',
    japones: '公園を散歩します。',
    romaji: 'Kōen o sanpo shimasu.',
    espanol: 'Paseo por el parque.'
  },

  // に (ni)
  {
    id: 'ni-1',
    particula: 'に',
    lecturaParticula: 'ni',
    categoria: 'Estructurales Básicas',
    uso: 'Indicar destino o dirección final',
    japones: '学校に行きます。',
    romaji: 'Gakkō ni ikimasu.',
    espanol: 'Voy a la escuela.',
    nota: 'に se centra en el destino final o ubicación, mientras que へ enfatiza el rumbo.'
  },
  {
    id: 'ni-2',
    particula: 'に',
    lecturaParticula: 'ni',
    categoria: 'Estructurales Básicas',
    uso: 'Marcar el tiempo específico de una acción',
    japones: '三時に会います。',
    romaji: 'San-ji ni aimasu.',
    espanol: 'Nos encontraremos a las tres.'
  },
  {
    id: 'ni-3',
    particula: 'に',
    lecturaParticula: 'ni',
    categoria: 'Estructurales Básicas',
    uso: 'Como marcador de objeto indirecto (receptor)',
    japones: '彼にプレゼントをあげます。',
    romaji: 'Kare ni purezento o agemasu.',
    espanol: 'Le daré un regalo a él.'
  },
  {
    id: 'ni-4',
    particula: 'に',
    lecturaParticula: 'ni',
    categoria: 'Estructurales Básicas',
    uso: 'Expresar el propósito de una acción',
    japones: '勉強に図書館に行きます。',
    romaji: 'Benkyō ni toshokan ni ikimasu.',
    espanol: 'Voy a la biblioteca para estudiar.'
  },

  // で (de)
  {
    id: 'de-1',
    particula: 'で',
    lecturaParticula: 'de',
    categoria: 'Estructurales Básicas',
    uso: 'Indicar el lugar donde se realiza una acción activa',
    japones: '図書館で勉強します。',
    romaji: 'Toshokan de benkyō shimasu.',
    espanol: 'Estudio en la biblioteca.',
    nota: 'Marca el escenario donde ocurre una acción dinámica (a diferencia de に para existencia estática).'
  },
  {
    id: 'de-2',
    particula: 'で',
    lecturaParticula: 'de',
    categoria: 'Estructurales Básicas',
    uso: 'Expresar el medio o instrumento utilizado',
    japones: '箸で食べます。',
    romaji: 'Hashi de tabemasu.',
    espanol: 'Como con palillos.'
  },
  {
    id: 'de-3',
    particula: 'で',
    lecturaParticula: 'de',
    categoria: 'Estructurales Básicas',
    uso: 'Indicar la causa o razón de algo',
    japones: '病気で休みました。',
    romaji: 'Byōki de yasumimashita.',
    espanol: 'Descansé debido a una enfermedad.'
  },

  // も (mo)
  {
    id: 'mo-1',
    particula: 'も',
    lecturaParticula: 'mo',
    categoria: 'Estructurales Básicas',
    uso: 'Indicar adición o inclusión ("también")',
    japones: '私もそれが欲しいです。',
    romaji: 'Watashi mo sore ga hoshii desu.',
    espanol: 'Yo también quiero eso.',
    nota: 'Reemplaza por completo a las partículas は, が y を.'
  },
  {
    id: 'mo-2',
    particula: 'も',
    lecturaParticula: 'mo',
    categoria: 'Estructurales Básicas',
    uso: 'Reforzar declaraciones negativas ("tampoco / ni")',
    japones: '彼女も知りません。',
    romaji: 'Kanojo mo shirimasen.',
    espanol: 'Ella tampoco lo sabe.'
  },

  // の (no)
  {
    id: 'no-1',
    particula: 'の',
    lecturaParticula: 'no',
    categoria: 'Estructurales Básicas',
    uso: 'Indicar posesión o pertenencia ("de")',
    japones: '私の夢。',
    romaji: 'Watashi no yume.',
    espanol: 'Mi sueño.'
  },
  {
    id: 'no-2',
    particula: 'の',
    lecturaParticula: 'no',
    categoria: 'Estructurales Básicas',
    uso: 'Nominalizar verbos o cláusulas',
    japones: '日本語を話すのが好きです。',
    romaji: 'Nihongo o hanasu no ga suki desu.',
    espanol: 'Me gusta hablar japonés.',
    nota: 'Convierte un verbo en sustantivo para poder usarlo como sujeto u objeto.'
  },
  {
    id: 'no-3',
    particula: 'の',
    lecturaParticula: 'no',
    categoria: 'Estructurales Básicas',
    uso: 'Formular preguntas en contexto informal',
    japones: 'どうしてそんなに遅いの？',
    romaji: 'Dōshite sonna ni osoi no?',
    espanol: '¿Por qué llegas tan tarde?'
  },

  // へ (e)
  {
    id: 'e-1',
    particula: 'へ',
    lecturaParticula: 'e',
    categoria: 'Estructurales Básicas',
    uso: 'Indicar la dirección o rumbo de un movimiento',
    japones: '日本へ旅行します。',
    romaji: 'Nihon e ryokō shimasu.',
    espanol: 'Viajo hacia Japón.',
    nota: 'Se escribe con el hiragana "he" (へ), pero como partícula se pronuncia siempre "e".'
  },
  {
    id: 'e-2',
    particula: 'へ',
    lecturaParticula: 'e',
    categoria: 'Estructurales Básicas',
    uso: 'Expresar destino en sentido poético o abstracto',
    japones: '明日への希望。',
    romaji: 'Ashita e no kibō.',
    espanol: 'Esperanza hacia el mañana.'
  },

  // か (ka)
  {
    id: 'ka-1',
    particula: 'か',
    lecturaParticula: 'ka',
    categoria: 'Estructurales Básicas',
    uso: 'Convertir declaraciones en preguntas',
    japones: 'これはあなたの本ですか。',
    romaji: 'Kore wa anata no hon desu ka.',
    espanol: '¿Es este tu libro?'
  },
  {
    id: 'ka-2',
particula: 'か',
lecturaParticula: 'ka',
categoria: 'Estructurales Básicas',
uso: 'Listar opciones o alternativas ("o")',
japones: 'コーヒーかお茶か、どちらにしますか？',
romaji: 'Kōhī ka ocha ka, dochira ni shimasu ka?',
espanol: '¿Café o té, cuál prefieres?'
},
  // ================= 2. PARTÍCULAS DE CONEXIÓN =================
  // と (to)
  {
    id: 'to-1',
    particula: 'と',
    lecturaParticula: 'to',
    categoria: 'Conexión',
    uso: 'Citar de manera directa',
    japones: '彼は「元気です」と言いました。',
    romaji: 'Kare wa "genki desu" to iimashita.',
    espanol: 'Él dijo "estoy bien".'
  },
  {
    id: 'to-2',
    particula: 'と',
    lecturaParticula: 'to',
    categoria: 'Conexión',
    uso: 'Indicar compañía o enumeración exhaustiva ("con / y")',
    japones: '友達と映画を見ます。',
    romaji: 'Tomodachi to eiga o mimasu.',
    espanol: 'Veo una película con un amigo.',
    nota: 'A diferencia de や, と se usa para listas completas o cerradas.'
  },
  {
    id: 'to-3',
    particula: 'と',
    lecturaParticula: 'to',
    categoria: 'Conexión',
    uso: 'Indicar compañía o enumeración exhaustiva ("con / y")',
    japones: 'コーヒーとケーキを注文しました。',
    romaji: 'Kōhī to kēki o chūmon shimashita.',
    espanol: 'Pedí café y pastel.'
  },
  {
    id: 'to-4',
    particula: 'と',
    lecturaParticula: 'to',
    categoria: 'Conexión',
    uso: 'Establecer condiciones automáticas o naturales',
    japones: '時間があれば、散歩に行くといい。',
    romaji: 'Jikan ga areba, sanpo ni iku to ii.',
    espanol: 'Si tienes tiempo, sería bueno ir a pasear.'
  },

  // や (ya)
  {
    id: 'ya-1',
    particula: 'や',
    lecturaParticula: 'ya',
    categoria: 'Conexión',
    uso: 'Listar elementos de manera no exhaustiva ("entre otras cosas")',
    japones: 'リンゴやバナナを買いました。',
    romaji: 'Ringo ya banana o kaimashita.',
    espanol: 'Compré manzanas, plátanos, entre otras cosas.',
    nota: 'Se combina frecuentemente con など (nado) al final para indicar que hay más elementos.'
  },
  {
    id: 'ya-2',
    particula: 'や',
    lecturaParticula: 'ya',
    categoria: 'Conexión',
    uso: 'Enumerar ejemplos en descripciones',
    japones: '趣味は読書や映画鑑賞です。',
    romaji: 'Shumi wa dokusho ya eiga kanshō desu.',
    espanol: 'Mis pasatiempos incluyen leer y ver películas.'
  },

  // ================= 3. PARTÍCULAS DE FIN DE ORACIÓN =================
  // ね (ne)
  {
    id: 'ne-1',
    particula: 'ね',
    lecturaParticula: 'ne',
    categoria: 'Fin de Oración',
    uso: 'Buscar confirmación o acuerdo ("¿verdad? / ¿no?")',
    japones: '今日は寒いですね。',
    romaji: 'Kyō wa samui desu ne.',
    espanol: 'Hace frío hoy, ¿verdad?'
  },
  {
    id: 'ne-2',
    particula: 'ね',
    lecturaParticula: 'ne',
    categoria: 'Fin de Oración',
    uso: 'Suavizar declaraciones o peticiones',
    japones: '少し待ってね。',
    romaji: 'Sukoshi matte ne.',
    espanol: 'Espera un poco, ¿vale?'
  },

  // よ (yo)
  {
    id: 'yo-1',
    particula: 'よ',
    lecturaParticula: 'yo',
    categoria: 'Fin de Oración',
    uso: 'Añadir énfasis o dar información nueva al oyente',
    japones: '明日は雨が降るよ。',
    romaji: 'Ashita wa ame ga furu yo.',
    espanol: 'Lloverá mañana, te lo aseguro.',
    nota: 'Transmite certeza cuando el hablante cree que el oyente desconoce el dato.'
  },
  {
    id: 'yo-2',
    particula: 'よ',
    lecturaParticula: 'yo',
    categoria: 'Fin de Oración',
    uso: 'Informar o asegurar algo al oyente',
    japones: '彼はもう帰ったよ。',
    romaji: 'Kare wa mō kaetta yo.',
    espanol: 'Él ya se ha ido a casa, ya sabes.'
  },

  // ぞ (zo)
  {
    id: 'zo-1',
    particula: 'ぞ',
    lecturaParticula: 'zo',
    categoria: 'Fin de Oración',
    uso: 'Reforzar una declaración con determinación o advertencia',
    japones: 'これが最後の警告だぞ。',
    romaji: 'Kore ga saigo no keikoku da zo.',
    espanol: 'Esta es la última advertencia.',
    nota: 'Tono muy enérgico y enfático, frecuente en manga/anime o habla masculina casual.'
  },
  {
    id: 'zo-2',
    particula: 'ぞ',
    lecturaParticula: 'zo',
    categoria: 'Fin de Oración',
    uso: 'Exhortar o advertir con intensidad',
    japones: '忘れるなぞ。',
    romaji: 'Wasureru na zo.',
    espanol: 'No lo olvides.'
  },

  // ぜ (ze)
  {
    id: 'ze-1',
    particula: 'ぜ',
    lecturaParticula: 'ze',
    categoria: 'Fin de Oración',
    uso: 'Añadir énfasis con tono enérgico, confiado o desafiante',
    japones: '絶対に勝つぜ。',
    romaji: 'Zettai ni katsu ze.',
    espanol: 'Definitivamente ganaré.'
  },
  {
    id: 'ze-2',
    particula: 'ぜ',
    lecturaParticula: 'ze',
    categoria: 'Fin de Oración',
    uso: 'Expresar confianza o camaradería',
    japones: 'やってみせるぜ。',
    romaji: 'Yatte miseru ze.',
    espanol: 'Te mostraré cómo se hace.'
  }
];

export const expresionesSuplementoData: ExpresionSuplemento[] = [
  { id: 'exp-1', categoria: 'Saludos y Cortesía', japones: 'おはようございます', romaji: 'Ohayō gozaimasu', espanol: 'Buenos días (formal)', contexto: 'Hasta media mañana (~10:30 h)' },
  { id: 'exp-2', categoria: 'Saludos y Cortesía', japones: 'こんにちは', romaji: 'Konnichiwa', espanol: 'Buenas tardes / Hola', contexto: 'Durante el día' },
  { id: 'exp-3', categoria: 'Saludos y Cortesía', japones: 'こんばんは', romaji: 'Konbanwa', espanol: 'Buenas noches (saludo)', contexto: 'Al caer la tarde y de noche' },
  { id: 'exp-4', categoria: 'Saludos y Cortesía', japones: 'おやすみなさい', romaji: 'Oyasuminasai', espanol: 'Buenas noches (al despedirse / ir a dormir)', contexto: 'Antes de acostarse' },
  { id: 'exp-5', categoria: 'Saludos y Cortesía', japones: '初めまして、どうぞよろしくお願いします', romaji: 'Hajimemashite, dōzo yoroshiku onegaishimasu', espanol: 'Encantado de conocerte, mucho gusto', contexto: 'Primera presentación' },
  { id: 'exp-6', categoria: 'En la Mesa y Tiendas', japones: 'いただきます', romaji: 'Itadakimasu', espanol: '¡Buen provecho! (Antes de comer)', contexto: 'Agradecimiento antes de empezar a comer' },
  { id: 'exp-7', categoria: 'En la Mesa y Tiendas', japones: 'ごちそうさまでした', romaji: 'Gochisōsama deshita', espanol: 'Muchas gracias por la comida', contexto: 'Al terminar de comer o salir del restaurante' },
  { id: 'exp-8', categoria: 'En la Mesa y Tiendas', japones: 'すみません、お会計をお願いします', romaji: 'Sumimasen, okaikei o onegaishimasu', espanol: 'Disculpe, la cuenta por favor', contexto: 'En restaurantes y cafeterías' },
  { id: 'exp-9', categoria: 'Emergencias y Viajes', japones: '〜はどこですか', romaji: '〜 wa doko desu ka', espanol: '¿Dónde está 〜?', contexto: 'Para preguntar ubicaciones' },
  { id: 'exp-10', categoria: 'Emergencias y Viajes', japones: '英語かスペイン語を話せますか', romaji: 'Eigo ka Supeingo o hanasemasu ka', espanol: '¿Habla inglés o español?', contexto: 'Pedir ayuda lingüística' },
  { id: 'exp-11', categoria: 'Expresiones Cotidianas', japones: 'お疲れ様でした', romaji: 'Otsukaresama deshita', espanol: 'Buen trabajo / Gracias por tu esfuerzo', contexto: 'Al terminar el trabajo o estudio' },
  { id: 'exp-12', categoria: 'Expresiones Cotidianas', japones: '気をつけて', romaji: 'Ki o tsukete', espanol: 'Cuídate / Ten cuidado', contexto: 'Despedida afectuosa o de viaje' }
    // ================= SUPLEMENTO: NOCIONES BÁSICAS (CARDONA GRANDA) =================
  {
    id: 'nb-1',
    categoria: 'Expresiones Cotidianas',
    japones: 'あの雲は人の顔のようですね。',
    romaji: 'Ano kumo wa hito no kao no yō desu ne.',
    espanol: 'Esa nube parece la cara de una persona, ¿no?',
    contexto: 'Expresión de apariencia 〜ようだ (semejanza visual)'
  },
  {
    id: 'nb-2',
    categoria: 'Expresiones Cotidianas',
    japones: 'あの人は日本語を日本人のように上手に話します。',
    romaji: 'Ano hito wa nihongo o nihonjin no yō ni jōzu ni hanashimasu.',
    espanol: 'Él habla japonés tan bien como un nativo.',
    contexto: 'Expresión de modo/semejanza 〜のように'
  },
  {
    id: 'nb-3',
    categoria: 'Expresiones Cotidianas',
    japones: 'あなたはお母さんに顔がよく似ていますね。',
    romaji: 'Anata wa okāsan ni kao ga yoku nite imasu ne.',
    espanol: 'Te pareces mucho de cara a tu madre.',
    contexto: 'Parecido físico o de carácter 〜に似ている'
  },
  {
    id: 'nb-4',
    categoria: 'Expresiones Cotidianas',
    japones: '今日は春みたいに暖かい。',
    romaji: 'Kyō wa haru mitai ni atatakai.',
    espanol: 'Hoy hace calor como en primavera.',
    contexto: 'Comparación coloquial 〜みたいだ'
  },
  {
    id: 'nb-5',
    categoria: 'Expresiones Cotidianas',
    japones: 'レストレポさんも行くらしいです。',
    romaji: 'Restrepo-san mo iku rashii desu.',
    espanol: 'Parece que el señor Restrepo también va a ir.',
    contexto: 'Conjetura o rumor 〜らしい (menor certeza)'
  },
  {
    id: 'nb-6',
    categoria: 'Expresiones Cotidianas',
    japones: '自分の部屋の掃除をするべきです。',
    romaji: 'Jibun no heya no sōji o suru beki desu.',
    espanol: 'Deberías limpiar tu propia habitación.',
    contexto: 'Deber moral o recomendación fuerte 〜べき'
  },
  {
    id: 'nb-7',
    categoria: 'Expresiones Cotidianas',
    japones: 'この漢字はもう習ったのだから、読めるはずですよ。',
    romaji: 'Kono kanji wa mō naratta no dakara, yomeru hazu desu yo.',
    espanol: 'Como ya has estudiado este kanji, deberías saber leerlo.',
    contexto: 'Expectativa lógica 〜はず (es de esperar que)'
  },
  {
    id: 'nb-8',
    categoria: 'Emergencias y Viajes',
    japones: 'この道を真っ直ぐ行けば、大通りに出るはずです。',
    romaji: 'Kono michi o massugu ikeba, ōdori ni deru hazu desu.',
    espanol: 'Si sigue recto por esta calle, debe salir a una avenida.',
    contexto: 'Indicaciones de dirección con 〜はず'
  },
  {
    id: 'nb-9',
    categoria: 'Emergencias y Viajes',
    japones: 'あなたのお家は駅からどうやって行くのですか。',
    romaji: 'Anata no uchi wa eki kara dōyatte iku no desu ka.',
    espanol: '¿Cómo se va desde la estación hasta su casa?',
    contexto: 'Preguntar cómo llegar (どうやって)'
  },
  {
    id: 'nb-10',
    categoria: 'Saludos y Cortesía',
    japones: 'どのくらい日本語を習っていますか。',
    romaji: 'Dono kurai nihongo o naratte imasu ka.',
    espanol: '¿Cuánto tiempo hace que estudias japonés?',
    contexto: 'Conversación inicial (どのくらい - cuánto tiempo/cantidad)'
  },
  {
    id: 'nb-11',
    categoria: 'Saludos y Cortesía',
    japones: 'そちらさまはもう一杯いかがですか。',
    romaji: 'Sochira-sama wa mō ippai ikaga desu ka.',
    espanol: '¿Desea usted otra copa?',
    contexto: 'Trato muy cortés hacia un invitado (そちらさま)'
  },
  {
    id: 'nb-12',
    categoria: 'Saludos y Cortesía',
    japones: 'あの方はどなたさまですか。',
    romaji: 'Ano kata wa donata-sama desu ka.',
    espanol: '¿Quién es ese señor / esa señora?',
    contexto: 'Pregunta formal por una persona'
  },
  {
    id: 'nb-13',
    categoria: 'Expresiones Cotidianas',
    japones: 'この言葉は漢字でどのように書きますか。',
    romaji: 'Kono kotoba wa kanji de dono yō ni kakimasu ka.',
    espanol: '¿Cómo se escribe esta palabra en kanji?',
    contexto: 'Pregunta útil en clase de japonés'
  },
  {
    id: 'nb-14',
    categoria: 'Expresiones Cotidianas',
    japones: '分からないことは何でも先生に聞きなさい。',
    romaji: 'Wakaranai koto wa nandemo sensei ni kikinasai.',
    espanol: 'Pregúntale al profesor cualquier cosa que no entiendas.',
    contexto: 'Pronombre indefinido 何でも (lo que sea)'
  },
  {
    id: 'nb-15',
    categoria: 'Expresiones Cotidianas',
    japones: 'この町はごみだらけになってしまった。',
    romaji: 'Kono machi wa gomi-darake ni natte shimatta.',
    espanol: 'Esta ciudad se ha llenado de basura.',
    contexto: 'Sufijo 〜だらけ (repleto de algo negativo)'
  },
  {
    id: 'nb-16',
    categoria: 'Expresiones Cotidianas',
    japones: 'どうしてかしら。あの人の顔を思い出せないのよ。',
    romaji: 'Dōshite kashira. Ano hito no kao o omoidasenai no yo.',
    espanol: '¿Por qué será que no logro acordarme de la cara de esa persona?',
    contexto: 'Registro femenino suave (かしら / のよ)'
  },
  {
    id: 'nb-17',
    categoria: 'Expresiones Cotidianas',
    japones: 'あそこに座っている若い女性は娘です。',
    romaji: 'Asoko ni suwatte iru wakai josei wa musume desu.',
    espanol: 'La jovencita que está sentada allá es mi hija.',
    contexto: 'Oración de relativo (el modificador precede al sustantivo)'
  },
  {
    id: 'nb-18',
    categoria: 'En la Mesa y Tiendas',
    japones: '私はすしが好きです。',
    romaji: 'Watashi wa sushi ga suki desu.',
    espanol: 'Me gusta el sushi.',
    contexto: 'Estructura de gustos con は (tema) + が (objeto de agrado)'
  }

];
export const expresionesData = expresionesSuplementoData;

