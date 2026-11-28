export interface FraseParticula {
  id: number;
  particula: string;
  funcion: string;
  japones: string;
  lectura: string;
  romaji: string;
  espanol: string;
  explicacion: string;
}

export interface ExpresionJaponesa {
  id: number;
  situacion: 'Cortesía' | 'Cotidiano' | 'Restaurante' | 'Conversación';
  japones: string;
  lectura: string;
  romaji: string;
  significadoNatural: string;
  traduccionLiteral?: string;
  notaUso: string;
}

export const frasesParticulasData: FraseParticula[] = [
  {
    id: 1,
    particula: 'は (wa)',
    funcion: 'Marcador de tema de la oración',
    japones: '私は学生です。',
    lectura: 'わたしはがくせいです。',
    romaji: 'Watashi wa gakusei desu.',
    espanol: 'Yo soy estudiante.',
    explicacion: 'Se escribe con el hiragana は (ha), pero cuando actúa como partícula se pronuncia "wa". Indica de qué o quién vamos a hablar.'
  },
  {
    id: 2,
    particula: 'を (o / wo)',
    funcion: 'Marcador de objeto directo',
    japones: '毎日日本語を勉強します。',
    lectura: 'まいにちにほんごをべんきょうします。',
    romaji: 'Mainichi nihongo o benkyō shimasu.',
    espanol: 'Estudio japonés todos los días.',
    explicacion: 'Señala qué elemento recibe directamente la acción del verbo (en este caso, "japonés" es lo que se estudia).'
  },
  {
    id: 3,
    particula: 'に (ni)',
    funcion: 'Destino, tiempo concreto o ubicación de existencia',
    japones: '七時に起きます。',
    lectura: 'しちじにおきます。',
    romaji: 'Shichi-ji ni okimasu.',
    espanol: 'Me levanto a las siete.',
    explicacion: 'Se coloca detrás de expresiones de tiempo exacto (horas, días de la semana, fechas).'
  },
  {
    id: 4,
    particula: 'で (de)',
    funcion: 'Lugar donde ocurre una acción o medio/herramienta',
    japones: '図書館で本を読みます。',
    lectura: 'としょかんでほんをよみます。',
    romaji: 'Toshokan de hon o yomimasu.',
    espanol: 'Leo un libro en la biblioteca.',
    explicacion: 'A diferencia de に (que indica dónde está algo), で marca el escenario donde se desarrolla una actividad.'
  },
  {
    id: 5,
    particula: 'の (no)',
    funcion: 'Posesión o pertenencia',
    japones: 'これは私の本です。',
    lectura: 'これはわたしのほんです。',
    romaji: 'Kore wa watashi no hon desu.',
    espanol: 'Este es mi libro.',
    explicacion: 'Conecta dos sustantivos; el primero modifica o posee al segundo (funciona como "de" en español).'
  }
];

export const expresionesData: ExpresionJaponesa[] = [
  {
    id: 1,
    situacion: 'Cortesía',
    japones: 'よろしくお願いします。',
    lectura: 'よろしくおねがいします。',
    romaji: 'Yoroshiku onegai shimasu.',
    significadoNatural: 'Encantado de conocerte / Cuento contigo / Por favor.',
    traduccionLiteral: 'Te lo ruego favorablemente.',
    notaUso: 'Expresión fundamental al presentarse, pedir un favor o iniciar un proyecto en equipo.'
  },
  {
    id: 2,
    situacion: 'Restaurante',
    japones: 'いただきます。',
    lectura: 'いただきます。',
    romaji: 'Itadakimasu.',
    significadoNatural: '¡Buen provecho! / Gracias por la comida.',
    traduccionLiteral: 'Lo recibo humildemente.',
    notaUso: 'Se dice siempre antes de empezar a comer o beber, juntando las manos.'
  },
  {
    id: 3,
    situacion: 'Restaurante',
    japones: 'ごちそうさまでした。',
    lectura: 'ごちそうさまでした。',
    romaji: 'Gochisōsama deshita.',
    significadoNatural: 'Estaba delicioso / Muchas gracias por la comida.',
    traduccionLiteral: 'Ha sido un gran banquete.',
    notaUso: 'Se dice al terminar de comer, tanto en casa como al salir de un restaurante.'
  },
  {
    id: 4,
    situacion: 'Cotidiano',
    japones: 'お疲れ様です。',
    lectura: 'おつかれさまです。',
    romaji: 'Otsukaresama desu.',
    significadoNatural: 'Buen trabajo / Gracias por tu esfuerzo.',
    traduccionLiteral: 'Debes estar cansado.',
    notaUso: 'Saludo habitual entre compañeros al terminar la jornada laboral o una tarea.'
  },
  {
    id: 5,
    situacion: 'Conversación',
    japones: 'しょうがない。',
    lectura: 'しょうがない。',
    romaji: 'Shō ga nai.',
    significadoNatural: 'No hay remedio / Qué le vamos a hacer.',
    traduccionLiteral: 'No hay manera.',
    notaUso: 'Muy común para aceptar situaciones que no se pueden cambiar (forma formal: しかたがありません).'
  }
];
