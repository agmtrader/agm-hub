'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, RefreshCcw, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  optionsLessonContent,
  type OptionsLessonBuilderConfig,
  type OptionsLessonVisualConfig,
  type OptionsLessonVisualStrategy
} from '@/lib/public/options-lesson'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const GRAPH_MIN_PRICE = 50
const GRAPH_MAX_PRICE = 150
const GRAPH_MIN_PNL = -35
const GRAPH_MAX_PNL = 35

type BuilderState = {
  selectedLong: boolean
  selectedShort: boolean
  longStrike: number
  shortStrike: number
}

type HandleType = 'long' | 'short' | null

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function priceToGraphX(price: number) {
  return ((price - GRAPH_MIN_PRICE) / (GRAPH_MAX_PRICE - GRAPH_MIN_PRICE)) * 100
}

function pnlToGraphY(pnl: number) {
  const clamped = clamp(pnl, GRAPH_MIN_PNL, GRAPH_MAX_PNL)
  return 100 - ((clamped - GRAPH_MIN_PNL) / (GRAPH_MAX_PNL - GRAPH_MIN_PNL)) * 100
}

function graphXToPrice(clientX: number, rect: DOMRect) {
  const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
  return GRAPH_MIN_PRICE + ratio * (GRAPH_MAX_PRICE - GRAPH_MIN_PRICE)
}

function buildPath(
  start: number,
  end: number,
  generator: (price: number) => number,
  samples = 60
) {
  const points = Array.from({ length: samples }, (_, index) => {
    const price = start + ((end - start) * index) / (samples - 1)
    const x = priceToGraphX(price)
    const y = pnlToGraphY(generator(price))
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  })

  return points.join(' ')
}

function getPreviewPath(strategy: OptionsLessonVisualStrategy) {
  if (strategy === 'long_call') {
    return {
      primary: 'M 0 78 L 56 78 L 100 22',
      secondary: 'M 0 78 L 56 78 L 77 50'
    }
  }

  if (strategy === 'covered_call') {
    return {
      primary: 'M 0 72 L 42 72 L 74 32 L 100 32',
      secondary: 'M 0 58 L 42 58 L 74 32 L 100 32'
    }
  }

  if (strategy === 'long_straddle') {
    return {
      primary: 'M 0 28 L 50 78 L 100 28'
    }
  }

  return {
    primary: 'M 0 82 C 18 82 28 80 38 48 C 45 18 55 18 62 48 C 72 80 82 82 100 82'
  }
}

function ModulePreviewGraph({ strategy }: { strategy: OptionsLessonVisualStrategy }) {
  const preview = getPreviewPath(strategy)

  return (
    <div className="relative h-44 overflow-hidden border-b border-slate-200 bg-slate-50/80">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <line x1="0" y1="58" x2="100" y2="58" stroke="#111827" strokeWidth="0.45" opacity="0.7" />
        <line x1="24" y1="0" x2="24" y2="100" stroke="#0b66ff" strokeWidth={strategy === 'long_call' ? '1.8' : '0'} />
        <line x1="0" y1="10" x2="100" y2="90" stroke="#dbe2ea" strokeWidth="0.35" />
        <line x1="0" y1="90" x2="100" y2="10" stroke="#dbe2ea" strokeWidth="0.35" />
        {preview.secondary && (
          <path d={preview.secondary} stroke="#ef233c" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        )}
        <path
          d={preview.primary}
          stroke={strategy === 'greeks_curve' ? '#303030' : strategy === 'long_straddle' ? '#e11d48' : '#22c55e'}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        {strategy !== 'greeks_curve' && <circle cx={strategy === 'long_call' ? '24' : strategy === 'long_straddle' ? '50' : '60'} cy={strategy === 'long_call' ? '30' : strategy === 'long_straddle' ? '54' : '40'} r="3" fill="#0b66ff" />}
      </svg>
      {strategy === 'long_call' && (
        <div className="absolute left-14 top-10 rounded-md bg-[#444] px-2 py-1 text-xs font-medium text-white">
          Drag Me
        </div>
      )}
    </div>
  )
}

function BasicConceptGraph({ visual }: { visual: OptionsLessonVisualConfig }) {
  const [price, setPrice] = useState(100)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [dragging, setDragging] = useState(false)

  const strike = 100
  const premium = visual.strategy === 'naked_call' ? 8 : 10
  const stockEntry = 100

  const getPnl = (underlyingPrice: number) => {
    if (visual.strategy === 'long_call' || visual.strategy === 'long_option_risk') {
      return Math.max(underlyingPrice - strike, 0) - premium
    }

    if (visual.strategy === 'protective_put') {
      return underlyingPrice - stockEntry + Math.max(strike - underlyingPrice, 0) - 6
    }

    if (visual.strategy === 'covered_call') {
      return underlyingPrice - stockEntry + premium - Math.max(underlyingPrice - strike, 0)
    }

    if (visual.strategy === 'naked_call') {
      return premium - Math.max(underlyingPrice - strike, 0)
    }

    if (visual.strategy === 'greeks_curve') {
      const distance = (underlyingPrice - 100) / 18
      return 28 * Math.exp(-(distance ** 2)) - 6
    }

    return Math.abs(underlyingPrice - 100) - 12
  }

  const graphPath = useMemo(
    () => buildPath(GRAPH_MIN_PRICE, GRAPH_MAX_PRICE, getPnl),
    [visual.strategy]
  )

  const currentPnl = getPnl(price)
  const currentX = priceToGraphX(price)
  const currentY = pnlToGraphY(currentPnl)
  const breakEven = visual.strategy === 'protective_put' ? stockEntry + 6 : strike + premium

  useEffect(() => {
    if (!dragging) {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = svgRef.current?.getBoundingClientRect()

      if (!rect) {
        return
      }

      setPrice(Math.round(graphXToPrice(event.clientX, rect)))
    }

    const handlePointerUp = () => {
      setDragging(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [dragging])

  const strokeColor =
    visual.strategy === 'naked_call'
      ? '#e11d48'
      : visual.strategy === 'covered_call'
        ? '#0f766e'
        : visual.strategy === 'protective_put'
          ? '#2563eb'
          : visual.strategy === 'greeks_curve'
            ? '#303030'
            : '#f97316'

  return (
    <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,46,77,0.06)]">
      <p className="mb-4 text-sm leading-6 text-[#113a63]/75">{visual.instruction}</p>
      <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-4">
        <div className="relative aspect-[1.22/1] w-full">
          <svg ref={svgRef} viewBox="0 0 100 100" className="h-full w-full touch-none">
            {Array.from({ length: 6 }, (_, index) => {
              const pointPrice = 50 + index * 20
              const x = priceToGraphX(pointPrice)
              return (
                <g key={pointPrice}>
                  <line x1={x} y1="8" x2={x} y2="86" stroke="#eef2f7" strokeWidth="0.35" />
                  <text x={x} y="92" textAnchor="middle" fontSize="3.2" fill="#6b7280">
                    {pointPrice}
                  </text>
                </g>
              )
            })}

            {[-30, -10, 0, 10, 30].map((value) => {
              const y = pnlToGraphY(value)
              return (
                <g key={value}>
                  <line x1="6" y1={y} x2="98" y2={y} stroke={value === 0 ? '#111827' : '#e5e7eb'} strokeWidth={value === 0 ? '0.5' : '0.35'} />
                  <text x="3.8" y={y + 1.2} textAnchor="end" fontSize="3.2" fill="#6b7280">
                    {value}
                  </text>
                </g>
              )
            })}

            <line x1={priceToGraphX(strike)} y1="8" x2={priceToGraphX(strike)} y2="86" stroke="#94a3b8" strokeWidth="0.45" strokeDasharray="2 1.5" />
            {visual.stockEntryLabel && (
              <line x1={priceToGraphX(stockEntry)} y1="8" x2={priceToGraphX(stockEntry)} y2="86" stroke="#cbd5e1" strokeWidth="0.45" strokeDasharray="2 1.5" />
            )}
            {visual.breakEvenLabel && (
              <line x1={priceToGraphX(breakEven)} y1="8" x2={priceToGraphX(breakEven)} y2="86" stroke="#f59e0b" strokeWidth="0.45" strokeDasharray="2 1.5" />
            )}

            <path d={graphPath} stroke={strokeColor} strokeWidth="1.2" fill="none" strokeLinecap="round" />

            <line x1={currentX} y1="8" x2={currentX} y2="86" stroke="#0b66ff" strokeWidth="0.8" />
            <g className="cursor-grab" onPointerDown={() => setDragging(true)}>
              <circle cx={currentX} cy={currentY} r="2.3" fill="#0b66ff" />
              <g transform={`translate(${currentX - 9},${currentY - 11})`}>
                <rect rx="2" width="18" height="7" fill="#444" />
                <text x="9" y="4.8" textAnchor="middle" fontSize="3.1" fill="white">
                  {visual.dragLabel}
                </text>
              </g>
            </g>

            <text x={priceToGraphX(strike)} y="5.8" textAnchor="middle" fontSize="3.1" fill="#6b7280">
              {visual.strikeLabel}
            </text>
          </svg>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-[#113a63]/45">{visual.currentPriceLabel}</p>
          <p className="mt-2 text-lg font-semibold text-[#113a63]">${price}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-[#113a63]/45">{visual.strikeLabel}</p>
          <p className="mt-2 text-lg font-semibold text-[#113a63]">${strike}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-[#113a63]/45">P&L</p>
          <p className={cn('mt-2 text-lg font-semibold', currentPnl >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
            {currentPnl >= 0 ? '+' : ''}${currentPnl.toFixed(0)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
        {visual.maxLossLabel && <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">{visual.maxLossLabel}</span>}
        {visual.maxProfitLabel && <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{visual.maxProfitLabel}</span>}
        {visual.breakEvenLabel && <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{visual.breakEvenLabel}</span>}
      </div>
    </div>
  )
}

function getInitialBuilderState(config: OptionsLessonBuilderConfig): BuilderState {
  return {
    selectedLong: false,
    selectedShort: false,
    longStrike: config.targetLongStrike + 10,
    shortStrike: config.targetShortStrike - 10
  }
}

function getPayoffAtPrice(price: number, state: BuilderState, config: OptionsLessonBuilderConfig) {
  let payoff = 0

  if (state.selectedLong) {
    payoff += Math.max(price - state.longStrike, 0) - config.longPremium
  }

  if (state.selectedShort) {
    payoff += config.shortPremium - Math.max(price - state.shortStrike, 0)
  }

  return payoff
}

function renderStrategyLines(state: BuilderState, config: OptionsLessonBuilderConfig) {
  if (!state.selectedLong && !state.selectedShort) {
    return []
  }

  const netDebit = config.longPremium - config.shortPremium
  const breakEven = state.selectedLong && state.selectedShort ? state.longStrike + netDebit : state.longStrike + config.longPremium

  return [
    {
      color: '#e11d48',
      path: buildPath(GRAPH_MIN_PRICE, Math.min(breakEven, GRAPH_MAX_PRICE), (price) =>
        getPayoffAtPrice(price, state, config)
      )
    },
    breakEven < GRAPH_MAX_PRICE
      ? {
          color: '#10b981',
          path: buildPath(Math.max(breakEven, GRAPH_MIN_PRICE), GRAPH_MAX_PRICE, (price) =>
            getPayoffAtPrice(price, state, config)
          )
        }
      : null
  ].filter(Boolean) as Array<{ color: string; path: string }>
}

function StrategyBuilderStep({
  config,
  revealed,
  correct,
  onCheck,
  onReset
}: {
  config: OptionsLessonBuilderConfig
  revealed: boolean
  correct: boolean
  onCheck: (correct: boolean) => void
  onReset: () => void
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [draggingHandle, setDraggingHandle] = useState<HandleType>(null)
  const [state, setState] = useState<BuilderState>(() => getInitialBuilderState(config))

  const netDebit = config.longPremium - config.shortPremium
  const breakEven = state.longStrike + netDebit
  const maxProfit = state.shortStrike - state.longStrike - netDebit
  const maxLoss = netDebit
  const lines = useMemo(() => renderStrategyLines(state, config), [state, config])

  const builderCorrect =
    state.selectedLong &&
    state.selectedShort &&
    Math.abs(state.longStrike - config.targetLongStrike) <= 2 &&
    Math.abs(state.shortStrike - config.targetShortStrike) <= 2 &&
    state.longStrike < state.shortStrike

  useEffect(() => {
    if (!draggingHandle) {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = svgRef.current?.getBoundingClientRect()

      if (!rect) {
        return
      }

      const nextPrice = Math.round(graphXToPrice(event.clientX, rect))
      onReset()

      setState((current) =>
        draggingHandle === 'long'
          ? {
              ...current,
              longStrike: clamp(nextPrice, GRAPH_MIN_PRICE + 5, current.selectedShort ? current.shortStrike - 5 : GRAPH_MAX_PRICE - 5)
            }
          : {
              ...current,
              shortStrike: clamp(nextPrice, current.selectedLong ? current.longStrike + 5 : GRAPH_MIN_PRICE + 5, GRAPH_MAX_PRICE - 5)
            }
      )
    }

    const handlePointerUp = () => setDraggingHandle(null)

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [draggingHandle, onReset])

  const toggleContract = (type: 'long' | 'short') => {
    onReset()
    setState((current) => ({
      ...current,
      selectedLong: type === 'long' ? !current.selectedLong : current.selectedLong,
      selectedShort: type === 'short' ? !current.selectedShort : current.selectedShort
    }))
  }

  const handleReset = () => {
    setState(getInitialBuilderState(config))
    onReset()
  }

  return (
    <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,46,77,0.06)]">
      <div className="rounded-[1.35rem] border border-slate-200 bg-[#115ccf] px-5 py-4 text-white">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">{config.contractPrompt}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => toggleContract('long')}
            className={cn(
              'rounded-xl border px-4 py-2 text-sm font-semibold transition-all',
              state.selectedLong ? 'border-white bg-white text-[#115ccf]' : 'border-white/40 bg-white/10 text-white'
            )}
          >
            {config.longCallLabel}
          </button>
          <button
            type="button"
            onClick={() => toggleContract('short')}
            className={cn(
              'rounded-xl border px-4 py-2 text-sm font-semibold transition-all',
              state.selectedShort ? 'border-white bg-white text-[#115ccf]' : 'border-white/40 bg-white/10 text-white'
            )}
          >
            {config.shortCallLabel}
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <p className="text-sm text-[#113a63]/75">{config.instruction}</p>

        <div className="flex flex-wrap gap-3">
          {state.selectedLong && (
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#113a63]">{config.longCallLabel} @ ${state.longStrike}</p>
                <p className="text-xs text-[#113a63]/60">${config.longPremium} {config.premiumDebitLabel}</p>
              </div>
              <button type="button" onClick={() => toggleContract('long')} className="text-[#0b66ff]">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {state.selectedShort && (
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#113a63]">{config.shortCallLabel} @ ${state.shortStrike}</p>
                <p className="text-xs text-[#113a63]/60">${config.shortPremium} {config.premiumCreditLabel}</p>
              </div>
              <button type="button" onClick={() => toggleContract('short')} className="text-[#0b66ff]">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-4">
          <div className="relative aspect-[1.22/1] w-full">
            <svg ref={svgRef} viewBox="0 0 100 100" className="h-full w-full touch-none">
              {Array.from({ length: 6 }, (_, index) => {
                const pointPrice = 50 + index * 20
                const x = priceToGraphX(pointPrice)
                return (
                  <g key={pointPrice}>
                    <line x1={x} y1="8" x2={x} y2="86" stroke="#eef2f7" strokeWidth="0.35" />
                    <text x={x} y="92" textAnchor="middle" fontSize="3.2" fill="#6b7280">{pointPrice}</text>
                  </g>
                )
              })}

              {[-20, -10, 0, 10, 20].map((value) => {
                const y = pnlToGraphY(value)
                return (
                  <g key={value}>
                    <line x1="6" y1={y} x2="98" y2={y} stroke={value === 0 ? '#111827' : '#e5e7eb'} strokeWidth={value === 0 ? '0.5' : '0.35'} />
                    <text x="3.8" y={y + 1.2} textAnchor="end" fontSize="3.2" fill="#6b7280">{value}</text>
                  </g>
                )
              })}

              {lines.map((line) => (
                <path key={`${line.color}-${line.path}`} d={line.path} stroke={line.color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
              ))}

              {revealed && correct && (
                <>
                  <line x1={priceToGraphX(state.longStrike)} y1="8" x2={priceToGraphX(state.longStrike)} y2="86" stroke="#3b82f6" strokeWidth="0.45" strokeDasharray="2 1.5" />
                  <line x1={priceToGraphX(state.shortStrike)} y1="8" x2={priceToGraphX(state.shortStrike)} y2="86" stroke="#3b82f6" strokeWidth="0.45" strokeDasharray="2 1.5" />
                  <line x1={priceToGraphX(breakEven)} y1="8" x2={priceToGraphX(breakEven)} y2="86" stroke="#f59e0b" strokeWidth="0.45" strokeDasharray="2 1.5" />
                </>
              )}

              {state.selectedLong && (
                <g className="cursor-grab" onPointerDown={() => setDraggingHandle('long')}>
                  <circle cx={priceToGraphX(state.longStrike)} cy={pnlToGraphY(getPayoffAtPrice(state.longStrike, { ...state, selectedLong: true }, config))} r="2.3" fill="#0b66ff" />
                </g>
              )}
              {state.selectedShort && (
                <g className="cursor-grab" onPointerDown={() => setDraggingHandle('short')}>
                  <circle cx={priceToGraphX(state.shortStrike)} cy={pnlToGraphY(getPayoffAtPrice(state.shortStrike, { ...state, selectedShort: true }, config))} r="2.3" fill="#0b66ff" />
                </g>
              )}
            </svg>
          </div>
        </div>

        {revealed && (
          <div className={cn('rounded-3xl border p-5', correct ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50')}>
            <Badge className={cn('w-fit', correct ? 'bg-emerald-500 text-white hover:bg-emerald-500' : 'bg-amber-500 text-white hover:bg-amber-500')}>
              {correct ? config.successLabel : config.retryLabel}
            </Badge>
            <p className="mt-4 text-sm leading-7 text-[#113a63]/80">
              {correct
                ? `${config.maxLossLabel}: $${maxLoss}. ${config.maxProfitLabel}: $${maxProfit}. ${config.breakEvenLabel}: $${breakEven}.`
                : `${config.retryHint} $${config.targetLongStrike} and $${config.targetShortStrike}.`}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => onCheck(builderCorrect)} className="bg-[#f97316] text-white hover:bg-[#ea6a10]">
            {config.checkPlacement}
          </Button>
          <Button variant="outline" onClick={handleReset} className="border-slate-200 bg-white text-[#113a63] hover:bg-slate-50 hover:text-[#113a63]">
            {config.resetStrategy}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function InteractiveOptionsLesson() {
  const { lang } = useTranslationProvider()
  const content = optionsLessonContent[lang] ?? optionsLessonContent.en
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [builderSolved, setBuilderSolved] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const selectedModule = content.modules.find((module) => module.id === selectedModuleId) ?? null
  const currentStep = selectedModule?.steps[currentStepIndex] ?? null
  const isCompleted = !!selectedModule && currentStepIndex >= selectedModule.steps.length
  const moduleProgress = selectedModule ? (Math.min(currentStepIndex, selectedModule.steps.length) / selectedModule.steps.length) * 100 : 0
  const lessonProgress = content.modules.length === 0 ? 0 : (completedSteps.length / content.modules.reduce((sum, module) => sum + module.steps.length, 0)) * 100

  const openModule = (moduleId: string) => {
    setSelectedModuleId(moduleId)
    setCurrentStepIndex(0)
    setSelectedChoiceId(null)
    setRevealed(false)
    setBuilderSolved(false)
  }

  const backToModules = () => {
    setSelectedModuleId(null)
    setCurrentStepIndex(0)
    setSelectedChoiceId(null)
    setRevealed(false)
    setBuilderSolved(false)
  }

  const markStepCompleted = (stepId: string) => {
    setCompletedSteps((current) => (current.includes(stepId) ? current : [...current, stepId]))
  }

  const handleCheckAnswer = () => {
    if (!currentStep?.choices || !selectedChoiceId) {
      return
    }

    setRevealed(true)

    if (selectedChoiceId === currentStep.correctChoiceId) {
      markStepCompleted(currentStep.id)
    }
  }

  const handleBuilderCheck = (correct: boolean) => {
    setRevealed(true)
    setBuilderSolved(correct)

    if (correct && currentStep) {
      markStepCompleted(currentStep.id)
    }
  }

  const handleNext = () => {
    setCurrentStepIndex((current) => current + 1)
    setSelectedChoiceId(null)
    setRevealed(false)
    setBuilderSolved(false)
  }

  const handleRestartModule = () => {
    setCurrentStepIndex(0)
    setSelectedChoiceId(null)
    setRevealed(false)
    setBuilderSolved(false)
  }

  const canAdvance = currentStep?.kind === 'builder' ? revealed && builderSolved : revealed

  if (!selectedModule) {
    return (
      <section className="w-full max-w-7xl px-4 md:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,46,77,0.08)] md:p-10">
          <div className="flex flex-col gap-4">
            <Badge className="w-fit border-0 bg-[#f97316]/10 px-4 py-1 text-[#f97316] hover:bg-[#f97316]/10">
              {content.badge}
            </Badge>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#113a63] md:text-5xl">{content.title}</h2>
            <p className="max-w-3xl text-lg leading-8 text-[#113a63]/78">{content.description}</p>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50/60 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-[#113a63]">{content.browseTitle}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[#113a63]/72">{content.browseDescription}</p>
              </div>
              <div className="min-w-[220px]">
                <div className="mb-2 flex items-center justify-between text-sm text-[#113a63]/65">
                  <span>{content.lessonProgressLabel}</span>
                  <span>{completedSteps.length}</span>
                </div>
                <Progress value={lessonProgress} className="h-2 bg-slate-100 [&>div]:bg-[#f97316]" />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {content.modules.map((module, index) => (
              <motion.button
                key={module.id}
                type="button"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
                onClick={() => openModule(module.id)}
                className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white text-left shadow-[0_14px_32px_rgba(15,46,77,0.07)] transition-transform hover:-translate-y-1"
              >
                <ModulePreviewGraph strategy={module.previewStrategy} />
                <div className="space-y-3 p-6">
                  <p className="text-sm font-medium text-[#0b66ff]">{module.level}</p>
                  <h3 className="text-[2rem] font-semibold leading-[1.08] text-[#2f3136]">{module.title}</h3>
                  <p className="text-base leading-8 text-[#3f4650]">{module.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-[#113a63]/55">
                      {module.steps.length} {content.questionPlural}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#f97316]">
                      {content.startModule}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full max-w-7xl px-4 md:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,46,77,0.08)] md:p-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <button type="button" onClick={backToModules} className="inline-flex items-center gap-2 text-sm font-medium text-[#113a63]/70">
              <ArrowLeft className="h-4 w-4" />
              {content.backToModules}
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-0 bg-[#f97316]/10 px-4 py-1 text-[#f97316] hover:bg-[#f97316]/10">{selectedModule.level}</Badge>
              <Badge variant="outline" className="border-slate-200 text-[#113a63]">{selectedModule.steps.length} {content.questionPlural}</Badge>
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-[#113a63] md:text-5xl">{selectedModule.title}</h2>
            <p className="max-w-3xl text-base leading-8 text-[#113a63]/76">{selectedModule.description}</p>
          </div>
          <div className="min-w-[260px]">
            <div className="mb-2 flex items-center justify-between text-sm text-[#113a63]/65">
              <span>{content.moduleProgressLabel}</span>
              <span>{Math.min(currentStepIndex, selectedModule.steps.length)} / {selectedModule.steps.length}</span>
            </div>
            <Progress value={moduleProgress} className="h-2 bg-slate-100 [&>div]:bg-[#f97316]" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div>
            {isCompleted ? (
              <Card className="border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,46,77,0.06)]">
                <CardContent className="p-8">
                  <Badge className="border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{content.moduleComplete}</Badge>
                  <h3 className="mt-5 text-3xl font-semibold text-[#113a63]">{content.moduleCompletedTitle}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#113a63]/78">{content.moduleCompletedDescription}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button onClick={handleRestartModule} className="bg-[#f97316] text-white hover:bg-[#ea6a10]">
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      {content.restartModule}
                    </Button>
                    <Button asChild variant="outline" className="border-slate-200 bg-white text-[#113a63] hover:bg-slate-50 hover:text-[#113a63]">
                      <Link href={formatURL('/learning/1', lang)}>
                        {content.reviewVideos}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : currentStep?.kind === 'builder' && currentStep.builder ? (
              <StrategyBuilderStep
                config={currentStep.builder}
                revealed={revealed}
                correct={builderSolved}
                onCheck={handleBuilderCheck}
                onReset={() => {
                  setRevealed(false)
                  setBuilderSolved(false)
                }}
              />
            ) : currentStep?.visual ? (
              <BasicConceptGraph visual={currentStep.visual} />
            ) : null}
          </div>

          <Card className="border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,46,77,0.06)]">
            <CardContent className="flex flex-col gap-6 p-6 md:p-8">
              {isCompleted ? (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-[#113a63]/65">{content.keepLearning}</p>
                  <div className="grid gap-3">
                    {selectedModule.steps.map((step, index) => (
                      <div key={step.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.16em] text-[#113a63]/45">{content.questionLabel} {index + 1}</span>
                          {completedSteps.includes(step.id) ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-slate-400" />}
                        </div>
                        <p className="mt-2 text-sm font-medium text-[#113a63]">{step.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : currentStep ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.18em] text-[#113a63]/45">{content.questionLabel} {currentStepIndex + 1}</span>
                      {completedSteps.includes(currentStep.id) ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-slate-400" />}
                    </div>
                    <h3 className="text-3xl font-semibold leading-tight text-[#113a63]">{currentStep.title}</h3>
                    <p className="text-base leading-8 text-[#113a63]/78">{currentStep.prompt}</p>
                    <p className="text-sm font-medium text-[#113a63]/55">{currentStep.context}</p>
                  </div>

                  <div className="grid gap-3">
                    {selectedModule.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={cn(
                          'rounded-2xl border px-4 py-3 text-sm',
                          index === currentStepIndex ? 'border-[#f97316]/25 bg-[#fff7f1] text-[#113a63]' : 'border-slate-200 bg-white text-[#113a63]/76'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.16em] text-[#113a63]/45">{content.questionLabel} {index + 1}</span>
                          {completedSteps.includes(step.id) ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-slate-400" />}
                        </div>
                        <p className="mt-2 font-medium">{step.title}</p>
                      </div>
                    ))}
                  </div>

                  {currentStep.kind === 'quiz' && currentStep.choices && (
                    <>
                      <div className="grid gap-3">
                        {currentStep.choices.map((choice) => {
                          const isSelected = selectedChoiceId === choice.id
                          const isCorrect = choice.id === currentStep.correctChoiceId
                          const showCorrect = revealed && isCorrect
                          const showWrong = revealed && isSelected && !isCorrect

                          return (
                            <button
                              key={choice.id}
                              type="button"
                              onClick={() => {
                                setSelectedChoiceId(choice.id)
                                if (revealed) {
                                  setRevealed(false)
                                }
                              }}
                              className={cn(
                                'rounded-2xl border bg-white p-4 text-left transition-all',
                                isSelected ? 'border-[#f97316] bg-[#fff7f1]' : 'border-slate-200 hover:bg-slate-50',
                                showCorrect && 'border-emerald-500 bg-emerald-50',
                                showWrong && 'border-rose-300 bg-rose-50'
                              )}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-[#113a63]">{choice.label}</p>
                                {showCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Circle className="h-4 w-4 text-slate-300" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {revealed && (
                        <div className={cn('rounded-3xl border p-5', selectedChoiceId === currentStep.correctChoiceId ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50')}>
                          <Badge className={cn('w-fit', selectedChoiceId === currentStep.correctChoiceId ? 'bg-emerald-500 text-white hover:bg-emerald-500' : 'bg-amber-500 text-white hover:bg-amber-500')}>
                            {selectedChoiceId === currentStep.correctChoiceId ? content.correctLabel : content.wrongLabel}
                          </Badge>
                          <p className="mt-4 text-sm leading-7 text-[#113a63]/80">{currentStep.insight}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        <Button onClick={handleCheckAnswer} disabled={!selectedChoiceId} className="bg-[#f97316] text-white hover:bg-[#ea6a10]">
                          {content.checkAnswer}
                        </Button>
                        <Button variant="outline" onClick={handleNext} disabled={!canAdvance} className="border-slate-200 bg-white text-[#113a63] hover:bg-slate-50 hover:text-[#113a63]">
                          {content.nextQuestion}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="ghost" onClick={handleRestartModule} className="text-[#113a63]/70 hover:bg-slate-100 hover:text-[#113a63]">
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          {content.restartModule}
                        </Button>
                      </div>
                    </>
                  )}

                  {currentStep.kind === 'builder' && (
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" onClick={handleNext} disabled={!canAdvance} className="border-slate-200 bg-white text-[#113a63] hover:bg-slate-50 hover:text-[#113a63]">
                        {content.nextQuestion}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="ghost" onClick={handleRestartModule} className="text-[#113a63]/70 hover:bg-slate-100 hover:text-[#113a63]">
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        {content.restartModule}
                      </Button>
                    </div>
                  )}
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
