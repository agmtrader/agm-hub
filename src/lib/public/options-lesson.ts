export type OptionsLessonChoice = { id: string; label: string }

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
  scenario?: string
  instruction: string
  description?: string
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
  image: string
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

type StepInput = Omit<OptionsModuleStep, 'kind' | 'choices' | 'correctChoiceId' | 'visual'> & {
  options: string[]
  answer: number
  strategy: OptionsLessonVisualStrategy
  visual: string
}

const makeStep = ({ options, answer, strategy, visual, ...step }: StepInput): OptionsModuleStep => ({
  ...step,
  kind: 'quiz',
  choices: options.map((label, index) => ({ id: `choice-${index}`, label })),
  correctChoiceId: `choice-${answer}`,
  visual: {
    strategy,
    scenario: step.id,
    instruction: visual,
    description: visual,
    dragLabel: 'Drag price',
    currentPriceLabel: 'Stock price',
    strikeLabel: 'Strike price',
    maxLossLabel: strategy === 'naked_call' ? 'Unlimited risk' : undefined,
    breakEvenLabel: strategy === 'long_call' ? 'Break even' : undefined,
  },
})

const modules: OptionsLessonModule[] = [
  {
    id: 'core-intuition', level: 'Beginner', title: 'The Optionality Mindset',
    description: 'Building the Intuition of Contracts, Rights, and Obligations',
    image: '/assets/resource-center/interactive-learning/modules/optionality-mindset.png',
    previewStrategy: 'long_call',
    steps: [
      makeStep({
        id: 'house-option', title: 'The House Option (The Premium)',
        prompt: 'You pay a non-refundable $5,000 today for the right to buy a house for $500,000 anytime in the next 3 months. If the house value shoots up to $600,000 and you use your right, what is your net profit?',
        context: 'Subtract the upfront premium from the value gained by exercising the contract.',
        insight: 'You gain $100,000 from buying below market value, then subtract the $5,000 premium. Net profit: $95,000.',
        options: ['$100,000', '$95,000', '$5,000', '-$5,000'], answer: 1, strategy: 'long_call',
        visual: 'Timeline: pay a $5,000 premium today for a $500,000 strike, then compare a $600,000 house branch with a $400,000 branch three months later.',
      }),
      makeStep({
        id: 'capping-downside', title: 'Capping the Downside',
        prompt: 'If you buy 100 shares at $100, you lose money every cent they drop. If you instead buy a Call Option for $500 that lets you buy at $100, what happens to your option value if the stock crashes to $20?',
        context: 'Compare the stock’s open-ended decline with the option buyer’s defined premium risk.',
        insight: 'The call can expire worthless, but the buyer’s maximum loss is strictly limited to the $500 premium paid.',
        options: ['You lose $8,000.', 'You lose $5,000.', 'Your loss stops exactly at $500.', 'You make money.'], answer: 2, strategy: 'long_option_risk',
        visual: 'A jagged stock line crashes from $100 to $20 beside a flat option-loss floor at -$500.',
      }),
      makeStep({
        id: 'intrinsic-value', title: 'The Value Boundary (In-the-Money)',
        prompt: 'You have the right to buy at $50 and the stock is trading at $55. What intrinsic value is built into the contract right now?',
        context: 'Intrinsic value is the immediate economic advantage of exercising.',
        insight: 'You can buy at $50 and immediately sell at $55, so the call is in-the-money by $5.',
        options: ['$0', '$5', '$50', '$55'], answer: 1, strategy: 'long_call',
        visual: 'A vertical price axis marks the $50 strike, with a green in-the-money zone above it and the current price flashing at $55.',
      }),
      makeStep({
        id: 'insurance-floor', title: 'The Insurance Floor (Puts)',
        prompt: 'You buy a Put option with a $90 strike to protect your stock. If the stock gaps down to $70, what price does the contract guarantee you can sell your shares for?',
        context: 'A put gives its owner the right to sell at the strike price.',
        insight: 'The put acts as an insurance floor, preserving the right to sell at $90 regardless of the lower market price.',
        options: ['$70', '$80', '$90', '$0'], answer: 2, strategy: 'protective_put',
        visual: 'A stock price plunges below a dotted horizontal floor labeled Put Strike: $90.',
      }),
      makeStep({
        id: 'time-decay', title: 'The Decaying Asset',
        prompt: 'If the underlying stock does not move at all over two weeks, what happens to the value of a bought option contract?',
        context: 'Time remaining is one component of an option premium.',
        insight: 'The contract loses time value as expiration approaches. This decay is measured by Theta.',
        options: ['It increases because it survived.', 'It stays exactly the same.', 'It decays and loses value over time.'], answer: 2, strategy: 'greeks_curve',
        visual: 'A 30-day calendar shows a $4.00 option on Day 1 and a lower value on Day 15 while the stock price stays unchanged.',
      }),
      makeStep({
        id: 'seller-obligation', title: 'Flipping the Table (The Seller)',
        prompt: 'As the option seller, you collect premium cash upfront. What do you give up in exchange for that guaranteed money?',
        context: 'Contrast the buyer’s contractual right with the seller’s role.',
        insight: 'Buyers hold rights; sellers accept the obligation to fulfill the contract when exercised or assigned.',
        options: ["Nothing, it’s free money.", 'You give up control; you must fulfill the contract if the buyer demands it.', 'You give up your brokerage account.'], answer: 1, strategy: 'covered_call',
        visual: 'The buyer pays premium for a right; the seller receives that cash while taking on a heavy obligation.',
      }),
    ],
  },
  {
    id: 'payoff-leverage', level: 'Beginner', title: 'Mapping the Payoff Curve',
    description: 'Visualizing Risk Profiles, Breakevens, and Leverage',
    image: '/assets/resource-center/interactive-learning/modules/mapping-payoff-curve.png',
    previewStrategy: 'long_call',
    steps: [
      makeStep({ id: 'break-even', title: 'The Break-Even Target', prompt: 'You buy a $100 Strike Call for a $5 premium. What stock price at expiration changes your net result from a loss to a profit?', context: 'For a long call, add the premium to the strike.', insight: 'Break-even is $100 + $5 = $105.', options: ['$95', '$100', '$105', '$110'], answer: 2, strategy: 'long_call', visual: 'A payoff axis plants a flag at the $100 strike and shows the $5 entry cost; drag toward the red-to-green crossover at $105.' }),
      makeStep({ id: 'hockey-stick', title: 'Reading the Hockey Stick', prompt: 'On a long-call payoff graph, what does the turning point where the flat line begins angling upward represent?', context: 'Identify the contract term that changes the slope of intrinsic value.', insight: 'The inflection point is the strike price. Break-even lies farther right after accounting for premium.', options: ['The Break-Even Point', 'The Strike Price', 'Maximum Profit', 'The Current Market Price'], answer: 1, strategy: 'long_call', visual: 'A classic L-shaped long-call payoff line highlights its turning point.' }),
      makeStep({ id: 'leverage-engine', title: 'Measuring the Leverage Engine', prompt: 'A stock rises from $100 to $110 while a $100 Call rises from $2 to $10. What are their respective percentage returns?', context: 'Return equals gain divided by the original investment.', insight: 'The stock gains 10%. The option gains $8 on a $2 investment, producing a 400% return.', options: ['Stock: +10% | Option: +10%', 'Stock: +10% | Option: +100%', 'Stock: +10% | Option: +400%', 'Stock: +10% | Option: +500%'], answer: 2, strategy: 'long_call', visual: 'Side-by-side panels compare the stock’s $100-to-$110 move with the option’s $2-to-$10 move.' }),
      makeStep({ id: 'contract-exposure', title: 'Multi-Contract Capital Exposure', prompt: 'An order is for 3 Call contracts at $1.50. With 100 shares per contract, what total cash is debited?', context: 'Multiply contracts × 100 shares × quoted premium.', insight: '3 × 100 × $1.50 = $450 total capital risked.', options: ['$4.50', '$45.00', '$450.00', '$1,500.00'], answer: 2, strategy: 'long_option_risk', visual: 'An order ticket shows Quantity 3, Type Call, Price $1.50, and the reminder that one contract represents 100 shares.' }),
      makeStep({ id: 'short-call-trap', title: 'The Short Call Trap', prompt: 'A graph shows a naked short call: flat profit below the strike and losses that keep growing as the stock rises. What is its maximum theoretical risk?', context: 'A stock has no theoretical upper price limit.', insight: 'A naked call seller faces unlimited theoretical loss because the stock can continue rising.', options: ['Limited to the premium collected.', 'Capped at $5,000.', 'Unlimited risk.'], answer: 2, strategy: 'naked_call', visual: 'The payoff stays flat and green below $50, then plunges into an open-ended red loss as price rises.' }),
    ],
  },
  {
    id: 'volatility-greeks', level: 'Intermediate', title: 'The Hidden Dimensions',
    description: 'Mastering Volatility Waves and Time Decay (The Greeks)',
    image: '/assets/resource-center/interactive-learning/modules/hidden-dimensions.png',
    previewStrategy: 'greeks_curve',
    steps: [
      makeStep({ id: 'volatility-expansion', title: 'The Volatility Expansion', prompt: 'Earnings are tomorrow. The stock is unchanged, yet both Call and Put prices are rising. What force is driving this?', context: 'The market is repricing uncertainty about the size of the coming move.', insight: 'Rising implied volatility expands premiums because traders anticipate a potentially large move in either direction.', options: ['Time decay speeding up', 'An increase in Implied Volatility (rising uncertainty)', 'Stock price manipulation'], answer: 1, strategy: 'greeks_curve', visual: 'An IV gauge jumps from 20% to 60%, expanding option-pricing curves while the stock-price dot stays still.' }),
      makeStep({ id: 'iv-crush', title: 'The Post-Earnings Crush', prompt: 'Earnings are out and the stock barely moved. An option bought yesterday suddenly loses substantial value. What occurred?', context: 'The unknown event has passed and expected uncertainty collapses.', insight: 'IV Crush rapidly removes volatility premium once the anticipated event is resolved.', options: ['Delta Shift', 'IV Crush (Volatility Collapse)', 'Assignment'], answer: 1, strategy: 'greeks_curve', visual: 'The morning after earnings, the IV gauge collapses from 60% to 20% and the option price drops immediately.' }),
      makeStep({ id: 'delta-action', title: 'Delta Action', prompt: 'An option has a Delta of 0.60. If the stock rises exactly $1.00, approximately how much should the option price increase?', context: 'Delta estimates option-price change per $1 move in the underlying.', insight: 'A 0.60 Delta implies an expected option-price increase of about $0.60 for a $1 stock increase.', options: ['$1.00', '$0.60', '$0.00', '$60.00'], answer: 1, strategy: 'greeks_curve', visual: 'A stock ticker moves up $1.00 next to an option data box reading Delta: 0.60.' }),
      makeStep({ id: 'delta-probability', title: 'Delta as a Probability Map', prompt: 'Roughly speaking, how does the market interpret a Delta of 0.10 for an out-of-the-money option?', context: 'Traders often use Delta as a quick probability proxy, not a guarantee.', insight: 'A 0.10 Delta is often read as roughly a 10% theoretical probability of expiring in-the-money.', options: ['A 90% chance of expiring profitable.', 'A roughly 10% theoretical probability of expiring in-the-money.', 'The option is guaranteed to lose money.'], answer: 1, strategy: 'greeks_curve', visual: 'A bell curve places the out-of-the-money strike in the far-right tail with a Delta label of 0.10.' }),
      makeStep({ id: 'theta-cliff', title: 'The Theta Cliff', prompt: 'When does an option buyer generally suffer the fastest time-value losses due to Theta?', context: 'Time decay accelerates rather than remaining perfectly linear.', insight: 'Theta decay tends to accelerate sharply during the final 30 days before expiration.', options: ['Between 90 and 60 days out.', 'Time decay is perfectly linear every day.', 'During the final 30 days before expiration.'], answer: 2, strategy: 'greeks_curve', visual: 'Option value slopes gently from Day 90 to Day 30, then drops steeply toward expiration at Day 0.' }),
    ],
  },
  {
    id: 'multi-leg', level: 'Intermediate', title: 'Strategic Architectures',
    description: 'Engineering Multi-Leg Spreads, Corridors, and Combos',
    image: '/assets/resource-center/interactive-learning/modules/strategic-architectures.png',
    previewStrategy: 'long_straddle',
    steps: [
      makeStep({ id: 'vertical-ceiling', title: 'Constructing the Vertical Ceiling', prompt: 'You buy a $100 Call for $5 and sell a $110 Call for $2, creating a Bull Call Spread. What is the most you can lose?', context: 'Maximum loss on a debit spread is the net debit paid.', insight: '$5 paid minus $2 collected equals a $3 net debit, or $300 per spread.', options: ['Unlimited', '$500', '$300 (Net Debit)', '$200'], answer: 2, strategy: 'covered_call', visual: 'Overlapping $100 long-call and $110 short-call lines combine into a capped payoff with a $3 net debit floor.' }),
      makeStep({ id: 'spread-cap', title: 'Calculating the Cap', prompt: 'The $100/$110 Bull Call Spread cost a $3 net debit. If the stock reaches $160 at expiration, what is the net profit?', context: 'Subtract the debit from the $10 width between strikes.', insight: 'The spread is worth its $10 maximum width. Minus the $3 debit, net profit is $7, or $700 per spread.', options: ['$60', '$10', '$7 ($700 total)', '$0'], answer: 2, strategy: 'covered_call', visual: 'The Bull Call Spread slider is at $160 while its profit line remains flat at the capped maximum.' }),
      makeStep({ id: 'straddle', title: 'Engineering Chaos (The Straddle)', prompt: 'Which combination creates a V-shaped payoff that profits from a sufficiently large move in either direction?', context: 'Combine one bullish right with one bearish right at the same strike.', insight: 'Buying both a Call and a Put at the same strike creates a long straddle.', options: ['Buy a Call and Sell a Put at the same strike.', 'Buy a Call and Buy a Put at the same strike.', 'Sell a Call and Sell a Put at the same strike.'], answer: 1, strategy: 'long_straddle', visual: 'A V-shaped payoff has its trough at $50 and rises into profit on both the left and right wings.' }),
      makeStep({ id: 'iron-condor', title: 'The Zone of Safety (Iron Condor)', prompt: 'An Iron Condor is profitable between $90 and $110 with capped losses outside. Where must the stock settle for maximum profit?', context: 'This market-neutral structure benefits from consolidation.', insight: 'Maximum profit occurs when the stock expires between the two inner short strikes: $90 to $110.', options: ['It must skyrocket past $110.', 'It must crash below $90.', 'It must stay consolidated within the $90 to $110 range.'], answer: 2, strategy: 'covered_call', visual: 'A table-top payoff is flat and profitable from $90 to $110, then slopes into capped losses beyond both boundaries.' }),
    ],
  },
  {
    id: 'execution-risk', level: 'Advanced', title: "The Pro's Playbook",
    description: 'Execution Mechanics, Position Sizing, and Reality Check',
    image: '/assets/resource-center/interactive-learning/modules/pro-playbook.png',
    previewStrategy: 'covered_call',
    steps: [
      makeStep({ id: 'assignment', title: 'The Reality of Assignment', prompt: 'You sold a $40 Put and the stock closes at $38 on expiration Friday. What structural event will happen to your account?', context: 'An in-the-money short put carries an obligation at expiration.', insight: 'You are assigned and required to buy 100 shares at the $40 strike price.', options: ['Nothing; the option expires worthless.', 'You are assigned and forced to buy 100 shares at $40 per share.', 'You automatically receive $200 cash.'], answer: 1, strategy: 'protective_put', visual: 'An account dashboard shows a Short $40 Put while the stock closes Friday at $38.' }),
      makeStep({ id: 'bid-ask', title: 'The Bid-Ask Spread Tax', prompt: 'The Bid is $1.00 and the Ask is $3.00. If you use a Market Order to buy immediately, what price do you pay and what is the immediate unrealized loss?', context: 'A market buy fills at the current ask, while immediate liquidation would occur at the bid.', insight: 'You pay the $3 ask and could sell only at the $1 bid, creating an immediate $2 unrealized loss.', options: ['Pay $1.00 | Loss: $0', 'Pay $2.00 | Loss: $1.00', 'Pay $3.00 | Loss: $2.00'], answer: 2, strategy: 'long_option_risk', visual: 'An illiquid order book displays Bid $1.00 from 10 buyers and Ask $3.00 from 5 sellers.' }),
      makeStep({ id: 'limit-order', title: 'Order Type Selection', prompt: 'You want to ensure you never pay more than $1.50 to enter a trade. Which order type must you use?', context: 'Choose the order that controls the maximum acceptable execution price.', insight: 'A Limit Order executes only at your specified price or better, though execution is not guaranteed.', options: ['Market Order', 'Limit Order', 'Stop Order'], answer: 1, strategy: 'long_option_risk', visual: 'A trading ticket toggles order types beside a maximum-cost line fixed at $1.50.' }),
      makeStep({ id: 'covered-call-execution', title: 'Defensive Monetization (Covered Calls)', prompt: 'You own 100 shares at $100 and sell a $105 Call for a $2 premium. If the stock stays at $100 all month, what happens?', context: 'The stock remains below the short call strike through expiration.', insight: 'The Call expires worthless and you keep the $2 premium, lowering the effective stock cost basis.', options: ['You lose your shares.', 'The option expires worthless and you keep the $2 premium as profit, lowering your cost basis.', 'You owe the broker money.'], answer: 1, strategy: 'covered_call', visual: 'A 100-share position at $100 is overlaid with a short $105 Call and a green +$2 premium bubble.' }),
    ],
  },
]

type TranslatedStep = {
  title: string
  prompt: string
  context: string
  insight: string
  options: string[]
  visual: string
}

const spanishStepText: Record<string, TranslatedStep> = {
  'house-option': {
    title: 'La Opción de la Casa (La Prima)',
    prompt: 'Pagas hoy $5,000 no reembolsables por el derecho de comprar una casa por $500,000 durante los próximos 3 meses. Si la casa sube a $600,000 y ejerces tu derecho, ¿cuál es tu ganancia neta?',
    context: 'Resta la prima inicial del valor obtenido al ejercer el contrato.',
    insight: 'Ganas $100,000 al comprar por debajo del valor de mercado y luego restas la prima de $5,000. Ganancia neta: $95,000.',
    options: ['$100,000', '$95,000', '$5,000', '-$5,000'],
    visual: 'Línea de tiempo: paga hoy una prima de $5,000 por un strike de $500,000 y compara dentro de tres meses una casa de $600,000 con una de $400,000.',
  },
  'capping-downside': {
    title: 'Limitando la Pérdida',
    prompt: 'Si compras 100 acciones a $100, pierdes dinero con cada centavo que bajan. Si en cambio compras una Call por $500 que te permite comprar a $100, ¿qué ocurre con el valor de tu opción si la acción cae a $20?',
    context: 'Compara la caída abierta de la acción con el riesgo definido por la prima de la opción.',
    insight: 'La Call puede vencer sin valor, pero la pérdida máxima del comprador queda limitada a la prima de $500.',
    options: ['Pierdes $8,000.', 'Pierdes $5,000.', 'Tu pérdida se detiene exactamente en $500.', 'Ganas dinero.'],
    visual: 'Una línea irregular cae de $100 a $20 junto a un piso horizontal de pérdida para la opción en -$500.',
  },
  'intrinsic-value': {
    title: 'El Límite de Valor (In-the-Money)',
    prompt: 'Tienes el derecho de comprar a $50 y la acción cotiza a $55. ¿Qué valor intrínseco tiene el contrato en este momento?',
    context: 'El valor intrínseco es la ventaja económica inmediata de ejercer.',
    insight: 'Puedes comprar a $50 y vender inmediatamente a $55, por lo que la Call está in-the-money por $5.',
    options: ['$0', '$5', '$50', '$55'],
    visual: 'Un eje vertical marca el strike de $50, con una zona verde in-the-money encima y el precio actual en $55.',
  },
  'insurance-floor': {
    title: 'El Piso de Seguro (Puts)',
    prompt: 'Compras una Put con strike de $90 para proteger tus acciones. Si la acción cae bruscamente a $70, ¿a qué precio garantiza el contrato que puedes venderlas?',
    context: 'Una Put otorga a su dueño el derecho de vender al precio strike.',
    insight: 'La Put funciona como un piso de seguro y conserva el derecho de vender a $90 aunque el mercado esté más abajo.',
    options: ['$70', '$80', '$90', '$0'],
    visual: 'El precio de la acción cae por debajo de un piso horizontal punteado marcado Strike de la Put: $90.',
  },
  'time-decay': {
    title: 'El Activo que se Derrite',
    prompt: 'Si la acción subyacente no se mueve durante dos semanas, ¿qué ocurre con el valor de una opción comprada?',
    context: 'El tiempo restante es uno de los componentes de la prima de una opción.',
    insight: 'El contrato pierde valor temporal al acercarse el vencimiento. Esta pérdida se mide mediante Theta.',
    options: ['Aumenta porque sobrevivió.', 'Permanece exactamente igual.', 'Decae y pierde valor con el tiempo.'],
    visual: 'Un calendario de 30 días muestra una opción de $4.00 el Día 1 y un valor menor el Día 15 mientras la acción permanece sin cambios.',
  },
  'seller-obligation': {
    title: 'Cambiando los Papeles (El Vendedor)',
    prompt: 'Como vendedor de la opción, cobras la prima por adelantado. ¿Qué entregas a cambio de ese dinero garantizado?',
    context: 'Contrasta el derecho contractual del comprador con el papel del vendedor.',
    insight: 'Los compradores tienen derechos; los vendedores aceptan la obligación de cumplir el contrato si es ejercido o asignado.',
    options: ['Nada, es dinero gratis.', 'Cedes el control; debes cumplir el contrato si el comprador lo exige.', 'Entregas tu cuenta de corretaje.'],
    visual: 'El comprador paga una prima por un derecho; el vendedor recibe el dinero y asume una obligación.',
  },
  'break-even': {
    title: 'El Objetivo de Equilibrio',
    prompt: 'Compras una Call con strike de $100 por una prima de $5. ¿Qué precio de la acción al vencimiento cambia el resultado neto de pérdida a ganancia?',
    context: 'Para una Call larga, suma la prima al strike.',
    insight: 'El punto de equilibrio es $100 + $5 = $105.',
    options: ['$95', '$100', '$105', '$110'],
    visual: 'Un eje de payoff marca el strike de $100 y el costo inicial de $5; mueve el marcador hacia el cruce de rojo a verde en $105.',
  },
  'hockey-stick': {
    title: 'Leyendo el Palo de Hockey',
    prompt: 'En la gráfica de payoff de una Call larga, ¿qué representa el punto donde la línea plana comienza a inclinarse hacia arriba?',
    context: 'Identifica el término del contrato que cambia la pendiente del valor intrínseco.',
    insight: 'El punto de inflexión es el strike. El equilibrio está más a la derecha después de considerar la prima.',
    options: ['El Punto de Equilibrio', 'El Precio Strike', 'La Ganancia Máxima', 'El Precio Actual de Mercado'],
    visual: 'Una gráfica clásica en forma de L para una Call larga resalta su punto de inflexión.',
  },
  'leverage-engine': {
    title: 'Midiendo el Motor de Apalancamiento',
    prompt: 'Una acción sube de $100 a $110 mientras una Call de $100 sube de $2 a $10. ¿Cuáles son sus rendimientos porcentuales respectivos?',
    context: 'El rendimiento es la ganancia dividida entre la inversión inicial.',
    insight: 'La acción gana 10%. La opción gana $8 sobre una inversión de $2, lo que produce un rendimiento de 400%.',
    options: ['Acción: +10% | Opción: +10%', 'Acción: +10% | Opción: +100%', 'Acción: +10% | Opción: +400%', 'Acción: +10% | Opción: +500%'],
    visual: 'Dos paneles comparan el movimiento de la acción de $100 a $110 con el de la opción de $2 a $10.',
  },
  'contract-exposure': {
    title: 'Exposición de Capital con Varios Contratos',
    prompt: 'Una orden contiene 3 contratos Call a $1.50. Con 100 acciones por contrato, ¿cuánto efectivo total se debita?',
    context: 'Multiplica contratos × 100 acciones × prima cotizada.',
    insight: '3 × 100 × $1.50 = $450 de capital total en riesgo.',
    options: ['$4.50', '$45.00', '$450.00', '$1,500.00'],
    visual: 'Una orden muestra Cantidad 3, Tipo Call, Precio $1.50 y el recordatorio de que cada contrato representa 100 acciones.',
  },
  'short-call-trap': {
    title: 'La Trampa de la Call Corta',
    prompt: 'Una gráfica muestra una Call corta descubierta: ganancia plana debajo del strike y pérdidas crecientes cuando la acción sube. ¿Cuál es su riesgo máximo teórico?',
    context: 'Una acción no tiene un límite superior teórico.',
    insight: 'El vendedor de una Call descubierta enfrenta una pérdida teórica ilimitada porque la acción puede continuar subiendo.',
    options: ['Limitado a la prima recibida.', 'Limitado a $5,000.', 'Riesgo ilimitado.'],
    visual: 'El payoff permanece plano y verde debajo de $50 y luego cae hacia una pérdida roja abierta conforme sube el precio.',
  },
  'volatility-expansion': {
    title: 'La Expansión de Volatilidad',
    prompt: 'Los resultados se publican mañana. La acción no cambia, pero los precios de Calls y Puts están subiendo. ¿Qué fuerza lo provoca?',
    context: 'El mercado está recalculando la incertidumbre sobre el tamaño del próximo movimiento.',
    insight: 'El aumento de volatilidad implícita expande las primas porque los traders anticipan un movimiento grande en cualquier dirección.',
    options: ['La aceleración del deterioro temporal', 'Un aumento de la Volatilidad Implícita (mayor incertidumbre)', 'Manipulación del precio de la acción'],
    visual: 'Un indicador de IV salta de 20% a 60%, expandiendo las curvas de precio mientras el punto de la acción permanece inmóvil.',
  },
  'iv-crush': {
    title: 'El Colapso Después de Resultados',
    prompt: 'Los resultados ya salieron y la acción apenas se movió. Una opción comprada ayer pierde mucho valor de repente. ¿Qué ocurrió?',
    context: 'El evento desconocido pasó y la incertidumbre esperada colapsa.',
    insight: 'El IV Crush elimina rápidamente la prima de volatilidad una vez resuelto el evento anticipado.',
    options: ['Cambio de Delta', 'IV Crush (Colapso de Volatilidad)', 'Asignación'],
    visual: 'La mañana posterior a resultados, el indicador de IV cae de 60% a 20% y el precio de la opción baja inmediatamente.',
  },
  'delta-action': {
    title: 'Delta en Acción',
    prompt: 'Una opción tiene Delta de 0.60. Si la acción sube exactamente $1.00, ¿aproximadamente cuánto debería aumentar el precio de la opción?',
    context: 'Delta estima el cambio en la opción por cada movimiento de $1 del subyacente.',
    insight: 'Un Delta de 0.60 implica un aumento esperado de aproximadamente $0.60 en la opción por una subida de $1 en la acción.',
    options: ['$1.00', '$0.60', '$0.00', '$60.00'],
    visual: 'La acción sube $1.00 junto a un cuadro de datos de la opción que muestra Delta: 0.60.',
  },
  'delta-probability': {
    title: 'Delta como Mapa de Probabilidad',
    prompt: 'A grandes rasgos, ¿cómo interpreta el mercado un Delta de 0.10 para una opción out-of-the-money?',
    context: 'Los traders suelen usar Delta como aproximación rápida de probabilidad, no como garantía.',
    insight: 'Un Delta de 0.10 suele interpretarse como aproximadamente 10% de probabilidad teórica de vencer in-the-money.',
    options: ['90% de probabilidad de vencer con ganancia.', 'Aproximadamente 10% de probabilidad teórica de vencer in-the-money.', 'La opción tiene garantizado perder dinero.'],
    visual: 'Una curva de campana coloca el strike out-of-the-money en la cola derecha con una etiqueta Delta 0.10.',
  },
  'theta-cliff': {
    title: 'El Precipicio de Theta',
    prompt: '¿Cuándo suele sufrir el comprador de una opción las pérdidas más rápidas de valor temporal por Theta?',
    context: 'El deterioro temporal se acelera en lugar de permanecer perfectamente lineal.',
    insight: 'Theta suele acelerarse fuertemente durante los últimos 30 días antes del vencimiento.',
    options: ['Entre 90 y 60 días antes.', 'El deterioro temporal es perfectamente lineal.', 'Durante los últimos 30 días antes del vencimiento.'],
    visual: 'El valor de la opción baja suavemente del Día 90 al Día 30 y luego cae con fuerza hacia el Día 0.',
  },
  'vertical-ceiling': {
    title: 'Construyendo el Techo Vertical',
    prompt: 'Compras una Call de $100 por $5 y vendes una Call de $110 por $2, creando un Bull Call Spread. ¿Cuál es la pérdida máxima?',
    context: 'La pérdida máxima de un debit spread es el débito neto pagado.',
    insight: '$5 pagados menos $2 recibidos equivalen a un débito neto de $3, o $300 por spread.',
    options: ['Ilimitada', '$500', '$300 (Débito Neto)', '$200'],
    visual: 'Las líneas de una Call larga de $100 y una Call corta de $110 se combinan en un payoff limitado con un piso de débito neto de $3.',
  },
  'spread-cap': {
    title: 'Calculando el Límite',
    prompt: 'El Bull Call Spread de $100/$110 costó un débito neto de $3. Si la acción llega a $160 al vencimiento, ¿cuál es la ganancia neta?',
    context: 'Resta el débito del ancho de $10 entre los strikes.',
    insight: 'El spread vale su ancho máximo de $10. Menos el débito de $3, la ganancia neta es $7, o $700 por spread.',
    options: ['$60', '$10', '$7 ($700 en total)', '$0'],
    visual: 'El marcador del Bull Call Spread está en $160 mientras la línea de ganancia permanece plana en su máximo.',
  },
  straddle: {
    title: 'Diseñando el Caos (El Straddle)',
    prompt: '¿Qué combinación crea un payoff en forma de V que gana con un movimiento suficientemente grande en cualquier dirección?',
    context: 'Combina un derecho alcista con uno bajista en el mismo strike.',
    insight: 'Comprar una Call y una Put en el mismo strike crea un long straddle.',
    options: ['Comprar una Call y vender una Put en el mismo strike.', 'Comprar una Call y comprar una Put en el mismo strike.', 'Vender una Call y vender una Put en el mismo strike.'],
    visual: 'Un payoff en forma de V tiene su punto más bajo en $50 y sube hacia ganancias en ambos extremos.',
  },
  'iron-condor': {
    title: 'La Zona de Seguridad (Iron Condor)',
    prompt: 'Un Iron Condor es rentable entre $90 y $110 y tiene pérdidas limitadas fuera de ese rango. ¿Dónde debe cerrar la acción para obtener la ganancia máxima?',
    context: 'Esta estructura neutral se beneficia de la consolidación.',
    insight: 'La ganancia máxima ocurre cuando la acción vence entre los dos strikes cortos interiores: $90 y $110.',
    options: ['Debe subir por encima de $110.', 'Debe caer por debajo de $90.', 'Debe permanecer dentro del rango de $90 a $110.'],
    visual: 'Un payoff con forma de mesa es plano y rentable de $90 a $110 y luego desciende hacia pérdidas limitadas en ambos lados.',
  },
  assignment: {
    title: 'La Realidad de la Asignación',
    prompt: 'Vendiste una Put de $40 y la acción cierra en $38 el viernes de vencimiento. ¿Qué evento estructural ocurrirá en tu cuenta?',
    context: 'Una Put corta in-the-money conlleva una obligación al vencimiento.',
    insight: 'Serás asignado y deberás comprar 100 acciones al precio strike de $40.',
    options: ['Nada; la opción vence sin valor.', 'Eres asignado y debes comprar 100 acciones a $40 cada una.', 'Recibes automáticamente $200 en efectivo.'],
    visual: 'Un panel de cuenta muestra una Put corta de $40 mientras la acción cierra el viernes en $38.',
  },
  'bid-ask': {
    title: 'El Costo del Bid-Ask Spread',
    prompt: 'El Bid es $1.00 y el Ask es $3.00. Si usas una orden de mercado para comprar inmediatamente, ¿qué precio pagas y cuál es la pérdida no realizada inicial?',
    context: 'Una compra a mercado se ejecuta al Ask; una venta inmediata ocurriría al Bid.',
    insight: 'Pagas el Ask de $3 y solo podrías vender al Bid de $1, creando una pérdida no realizada inmediata de $2.',
    options: ['Pagas $1.00 | Pérdida: $0', 'Pagas $2.00 | Pérdida: $1.00', 'Pagas $3.00 | Pérdida: $2.00'],
    visual: 'Un libro de órdenes ilíquido muestra Bid de $1.00 con 10 compradores y Ask de $3.00 con 5 vendedores.',
  },
  'limit-order': {
    title: 'Selección del Tipo de Orden',
    prompt: 'Quieres asegurarte de nunca pagar más de $1.50 para entrar a una operación. ¿Qué tipo de orden debes usar?',
    context: 'Elige la orden que controla el precio máximo de ejecución aceptable.',
    insight: 'Una orden límite se ejecuta únicamente a tu precio indicado o mejor, aunque la ejecución no está garantizada.',
    options: ['Orden de Mercado', 'Orden Límite', 'Orden Stop'],
    visual: 'Un ticket de trading alterna tipos de orden junto a una línea de costo máximo fijada en $1.50.',
  },
  'covered-call-execution': {
    title: 'Monetización Defensiva (Covered Calls)',
    prompt: 'Posees 100 acciones a $100 y vendes una Call de $105 por una prima de $2. Si la acción permanece en $100 durante todo el mes, ¿qué ocurre?',
    context: 'La acción permanece debajo del strike de la Call corta hasta el vencimiento.',
    insight: 'La Call vence sin valor y conservas la prima de $2, reduciendo el costo efectivo de las acciones.',
    options: ['Pierdes tus acciones.', 'La opción vence sin valor y conservas la prima de $2 como ganancia, reduciendo tu costo base.', 'Le debes dinero al broker.'],
    visual: 'Una posición de 100 acciones a $100 se combina con una Call corta de $105 y una burbuja verde de prima de +$2.',
  },
}

const spanishModuleText: Record<string, { title: string; description: string; level: string }> = {
  'core-intuition': { title: 'La Mentalidad de Opcionalidad', description: 'Construyendo la Intuición de Contratos, Derechos y Obligaciones', level: 'Principiante' },
  'payoff-leverage': { title: 'Mapeando la Curva de Payoff', description: 'Visualizando Perfiles de Riesgo, Puntos de Equilibrio y Apalancamiento', level: 'Principiante' },
  'volatility-greeks': { title: 'Las Dimensiones Ocultas', description: 'Dominando las Olas de Volatilidad y el Deterioro Temporal (Los Greeks)', level: 'Intermedio' },
  'multi-leg': { title: 'Arquitecturas Estratégicas', description: 'Diseñando Spreads Multi-Leg, Corredores y Combinaciones', level: 'Intermedio' },
  'execution-risk': { title: 'El Manual del Profesional', description: 'Mecánica de Ejecución, Tamaño de Posición y Prueba de Realidad', level: 'Avanzado' },
}

const spanishModules: OptionsLessonModule[] = modules.map((module) => {
  const translatedModule = spanishModuleText[module.id]

  return {
    ...module,
    ...translatedModule,
    steps: module.steps.map((step) => {
      const translatedStep = spanishStepText[step.id]

      return {
        ...step,
        ...translatedStep,
        choices: translatedStep.options.map((label, index) => ({ id: `choice-${index}`, label })),
        visual: step.visual
          ? { ...step.visual, instruction: translatedStep.visual, description: translatedStep.visual }
          : step.visual,
      }
    }),
  }
})

const shared = {
  badge: 'Interactive Options Lesson',
  title: 'Learn options step by step',
  description: 'Work through five guided modules with interactive payoff charts, practical execution scenarios, and immediate answer feedback.',
  browseTitle: 'Choose a module',
  browseDescription: 'Begin with contract mechanics, then progress through payoff leverage, volatility, multi-leg structures, and real execution risk.',
  backToModules: 'Back to modules', startModule: 'Open module', lessonProgressLabel: 'Overall learning path', moduleProgressLabel: 'Module progress',
  questionLabel: 'Question', questionPlural: 'questions', correctLabel: 'Correct', wrongLabel: 'Try again', checkAnswer: 'Check answer', nextQuestion: 'Next question',
  restartModule: 'Restart module', moduleComplete: 'Module complete', moduleCompletedTitle: 'You completed this module',
  moduleCompletedDescription: 'Nice work. Review the module or return to the catalog to continue the learning path.',
  reviewVideos: 'Explore video chapters', keepLearning: 'Continue learning', modules,
}

export const optionsLessonContent: Record<string, OptionsLessonContent> = {
  en: shared,
  es: {
    ...shared,
    modules: spanishModules,
    badge: 'Leccion Interactiva de Opciones', title: 'Aprende opciones paso a paso',
    description: 'Avanza por cinco modulos guiados con graficas interactivas, escenarios de ejecucion y retroalimentacion inmediata.',
    browseTitle: 'Elige un modulo', browseDescription: 'Comienza con la mecanica de contratos y avanza por payoff, volatilidad, estructuras multi-leg y riesgo de ejecucion.',
    backToModules: 'Volver a modulos', startModule: 'Abrir modulo', lessonProgressLabel: 'Ruta completa de aprendizaje', moduleProgressLabel: 'Progreso del modulo',
    questionLabel: 'Pregunta', questionPlural: 'preguntas', correctLabel: 'Correcto', wrongLabel: 'Intentalo de nuevo', checkAnswer: 'Revisar respuesta', nextQuestion: 'Siguiente pregunta',
    restartModule: 'Reiniciar modulo', moduleComplete: 'Modulo completado', moduleCompletedTitle: 'Completaste este modulo',
    moduleCompletedDescription: 'Buen trabajo. Repasa el modulo o vuelve al catalogo para continuar.', reviewVideos: 'Explorar capitulos en video', keepLearning: 'Seguir aprendiendo',
  },
}
