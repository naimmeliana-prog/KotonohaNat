import type { UiLanguage } from '../types/kotonoha';

export interface TranslationTree {
  meta: {
    title: string;
  };
  navbar: {
    ariaNav: string;
    inicio: string;
    cursos: string;
    practica: string;
    diccionario: string;
    intercambio: string;
    comunidad: string;
    signIn: string;
    openMenu: string;
    closeMenu: string;
    switchLanguage: string;
  };
  footer: {
    tagline: string;
    lightTheme: string;
    darkTheme: string;
    adminPanel: string;
  };
  authModal: {
    accountTitlePrefix: string;
    accessTitle: string;
    userSummary: string;
    guestSummary: string;
    closeLabel: string;
    jlptGoal: string;
    nativeLangLabel: string;
    nativeEsStudent: string;
    nativeJaPartner: string;
    nativeOther: string;
    shortBioLabel: string;
    shortBioPlaceholder: string;
    logout: string;
    saving: string;
    saveProfile: string;
    profileSaved: string;
    profileSaveError: string;
    googleContinue: string;
    googleError: string;
    orDivider: string;
    tabRegister: string;
    tabLogin: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    usernameInvalid: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    langProfileLabel: string;
    learningJaOption: string;
    nativeJaOption: string;
    otherLangOption: string;
    initialLevelLabel: string;
    privacyNote: string;
    connecting: string;
    createAccountBtn: string;
    loginBtn: string;
    emailDisabledError: string;
    usernameTakenError: string;
    badCredentialsError: string;
    genericAuthError: string;
  };
  dashboard: {
    eyebrow: string;
    darkMode: string;
    lightMode: string;
    heroTitle: string;
    heroSubtitle: string;
    primaryCta: string;
    secondaryCta: string;
    exchangeCta: string;
    guestPromptPrefix: string;
    guestPromptLink: string;
    heroAlt: string;
    fallbackCaption: string;
    kpiSectionLabel: string;
    kpiStreakTitle: string;
    kpiStreakUnit: string;
    kpiTodayMin: string;
    kpiDueTitle: string;
    kpiMasteredSub: string;
    kpiUnitsTitle: string;
    kpiWeeklyAccPrefix: string;
    kpiNoSessions: string;
    kpiXpTitle: string;
    kpiGoalPrefix: string;
    chartTitle: string;
    chartSubtitle: string;
    chartSynced: string;
    chartEmpty: string;
    chartTooltipXp: string;
    recentActivityTitle: string;
    routineTitle: string;
    routineSubtitle: string;
    routineSrsTitle: string;
    routineSrsSub: string;
    routineOralTitle: string;
    routineOralSub: string;
    routineCoursesTitle: string;
    routineCoursesSub: string;
    routineWritingTitle: string;
    routineWritingSub: string;
    routineExchangeTitle: string;
    routineExchangeSub: string;
    routineFooter: string;
    spotlight1Eyebrow: string;
    spotlight1Title: string;
    spotlight1Desc: string;
    spotlight1Cta: string;
    spotlight1Alt: string;
    spotlight2Eyebrow: string;
    spotlight2Title: string;
    spotlight2Desc: string;
    spotlight2Cta: string;
    spotlight2Alt: string;
  };
  courses: {
    eyebrow: string;
    title: string;
    loading: string;
    emptyLevel: string;
    availableUnits: string;
    unitLabel: string;
    approvedBadge: string;
    tabGrammar: string;
    tabVocab: string;
    tabDialogue: string;
    tabExercises: string;
    tabExam: string;
    structurePrefix: string;
    listenPronunciation: string;
    essentialVocab: string;
    colWord: string;
    colReading: string;
    colMeaning: string;
    colActions: string;
    inSrs: string;
    addSrs: string;
    keyKanji: string;
    strokesSuffix: string;
    dialogueHint: string;
    hideEs: string;
    showEs: string;
    correctPrefix: string;
    reviewPrefix: string;
    examHint: string;
    examResultPrefix: string;
    examPassed: string;
    examRetryNote: string;
    questionPrefix: string;
    evaluatingExam: string;
    gradeExamBtn: string;
    retryExamBtn: string;
    loadError: string;
    audioError: string;
    srsSaveError: string;
    examSaveError: string;
  };
  practice: {
    eyebrow: string;
    title: string;
    tabOral: string;
    tabSrs: string;
    tabWriting: string;
    senseiHeader: string;
    scenarioPrefix: string;
    levelPrefix: string;
    paceLabel: string;
    paceSlow: string;
    paceNatural: string;
    resetDialogue: string;
    youLabel: string;
    pronunciationPrefix: string;
    clearPronunciation: string;
    inProgressPronunciation: string;
    suggestedNatural: string;
    analyzingOral: string;
    speakJa: string;
    stopAndEvaluate: string;
    recordingHint: string;
    micHint: string;
    oralInputPlaceholder: string;
    send: string;
    oralSettingsTitle: string;
    oralSettingsSub: string;
    scenarioSelectLabel: string;
    jlptLevelLabel: string;
    voicePaceLabel: string;
    paceOptionSlow: string;
    paceOptionNatural: string;
    voiceTimbreLabel: string;
    phoneticTipTitle: string;
    phoneticTipBody: string;
    shortRecordingError: string;
    micBlockedError: string;
    oralProcessError: string;
    audioPlayError: string;
    scenarios: { id: string; label: string; openingJa: string; openingSub: string }[];
    cardCounter: string;
    sessionStreak: string;
    addCardBtn: string;
    newFrontPlaceholder: string;
    newReadingPlaceholder: string;
    newBackPlaceholder: string;
    saveCardBtn: string;
    loadingDeck: string;
    listenCard: string;
    revealHint: string;
    showAnswer: string;
    rateAgain: string;
    rateHard: string;
    rateGood: string;
    rateEasy: string;
    noCards: string;
    sm2Title: string;
    sm2Desc: string;
    totalDeck: string;
    deckStateLabel: string;
    deckGuestState: string;
    deckSyncedState: string;
    signInToSaveDeck: string;
    guestSrsNotice: string;
    nextReviewMsg: string;
    strokesSuffix: string;
    readingLabel: string;
    targetCharLabel: string;
    listenChar: string;
    clearCanvas: string;
    hideGuide: string;
    showGuide: string;
    evaluatingStroke: string;
    evaluateStrokeBtn: string;
    drawFirstError: string;
    strokeError: string;
    strokeRuleTitle: string;
    strokeRuleBody: string;
    scripts: {
      hiragana: string;
      katakana: string;
      kanji: string;
    };
  };
  dictionary: {
    eyebrow: string;
    title: string;
    allLevels: string;
    searchPlaceholder: string;
    filterSourceLabel: string;
    allSources: string;
    searching: string;
    emptyResult: string;
    resultsCount: string;
    listen: string;
    inYourSrs: string;
    addToSrs: string;
    loadError: string;
    audioError: string;
    srsError: string;
  };
  community: {
    eyebrow: string;
    title: string;
    tabForum: string;
    tabChat: string;
    tabNatives: string;
    categories: {
      all: string;
      intercambio: string;
      gramatica: string;
      pronunciacion: string;
      cultura: string;
      recursos: string;
    };
    cancel: string;
    newTopic: string;
    topicTitlePlaceholder: string;
    topicBodyPlaceholder: string;
    publishing: string;
    publishBtn: string;
    loadingPosts: string;
    emptyCategoryTitle: string;
    emptyCategorySub: string;
    nativeBadge: string;
    helpfulBtn: string;
    repliesLabel: string;
    replyPlaceholderSigned: string;
    replyPlaceholderGuest: string;
    replyBtn: string;
    roomsHeading: string;
    rooms: { id: 'general' | 'intercambio-es-ja' | 'principiantes-n5' | 'practica-oral'; label: string; desc: string }[];
    roomPrefix: string;
    chatRealtimeSub: string;
    signInToChat: string;
    emptyChat: string;
    nativeShortBadge: string;
    translationPrefix: string;
    chatInputPlaceholder: string;
    chatHintPlaceholder: string;
    send: string;
    playbookEyebrow: string;
    playbookTitle: string;
    playbookSteps: { title: string; body: string }[];
    inviteCardTitle: string;
    inviteCardSub: string;
    inviteCopied: string;
    inviteCopyBtn: string;
    validationTitleBody: string;
    validationReply: string;
  };
  exchange: {
    eyebrow: string;
    title: string;
    subtitle: string;
    profileTitle: string;
    profileIncompleteHint: string;
    profileSavedNotice: string;
    signInPrompt: string;
    signInBtn: string;
    nicknameLabel: string;
    nicknamePlaceholder: string;
    nativeLangLabel: string;
    nativeEs: string;
    nativeJa: string;
    nativeOther: string;
    learningLangLabel: string;
    learningJa: string;
    learningEs: string;
    levelLabel: string;
    levels: {
      beginner: string;
      intermediate: string;
      advanced: string;
    };
    interestsLabel: string;
    interestsHelper: string;
    interests: {
      anime_manga: string;
      travel: string;
      gastronomy: string;
      music: string;
      culture: string;
      daily_life: string;
    };
    saveProfileBtn: string;
    savingProfileBtn: string;
    dailyPromptEyebrow: string;
    aiGeneratedBadge: string;
    generatePromptBtn: string;
    generatingPromptBtn: string;
    otherPromptsLabel: string;
    responsesCountSuffix: string;
    composerTitle: string;
    composerSubtitleEs: string;
    composerSubtitleJa: string;
    composerPlaceholder: string;
    publishResponseBtn: string;
    publishingResponseBtn: string;
    loadingWall: string;
    emptyResponses: string;
    learningBadgePrefix: string;
    correctReplyBtn: string;
    closeFormBtn: string;
    kindCorrection: string;
    kindReply: string;
    correctedTextLabel: string;
    correctedTextPlaceholder: string;
    commentLabel: string;
    commentPlaceholder: string;
    sendFeedbackBtn: string;
    sendingFeedbackBtn: string;
    correctionsTitle: string;
    correctionTag: string;
    replyTag: string;
    correctedLabel: string;
    bridgeExplainBtn: string;
    bridgeExplainingBtn: string;
    bridgeRepliesBtn: string;
    bridgeSuggestingBtn: string;
    bridgeExplainTitle: string;
    bridgeTranslationLabel: string;
    bridgeReadingLabel: string;
    bridgeGrammarLabel: string;
    bridgeRepliesTitle: string;
    useSuggestionBtn: string;
    registers: {
      simple: string;
      standard: string;
      colloquial: string;
    };
    errors: {
      minLength: string;
      maxInterests: string;
      commentMinLength: string;
    };
  };
  admin: {
    restrictedTitle: string;
    restrictedDescPrefix: string;
    restrictedDescSuffix: string;
    currentSessionPrefix: string;
    rolePrefix: string;
    googleAdminBtn: string;
    verifyingAdmin: string;
    manageStudentBtn: string;
    eyebrow: string;
    title: string;
    tabMonitor: string;
    tabPdf: string;
    tabFirestore: string;
    syncCatalogBtn: string;
    syncingBtn: string;
    refreshAria: string;
    latencyTitle: string;
    requestsSuffix: string;
    errorRatePrefix: string;
    communityTitle: string;
    usersSuffix: string;
    forumTopicsSuffix: string;
    chatMsgSuffix: string;
    catalogTitle: string;
    unitsShort: string;
    dictShort: string;
    catalogSub: string;
    serverHealthTitle: string;
    uptimePrefix: string;
    chartTitle: string;
    chartTooltip: string;
    recentReqTitle: string;
    colRoute: string;
    colStatus: string;
    pdfTitle: string;
    pdfDesc: string;
    pdfModeLabel: string;
    pdfModeLesson: string;
    pdfModeDict: string;
    pdfLevelLabel: string;
    pdfSourceLabel: string;
    pdfSourcePlaceholder: string;
    pdfFileLabel: string;
    pdfImportBtn: string;
    pdfImportingBtn: string;
    addDictTitle: string;
    wordPlaceholder: string;
    readingPlaceholder: string;
    romajiPlaceholder: string;
    meaningPlaceholder: string;
    sourcePlaceholder: string;
    saveEntryBtn: string;
    publishedUnitsTitle: string;
    activeDictPrefix: string;
    activeDictSuffix: string;
    alreadySyncedMsg: string;
    selectPdfError: string;
    pdfSizeError: string;
    noValidDictError: string;
    entrySavedMsg: string;
  };
  errors: {
    title: string;
    subtitle: string;
    reloadBtn: string;
    fallbackMsg: string;
  };
}

export const TRANSLATIONS: Record<UiLanguage, TranslationTree> = {
  es: {
    meta: {
      title: 'Kotonoha — Academia de Japonés e Intercambio ES ↔ JA',
    },
    navbar: {
      ariaNav: 'Navegación principal',
      inicio: 'Inicio',
      cursos: 'Cursos',
      practica: 'Práctica',
      diccionario: 'Diccionario',
      intercambio: 'Intercambio',
      comunidad: 'Comunidad',
      signIn: 'Acceder',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      switchLanguage: 'Cambiar idioma',
    },
    footer: {
      tagline: 'Academia de japonés N5–N1 e intercambio ES ↔ JA',
      lightTheme: 'Tema claro',
      darkTheme: 'Tema oscuro',
      adminPanel: 'Panel de administración',
    },
    authModal: {
      accountTitlePrefix: 'Cuenta de',
      accessTitle: 'Acceso a Kotonoha',
      userSummary: 'JLPT {level} · {xp} XP · Racha de {days} días',
      guestSummary: 'Sincroniza tu progreso, tarjetas SRS, intercambio, foro y chat en Firebase.',
      closeLabel: 'Cerrar ventana',
      jlptGoal: 'Objetivo JLPT',
      nativeLangLabel: 'Idioma nativo',
      nativeEsStudent: 'Español (aprendo japonés)',
      nativeJaPartner: 'Japonés (nativo / intercambio)',
      nativeOther: 'Otro idioma',
      shortBioLabel: 'Presentación corta (visible en foro y chat)',
      shortBioPlaceholder: 'Ej: Practico N5 todos los días y me encantaría intercambiar español por japonés.',
      logout: 'Cerrar sesión',
      saving: 'Guardando...',
      saveProfile: 'Guardar perfil',
      profileSaved: 'Perfil guardado en Firebase Firestore.',
      profileSaveError: 'No se pudo actualizar el perfil.',
      googleContinue: 'Continuar con Google (recomendado · 1 clic)',
      googleError: 'No se pudo iniciar sesión con Google.',
      orDivider: 'o solo usuario y contraseña',
      tabRegister: 'Crear usuario',
      tabLogin: 'Ya tengo usuario',
      usernameLabel: 'Nombre de usuario (seudónimo público)',
      usernamePlaceholder: 'ej. sakura_estudio',
      usernameInvalid: 'El nombre de usuario debe tener entre 3 y 24 caracteres (solo letras, números, _ o -).',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Mínimo 6 caracteres',
      langProfileLabel: 'Perfil lingüístico',
      learningJaOption: 'Aprendo japonés',
      nativeJaOption: 'Nativo japonés',
      otherLangOption: 'Otro idioma',
      initialLevelLabel: 'Nivel inicial',
      privacyNote: 'En el foro, chat e intercambio solo mostramos tu seudónimo, nunca tu correo ni datos personales.',
      connecting: 'Conectando...',
      createAccountBtn: 'Crear usuario sin datos personales',
      loginBtn: 'Entrar',
      emailDisabledError:
        'Para activar cuentas solo con usuario y contraseña sin email, habilita el proveedor "Correo electrónico/contraseña" en Firebase Console > Authentication > Sign-in method (o usa "Continuar con Google").',
      usernameTakenError: 'Ese nombre de usuario ya existe. Elige otro o inicia sesión.',
      badCredentialsError: 'Nombre de usuario o contraseña incorrectos.',
      genericAuthError: 'No se pudo completar la autenticación.',
    },
    dashboard: {
      eyebrow: 'Academia de Japonés · JLPT N5 a N1 · 言の葉',
      darkMode: 'Modo oscuro',
      lightMode: 'Modo claro',
      heroTitle: 'Aprende japonés con voz real, rigor y calma diaria',
      heroSubtitle:
        'Gramática estructurada por niveles, diccionarios integrados, repetición espaciada, caligrafía en lienzo, un tutor oral con pronunciación humana e intercambio asíncrono con nativos japoneses.',
      primaryCta: 'Practicar conversación oral',
      secondaryCta: 'Explorar cursos JLPT',
      exchangeCta: 'Intercambio de idiomas',
      guestPromptPrefix: '¿Quieres guardar tu racha y tus tarjetas SRS?',
      guestPromptLink: 'Crea un usuario anónimo en 10 segundos',
      heroAlt: 'Grabado minimalista japonés con el sol rojo Hinomaru, el Monte Fuji nevado y las olas de Kanagawa',
      fallbackCaption: '言の葉 · 富士と浪',
      kpiSectionLabel: 'Resumen diario de aprendizaje',
      kpiStreakTitle: 'Racha constante',
      kpiStreakUnit: 'días',
      kpiTodayMin: '{min} min registrados hoy',
      kpiDueTitle: 'Tarjetas SRS pendientes',
      kpiMasteredSub: '{mastered} de {total} dominadas',
      kpiUnitsTitle: 'Unidades evaluadas',
      kpiWeeklyAccPrefix: 'Precisión semanal:',
      kpiNoSessions: 'Sin sesiones aún',
      kpiXpTitle: 'Experiencia acumulada',
      kpiGoalPrefix: 'Meta actual: JLPT',
      chartTitle: 'Progreso diario de los últimos 7 días',
      chartSubtitle: 'Experiencia (XP) obtenida por repasos SRS, lecciones, caligrafía y conversación oral',
      chartSynced: 'Datos sincronizados',
      chartEmpty: 'Empieza tu primera sesión hoy',
      chartTooltipXp: 'XP ganados',
      recentActivityTitle: 'Actividad reciente',
      routineTitle: 'Rutina recomendada de hoy',
      routineSubtitle: 'Bloques equilibrados de 15 a 25 minutos para progresar en todas las destrezas',
      routineSrsTitle: 'Repetición espaciada (SRS)',
      routineSrsSub: '{due} tarjetas listas con algoritmo SM-2',
      routineOralTitle: 'Conversación con Haruka-sensei',
      routineOralSub: 'Voz realista japonesa y corrección fonética en tiempo real',
      routineCoursesTitle: 'Unidad de gramática y evaluación',
      routineCoursesSub: 'Lecciones completas desde N5 hasta N1 con examen final',
      routineWritingTitle: 'Taller de escritura y caligrafía',
      routineWritingSub: 'Trazo guiado de Hiragana, Katakana y Kanji evaluado por IA',
      routineExchangeTitle: 'Muro diario de intercambio ES ↔ JA',
      routineExchangeSub: 'Responde al reto diario con ayuda de IA y recibe correcciones de nativos',
      routineFooter: 'Constancia sobre intensidad: コツコツ (paso a paso cada día).',
      spotlight1Eyebrow: 'Escritura táctil · Hiragana, Katakana y Kanji',
      spotlight1Title: 'Practica cada trazo sobre cuadrícula japonesa',
      spotlight1Desc:
        'Dibuja con ratón o pantalla táctil sobre papel cuadriculado tradicional, activa la guía de referencia y recibe corrección visual de equilibrio y proporción.',
      spotlight1Cta: 'Abrir taller de escritura',
      spotlight1Alt: 'Piedra de tinta sumi, pincel de bambú y papel washi para practicar escritura japonesa',
      spotlight2Eyebrow: 'Intercambio asíncrono · Puente IA Gemini',
      spotlight2Title: 'Conecta con hablantes nativos sin barreras',
      spotlight2Desc:
        'Comparte respuestas en el muro diario bilingüe, traduce al instante con explicación gramatical y deja correcciones amables con nativos japoneses que quieren practicar español.',
      spotlight2Cta: 'Ir al intercambio de idiomas',
      spotlight2Alt: 'Olas de Kanagawa bajo el sol rojo simbolizando el puente entre Japón y el mundo hispanohablante',
    },
    courses: {
      eyebrow: 'Plan de estudios completo · Gramática, léxico, kanji, diálogo y examen',
      title: 'Cursos estructurados por nivel JLPT',
      loading: 'Cargando unidades del nivel {level}...',
      emptyLevel: 'Aún no hay lecciones en el nivel {level}.',
      availableUnits: 'Unidades disponibles ({count})',
      unitLabel: 'Unidad',
      approvedBadge: 'Aprobada',
      tabGrammar: 'Gramática',
      tabVocab: 'Vocabulario y Kanji',
      tabDialogue: 'Diálogo oral',
      tabExercises: 'Ejercicios',
      tabExam: 'Evaluación',
      structurePrefix: 'Estructura:',
      listenPronunciation: 'Escuchar pronunciación',
      essentialVocab: 'Vocabulario esencial ({count})',
      colWord: 'Palabra',
      colReading: 'Lectura',
      colMeaning: 'Significado',
      colActions: 'Acciones',
      inSrs: 'En SRS',
      addSrs: 'SRS',
      keyKanji: 'Kanji clave de la unidad ({count})',
      strokesSuffix: 'trazos',
      dialogueHint: 'Escucha cada intervención con voz nativa generada en tiempo real y repite en voz alta.',
      hideEs: 'Ocultar traducción',
      showEs: 'Mostrar traducción',
      correctPrefix: 'Correcto: ',
      reviewPrefix: 'Revisa este punto: ',
      examHint: 'Aprueba con al menos 70% para registrar la unidad como completada en Firestore.',
      examResultPrefix: 'Resultado:',
      examPassed: 'Unidad aprobada',
      examRetryNote: 'Sigue practicando',
      questionPrefix: 'Pregunta',
      evaluatingExam: 'Evaluando...',
      gradeExamBtn: 'Corregir evaluación',
      retryExamBtn: 'Reintentar evaluación',
      loadError: 'No se pudieron cargar las lecciones.',
      audioError: 'No se pudo reproducir el audio japonés.',
      srsSaveError: 'No se pudo guardar en tu mazo SRS.',
      examSaveError: 'Error al registrar la evaluación en Firestore.',
    },
    practice: {
      eyebrow: 'Entrenamiento activo · Voz realista, repetición espaciada y escritura',
      title: 'Centro de práctica interactiva',
      tabOral: 'Tutor oral IA',
      tabSrs: 'Repetición SRS',
      tabWriting: 'Escritura',
      senseiHeader: 'Haruka-sensei · Conversación y fonética',
      scenarioPrefix: 'Escenario:',
      levelPrefix: 'Nivel',
      paceLabel: 'Velocidad',
      paceSlow: 'pausada',
      paceNatural: 'natural Tokio',
      resetDialogue: 'Reiniciar diálogo',
      youLabel: 'Tu intervención',
      pronunciationPrefix: 'Pronunciación:',
      clearPronunciation: 'Muy clara',
      inProgressPronunciation: 'En progreso',
      suggestedNatural: 'Forma natural sugerida:',
      analyzingOral: 'Analizando tu pronunciación y preparando la respuesta hablada de Haruka-sensei...',
      speakJa: 'Hablar en japonés',
      stopAndEvaluate: 'Detener y evaluar ({sec}s)',
      recordingHint: 'Escuchando tu micrófono... habla con naturalidad.',
      micHint: 'Graba tu voz para análisis fonético real o escribe abajo si prefieres.',
      oralInputPlaceholder: 'O escribe en japonés / romaji (ej. コーヒーを一つください)',
      send: 'Enviar',
      oralSettingsTitle: 'Ajustes de la sesión oral',
      oralSettingsSub: 'Adapta la velocidad, voz y contexto de conversación a tu nivel actual.',
      scenarioSelectLabel: 'Escenario de práctica',
      jlptLevelLabel: 'Nivel JLPT',
      voicePaceLabel: 'Ritmo de voz',
      paceOptionSlow: 'Pausado (didáctico)',
      paceOptionNatural: 'Natural (Tokio)',
      voiceTimbreLabel: 'Timbre de voz nativa',
      phoneticTipTitle: 'Consejo fonético',
      phoneticTipBody:
        'En japonés cada sílaba (mora) dura exactamente lo mismo. Cuida las vocales largas como コーヒー (ko-o-hi-i) y la pausa breve de っ.',
      shortRecordingError: 'La grabación fue demasiado corta. Mantén pulsado y habla una frase clara en japonés.',
      micBlockedError: 'No pudimos acceder al micrófono. Permite el permiso o escribe tu frase abajo.',
      oralProcessError: 'No se pudo procesar tu turno oral.',
      audioPlayError: 'Error reproduciendo la voz japonesa.',
      scenarios: [
        {
          id: 'Cafetería en Tokio',
          label: 'Cafetería en Tokio',
          openingJa: 'いらっしゃいませ！ご注文はお決まりですか。',
          openingSub: '¡Bienvenida! ¿Ya decidió qué pedir?',
        },
        {
          id: 'Presentación personal',
          label: 'Presentación personal',
          openingJa: 'はじめまして！お名前と好きなことを教えてくれますか。',
          openingSub: '¡Mucho gusto! ¿Me cuentas tu nombre y qué te gusta hacer?',
        },
        {
          id: 'Estación de Shinjuku',
          label: 'Estación de Shinjuku',
          openingJa: 'すみません、どちらの駅へ行きたいですか。ご案内しますよ。',
          openingSub: 'Disculpa, ¿a qué estación quieres ir? Te indico el camino.',
        },
        {
          id: 'Restaurante Izakaya',
          label: 'Restaurante Izakaya',
          openingJa: 'こんばんは！お飲み物は何になさいますか。',
          openingSub: '¡Buenas noches! ¿Qué desea tomar de bebida?',
        },
        {
          id: 'Entrevista formal (Keigo)',
          label: 'Entrevista formal (Keigo)',
          openingJa: '本日はお越しいただきありがとうございます。簡単に自己紹介をお願いできますか。',
          openingSub: 'Muchas gracias por venir hoy. ¿Podría hacer una breve presentación?',
        },
        {
          id: 'Conversación libre',
          label: 'Conversación libre',
          openingJa: 'こんにちは！今日はどんな一日でしたか。',
          openingSub: '¡Hola! ¿Cómo ha sido tu día hoy?',
        },
      ],
      cardCounter: 'Tarjeta {cur} de {total}',
      sessionStreak: 'Racha de sesión:',
      addCardBtn: 'Añadir tarjeta',
      newFrontPlaceholder: 'Japonés (ej. 桜)',
      newReadingPlaceholder: 'Lectura (ej. さくら · sakura)',
      newBackPlaceholder: 'Significado en español',
      saveCardBtn: 'Guardar',
      loadingDeck: 'Cargando tu mazo desde Firestore...',
      listenCard: 'Pronunciación',
      revealHint: 'Intenta recordar la lectura y el significado antes de revelar la respuesta.',
      showAnswer: 'Mostrar respuesta',
      rateAgain: 'Otra vez (1d)',
      rateHard: 'Difícil',
      rateGood: 'Bien',
      rateEasy: 'Fácil (+XP)',
      noCards: 'No hay tarjetas disponibles todavía.',
      sm2Title: 'Algoritmo SM-2 en Firestore',
      sm2Desc:
        'Cada calificación recalcula tu factor de facilidad y programa la tarjeta en la nube justo antes de la curva del olvido.',
      totalDeck: 'Total en mazo:',
      deckStateLabel: 'Estado:',
      deckGuestState: 'Invitado (sin guardar)',
      deckSyncedState: 'Sincronizado en Firebase',
      signInToSaveDeck: 'Iniciar sesión para guardar mazo',
      guestSrsNotice: 'Modo práctica libre: inicia sesión para guardar tus intervalos SM-2 en Firebase Firestore.',
      nextReviewMsg: 'Próximo repaso programado en {days} día(s) · +{xp} XP',
      strokesSuffix: 'trazos',
      readingLabel: 'Lectura:',
      targetCharLabel: 'Carácter objetivo:',
      listenChar: 'Escuchar',
      clearCanvas: 'Limpiar lienzo',
      hideGuide: 'Ocultar guía',
      showGuide: 'Mostrar guía',
      evaluatingStroke: 'Evaluando trazo...',
      evaluateStrokeBtn: 'Evaluar trazo con IA',
      drawFirstError: 'Dibuja el carácter sobre el lienzo antes de evaluarlo.',
      strokeError: 'No se pudo evaluar el trazo.',
      strokeRuleTitle: 'Regla de oro de los trazos',
      strokeRuleBody:
        'En japonés siempre se traza de arriba hacia abajo y de izquierda a derecha. Prueba primero con la guía activa y luego ocúltala para memorizar la forma.',
      scripts: {
        hiragana: 'Hiragana',
        katakana: 'Katakana',
        kanji: 'Kanji',
      },
    },
    dictionary: {
      eyebrow: 'Biblioteca léxica unificada · {count} diccionarios integrados',
      title: 'Diccionarios Japonés — Español',
      allLevels: 'Todos',
      searchPlaceholder: 'Busca por kanji, hiragana, romaji o español (ej. 桜, taberu, partícula...)',
      filterSourceLabel: 'Filtrar por diccionario',
      allSources: 'Todos los diccionarios',
      searching: 'Buscando entradas...',
      emptyResult: 'No se encontraron resultados para "{q}".',
      resultsCount: '{count} entradas encontradas',
      listen: 'Escuchar',
      inYourSrs: 'En tu SRS',
      addToSrs: 'Añadir a SRS',
      loadError: 'Error consultando los diccionarios.',
      audioError: 'No se pudo sintetizar la pronunciación.',
      srsError: 'No se pudo añadir la entrada al mazo SRS.',
    },
    community: {
      eyebrow: 'Acceso privado con solo usuario y contraseña · Sin correo ni datos personales',
      title: 'Comunidad, foro y chat en vivo',
      tabForum: 'Foro',
      tabChat: 'Chat en vivo',
      tabNatives: 'Conectar nativos',
      categories: {
        all: 'Todos',
        intercambio: 'Intercambio ES↔JA',
        gramatica: 'Gramática',
        pronunciacion: 'Pronunciación',
        cultura: 'Cultura',
        recursos: 'Recursos',
      },
      cancel: 'Cancelar',
      newTopic: 'Nuevo tema',
      topicTitlePlaceholder: 'Título del tema',
      topicBodyPlaceholder: 'Comparte tu duda de japonés, una frase para corregir o tu propuesta de tándem...',
      publishing: 'Publicando...',
      publishBtn: 'Publicar en el foro',
      loadingPosts: 'Cargando conversaciones...',
      emptyCategoryTitle: 'Todavía no hay temas en esta categoría',
      emptyCategorySub: 'Inicia sesión con tu nombre de usuario y abre el primer debate o solicitud de intercambio.',
      nativeBadge: 'Nativo japonés',
      helpfulBtn: 'útil',
      repliesLabel: 'respuestas',
      replyPlaceholderSigned: 'Escribe una respuesta...',
      replyPlaceholderGuest: 'Inicia sesión con tu usuario para responder',
      replyBtn: 'Responder',
      roomsHeading: 'Salas comunitarias',
      rooms: [
        { id: 'general', label: 'General', desc: 'Bienvenida y práctica diaria abierta' },
        { id: 'intercambio-es-ja', label: 'Intercambio ES–JA', desc: 'Tándem directo entre hispanohablantes y nativos japoneses' },
        { id: 'principiantes-n5', label: 'Principiantes N5', desc: 'Frases cortas con hiragana y apoyo en español' },
        { id: 'practica-oral', label: 'Práctica Oral', desc: 'Propuestas de conversación y notas de pronunciación' },
      ],
      roomPrefix: 'Sala:',
      chatRealtimeSub: 'Sincronización en tiempo real · Solo se muestra tu nombre de usuario',
      signInToChat: 'Entrar para chatear',
      emptyChat: 'Sé la primera persona en saludar en esta sala.',
      nativeShortBadge: 'Nativo JA',
      translationPrefix: 'Traducción:',
      chatInputPlaceholder: 'Escribe un mensaje en japonés o español...',
      chatHintPlaceholder: 'Traducción o pista en hiragana (opcional, ayuda mucho al intercambio)',
      send: 'Enviar',
      playbookEyebrow: 'Plan práctico de crecimiento comunitario · Intercambio ES ↔ JA',
      playbookTitle: 'Cómo atraer hablantes nativos japoneses a Kotonoha',
      playbookSteps: [
        {
          title: '01. Intercambio recíproco (Español por Japonés)',
          body: 'El español es uno de los idiomas más demandados entre universitarios japoneses. Al compartir la web, invita a estudiantes japoneses de español a cambiar el selector superior a "🇯🇵 日本語": verán toda la plataforma invitándoles a practicar español gratis contigo a cambio de ayudar con el japonés.',
        },
        {
          title: '02. Ventaja competitiva cultural: anonimato real',
          body: 'En Japón existe gran sensibilidad hacia la privacidad digital. Destacar que Kotonoha funciona con seudónimo y contraseña (sin correo público ni teléfono) elimina la mayor barrera de entrada.',
        },
        {
          title: '03. Canales concretos donde publicar la invitación',
          body: 'Comparte el enlace en clubes universitarios de español en Japón (TUFS, Sophia, Waseda, Kansai Gaidai), comunidades como r/language_exchange y hashtags en X como #スペイン語勉強中 y #言語交換.',
        },
        {
          title: '04. Horarios puente Tokio ↔ España / Latinoamérica',
          body: 'El muro diario asíncrono de la pestaña Intercambio elimina el problema de la diferencia horaria: puedes responder cuando quieras y un nativo japonés lo corregirá en su tarde en Tokio.',
        },
      ],
      inviteCardTitle: 'Mensaje listo en japonés natural',
      inviteCardSub:
        'Copia esta invitación redactada en japonés cortés para publicarla en X (#スペイン語勉強中), Discord o tableros universitarios:',
      inviteCopied: 'Invitación copiada',
      inviteCopyBtn: 'Copiar invitación en japonés',
      validationTitleBody: 'El título debe tener al menos 4 caracteres y el mensaje al menos 8.',
      validationReply: 'La respuesta debe tener al menos 2 caracteres.',
    },
    exchange: {
      eyebrow: 'Muro asíncrono ES ↔ JA · Firestore + Puente IA Gemini',
      title: 'Intercambio de Idiomas',
      subtitle:
        'Practica escribiendo respuestas reales al reto del día. La IA traduce, explica gramática y sugiere respuestas naturales en cada mensaje.',
      profileTitle: 'Tu perfil de intercambio',
      profileIncompleteHint:
        'Completa tu apodo, idiomas, nivel y 3 intereses en Firestore para que otros hablantes te conozcan.',
      profileSavedNotice: 'Perfil de intercambio guardado en Firebase Firestore.',
      signInPrompt: 'Inicia sesión para guardar tu perfil, publicar en el muro diario o corregir respuestas.',
      signInBtn: 'Acceder / Crear usuario',
      nicknameLabel: 'Nombre / Apodo',
      nicknamePlaceholder: 'Ej. Lucía / さくら',
      nativeLangLabel: 'Idioma nativo',
      nativeEs: 'Español',
      nativeJa: 'Japonés',
      nativeOther: 'Otro',
      learningLangLabel: 'Idioma que practicas',
      learningJa: 'Japonés (日本語)',
      learningEs: 'Español',
      levelLabel: 'Tu nivel en ese idioma',
      levels: {
        beginner: 'Principiante',
        intermediate: 'Intermedio',
        advanced: 'Avanzado',
      },
      interestsLabel: 'Elige 3 intereses ({count}/3)',
      interestsHelper: 'Ayudan a conectar con compañeros afines',
      interests: {
        anime_manga: 'Anime / Manga',
        travel: 'Viajes',
        gastronomy: 'Gastronomía',
        music: 'Música',
        culture: 'Cultura',
        daily_life: 'Vida diaria',
      },
      saveProfileBtn: 'Guardar perfil de intercambio',
      savingProfileBtn: 'Guardando en Firestore...',
      dailyPromptEyebrow: 'Reto diario de conversación',
      aiGeneratedBadge: 'Tema creado con IA',
      generatePromptBtn: 'Nuevo tema con IA',
      generatingPromptBtn: 'Generando tema...',
      otherPromptsLabel: 'Cambiar de reto:',
      responsesCountSuffix: 'respuestas',
      composerTitle: 'Publica tu respuesta en el idioma que estás aprendiendo',
      composerSubtitleEs: 'Anímate a escribir en japonés (no pasa nada si cometes errores, los nativos te ayudarán).',
      composerSubtitleJa: 'Escribe en español natural a tu ritmo.',
      composerPlaceholder: 'Escribe aquí tu respuesta al reto del día...',
      publishResponseBtn: 'Publicar respuesta',
      publishingResponseBtn: 'Publicando...',
      loadingWall: 'Cargando muro de intercambio...',
      emptyResponses: 'Sé la primera persona en responder a este reto diario.',
      learningBadgePrefix: 'Practica:',
      correctReplyBtn: 'Corregir / Responder',
      closeFormBtn: 'Cerrar',
      kindCorrection: 'Corrección amable',
      kindReply: 'Continuar charla',
      correctedTextLabel: 'Versión sugerida más natural (opcional)',
      correctedTextPlaceholder: 'Escribe la frase corregida para ayudarle...',
      commentLabel: 'Tu comentario o respuesta',
      commentPlaceholder: 'Explica el matiz o continúa la conversación...',
      sendFeedbackBtn: 'Enviar al hilo',
      sendingFeedbackBtn: 'Enviando...',
      correctionsTitle: 'Correcciones y respuestas en hilo',
      correctionTag: 'Corrección',
      replyTag: 'Respuesta',
      correctedLabel: 'Sugerencia natural:',
      bridgeExplainBtn: 'Traducir y explicar',
      bridgeExplainingBtn: 'Analizando con Gemini...',
      bridgeRepliesBtn: 'Ayúdame a responder',
      bridgeSuggestingBtn: 'Creando sugerencias...',
      bridgeExplainTitle: 'Puente IA · Traducción y gramática',
      bridgeTranslationLabel: 'Traducción',
      bridgeReadingLabel: 'Lectura (Furigana / Romaji)',
      bridgeGrammarLabel: 'Puntos clave',
      bridgeRepliesTitle: '3 sugerencias naturales para responder',
      useSuggestionBtn: 'Usar en mi respuesta',
      registers: {
        simple: 'Sencilla',
        standard: 'Estándar',
        colloquial: 'Coloquial',
      },
      errors: {
        minLength: 'Escribe al menos 2 caracteres para publicar.',
        maxInterests: 'Puedes seleccionar hasta 3 intereses.',
        commentMinLength: 'Escribe un comentario de al menos 2 caracteres.',
      },
    },
    admin: {
      restrictedTitle: 'Panel de administración',
      restrictedDescPrefix: 'Protegido mediante Firebase Auth y reglas de seguridad en Cloud Firestore. Solo la cuenta verificada',
      restrictedDescSuffix: 'puede acceder a las métricas en vivo, al importador PDF y a la gestión dinámica del temario.',
      currentSessionPrefix: 'Sesión actual:',
      rolePrefix: 'rol',
      googleAdminBtn: 'Entrar con Google (Administrador)',
      verifyingAdmin: 'Verificando identidad...',
      manageStudentBtn: 'Gestionar cuenta de estudiante',
      eyebrow: 'Consola de administración · Firebase Firestore, telemetría en vivo e importador PDF',
      title: 'Rendimiento y gestión dinámica',
      tabMonitor: 'Rendimiento en vivo',
      tabPdf: 'Importar PDF',
      tabFirestore: 'Firestore',
      syncCatalogBtn: 'Sincronizar catálogo base',
      syncingBtn: 'Sincronizando...',
      refreshAria: 'Actualizar métricas',
      latencyTitle: 'Latencia media / p95',
      requestsSuffix: 'peticiones (1h)',
      errorRatePrefix: 'Error',
      communityTitle: 'Comunidad en Firestore',
      usersSuffix: 'usuarios',
      forumTopicsSuffix: 'temas foro',
      chatMsgSuffix: 'mensajes chat',
      catalogTitle: 'Catálogo en Firestore',
      unitsShort: 'uds',
      dictShort: 'dicc',
      catalogSub: 'Escalable y replicado globalmente',
      serverHealthTitle: 'Salud del servidor API',
      uptimePrefix: 'Uptime',
      chartTitle: 'Latencia de API por minuto (ms)',
      chartTooltip: 'Latencia media (ms)',
      recentReqTitle: 'Últimas peticiones al servidor',
      colRoute: 'Ruta',
      colStatus: 'Estado',
      pdfTitle: 'Importador inteligente de libros y diccionarios PDF',
      pdfDesc:
        'Sube capítulos de tus libros de japonés o páginas de diccionarios en formato PDF. El servidor extraerá gramática, vocabulario, kanji, diálogos, ejercicios y evaluación, y los publicará dinámicamente en Cloud Firestore.',
      pdfModeLabel: 'Tipo de material a generar',
      pdfModeLesson: 'Unidad de curso completa (con examen)',
      pdfModeDict: 'Entradas de diccionario bilingüe',
      pdfLevelLabel: 'Nivel JLPT destino',
      pdfSourceLabel: 'Nombre del libro o diccionario fuente',
      pdfSourcePlaceholder: 'Ej. Partículas de Japonés · Cap. 1 / Diccionario Kanji',
      pdfFileLabel: 'Archivo PDF (máx. 11 MB)',
      pdfImportBtn: 'Importar recurso PDF',
      pdfImportingBtn: 'Analizando PDF y guardando en Firestore...',
      addDictTitle: 'Añadir palabra al diccionario',
      wordPlaceholder: 'Palabra en japonés (ej. 図書館)',
      readingPlaceholder: 'Lectura kana',
      romajiPlaceholder: 'Romaji',
      meaningPlaceholder: 'Significado en español',
      sourcePlaceholder: 'Diccionario fuente',
      saveEntryBtn: 'Guardar entrada en Firestore',
      publishedUnitsTitle: 'Unidades publicadas ({count})',
      activeDictPrefix: 'Diccionario activo:',
      activeDictSuffix: 'entradas disponibles.',
      alreadySyncedMsg: 'El catálogo base de Firestore ya está sincronizado y publicado.',
      selectPdfError: 'Selecciona primero un archivo PDF de curso o diccionario japonés.',
      pdfSizeError: 'El PDF supera el límite de 11 MB por envío. Divide capítulos largos antes de subirlo.',
      noValidDictError: 'No se detectaron entradas de diccionario válidas en el PDF.',
      entrySavedMsg: 'Entrada añadida dinámicamente en Cloud Firestore.',
    },
    errors: {
      title: 'Se detuvo una operación de la aplicación',
      subtitle: 'Si acabas de activar Firebase o cambiar permisos, recarga la página para volver a sincronizar.',
      reloadBtn: 'Recargar Kotonoha',
      fallbackMsg: 'Ha ocurrido un error inesperado.',
    },
  },

  ja: {
    meta: {
      title: 'Kotonoha（言の葉）— スペイン語無料練習 ＆ 日本語サポート言語交換コミュニティ',
    },
    navbar: {
      ariaNav: 'メインナビゲーション',
      inicio: 'ホーム',
      cursos: '日本語コース',
      practica: '練習スタジオ',
      diccionario: '辞書',
      intercambio: '言語交換',
      comunidad: 'コミュニティ',
      signIn: 'ログイン',
      openMenu: 'メニューを開く',
      closeMenu: 'メニューを閉じる',
      switchLanguage: '表示言語を切り替える',
    },
    footer: {
      tagline: '日本語 × スペイン語 無料言語交換プラットフォーム',
      lightTheme: 'ライトモード',
      darkTheme: 'ダークモード',
      adminPanel: '管理パネル',
    },
    authModal: {
      accountTitlePrefix: 'アカウント:',
      accessTitle: 'Kotonoha へログイン・登録',
      userSummary: 'JLPT {level} · {xp} XP · {days}日連続',
      guestSummary: 'メールアドレス不要のニックネームだけでも登録OK。言語交換やチャットを保存できます。',
      closeLabel: '閉じる',
      jlptGoal: '日本語レベル（または案内目安）',
      nativeLangLabel: '母語',
      nativeEsStudent: 'スペイン語（日本語を学習中）',
      nativeJaPartner: '日本語（ネイティブ・スペイン語を練習したい）',
      nativeOther: 'その他の言語',
      shortBioLabel: 'ひとこと自己紹介（コミュニティで表示）',
      shortBioPlaceholder: '例：東京在住です。スペイン語を勉強中なので、日本語と楽しく交換できたら嬉しいです！',
      logout: 'ログアウト',
      saving: '保存中...',
      saveProfile: 'プロフィールを保存',
      profileSaved: 'Firebase Firestore に保存しました。',
      profileSaveError: 'プロフィールの更新に失敗しました。',
      googleContinue: 'Google でかんたんログイン（1クリック）',
      googleError: 'Google ログインに失敗しました。',
      orDivider: 'またはニックネームとパスワードで登録',
      tabRegister: '新規作成',
      tabLogin: 'ログイン',
      usernameLabel: 'ニックネーム（公開用・本名不要）',
      usernamePlaceholder: '例: kenji_tokyo（半角英数字・_・-）',
      usernameInvalid: 'ユーザー名は3〜24文字の半角英数字・アンダースコア（_）・ハイフン（-）で入力してください。',
      passwordLabel: 'パスワード',
      passwordPlaceholder: '6文字以上',
      langProfileLabel: '言語プロフィール',
      learningJaOption: '日本語を学習中（スペイン語話者）',
      nativeJaOption: '日本語ネイティブ（スペイン語を練習したい）',
      otherLangOption: 'その他の言語',
      initialLevelLabel: '目安レベル',
      privacyNote: 'メールアドレスや電話番号などの個人情報は公開されません。ニックネームだけで安心してお話しできます。',
      connecting: '接続中...',
      createAccountBtn: '個人情報なしで登録する',
      loginBtn: 'ログイン',
      emailDisabledError:
        'メールなしのユーザー登録を使うには、Firebase Console の Authentication > Sign-in method でメール/パスワードを有効にするか、上の Google ログインをご利用ください。',
      usernameTakenError: 'このユーザー名はすでに使われています。別の名前をお試しください。',
      badCredentialsError: 'ユーザー名またはパスワードが正しくありません。',
      genericAuthError: '認証を完了できませんでした。',
    },
    dashboard: {
      eyebrow: 'スペイン語 ⇄ 日本語 言語交換コミュニティ · 無料 · 言の葉',
      darkMode: 'ダーク',
      lightMode: 'ライト',
      heroTitle: 'スペイン語を無料で練習しながら、日本語でおしゃべりしませんか？',
      heroSubtitle:
        'Kotonohaは、日本語を熱心に学ぶスペイン語ネイティブと、スペイン語を楽しく練習したい日本の皆さんをつなぐ無料コミュニティです。日本語でのちょっとしたお返しや優しい添削をするだけで、ネイティブの生きたスペイン語にいつでも触れられます。',
      primaryCta: '言語交換ウォールを見る',
      secondaryCta: 'AI会話・日本語練習を見る',
      exchangeCta: '言語交換を始める',
      guestPromptPrefix: 'ニックネームだけで参加できます：',
      guestPromptLink: '10秒で無料アカウントを作成',
      heroAlt: '富士山と神奈川沖の波、日の丸を描いたミニマルな和風イラスト',
      fallbackCaption: '言の葉 · 富士と浪',
      kpiSectionLabel: '今日の交流・学習ステータス',
      kpiStreakTitle: '連続参加日数',
      kpiStreakUnit: '日',
      kpiTodayMin: '本日の活動: {min} 分',
      kpiDueTitle: '復習カード (SRS)',
      kpiMasteredSub: '{total}枚中 {mastered}枚習得',
      kpiUnitsTitle: '完了ユニット',
      kpiWeeklyAccPrefix: '週間正答率:',
      kpiNoSessions: 'まだ記録がありません',
      kpiXpTitle: '獲得ポイント',
      kpiGoalPrefix: '設定レベル: JLPT',
      chartTitle: '直近7日間のアクティビティ',
      chartSubtitle: '言語交換・学習・添削などで貯まった日別の経験値（XP）',
      chartSynced: '同期済み',
      chartEmpty: '今日のメッセージから始めましょう',
      chartTooltipXp: '獲得 XP',
      recentActivityTitle: '最近のアクティビティ',
      routineTitle: 'おすすめの楽しみ方',
      routineSubtitle: 'スキマ時間10分から、スペイン語話者とのやさしい言葉のキャッチボールを',
      routineSrsTitle: '今日の言語交換チャレンジに投稿する',
      routineSrsSub: 'AI翻訳と返信ヒント付きだからスペイン語初心者でも安心',
      routineOralTitle: 'スペイン語学習者の日本語を優しく添削する',
      routineOralSub: '自然な言い回しを1つ伝えるだけでとても喜ばれます',
      routineCoursesTitle: '日本の文法コース・辞書をのぞく',
      routineCoursesSub: 'スペイン語で日本語がどう説明されているか見るとスペイン語の勉強にもなります',
      routineWritingTitle: 'AI会話・文字練習スタジオ',
      routineWritingSub: '音声付きAIチューターや手書き機能も体験できます',
      routineExchangeTitle: 'デイリートピックで非同期交流',
      routineExchangeSub: '時差を気にせず、好きな時間にスペイン語で返信できます（{due}件のカード準備完了）',
      routineFooter: 'コツコツ気楽に：お互いの言葉を教え合う温かい場所です。',
      spotlight1Eyebrow: 'AIブリッジ搭載 · 翻訳・文法解説・返信ヒント',
      spotlight1Title: 'スペイン語に自信がなくてもAIがすぐサポート',
      spotlight1Desc:
        '相手のスペイン語メッセージの下にある「翻訳と解説」や「返信のヒント」を押すだけで、自然な意味と今すぐ使える返事のアイデア（やさしい・標準・くだけた表現）を提案します。',
      spotlight1Cta: '言語交換ウォールへ',
      spotlight1Alt: '硯と筆、和紙のイメージ',
      spotlight2Eyebrow: '時差ゼロの非同期交流 · 個人情報不要',
      spotlight2Title: 'スペイン語ネイティブとつながる安全なコミュニティ',
      spotlight2Desc:
        'メールアドレスや本名を出さずに参加可能。毎日の会話テーマにスペイン語で書き込んだり、スペイン語話者の日本語に優しいコメントを残して交流を深めましょう。',
      spotlight2Cta: 'コミュニティを見る',
      spotlight2Alt: '日本とスペイン語圏を結ぶ波のイラスト',
    },
    courses: {
      eyebrow: '日本語カリキュラム（スペイン語解説付き）· JLPT N5〜N1',
      title: 'レベル別日本語コース＆スペイン語対訳',
      loading: 'JLPT {level} のユニットを読み込み中...',
      emptyLevel: 'レベル {level} のレッスンはまだ登録されていません。',
      availableUnits: '公開中のユニット ({count})',
      unitLabel: 'ユニット',
      approvedBadge: '修了',
      tabGrammar: '文法・表現',
      tabVocab: '語彙・漢字',
      tabDialogue: '会話ダイアログ',
      tabExercises: '練習問題',
      tabExam: '確認テスト',
      structurePrefix: '文型:',
      listenPronunciation: '音声を聞く',
      essentialVocab: '重要語彙 ({count})',
      colWord: '単語',
      colReading: '読み方',
      colMeaning: 'スペイン語での意味',
      colActions: '操作',
      inSrs: '追加済み',
      addSrs: 'SRSへ',
      keyKanji: 'ユニットの重要漢字 ({count})',
      strokesSuffix: '画',
      dialogueHint: '自然な音声を再生しながら、スペイン語訳の表現も参考にできます。',
      hideEs: 'スペイン語訳を隠す',
      showEs: 'スペイン語訳を表示',
      correctPrefix: '正解: ',
      reviewPrefix: '解説: ',
      examHint: '70%以上の正答でユニット修了としてFirestoreに記録されます。',
      examResultPrefix: '結果:',
      examPassed: '合格しました！',
      examRetryNote: 'もう一度挑戦しよう',
      questionPrefix: '問題',
      evaluatingExam: '採点中...',
      gradeExamBtn: 'テストを採点する',
      retryExamBtn: 'もう一度受ける',
      loadError: 'レッスンの読み込みに失敗しました。',
      audioError: '音声を再生できませんでした。',
      srsSaveError: 'SRSデッキに保存できませんでした。',
      examSaveError: 'テスト結果の保存に失敗しました。',
    },
    practice: {
      eyebrow: '実践練習スタジオ · AI音声会話・SRS・書道キャンバス',
      title: 'インタラクティブ練習センター',
      tabOral: 'AI音声会話',
      tabSrs: 'SRS暗記カード',
      tabWriting: '手書き書道',
      senseiHeader: 'ハルカ先生 · 会話・発音チェック',
      scenarioPrefix: 'シチュエーション:',
      levelPrefix: 'レベル',
      paceLabel: '話す速さ',
      paceSlow: 'ゆっくり',
      paceNatural: '自然な速度',
      resetDialogue: '会話をリセット',
      youLabel: 'あなたの発話',
      pronunciationPrefix: '発音スコア:',
      clearPronunciation: 'とても明瞭',
      inProgressPronunciation: '改善中',
      suggestedNatural: 'より自然な表現:',
      analyzingOral: '音声を解析し、ハルカ先生の返答を準備しています...',
      speakJa: 'マイクで話す',
      stopAndEvaluate: '録音終了・評価 ({sec}秒)',
      recordingHint: '録音中... 自然な速さで話してみてください。',
      micHint: 'マイクで発音チェックするか、下の入力欄から送信できます。',
      oralInputPlaceholder: 'テキストでも送信できます（例: コーヒーを一つください）',
      send: '送信',
      oralSettingsTitle: 'セッション設定',
      oralSettingsSub: '会話シーン・JLPTレベル・音声の速さを調整できます。',
      scenarioSelectLabel: '会話シーン',
      jlptLevelLabel: 'JLPTレベル',
      voicePaceLabel: '音声スピード',
      paceOptionSlow: 'ゆっくり（学習用）',
      paceOptionNatural: '標準（東京アクセント）',
      voiceTimbreLabel: 'ボイス選択',
      phoneticTipTitle: '発音のワンポイント',
      phoneticTipBody: '日本語は1モーラ（拍）の長さが均一です。長音（コーヒー）や促音（っ）の拍を意識すると自然な響きになります。',
      shortRecordingError: '録音が短すぎます。もう少し長めに話してください。',
      micBlockedError: 'マイクへのアクセスが許可されていません。下のテキスト欄もご利用いただけます。',
      oralProcessError: '会話ターンの処理に失敗しました。',
      audioPlayError: '音声の再生中にエラーが発生しました。',
      scenarios: [
        {
          id: 'Cafetería en Tokio',
          label: '東京のカフェ',
          openingJa: 'いらっしゃいませ！ご注文はお決まりですか。',
          openingSub: '¡Bienvenida! ¿Ya decidió qué pedir?',
        },
        {
          id: 'Presentación personal',
          label: '自己紹介',
          openingJa: 'はじめまして！お名前と好きなことを教えてくれますか。',
          openingSub: '¡Mucho gusto! ¿Me cuentas tu nombre y qué te gusta hacer?',
        },
        {
          id: 'Estación de Shinjuku',
          label: '新宿駅での道案内',
          openingJa: 'すみません、どちらの駅へ行きたいですか。ご案内しますよ。',
          openingSub: 'Disculpa, ¿a qué estación quieres ir? Te indico el camino.',
        },
        {
          id: 'Restaurante Izakaya',
          label: '居酒屋で注文',
          openingJa: 'こんばんは！お飲み物は何になさいますか。',
          openingSub: '¡Buenas noches! ¿Qué desea tomar de bebida?',
        },
        {
          id: 'Entrevista formal (Keigo)',
          label: '敬語・フォーマル会話',
          openingJa: '本日はお越しいただきありがとうございます。簡単に自己紹介をお願いできますか。',
          openingSub: 'Muchas gracias por venir hoy. ¿Podría hacer una breve presentación?',
        },
        {
          id: 'Conversación libre',
          label: 'フリートーク',
          openingJa: 'こんにちは！今日はどんな一日でしたか。',
          openingSub: '¡Hola! ¿Cómo ha sido tu día hoy?',
        },
      ],
      cardCounter: 'カード {cur} / {total}',
      sessionStreak: '連続正解:',
      addCardBtn: 'カードを追加',
      newFrontPlaceholder: '表（例: 桜）',
      newReadingPlaceholder: '読み（例: さくら · sakura）',
      newBackPlaceholder: '意味（スペイン語など）',
      saveCardBtn: '保存',
      loadingDeck: 'Firestoreからカードを読み込み中...',
      listenCard: '発音を聞く',
      revealHint: '答えを見る前に読み方と意味を思い出してみましょう。',
      showAnswer: '答えを表示',
      rateAgain: 'もう一度 (1日)',
      rateHard: '難しい',
      rateGood: 'ちょうど良い',
      rateEasy: '簡単 (+XP)',
      noCards: 'カードがまだありません。',
      sm2Title: 'Firestore連携 SM-2 間隔反復',
      sm2Desc: '評価に応じて忘却曲線に合わせた最適な復習タイミングを自動計算します。',
      totalDeck: 'デッキ枚数:',
      deckStateLabel: '同期状態:',
      deckGuestState: 'ゲスト（未保存）',
      deckSyncedState: 'Firebaseに同期中',
      signInToSaveDeck: 'ログインしてデッキを保存',
      guestSrsNotice: 'ゲストモード中：ログインするとSM-2の復習間隔がFirestoreに保存されます。',
      nextReviewMsg: '次回の復習は {days} 日後 · +{xp} XP',
      strokesSuffix: '画',
      readingLabel: '読み:',
      targetCharLabel: '練習文字:',
      listenChar: '聞く',
      clearCanvas: '書き直す',
      hideGuide: 'お手本を隠す',
      showGuide: 'お手本を表示',
      evaluatingStroke: 'AIが添削中...',
      evaluateStrokeBtn: 'AIで文字バランスを評価',
      drawFirstError: '評価する前にキャンバスに文字を書いてください。',
      strokeError: '文字の評価に失敗しました。',
      strokeRuleTitle: '書き順の基本',
      strokeRuleBody: '基本は「上から下へ」「左から右へ」。お手本ありでバランスを掴んでから、お手本なしに挑戦してみましょう。',
      scripts: {
        hiragana: 'ひらがな',
        katakana: 'カタカナ',
        kanji: '漢字',
      },
    },
    dictionary: {
      eyebrow: '日西統合辞書ライブラリ · {count} 種類の教材収録',
      title: '日本語 — スペイン語 辞書',
      allLevels: 'すべて',
      searchPlaceholder: '漢字、ひらがな、ローマ字、スペイン語で検索（例: 桜, taberu, は...）',
      filterSourceLabel: '出典で絞り込む',
      allSources: 'すべての出典',
      searching: '検索中...',
      emptyResult: '「{q}」に一致する項目が見つかりませんでした。',
      resultsCount: '{count} 件の見出し語',
      listen: '聞く',
      inYourSrs: 'SRS済み',
      addToSrs: 'SRSに追加',
      loadError: '辞書の読み込み中にエラーが発生しました。',
      audioError: '音声を生成できませんでした。',
      srsError: 'SRSカードに追加できませんでした。',
    },
    community: {
      eyebrow: 'ニックネーム＆パスワードだけで参加OK · 個人情報不要',
      title: 'コミュニティ・掲示板・チャット',
      tabForum: '掲示板',
      tabChat: 'リアルタイムチャット',
      tabNatives: '言語交換ガイド',
      categories: {
        all: 'すべて',
        intercambio: 'スペイン語⇄日本語交換',
        gramatica: '文法相談',
        pronunciacion: '発音',
        cultura: '文化',
        recursos: '学習資料',
      },
      cancel: 'キャンセル',
      newTopic: 'トピックを立てる',
      topicTitlePlaceholder: 'タイトル',
      topicBodyPlaceholder: 'スペイン語や日本語の質問、パートナー募集などを気軽に書いてみましょう...',
      publishing: '投稿中...',
      publishBtn: '掲示板に投稿する',
      loadingPosts: '投稿を読み込み中...',
      emptyCategoryTitle: 'このカテゴリーにはまだ投稿がありません',
      emptyCategorySub: 'ニックネームでログインして最初のスレッドを作ってみましょう。',
      nativeBadge: '日本語ネイティブ',
      helpfulBtn: '参考になった',
      repliesLabel: '件の返信',
      replyPlaceholderSigned: '返信や優しいコメントを書く...',
      replyPlaceholderGuest: '返信するにはログインしてください',
      replyBtn: '返信する',
      roomsHeading: 'チャットルーム',
      rooms: [
        { id: 'general', label: '総合ラウンジ', desc: 'はじめましての挨拶やフリートーク' },
        { id: 'intercambio-es-ja', label: 'ES–JA 言語交換', desc: 'スペイン語話者と日本語話者のメイン交流ルーム' },
        { id: 'principiantes-n5', label: 'やさしい日本語・初級', desc: 'ひらがな中心＆スペイン語ヒント付きのルーム' },
        { id: 'practica-oral', label: '発音・会話トピック', desc: 'おすすめの表現や会話アイデアを共有' },
      ],
      roomPrefix: 'ルーム:',
      chatRealtimeSub: 'リアルタイム同期 · 表示されるのはニックネームのみです',
      signInToChat: 'ログインして参加',
      emptyChat: '最初のメッセージを挨拶として送ってみましょう。',
      nativeShortBadge: '日本語話者',
      translationPrefix: '対訳メモ:',
      chatInputPlaceholder: 'スペイン語や日本語でメッセージを入力...',
      chatHintPlaceholder: '訳や読み方のヒント（任意・入力すると相手が理解しやすくなります）',
      send: '送信',
      playbookEyebrow: '日西言語交換コミュニティの楽しみ方 · ES ↔ JA',
      playbookTitle: '日本の皆さんが安心してスペイン語を無料で練習できる仕組み',
      playbookSteps: [
        {
          title: '01. 持ちつ持たれつの言語交換（スペイン語 ⇄ 日本語）',
          body: 'Kotonohaには日本語を真剣に学んでいるスペイン語ネイティブが集まっています。あなたが日本語の自然な言い回しを少し教えてあげる代わりに、ネイティブのリアルなスペイン語表現を無料で練習できます。',
        },
        {
          title: '02. メールアドレスや電話番号の公開は一切不要',
          body: 'ニックネームとパスワードだけで始められるため、プライバシーを守りながら落ち着いて言葉のやり取りができます。',
        },
        {
          title: '03. AIブリッジ機能で初級者でも会話が続く',
          body: '「言語交換」タブでは、相手の投稿に「翻訳と解説」「返信のヒント」ボタンが用意されており、分からないスペイン語があってもすぐ理解して返信できます。',
        },
        {
          title: '04. 時差を気にしない非同期デイリーお題',
          body: '日本とスペイン・中南米には時差がありますが、毎日の質問ウォールなら好きな時間に書いて、次の日にネイティブからのコメントや添削を受け取れます。',
        },
      ],
      inviteCardTitle: 'お友達・SNS向けの紹介文（コピー用）',
      inviteCardSub: 'スペイン語を勉強しているお友達やX（#スペイン語勉強中 #言語交換）へのシェアにご活用ください：',
      inviteCopied: 'コピーしました',
      inviteCopyBtn: '紹介メッセージをコピー',
      validationTitleBody: 'タイトルは4文字以上、本文は8文字以上入力してください。',
      validationReply: '返信は2文字以上入力してください。',
    },
    exchange: {
      eyebrow: '非同期デイリー交流ウォール · Firestore + Gemini AI ブリッジ',
      title: '言語交換（スペイン語 ⇄ 日本語）',
      subtitle:
        '毎日のお題に学んでいる言語で答えてみましょう。スペイン語話者と日本語話者がお互いに優しく添削・返信し合い、AIが翻訳や返信フレーズを提案してくれます。',
      profileTitle: 'あなたの言語交換プロフィール',
      profileIncompleteHint:
        'まずは名前（ニックネーム）・母語・学びたい言語とレベル・興味のあること3つを登録しましょう。',
      profileSavedNotice: '言語交換プロフィールをFirestoreに保存しました。',
      signInPrompt: 'プロフィールの保存、回答の投稿、添削・返信を行うにはログインしてください。',
      signInBtn: 'ログイン / ニックネーム登録',
      nicknameLabel: '名前 / ニックネーム',
      nicknamePlaceholder: '例: さくら / Kenji',
      nativeLangLabel: '母語',
      nativeEs: 'スペイン語',
      nativeJa: '日本語',
      nativeOther: 'その他',
      learningLangLabel: '練習したい言語',
      learningJa: '日本語',
      learningEs: 'スペイン語 (Español)',
      levelLabel: '現在のレベル',
      levels: {
        beginner: '初級（ビギナー）',
        intermediate: '中級',
        advanced: '上級',
      },
      interestsLabel: '興味のあるテーマを3つ選択 ({count}/3)',
      interestsHelper: '共通の話題があるパートナーとつながりやすくなります',
      interests: {
        anime_manga: 'アニメ・マンガ',
        travel: '旅行',
        gastronomy: 'グルメ・料理',
        music: '音楽',
        culture: '文化',
        daily_life: '日常生活',
      },
      saveProfileBtn: 'プロフィールを保存する',
      savingProfileBtn: '保存中...',
      dailyPromptEyebrow: '今日の会話チャレンジ',
      aiGeneratedBadge: 'AIが作成',
      generatePromptBtn: 'AIで新しいトピックを作成',
      generatingPromptBtn: 'トピック生成中...',
      otherPromptsLabel: '別のトピックを選ぶ:',
      responsesCountSuffix: '件の投稿',
      composerTitle: '練習中の言語（スペイン語など）で回答を投稿しよう',
      composerSubtitleEs: '間違いを恐れずスペイン語（または日本語）で書いてみましょう。ネイティブが優しく直してくれます！',
      composerSubtitleJa: '今日は学んでいる言語で1〜3文ほど書いてみませんか？',
      composerPlaceholder: '今日の質問に対するあなたの回答を書いてみましょう...',
      publishResponseBtn: '回答を投稿する',
      publishingResponseBtn: '投稿中...',
      loadingWall: '投稿を読み込み中...',
      emptyResponses: 'このトピックへの最初の回答を書いてみましょう！',
      learningBadgePrefix: '学習中:',
      correctReplyBtn: '添削・返信する',
      closeFormBtn: '閉じる',
      kindCorrection: '優しい添削',
      kindReply: '会話を続ける（返信）',
      correctedTextLabel: 'より自然な表現の提案（任意）',
      correctedTextPlaceholder: '例：より自然にするならこのように言えます...',
      commentLabel: 'コメント・メッセージ',
      commentPlaceholder: '良かった点や自然なニュアンス、お返事を書きましょう...',
      sendFeedbackBtn: 'スレッドに送信',
      sendingFeedbackBtn: '送信中...',
      correctionsTitle: '添削・返信スレッド',
      correctionTag: '添削',
      replyTag: '返信',
      correctedLabel: '自然な言い換え:',
      bridgeExplainBtn: '翻訳と解説',
      bridgeExplainingBtn: 'AIが解説を作成中...',
      bridgeRepliesBtn: '返信のヒント',
      bridgeSuggestingBtn: 'AIが返信案を作成中...',
      bridgeExplainTitle: 'AIブリッジ · 翻訳とポイント解説',
      bridgeTranslationLabel: '日本語訳 / ニュアンス',
      bridgeReadingLabel: '読み方・発音メモ',
      bridgeGrammarLabel: '文法・自然表現ポイント',
      bridgeRepliesTitle: '文脈に合った3つの返信アイデア',
      useSuggestionBtn: '返信欄に入力する',
      registers: {
        simple: 'やさしい表現',
        standard: '自然な標準表現',
        colloquial: 'カジュアル・親しみ',
      },
      errors: {
        minLength: '2文字以上入力してください。',
        maxInterests: '興味のあるテーマは3つまで選べます。',
        commentMinLength: 'コメントは2文字以上入力してください。',
      },
    },
    admin: {
      restrictedTitle: '管理パネル',
      restrictedDescPrefix: 'Firebase AuthとCloud Firestoreのルールで保護されています。認証済みアカウント',
      restrictedDescSuffix: 'のみリアルタイム指標・PDFインポーター・コンテンツ管理にアクセスできます。',
      currentSessionPrefix: '現在のログイン:',
      rolePrefix: 'ロール',
      googleAdminBtn: 'Googleでログイン（管理者）',
      verifyingAdmin: '認証中...',
      manageStudentBtn: '一般アカウントを管理',
      eyebrow: '管理コンソール · Firebase Firestore・リアルタイム計測・PDF取り込み',
      title: 'パフォーマンス監視とコンテンツ管理',
      tabMonitor: 'リアルタイム監視',
      tabPdf: 'PDF取り込み',
      tabFirestore: 'Firestore管理',
      syncCatalogBtn: '基本カタログを同期',
      syncingBtn: '同期中...',
      refreshAria: '指標を更新',
      latencyTitle: '平均 / p95 レイテンシ',
      requestsSuffix: 'リクエスト (1時間)',
      errorRatePrefix: 'エラー率',
      communityTitle: 'Firestore コミュニティ',
      usersSuffix: 'ユーザー',
      forumTopicsSuffix: '投稿',
      chatMsgSuffix: 'チャット',
      catalogTitle: 'Firestore 教材数',
      unitsShort: '課',
      dictShort: '語',
      catalogSub: 'クラウド上で即時反映',
      serverHealthTitle: 'APIサーバー状態',
      uptimePrefix: '稼働',
      chartTitle: '分ごとのAPIレイテンシ (ms)',
      chartTooltip: '平均レイテンシ (ms)',
      recentReqTitle: '直近のリクエスト',
      colRoute: 'エンドポイント',
      colStatus: '状態',
      pdfTitle: '日本語教材・辞書 PDF インポーター',
      pdfDesc: '日本語の教科書や辞書PDFをアップロードすると、AIが文法・語彙・漢字・会話・テストを抽出してFirestoreに公開します。',
      pdfModeLabel: '生成タイプ',
      pdfModeLesson: 'コースユニット（テスト付き）',
      pdfModeDict: '日西辞書エントリ',
      pdfLevelLabel: '対象JLPTレベル',
      pdfSourceLabel: '書籍・辞書名',
      pdfSourcePlaceholder: '例：日本語の助詞 完全ガイド',
      pdfFileLabel: 'PDFファイル（最大11MB）',
      pdfImportBtn: 'PDFを解析して保存',
      pdfImportingBtn: '解析してFirestoreに保存中...',
      addDictTitle: '辞書に単語を追加',
      wordPlaceholder: '日本語の単語（例: 図書館）',
      readingPlaceholder: 'かな読み',
      romajiPlaceholder: 'ローマ字',
      meaningPlaceholder: 'スペイン語の意味',
      sourcePlaceholder: '出典名',
      saveEntryBtn: 'Firestoreに保存',
      publishedUnitsTitle: '公開中のユニット ({count})',
      activeDictPrefix: '登録済み辞書:',
      activeDictSuffix: '件',
      alreadySyncedMsg: 'Firestoreの基本カタログはすでに最新です。',
      selectPdfError: 'PDFファイルを選択してください。',
      pdfSizeError: 'ファイルサイズが11MBを超えています。章ごとに分割してください。',
      noValidDictError: 'PDFから有効な辞書エントリを抽出できませんでした。',
      entrySavedMsg: 'Firestoreに新しい辞書エントリを保存しました。',
    },
    errors: {
      title: 'アプリの操作中に問題が発生しました',
      subtitle: 'Firebaseの設定直後や権限変更後は、ページを再読み込みしてください。',
      reloadBtn: 'Kotonohaを再読み込み',
      fallbackMsg: '予期しないエラーが発生しました。',
    },
  },
};

export function formatT(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
}
