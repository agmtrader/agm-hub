export type OptionsLessonChoice = {
  id: string
  label: string
}

export type OptionsLessonVisualStrategy =
  | 'long_call'
  | 'protective_put'
  | 'long_option_risk'
  | 'covered_call'
  | 'naked_call'
  | 'greeks_curve'
  | 'long_straddle'

export type OptionsLessonVisualConfig = {
  strategy: OptionsLessonVisualStrategy
  instruction: string
  dragLabel: string
  currentPriceLabel: string
  strikeLabel: string
  stockEntryLabel?: string
  maxProfitLabel?: string
  maxLossLabel?: string
  breakEvenLabel?: string
}

export type OptionsLessonBuilderConfig = {
  instruction: string
  contractPrompt: string
  longCallLabel: string
  shortCallLabel: string
  selectedContractsLabel: string
  premiumDebitLabel: string
  premiumCreditLabel: string
  checkPlacement: string
  resetStrategy: string
  targetLongStrike: number
  targetShortStrike: number
  longPremium: number
  shortPremium: number
  maxProfitLabel: string
  maxLossLabel: string
  breakEvenLabel: string
  successLabel: string
  retryLabel: string
  retryHint: string
  longStrikeLabel: string
  shortStrikeLabel: string
  underlyingPriceLabel: string
  profitLossLabel: string
}

export type OptionsModuleStep = {
  id: string
  kind: 'quiz' | 'builder'
  title: string
  prompt: string
  context: string
  insight: string
  correctChoiceId?: string
  choices?: OptionsLessonChoice[]
  visual?: OptionsLessonVisualConfig
  builder?: OptionsLessonBuilderConfig
}

export type OptionsLessonModule = {
  id: string
  level: string
  title: string
  description: string
  previewStrategy: OptionsLessonVisualStrategy
  steps: OptionsModuleStep[]
}

export type OptionsLessonContent = {
  badge: string
  title: string
  description: string
  browseTitle: string
  browseDescription: string
  backToModules: string
  startModule: string
  lessonProgressLabel: string
  moduleProgressLabel: string
  questionLabel: string
  questionPlural: string
  correctLabel: string
  wrongLabel: string
  checkAnswer: string
  nextQuestion: string
  restartModule: string
  moduleComplete: string
  moduleCompletedTitle: string
  moduleCompletedDescription: string
  reviewVideos: string
  keepLearning: string
  modules: OptionsLessonModule[]
}

export const optionsLessonContent: Record<string, OptionsLessonContent> = {
  en: {
    badge: 'Interactive Options Lesson',
    title: 'Learn options step by step',
    description:
      'Choose a learning module, explore the payoff graph, and answer guided questions as you build from beginner concepts to more advanced strategies.',
    browseTitle: 'Choose a module',
    browseDescription:
      'Start with beginner foundations, move into intermediate strategies, and finish with advanced volatility concepts at your own pace.',
    backToModules: 'Back to modules',
    startModule: 'Open module',
    lessonProgressLabel: 'Overall learning path',
    moduleProgressLabel: 'Module progress',
    questionLabel: 'Question',
    questionPlural: 'questions',
    correctLabel: 'Correct',
    wrongLabel: 'Try again',
    checkAnswer: 'Check answer',
    nextQuestion: 'Next question',
    restartModule: 'Restart module',
    moduleComplete: 'Module complete',
    moduleCompletedTitle: 'You completed this module',
    moduleCompletedDescription:
      'Nice work. You can review the module again or return to the catalog to continue with the next stage of the learning path.',
    reviewVideos: 'Explore video chapters',
    keepLearning: 'Continue learning',
    modules: [
      {
        id: 'intro',
        level: 'Beginner',
        title: 'Introduction to Options',
        description:
          'Understand calls, puts, and defined risk by watching payoff shapes respond to price changes on the chart.',
        previewStrategy: 'long_call',
        steps: [
          {
            id: 'directional-call',
            kind: 'quiz',
            title: 'Which option fits a bullish view?',
            prompt:
              'A trader expects shares to rise over the next month and wants upside exposure without buying 100 shares outright.',
            context: 'Which choice best matches that goal?',
            insight:
              'A long call gives upside exposure with defined risk equal to the premium paid.',
            correctChoiceId: 'buy-call',
            visual: {
              strategy: 'long_call',
              instruction:
                'Drag the price marker and notice how a long call stays negative until price starts breaking through the strike and premium.',
              dragLabel: 'Drag price',
              currentPriceLabel: 'Stock price',
              strikeLabel: 'Strike',
              maxLossLabel: 'Max loss',
              breakEvenLabel: 'Break even'
            },
            choices: [
              { id: 'buy-call', label: 'Buy a call option' },
              { id: 'buy-put', label: 'Buy a put option' },
              { id: 'sell-call', label: 'Sell a naked call option' }
            ]
          },
          {
            id: 'protective-put',
            kind: 'quiz',
            title: 'How does a put protect a stock position?',
            prompt:
              'An investor owns shares and wants downside protection during a risky event, while still keeping upside if the stock climbs.',
            context: 'What is the most appropriate move?',
            insight:
              'A protective put places a floor under the stock position, limiting downside while keeping upside open.',
            correctChoiceId: 'buy-put',
            visual: {
              strategy: 'protective_put',
              instruction:
                'Move the stock price and see how the put creates a floor under the portfolio once price falls below the strike.',
              dragLabel: 'Drag price',
              currentPriceLabel: 'Stock price',
              strikeLabel: 'Put strike',
              stockEntryLabel: 'Stock entry',
              maxLossLabel: 'Protected floor'
            },
            choices: [
              { id: 'buy-put', label: 'Buy a put against the shares' },
              { id: 'sell-put', label: 'Sell a cash-secured put' },
              { id: 'sell-shares', label: 'Sell all the shares immediately' }
            ]
          },
          {
            id: 'defined-risk',
            kind: 'quiz',
            title: 'What is the max loss for a long option buyer?',
            prompt:
              'A beginner buys one call option and pays a premium up front. The contract expires worthless.',
            context: 'What is the buyer’s maximum loss?',
            insight:
              'For a long call or long put, the most the buyer can lose is the premium paid.',
            correctChoiceId: 'premium',
            visual: {
              strategy: 'long_option_risk',
              instruction:
                'Slide the stock price and notice that the payoff cannot fall below the premium paid. That is the defined-risk feature of buying options.',
              dragLabel: 'Drag price',
              currentPriceLabel: 'Stock price',
              strikeLabel: 'Strike',
              maxLossLabel: 'Premium paid',
              breakEvenLabel: 'Break even'
            },
            choices: [
              { id: 'premium', label: 'The premium paid for the option' },
              { id: 'unlimited', label: 'Unlimited loss because options are leveraged' },
              { id: 'stock-price', label: 'The full stock price of 100 shares' }
            ]
          }
        ]
      },
      {
        id: 'income-risk',
        level: 'Intermediate',
        title: 'Income and Risk Tradeoffs',
        description:
          'Explore how covered calls generate income and why uncovered option selling can create very different risk profiles.',
        previewStrategy: 'covered_call',
        steps: [
          {
            id: 'covered-call',
            kind: 'quiz',
            title: 'Why do investors use covered calls?',
            prompt:
              'A shareholder expects a stock to stay mostly flat for a while and wants to generate extra income from the position.',
            context: 'Which strategy lines up with that idea?',
            insight:
              'A covered call adds premium income, but it caps upside above the short-call strike.',
            correctChoiceId: 'covered-call',
            visual: {
              strategy: 'covered_call',
              instruction:
                'Drag the stock price higher and lower to see the trade-off: income up front, but capped upside after the short-call strike.',
              dragLabel: 'Drag price',
              currentPriceLabel: 'Stock price',
              strikeLabel: 'Short call strike',
              stockEntryLabel: 'Stock entry',
              maxProfitLabel: 'Upside cap'
            },
            choices: [
              { id: 'covered-call', label: 'Sell a call while owning the shares' },
              { id: 'long-call', label: 'Buy another call for more upside' },
              { id: 'protective-put', label: 'Buy a put to increase cost' }
            ]
          },
          {
            id: 'seller-risk',
            kind: 'quiz',
            title: 'Why is a naked call considered dangerous?',
            prompt:
              'A trader compares several positions and wants to avoid strategies with open-ended downside exposure.',
            context: 'Which position carries the largest risk?',
            insight:
              'Selling a naked call can create very large losses because the stock can keep rising while the seller remains obligated at the strike price.',
            correctChoiceId: 'naked-call',
            visual: {
              strategy: 'naked_call',
              instruction:
                'Push the stock price higher and notice how the loss keeps growing beyond the strike. That is open-ended risk.',
              dragLabel: 'Drag price',
              currentPriceLabel: 'Stock price',
              strikeLabel: 'Short call strike',
              maxLossLabel: 'Open-ended risk',
              breakEvenLabel: 'Break even'
            },
            choices: [
              { id: 'naked-call', label: 'Selling a naked call' },
              { id: 'long-put', label: 'Buying a put' },
              { id: 'long-call', label: 'Buying a call' }
            ]
          }
        ]
      },
      {
        id: 'spreads',
        level: 'Intermediate',
        title: 'Vertical Spreads',
        description:
          'Build a bull call spread directly on the graph to understand defined risk, capped reward, and breakeven.',
        previewStrategy: 'covered_call',
        steps: [
          {
            id: 'bull-call-builder',
            kind: 'builder',
            title: 'Create a bull call spread on the graph',
            prompt:
              'Create a bull call spread. Buy a call at $90 for $10 and sell a call at $110 for $5. Select the contracts and place the handles at the correct strike prices.',
            context:
              'This practical step turns the payoff diagram into something learners can manipulate directly.',
            insight:
              'A bull call spread combines a long lower-strike call with a short higher-strike call. The net debit defines max loss, while strike width minus the debit defines max profit.',
            builder: {
              instruction: 'Select contracts to build your strategy, then drag each handle until the strikes match the scenario.',
              contractPrompt: 'Select contracts to build your strategy.',
              longCallLabel: 'Long call',
              shortCallLabel: 'Short call',
              selectedContractsLabel: 'Selected contracts',
              premiumDebitLabel: 'premium debit',
              premiumCreditLabel: 'premium credit',
              checkPlacement: 'Check setup',
              resetStrategy: 'Reset setup',
              targetLongStrike: 90,
              targetShortStrike: 110,
              longPremium: 10,
              shortPremium: 5,
              maxProfitLabel: 'Max profit',
              maxLossLabel: 'Max loss',
              breakEvenLabel: 'Break even',
              successLabel: 'Correct',
              retryLabel: 'Adjust the handles',
              retryHint: 'Use both contracts, keep the long call below the short call, and place the strikes near',
              longStrikeLabel: 'Long call strike',
              shortStrikeLabel: 'Short call strike',
              underlyingPriceLabel: 'Underlying price',
              profitLossLabel: 'Profit / Loss'
            }
          }
        ]
      },
      {
        id: 'advanced',
        level: 'Advanced',
        title: 'Greeks and Volatility',
        description:
          'See how option sensitivity clusters near the center and how volatility strategies profit from bigger moves away from the middle.',
        previewStrategy: 'long_straddle',
        steps: [
          {
            id: 'greeks-intuition',
            kind: 'quiz',
            title: 'Where is an option often most sensitive?',
            prompt:
              'A trader is studying option Greeks and wants intuition about where price sensitivity often concentrates.',
            context: 'Where is the option usually most reactive on the curve?',
            insight:
              'Sensitivity often clusters near the center of the distribution, then fades as outcomes move into the tails.',
            correctChoiceId: 'center',
            visual: {
              strategy: 'greeks_curve',
              instruction:
                'Drag the marker across the curve and notice how the highest sensitivity lives near the center, not at the far edges.',
              dragLabel: 'Drag point',
              currentPriceLabel: 'Sensitivity point',
              strikeLabel: 'Center',
              maxProfitLabel: 'Higher sensitivity'
            },
            choices: [
              { id: 'center', label: 'Near the center of the curve' },
              { id: 'left-tail', label: 'At the far left tail' },
              { id: 'right-tail', label: 'At the far right tail' }
            ]
          },
          {
            id: 'straddle-intuition',
            kind: 'quiz',
            title: 'When does a long straddle benefit most?',
            prompt:
              'A trader expects a large move but is unsure whether the stock will break sharply higher or lower.',
            context: 'What kind of outcome helps a long straddle most?',
            insight:
              'A long straddle typically benefits when the stock moves far enough away from the center in either direction.',
            correctChoiceId: 'large-move',
            visual: {
              strategy: 'long_straddle',
              instruction:
                'Drag the price away from the center and watch how the payoff improves as the move becomes larger in either direction.',
              dragLabel: 'Drag price',
              currentPriceLabel: 'Stock price',
              strikeLabel: 'Center strike',
              breakEvenLabel: 'Break even',
              maxProfitLabel: 'Bigger move'
            },
            choices: [
              { id: 'large-move', label: 'A large move in either direction' },
              { id: 'flat-market', label: 'A flat market near the strike' },
              { id: 'small-move', label: 'A very small move with low volatility' }
            ]
          }
        ]
      }
    ]
  },
  es: {
    badge: 'Leccion Interactiva de Opciones',
    title: 'Aprende opciones paso a paso',
    description:
      'Elige un modulo, explora la grafica de payoff y responde preguntas guiadas mientras avanzas desde conceptos basicos hasta estrategias mas avanzadas.',
    browseTitle: 'Elige un modulo',
    browseDescription:
      'Empieza con fundamentos para principiantes, avanza a estrategias intermedias y termina con conceptos avanzados de volatilidad a tu propio ritmo.',
    backToModules: 'Volver a modulos',
    startModule: 'Abrir modulo',
    lessonProgressLabel: 'Ruta completa de aprendizaje',
    moduleProgressLabel: 'Progreso del modulo',
    questionLabel: 'Pregunta',
    questionPlural: 'preguntas',
    correctLabel: 'Correcto',
    wrongLabel: 'Intentalo de nuevo',
    checkAnswer: 'Revisar respuesta',
    nextQuestion: 'Siguiente pregunta',
    restartModule: 'Reiniciar modulo',
    moduleComplete: 'Modulo completado',
    moduleCompletedTitle: 'Completaste este modulo',
    moduleCompletedDescription:
      'Buen trabajo. Puedes repasar el modulo o volver al catalogo para continuar con la siguiente etapa del aprendizaje.',
    reviewVideos: 'Explorar capitulos en video',
    keepLearning: 'Seguir aprendiendo',
    modules: [
      {
        id: 'intro',
        level: 'Principiante',
        title: 'Introduccion a Opciones',
        description:
          'Comprende calls, puts y riesgo definido viendo como cambian los payoffs en la grafica.',
        previewStrategy: 'long_call',
        steps: [
          {
            id: 'directional-call',
            kind: 'quiz',
            title: 'Que opcion encaja con una vision alcista?',
            prompt:
              'Un trader espera que las acciones suban durante el proximo mes y quiere exposicion al alza sin comprar 100 acciones directamente.',
            context: 'Que eleccion coincide mejor con ese objetivo?',
            insight:
              'Una call larga da exposicion alcista con riesgo definido igual a la prima pagada.',
            correctChoiceId: 'buy-call',
            visual: {
              strategy: 'long_call',
              instruction:
                'Arrastra el marcador de precio y observa como una call larga permanece negativa hasta que el precio supera el strike y la prima.',
              dragLabel: 'Mover precio',
              currentPriceLabel: 'Precio de la accion',
              strikeLabel: 'Strike',
              maxLossLabel: 'Perdida maxima',
              breakEvenLabel: 'Punto de equilibrio'
            },
            choices: [
              { id: 'buy-call', label: 'Comprar una opcion call' },
              { id: 'buy-put', label: 'Comprar una opcion put' },
              { id: 'sell-call', label: 'Vender una call descubierta' }
            ]
          },
          {
            id: 'protective-put',
            kind: 'quiz',
            title: 'Como protege un put una posicion en acciones?',
            prompt:
              'Un inversionista tiene acciones y quiere proteccion bajista durante un evento de riesgo, sin perder el potencial alcista.',
            context: 'Cual es el movimiento mas apropiado?',
            insight:
              'Un protective put coloca un piso bajo la posicion en acciones y limita la caida.',
            correctChoiceId: 'buy-put',
            visual: {
              strategy: 'protective_put',
              instruction:
                'Mueve el precio de la accion y mira como el put crea un piso bajo el portafolio cuando el precio cae por debajo del strike.',
              dragLabel: 'Mover precio',
              currentPriceLabel: 'Precio de la accion',
              strikeLabel: 'Strike del put',
              stockEntryLabel: 'Entrada en acciones',
              maxLossLabel: 'Piso protegido'
            },
            choices: [
              { id: 'buy-put', label: 'Comprar un put sobre las acciones' },
              { id: 'sell-put', label: 'Vender un cash-secured put' },
              { id: 'sell-shares', label: 'Vender todas las acciones de inmediato' }
            ]
          },
          {
            id: 'defined-risk',
            kind: 'quiz',
            title: 'Cual es la perdida maxima para quien compra una opcion?',
            prompt:
              'Un principiante compra una call y paga una prima por adelantado. El contrato vence sin valor.',
            context: 'Cual es la perdida maxima del comprador?',
            insight:
              'Para una call larga o un put largo, lo maximo que puede perder el comprador es la prima pagada.',
            correctChoiceId: 'premium',
            visual: {
              strategy: 'long_option_risk',
              instruction:
                'Desliza el precio y observa que el payoff no puede caer por debajo de la prima pagada. Ese es el beneficio del riesgo definido.',
              dragLabel: 'Mover precio',
              currentPriceLabel: 'Precio de la accion',
              strikeLabel: 'Strike',
              maxLossLabel: 'Prima pagada',
              breakEvenLabel: 'Punto de equilibrio'
            },
            choices: [
              { id: 'premium', label: 'La prima pagada por la opcion' },
              { id: 'unlimited', label: 'Perdida ilimitada porque hay apalancamiento' },
              { id: 'stock-price', label: 'El precio total de 100 acciones' }
            ]
          }
        ]
      },
      {
        id: 'income-risk',
        level: 'Intermedio',
        title: 'Ingresos y Riesgo',
        description:
          'Explora como las covered calls generan ingresos y por que vender opciones descubiertas cambia por completo el perfil de riesgo.',
        previewStrategy: 'covered_call',
        steps: [
          {
            id: 'covered-call',
            kind: 'quiz',
            title: 'Por que se usan covered calls?',
            prompt:
              'Un accionista cree que el precio se mantendra bastante estable y quiere generar ingresos adicionales.',
            context: 'Que estrategia va mejor con esa idea?',
            insight:
              'Una covered call agrega ingreso por prima, pero limita la subida por encima del strike vendido.',
            correctChoiceId: 'covered-call',
            visual: {
              strategy: 'covered_call',
              instruction:
                'Arrastra el precio al alza y a la baja para ver el intercambio: ingreso inicial, pero un techo de ganancia despues del strike.',
              dragLabel: 'Mover precio',
              currentPriceLabel: 'Precio de la accion',
              strikeLabel: 'Strike de la call corta',
              stockEntryLabel: 'Entrada en acciones',
              maxProfitLabel: 'Tope de ganancia'
            },
            choices: [
              { id: 'covered-call', label: 'Vender una call mientras posees las acciones' },
              { id: 'long-call', label: 'Comprar otra call para mas alza' },
              { id: 'protective-put', label: 'Comprar un put para aumentar costo' }
            ]
          },
          {
            id: 'seller-risk',
            kind: 'quiz',
            title: 'Por que una naked call se considera peligrosa?',
            prompt:
              'Un trader compara varias posiciones y quiere evitar estrategias con riesgo abierto.',
            context: 'Que posicion tiene el riesgo mas grande?',
            insight:
              'Vender una call descubierta puede generar perdidas muy grandes porque la accion puede seguir subiendo.',
            correctChoiceId: 'naked-call',
            visual: {
              strategy: 'naked_call',
              instruction:
                'Lleva el precio de la accion hacia arriba y observa como la perdida crece despues del strike. Eso es riesgo abierto.',
              dragLabel: 'Mover precio',
              currentPriceLabel: 'Precio de la accion',
              strikeLabel: 'Strike de la call corta',
              maxLossLabel: 'Riesgo abierto',
              breakEvenLabel: 'Punto de equilibrio'
            },
            choices: [
              { id: 'naked-call', label: 'Vender una call descubierta' },
              { id: 'long-put', label: 'Comprar un put' },
              { id: 'long-call', label: 'Comprar una call' }
            ]
          }
        ]
      },
      {
        id: 'spreads',
        level: 'Intermedio',
        title: 'Vertical Spreads',
        description:
          'Construye un bull call spread directamente en la grafica para entender riesgo definido, ganancia limitada y punto de equilibrio.',
        previewStrategy: 'covered_call',
        steps: [
          {
            id: 'bull-call-builder',
            kind: 'builder',
            title: 'Crea un bull call spread en la grafica',
            prompt:
              'Crea un bull call spread. Compra una call en $90 por $10 y vende una call en $110 por $5. Selecciona los contratos y coloca los handles en los strikes correctos.',
            context:
              'Este paso practico convierte el payoff en algo que la persona puede manipular directamente.',
            insight:
              'Un bull call spread combina una call larga de strike menor con una call corta de strike mayor. El debito neto define la perdida maxima y el ancho entre strikes menos ese debito define la ganancia maxima.',
            builder: {
              instruction: 'Selecciona los contratos para construir la estrategia y luego arrastra cada handle hasta que coincida con el escenario.',
              contractPrompt: 'Selecciona contratos para construir tu estrategia.',
              longCallLabel: 'Call larga',
              shortCallLabel: 'Call corta',
              selectedContractsLabel: 'Contratos seleccionados',
              premiumDebitLabel: 'prima debitada',
              premiumCreditLabel: 'prima acreditada',
              checkPlacement: 'Revisar estrategia',
              resetStrategy: 'Reiniciar estrategia',
              targetLongStrike: 90,
              targetShortStrike: 110,
              longPremium: 10,
              shortPremium: 5,
              maxProfitLabel: 'Ganancia maxima',
              maxLossLabel: 'Perdida maxima',
              breakEvenLabel: 'Punto de equilibrio',
              successLabel: 'Correcto',
              retryLabel: 'Ajusta los handles',
              retryHint: 'Usa ambos contratos, mantén la call larga por debajo de la call corta y coloca los strikes cerca de',
              longStrikeLabel: 'Strike de la call larga',
              shortStrikeLabel: 'Strike de la call corta',
              underlyingPriceLabel: 'Precio del subyacente',
              profitLossLabel: 'Ganancia / Perdida'
            }
          }
        ]
      },
      {
        id: 'advanced',
        level: 'Avanzado',
        title: 'Greeks y Volatilidad',
        description:
          'Observa como se concentra la sensibilidad cerca del centro y como las estrategias de volatilidad se benefician de movimientos grandes.',
        previewStrategy: 'long_straddle',
        steps: [
          {
            id: 'greeks-intuition',
            kind: 'quiz',
            title: 'Donde suele concentrarse la sensibilidad de una opcion?',
            prompt:
              'Un trader estudia los Greeks y quiere intuicion sobre donde suele concentrarse la sensibilidad del precio.',
            context: 'Donde suele reaccionar mas la opcion en la curva?',
            insight:
              'La sensibilidad suele concentrarse cerca del centro de la distribucion y disminuir hacia las colas.',
            correctChoiceId: 'center',
            visual: {
              strategy: 'greeks_curve',
              instruction:
                'Arrastra el marcador sobre la curva y observa como la sensibilidad mas alta se encuentra cerca del centro, no en los extremos.',
              dragLabel: 'Mover punto',
              currentPriceLabel: 'Punto de sensibilidad',
              strikeLabel: 'Centro',
              maxProfitLabel: 'Mayor sensibilidad'
            },
            choices: [
              { id: 'center', label: 'Cerca del centro de la curva' },
              { id: 'left-tail', label: 'En la cola izquierda' },
              { id: 'right-tail', label: 'En la cola derecha' }
            ]
          },
          {
            id: 'straddle-intuition',
            kind: 'quiz',
            title: 'Cuando se beneficia mas un long straddle?',
            prompt:
              'Un trader espera un movimiento grande, pero no sabe si el precio subira o bajara con fuerza.',
            context: 'Que tipo de resultado ayuda mas a un long straddle?',
            insight:
              'Un long straddle suele beneficiarse cuando la accion se mueve lo suficiente lejos del centro en cualquier direccion.',
            correctChoiceId: 'large-move',
            visual: {
              strategy: 'long_straddle',
              instruction:
                'Arrastra el precio lejos del centro y observa como mejora el payoff cuando el movimiento se vuelve mas grande en cualquier direccion.',
              dragLabel: 'Mover precio',
              currentPriceLabel: 'Precio de la accion',
              strikeLabel: 'Strike central',
              breakEvenLabel: 'Punto de equilibrio',
              maxProfitLabel: 'Movimiento grande'
            },
            choices: [
              { id: 'large-move', label: 'Un movimiento grande en cualquier direccion' },
              { id: 'flat-market', label: 'Un mercado plano cerca del strike' },
              { id: 'small-move', label: 'Un movimiento muy pequeno con baja volatilidad' }
            ]
          }
        ]
      }
    ]
  }
}
