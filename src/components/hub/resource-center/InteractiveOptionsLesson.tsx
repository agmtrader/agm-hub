'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Circle, RefreshCcw, X } from 'lucide-react'

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

type ScenarioGraphic = {
  title: string
  axis: string
  paths: Array<{ d: string; color: string; dash?: string }>
  labels: Array<{ x: number; y: number; text: string; color?: string }>
  zones?: Array<{ x: number; y: number; width: number; height: number; color: string }>
  markerLabel?: string
}

const scenarioGraphics: Record<string, ScenarioGraphic> = {
  'house-option': {
    title: '3-month option timeline', axis: 'Today → Expiration', markerLabel: 'Timeline',
    paths: [{ d: 'M 12 48 L 48 48 M 48 48 L 88 22 M 48 48 L 88 74', color: '#0b66ff' }],
    labels: [{ x: 12, y: 38, text: 'Today: -$5k premium' }, { x: 48, y: 42, text: '$500k strike' }, { x: 88, y: 17, text: '$600k house', color: '#059669' }, { x: 88, y: 84, text: '$400k house', color: '#64748b' }],
  },
  'capping-downside': {
    title: 'Stock loss vs. option loss', axis: 'Stock price', markerLabel: 'Crash',
    paths: [{ d: 'M 10 18 C 24 22 30 34 42 30 S 58 55 70 52 S 82 78 92 82', color: '#e11d48' }, { d: 'M 10 68 L 92 68', color: '#0b66ff', dash: '3 2' }],
    labels: [{ x: 12, y: 13, text: '$100 stock' }, { x: 89, y: 91, text: '$20' }, { x: 72, y: 64, text: 'Option floor: -$500', color: '#0b66ff' }],
  },
  'intrinsic-value': {
    title: 'In-the-money boundary', axis: 'Stock price', markerLabel: 'Price', zones: [{ x: 42, y: 8, width: 50, height: 38, color: '#dcfce7' }, { x: 42, y: 46, width: 50, height: 42, color: '#e2e8f0' }],
    paths: [{ d: 'M 42 8 L 42 88', color: '#334155' }, { d: 'M 35 46 L 92 46', color: '#f97316', dash: '3 2' }],
    labels: [{ x: 20, y: 48, text: 'Strike $50' }, { x: 68, y: 28, text: '$55 → $5 intrinsic', color: '#059669' }, { x: 68, y: 68, text: 'Out of the money' }],
  },
  'insurance-floor': {
    title: 'Protective put floor', axis: 'Stock price', markerLabel: 'Stock',
    paths: [{ d: 'M 10 20 C 28 24 34 34 48 31 S 62 55 76 66 S 86 78 92 82', color: '#e11d48' }, { d: 'M 10 55 L 92 55', color: '#2563eb', dash: '3 2' }],
    labels: [{ x: 72, y: 51, text: 'Put strike: $90', color: '#2563eb' }, { x: 84, y: 88, text: 'Market: $70' }],
  },
  'time-decay': {
    title: 'Time-value decay', axis: 'Days to expiration', markerLabel: 'Day',
    paths: [{ d: 'M 10 18 C 38 20 58 28 70 42 C 82 58 87 72 92 84', color: '#f97316' }],
    labels: [{ x: 12, y: 13, text: 'Day 1: $4.00' }, { x: 51, y: 31, text: 'Day 15: lower value' }, { x: 89, y: 92, text: 'Day 30' }],
  },
  'seller-obligation': {
    title: 'Rights and obligations', axis: 'Contract relationship', markerLabel: 'Premium',
    paths: [{ d: 'M 28 45 L 72 45', color: '#10b981' }, { d: 'M 72 60 L 28 60', color: '#f97316', dash: '3 2' }],
    labels: [{ x: 18, y: 35, text: 'BUYER' }, { x: 18, y: 72, text: 'Gets a right', color: '#0b66ff' }, { x: 82, y: 35, text: 'SELLER' }, { x: 82, y: 72, text: 'Takes obligation', color: '#e11d48' }, { x: 50, y: 40, text: 'Premium →', color: '#059669' }],
  },
  'break-even': {
    title: 'Long call break-even', axis: 'Stock price at expiration', markerLabel: 'Price', zones: [{ x: 10, y: 8, width: 61, height: 80, color: '#fff1f2' }, { x: 71, y: 8, width: 21, height: 80, color: '#ecfdf5' }],
    paths: [{ d: 'M 10 68 L 60 68 L 92 20', color: '#f97316' }, { d: 'M 71 8 L 71 88', color: '#10b981', dash: '3 2' }],
    labels: [{ x: 60, y: 76, text: 'Strike $100' }, { x: 73, y: 13, text: 'Break-even $105', color: '#059669' }, { x: 20, y: 63, text: '-$5 premium' }],
  },
  'hockey-stick': {
    title: 'Reading the hockey stick', axis: 'Stock price at expiration', markerLabel: 'Price',
    paths: [{ d: 'M 10 70 L 56 70 L 92 18', color: '#f97316' }], labels: [{ x: 56, y: 78, text: 'Inflection = Strike', color: '#0b66ff' }, { x: 79, y: 34, text: 'Upside' }],
  },
  'leverage-engine': {
    title: 'Stock return vs. option return', axis: 'Percentage return', markerLabel: 'Compare', zones: [{ x: 18, y: 70, width: 24, height: 18, color: '#dbeafe' }, { x: 58, y: 18, width: 24, height: 70, color: '#dcfce7' }],
    paths: [], labels: [{ x: 30, y: 65, text: 'STOCK +10%', color: '#2563eb' }, { x: 70, y: 13, text: 'OPTION +400%', color: '#059669' }, { x: 30, y: 94, text: '$100 → $110' }, { x: 70, y: 94, text: '$2 → $10' }],
  },
  'contract-exposure': {
    title: 'Order entry', axis: '3 × 100 × $1.50', markerLabel: 'Quantity', zones: [{ x: 12, y: 18, width: 76, height: 58, color: '#eff6ff' }], paths: [],
    labels: [{ x: 24, y: 35, text: 'QUANTITY  3' }, { x: 50, y: 35, text: 'TYPE  CALL' }, { x: 76, y: 35, text: 'PRICE  $1.50' }, { x: 50, y: 60, text: 'TOTAL DEBIT  $450', color: '#e11d48' }, { x: 50, y: 86, text: '1 contract = 100 shares' }],
  },
  'short-call-trap': {
    title: 'Naked short-call risk', axis: 'Stock price', markerLabel: 'Price',
    paths: [{ d: 'M 10 28 L 52 28 L 92 86', color: '#e11d48' }], labels: [{ x: 28, y: 23, text: 'Premium kept', color: '#059669' }, { x: 54, y: 20, text: '$50 strike' }, { x: 79, y: 72, text: 'Unlimited loss', color: '#e11d48' }],
  },
  'volatility-expansion': {
    title: 'Implied volatility expansion', axis: 'Uncertainty', markerLabel: 'IV',
    paths: [{ d: 'M 12 62 C 30 58 36 38 50 38 C 64 38 70 58 88 62', color: '#94a3b8' }, { d: 'M 8 78 C 26 72 34 20 50 20 C 66 20 74 72 92 78', color: '#8b5cf6' }],
    labels: [{ x: 25, y: 55, text: 'IV 20%' }, { x: 76, y: 74, text: 'IV 60%', color: '#7c3aed' }, { x: 50, y: 92, text: 'Stock unchanged' }],
  },
  'iv-crush': {
    title: 'Post-earnings IV crush', axis: 'Event timeline', markerLabel: 'IV',
    paths: [{ d: 'M 10 22 L 48 22 L 52 72 L 92 72', color: '#8b5cf6' }], labels: [{ x: 26, y: 16, text: 'Before: IV 60%' }, { x: 72, y: 82, text: 'After: IV 20%' }, { x: 51, y: 48, text: 'Earnings' }],
  },
  'delta-action': {
    title: 'Delta response', axis: '$1 underlying move', markerLabel: 'Stock',
    paths: [{ d: 'M 18 68 L 42 38', color: '#0b66ff' }, { d: 'M 58 68 L 82 50', color: '#10b981' }], labels: [{ x: 30, y: 78, text: 'STOCK +$1.00' }, { x: 70, y: 78, text: 'OPTION +$0.60' }, { x: 50, y: 20, text: 'DELTA 0.60', color: '#7c3aed' }],
  },
  'delta-probability': {
    title: 'Delta probability map', axis: 'Future stock-price distribution', markerLabel: 'Strike',
    paths: [{ d: 'M 8 82 C 22 81 30 68 40 38 C 46 18 54 18 60 38 C 70 68 78 81 92 82', color: '#334155' }, { d: 'M 78 18 L 78 84', color: '#f97316', dash: '3 2' }], labels: [{ x: 78, y: 13, text: 'OTM strike' }, { x: 82, y: 35, text: 'Δ 0.10 ≈ 10%', color: '#f97316' }],
  },
  'theta-cliff': {
    title: 'The Theta cliff', axis: 'Days remaining: 90 → 0', markerLabel: 'Day',
    paths: [{ d: 'M 10 22 C 40 24 58 30 68 42 C 80 56 86 72 92 86', color: '#e11d48' }], labels: [{ x: 15, y: 17, text: '90 days' }, { x: 68, y: 37, text: '30 days' }, { x: 85, y: 92, text: 'Fastest decay', color: '#e11d48' }],
  },
  'vertical-ceiling': {
    title: '$100 / $110 bull call spread', axis: 'Stock price', markerLabel: 'Price',
    paths: [{ d: 'M 10 72 L 48 72 L 76 24 L 92 24', color: '#10b981' }, { d: 'M 10 78 L 48 78 L 92 20', color: '#2563eb', dash: '3 2' }], labels: [{ x: 34, y: 68, text: 'Max loss -$3' }, { x: 48, y: 88, text: 'Long $100' }, { x: 76, y: 18, text: 'Short $110' }],
  },
  'spread-cap': {
    title: 'Capped spread profit', axis: 'Stock price at expiration', markerLabel: 'Price',
    paths: [{ d: 'M 10 72 L 45 72 L 68 26 L 92 26', color: '#10b981' }], labels: [{ x: 34, y: 68, text: '-$3 debit' }, { x: 75, y: 20, text: 'Max +$7 / $700', color: '#059669' }, { x: 90, y: 38, text: 'Stock $160' }],
  },
  'straddle': {
    title: 'Long straddle', axis: 'Stock price', markerLabel: 'Price',
    paths: [{ d: 'M 10 22 L 50 76 L 90 22', color: '#e11d48' }], labels: [{ x: 50, y: 86, text: '$50 strike' }, { x: 22, y: 17, text: 'Profit if down big', color: '#059669' }, { x: 78, y: 17, text: 'Profit if up big', color: '#059669' }],
  },
  'iron-condor': {
    title: 'Iron condor profit corridor', axis: 'Stock price', markerLabel: 'Price', zones: [{ x: 36, y: 20, width: 30, height: 40, color: '#dcfce7' }],
    paths: [{ d: 'M 10 76 L 25 76 L 38 30 L 64 30 L 77 76 L 92 76', color: '#0f766e' }], labels: [{ x: 38, y: 24, text: '$90' }, { x: 64, y: 24, text: '$110' }, { x: 51, y: 52, text: 'MAX PROFIT ZONE', color: '#059669' }],
  },
  assignment: {
    title: 'Expiration assignment', axis: 'Friday close → Weekend', markerLabel: 'Close',
    paths: [{ d: 'M 12 40 L 44 40 L 58 68 L 88 68', color: '#e11d48' }], labels: [{ x: 28, y: 34, text: 'Short Put strike $40' }, { x: 62, y: 63, text: 'Stock closes $38' }, { x: 72, y: 82, text: 'Assigned: Buy 100 @ $40', color: '#e11d48' }],
  },
  'bid-ask': {
    title: 'Illiquid option order book', axis: 'Immediate round-trip cost', markerLabel: 'Spread', zones: [{ x: 10, y: 22, width: 34, height: 50, color: '#dcfce7' }, { x: 56, y: 22, width: 34, height: 50, color: '#fee2e2' }],
    paths: [], labels: [{ x: 27, y: 36, text: 'BID $1.00', color: '#059669' }, { x: 27, y: 52, text: '10 buyers' }, { x: 73, y: 36, text: 'ASK $3.00', color: '#e11d48' }, { x: 73, y: 52, text: '5 sellers' }, { x: 50, y: 84, text: 'Market buy → immediate -$2 loss' }],
  },
  'limit-order': {
    title: 'Order type selection', axis: 'Maximum entry cost', markerLabel: 'Limit', zones: [{ x: 14, y: 20, width: 72, height: 56, color: '#eff6ff' }],
    paths: [{ d: 'M 22 58 L 78 58', color: '#0b66ff', dash: '3 2' }], labels: [{ x: 30, y: 37, text: 'MARKET' }, { x: 50, y: 37, text: 'LIMIT', color: '#0b66ff' }, { x: 70, y: 37, text: 'STOP' }, { x: 50, y: 54, text: 'MAX $1.50' }, { x: 50, y: 69, text: 'Price control, no fill guarantee' }],
  },
  'covered-call-execution': {
    title: 'Covered-call income', axis: 'Stock price', markerLabel: 'Price',
    paths: [{ d: 'M 10 76 L 50 48 L 70 30 L 92 30', color: '#0f766e' }, { d: 'M 10 52 L 92 52', color: '#94a3b8', dash: '3 2' }], labels: [{ x: 35, y: 48, text: '100 shares @ $100' }, { x: 70, y: 24, text: 'Short Call $105' }, { x: 62, y: 65, text: '+$2 premium kept', color: '#059669' }],
  },
}

const spanishScenarioCopy: Record<string, { title: string; axis: string; markerLabel?: string; labels: string[] }> = {
  'house-option': { title: 'Línea de tiempo de la opción a 3 meses', axis: 'Hoy → Vencimiento', markerLabel: 'Línea de tiempo', labels: ['Hoy: prima de -$5k', 'Strike de $500k', 'Casa de $600k', 'Casa de $400k'] },
  'capping-downside': { title: 'Pérdida de la acción vs. la opción', axis: 'Precio de la acción', markerLabel: 'Caída', labels: ['Acción a $100', '$20', 'Piso de la opción: -$500'] },
  'intrinsic-value': { title: 'Límite in-the-money', axis: 'Precio de la acción', markerLabel: 'Precio', labels: ['Strike $50', '$55 → $5 intrínsecos', 'Out of the money'] },
  'insurance-floor': { title: 'Piso de la Put protectora', axis: 'Precio de la acción', markerLabel: 'Acción', labels: ['Strike de la Put: $90', 'Mercado: $70'] },
  'time-decay': { title: 'Deterioro del valor temporal', axis: 'Días hasta el vencimiento', markerLabel: 'Día', labels: ['Día 1: $4.00', 'Día 15: menor valor', 'Día 30'] },
  'seller-obligation': { title: 'Derechos y obligaciones', axis: 'Relación contractual', markerLabel: 'Prima', labels: ['COMPRADOR', 'Obtiene un derecho', 'VENDEDOR', 'Asume una obligación', 'Prima →'] },
  'break-even': { title: 'Equilibrio de una Call larga', axis: 'Precio al vencimiento', markerLabel: 'Precio', labels: ['Strike $100', 'Equilibrio $105', 'Prima de -$5'] },
  'hockey-stick': { title: 'Leyendo el palo de hockey', axis: 'Precio al vencimiento', markerLabel: 'Precio', labels: ['Inflexión = Strike', 'Potencial alcista'] },
  'leverage-engine': { title: 'Rendimiento de acción vs. opción', axis: 'Rendimiento porcentual', markerLabel: 'Comparar', labels: ['ACCIÓN +10%', 'OPCIÓN +400%', '$100 → $110', '$2 → $10'] },
  'contract-exposure': { title: 'Entrada de la orden', axis: '3 × 100 × $1.50', markerLabel: 'Cantidad', labels: ['CANTIDAD  3', 'TIPO  CALL', 'PRECIO  $1.50', 'DÉBITO TOTAL  $450', '1 contrato = 100 acciones'] },
  'short-call-trap': { title: 'Riesgo de una Call corta descubierta', axis: 'Precio de la acción', markerLabel: 'Precio', labels: ['Prima conservada', 'Strike de $50', 'Pérdida ilimitada'] },
  'volatility-expansion': { title: 'Expansión de volatilidad implícita', axis: 'Incertidumbre', markerLabel: 'IV', labels: ['IV 20%', 'IV 60%', 'Acción sin cambios'] },
  'iv-crush': { title: 'IV Crush después de resultados', axis: 'Línea de tiempo del evento', markerLabel: 'IV', labels: ['Antes: IV 60%', 'Después: IV 20%', 'Resultados'] },
  'delta-action': { title: 'Respuesta de Delta', axis: 'Movimiento de $1 del subyacente', markerLabel: 'Acción', labels: ['ACCIÓN +$1.00', 'OPCIÓN +$0.60', 'DELTA 0.60'] },
  'delta-probability': { title: 'Mapa de probabilidad de Delta', axis: 'Distribución futura del precio', markerLabel: 'Strike', labels: ['Strike OTM', 'Δ 0.10 ≈ 10%'] },
  'theta-cliff': { title: 'El precipicio de Theta', axis: 'Días restantes: 90 → 0', markerLabel: 'Día', labels: ['90 días', '30 días', 'Deterioro más rápido'] },
  'vertical-ceiling': { title: 'Bull Call Spread de $100 / $110', axis: 'Precio de la acción', markerLabel: 'Precio', labels: ['Pérdida máxima -$3', 'Larga $100', 'Corta $110'] },
  'spread-cap': { title: 'Ganancia limitada del spread', axis: 'Precio al vencimiento', markerLabel: 'Precio', labels: ['Débito de -$3', 'Máximo +$7 / $700', 'Acción $160'] },
  straddle: { title: 'Long Straddle', axis: 'Precio de la acción', markerLabel: 'Precio', labels: ['Strike de $50', 'Gana si cae mucho', 'Gana si sube mucho'] },
  'iron-condor': { title: 'Corredor de ganancia del Iron Condor', axis: 'Precio de la acción', markerLabel: 'Precio', labels: ['$90', '$110', 'ZONA DE GANANCIA MÁXIMA'] },
  assignment: { title: 'Asignación al vencimiento', axis: 'Cierre del viernes → Fin de semana', markerLabel: 'Cierre', labels: ['Put corta con strike $40', 'La acción cierra en $38', 'Asignación: Compra 100 a $40'] },
  'bid-ask': { title: 'Libro de órdenes ilíquido', axis: 'Costo inmediato de ida y vuelta', markerLabel: 'Spread', labels: ['BID $1.00', '10 compradores', 'ASK $3.00', '5 vendedores', 'Compra a mercado → pérdida inmediata de -$2'] },
  'limit-order': { title: 'Selección del tipo de orden', axis: 'Costo máximo de entrada', markerLabel: 'Límite', labels: ['MERCADO', 'LÍMITE', 'STOP', 'MÁXIMO $1.50', 'Control de precio, sin garantía de ejecución'] },
  'covered-call-execution': { title: 'Ingreso de la Covered Call', axis: 'Precio de la acción', markerLabel: 'Precio', labels: ['100 acciones a $100', 'Call corta de $105', 'Prima de +$2 conservada'] },
}

function ScenarioConceptGraph({ visual }: { visual: OptionsLessonVisualConfig }) {
  const { lang } = useTranslationProvider()
  const [marker, setMarker] = useState(50)
  const baseGraphic = visual.scenario ? scenarioGraphics[visual.scenario] : undefined
  const translatedCopy = lang === 'es' && visual.scenario ? spanishScenarioCopy[visual.scenario] : undefined
  const graphic = baseGraphic && translatedCopy
    ? {
        ...baseGraphic,
        title: translatedCopy.title,
        axis: translatedCopy.axis,
        markerLabel: translatedCopy.markerLabel,
        labels: baseGraphic.labels.map((label, index) => ({ ...label, text: translatedCopy.labels[index] ?? label.text })),
      }
    : baseGraphic

  if (!graphic) return null

  const markerX = 10 + marker * 0.82

  return (
    <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,46,77,0.06)]">
      <div className="mb-4 rounded-2xl border border-[#0b66ff]/15 bg-[#0b66ff]/5 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0b66ff]">{graphic.title}</p>
        <p className="mt-2 text-sm leading-6 text-[#113a63]/72">{visual.description}</p>
      </div>
      <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-4">
        <svg viewBox="0 0 100 100" className="aspect-[1.22/1] h-full w-full" role="img" aria-label={graphic.title}>
          {[20, 40, 60, 80].map((point) => <line key={`h-${point}`} x1="7" y1={point} x2="95" y2={point} stroke="#e5e7eb" strokeWidth="0.35" />)}
          {(graphic.zones ?? []).map((zone, index) => <rect key={index} {...zone} fill={zone.color} rx="2" />)}
          {graphic.paths.map((path, index) => <path key={index} d={path.d} stroke={path.color} strokeWidth="1.35" strokeDasharray={path.dash} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
          <line x1={markerX} y1="8" x2={markerX} y2="88" stroke="#0b66ff" strokeWidth="0.65" opacity="0.55" />
          <circle cx={markerX} cy="88" r="1.8" fill="#0b66ff" />
          {graphic.labels.map((label, index) => <text key={index} x={label.x} y={label.y} textAnchor="middle" fontSize="3.15" fontWeight="600" fill={label.color ?? '#475569'}>{label.text}</text>)}
          <text x="50" y="98" textAnchor="middle" fontSize="3.2" fill="#64748b">{graphic.axis}</text>
        </svg>
        <label className="mt-3 block text-xs font-semibold uppercase tracking-[0.14em] text-[#113a63]/55">
          {graphic.markerLabel ?? 'Explore'}
          <input className="mt-2 block w-full accent-[#0b66ff]" type="range" min="0" max="100" value={marker} onChange={(event) => setMarker(Number(event.target.value))} />
        </label>
      </div>
    </div>
  )
}

function BasicConceptGraph({ visual }: { visual: OptionsLessonVisualConfig }) {
  if (visual.scenario && scenarioGraphics[visual.scenario]) {
    return <ScenarioConceptGraph visual={visual} />
  }

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
      {!visual.description && <p className="mb-4 text-sm leading-6 text-[#113a63]/75">{visual.instruction}</p>}
      {visual.description && (
        <div className="mb-4 rounded-2xl border border-[#0b66ff]/15 bg-[#0b66ff]/5 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0b66ff]">Visual guide</p>
          <p className="mt-2 text-sm leading-6 text-[#113a63]/72">{visual.description}</p>
        </div>
      )}
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  })
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

          <div className="relative mt-8 flex w-full items-center justify-center">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 z-10 rounded-full shadow-md"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="w-full overflow-hidden px-8" ref={emblaRef}>
              <div className="flex">
                {content.modules.map((module, index) => (
                  <div key={module.id} className="flex-[0_0_100%] px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.33%]">
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.3 }}
                      onClick={() => openModule(module.id)}
                      className="h-full w-full overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white text-left shadow-[0_14px_32px_rgba(15,46,77,0.07)] transition-transform hover:-translate-y-1"
                    >
                      <div className="relative h-44 overflow-hidden border-b border-slate-200 bg-[#fbf8f1]">
                        <Image
                          src={module.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-3 p-6">
                        <p className="text-sm font-medium text-[#0b66ff]">{module.level}</p>
                        <h3 className="text-3xl font-semibold leading-tight text-[#2f3136]">{module.title}</h3>
                        <p className="text-base leading-8 text-[#3f4650]">{module.description}</p>
                        <div className="flex items-center justify-between gap-4 pt-2">
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
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 z-10 rounded-full shadow-md"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
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
                      <Link href={formatURL('/resource-center/learning/1', lang)}>
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
                    {selectedModule.steps.map((step) => (
                      <div key={step.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-[#113a63]">{step.title}</p>
                          {completedSteps.includes(step.id) ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-slate-400" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : currentStep ? (
                <>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-semibold leading-tight text-[#113a63]">{currentStep.title}</h3>
                    <p className="text-base leading-8 text-[#113a63]/78">{currentStep.prompt}</p>
                    <p className="text-sm font-medium text-[#113a63]/55">{currentStep.context}</p>
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
