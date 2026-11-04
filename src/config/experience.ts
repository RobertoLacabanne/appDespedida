/**
 * LO QUE NOS QUEDA — configuración central
 * ------------------------------------------------------------------
 * Todo lo que se lee en la experiencia sale de este archivo.
 * Podés cambiar cualquier texto sin tocar los componentes.
 *
 * Reglas para que no se rompa nada:
 *  - Los textos van entre comillas simples '...'. Si un texto lleva un
 *    apóstrofo, usá comillas dobles "..." para ese texto.
 *  - Las listas van entre corchetes [ ... ] y cada elemento separado por coma.
 *  - Después de editar, corré `npm run build` para verificar.
 */

export type FlowerKind = 'girasol' | 'rosa' | 'olivo'

/** Un recuerdo real para sumar en el capítulo II (opcional). */
export interface Memory {
  /** Texto del recuerdo. Obligatorio. */
  text: string
  /** Título corto opcional, p. ej. "La primera semana". */
  title?: string
  /** Momento aproximado, tal como quieras que se lea, p. ej. "Invierno de 2019". */
  when?: string
  /** Ruta a una foto dentro de /public, p. ej. '/recuerdos/mate.jpg'. */
  photo?: string
  /** Descripción de la foto para lectores de pantalla. Obligatoria si hay foto. */
  photoAlt?: string
}

export interface ExperienceConfig {
  meta: {
    title: string
    subtitle: string
    /** Descripción que aparece en la vista previa de WhatsApp. */
    previewDescription: string
    themeColor: string
  }
  sender: {
    name: string
    closing: string
  }
  /** Personas a quienes está dedicada. Se muestran en la portada y en la carta. */
  recipients: string[]
  /** Cantidad de años compartidos. Dejalo en null si preferís no especificarla. */
  yearsShared: number | null
  ui: {
    next: string
    back: string
    skipIntro: string
    restart: string
    soundOn: string
    soundOff: string
    progressLabel: string
  }
  chapters: {
    time: {
      title: string
      phrases: string[]
      cta: string
    }
    roots: {
      title: string
      quote: string
      words: string[]
      hint: string
      completed: string
      memoriesTitle: string
    }
    gratitude: {
      title: string
      intro: string
      hint: string
      messages: string[]
      finalMessage: string
      finalLabel: string
      flowerNames: Record<FlowerKind, { name: string; meaning: string }>
    }
    lettingGo: {
      title: string
      prompt: string
      hint: string
      blowButton: string
      texts: string[]
    }
    remains: {
      title: string
      letterHeading: string
      letter: string[]
      closingPhrase: string
      circleHint: string
      circleMessage: string
    }
  }
  /** Recuerdos o anécdotas reales. Vacío = la sección no se muestra. */
  memories: Memory[]
  share: {
    button: string
    /** Texto que acompaña al enlace al compartir. */
    text: string
    whatsappFallback: string
    copyLink: string
    copied: string
  }
  sound: {
    /**
     * 'generative' → ambiente sonoro suave generado en el navegador (sin archivos,
     *                 sin derechos de terceros). Arranca apagado; solo suena si
     *                 la persona toca el botón de sonido.
     * 'file'       → reproduce el archivo indicado en `src` (tiene que ser
     *                 música con licencia de uso apropiada).
     * 'off'        → no se muestra el botón de sonido.
     */
    mode: 'generative' | 'file' | 'off'
    src: string | null
    credit: string | null
  }
}

export const experience: ExperienceConfig = {
  meta: {
    title: 'Lo que nos queda',
    subtitle: 'Hay lugares de los que uno se va, pero personas que se lleva para siempre.',
    previewDescription: 'Hay lugares de los que uno se va, pero personas que se lleva para siempre.',
    themeColor: '#F7EFE2',
  },

  sender: {
    name: 'Rober',
    closing: 'Con mucho cariño,',
  },

  recipients: ['Inés', 'Agustín', 'Carla', 'Brenda', 'Consuelo', 'Martina'],

  yearsShared: null,

  // Microcopy de la interfaz (escrito para esta versión; editable).
  ui: {
    next: 'Seguir',
    back: 'Volver',
    skipIntro: 'Tocá para seguir',
    restart: 'Volver a empezar',
    soundOn: 'Activar sonido',
    soundOff: 'Silenciar',
    progressLabel: 'Capítulo',
  },

  chapters: {
    time: {
      title: 'El tiempo compartido',
      phrases: [
        'Hay despedidas que no se explican con un simple adiós.',
        'Porque hay lugares que terminan siendo mucho más que un lugar de trabajo.',
        'Y personas que, sin darnos cuenta, se vuelven parte de nuestra historia.',
      ],
      cta: 'Empezar este recorrido',
    },

    roots: {
      title: 'Las raíces',
      quote:
        'Lo más valioso que uno se lleva de un lugar no siempre es lo que aprendió a hacer, sino las personas con las que compartió el camino.',
      words: [
        'Amistad',
        'Compañerismo',
        'Risas',
        'Aprendizajes',
        'Confianza',
        'Anécdotas',
        'Apoyo',
        'Recuerdos',
      ],
      // Microcopy (editable).
      hint: 'Tocá los brotes del árbol',
      completed: 'Y todo eso fue creciendo con los años.',
      memoriesTitle: 'Algunos recuerdos',
    },

    gratitude: {
      title: 'Gracias',
      // Microcopy (editable).
      intro: 'Cada flor guarda algo que quería decirles.',
      hint: 'Tocá una flor',
      messages: [
        'Gracias por las risas que hicieron más livianos los días difíciles.',
        'Gracias por cada charla que empezó hablando de trabajo y terminó hablando de la vida.',
        'Gracias por estar cuando las cosas no salían como esperábamos.',
        'Gracias por enseñarme, escucharme y acompañarme.',
        'Gracias por hacer que tantos días comunes terminaran siendo recuerdos especiales.',
        'Gracias por demostrarme que el compañerismo también puede convertirse en amistad.',
      ],
      finalMessage:
        'De todo lo que viví en estos años, ustedes son una de las cosas más lindas que me llevo.',
      // Rótulo de la última tarjeta (microcopy, editable).
      finalLabel: 'Lo que me llevo',
      flowerNames: {
        girasol: { name: 'Girasol', meaning: 'la gratitud' },
        rosa: { name: 'Rosa rosada', meaning: 'el cariño sincero' },
        olivo: { name: 'Rama de olivo', meaning: 'la paz' },
      },
    },

    lettingGo: {
      title: 'Aprender a soltar',
      prompt: 'A veces, seguir creciendo también significa aprender a despedirse.',
      // Microcopy (editable).
      hint: 'Deslizá el dedo sobre el diente de león',
      blowButton: 'Soplar',
      texts: [
        'Hoy me toca comenzar una etapa distinta.',
        'Me voy agradecido por todo lo vivido, por lo aprendido y, sobre todo, por las personas que encontré en el camino.',
        'Las rutinas pueden cambiar. Los lugares también. Pero hay vínculos que no dependen de compartir todos los días el mismo espacio.',
      ],
    },

    remains: {
      title: 'Lo que nos queda',
      letterHeading: 'Una carta',
      letter: [
        'Después de tantos años compartiendo días, historias, risas y momentos de todo tipo, hoy me toca cerrar esta etapa.',
        'Y aunque despedirse nunca es del todo sencillo, me voy con la tranquilidad de saber que lo verdaderamente importante no queda atrás.',
        'Porque más allá del trabajo, de las obligaciones y de la rutina, lo que queda son las personas.',
        'Me llevo los recuerdos, las enseñanzas, las conversaciones y, sobre todo, las amistades que nacieron en el camino.',
        'Gracias por acompañarme durante todos estos años.',
        'Gracias por haber sido parte de esta etapa de mi vida.',
        'Y gracias por hacer que valiera tanto la pena.',
        'No quiero que esto sea un adiós.',
        'Prefiero pensar que simplemente dejamos de compartir un lugar, pero no todo lo que construimos.',
        'Nos seguiremos encontrando.',
      ],
      closingPhrase: 'Lo que vivimos queda. Lo que construimos permanece.',
      // Microcopy (editable).
      circleHint: 'Tocá el círculo',
      circleMessage: 'Gracias por tanto.',
    },
  },

  /*
   * Recuerdos reales (opcional). Ejemplo de formato — NO es contenido real:
   *
   * memories: [
   *   {
   *     title: 'Título corto',
   *     when: 'Cuándo fue, como quieras escribirlo',
   *     text: 'Lo que pasó, en dos o tres líneas.',
   *     photo: '/recuerdos/nombre-de-la-foto.jpg',
   *     photoAlt: 'Qué se ve en la foto',
   *   },
   * ],
   */
  memories: [],

  share: {
    button: 'Compartir este recuerdo',
    text: 'Lo que nos queda. Hay lugares de los que uno se va, pero personas que se lleva para siempre.',
    whatsappFallback: 'Enviar por WhatsApp',
    copyLink: 'Copiar enlace',
    copied: 'Enlace copiado',
  },

  sound: {
    mode: 'generative',
    src: null,
    credit: null,
  },
}
