"use client"

import React, { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

/**
 * InteractiveGridPattern is a component that renders a grid pattern with interactive squares.
 *
 * @param width - The width of each square.
 * @param height - The height of each square.
 * @param squares - The number of squares in the grid. The first element is the number of horizontal squares, and the second element is the number of vertical squares.
 * @param className - The class name of the grid.
 * @param squaresClassName - The class name of the squares.
 */
interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  squares?: [number, number] // [horizontal, vertical]
  className?: string
  squaresClassName?: string
}

/**
 * The InteractiveGridPattern component.
 *
 * @see InteractiveGridPatternProps for the props interface.
 * @returns A React component.
 */
export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [50, 50],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null)
  const [hoveredColorIndex, setHoveredColorIndex] = useState(0)
  const [viewportWidth, setViewportWidth] = useState<number | null>(null)

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth)

    updateViewportWidth()
    window.addEventListener("resize", updateViewportWidth)

    return () => window.removeEventListener("resize", updateViewportWidth)
  }, [])

  const isMobile = viewportWidth !== null && viewportWidth < 640
  const isTablet = viewportWidth !== null && viewportWidth >= 640 && viewportWidth < 1024

  const responsiveWidth = isMobile ? width * 1.8 : isTablet ? width * 1.25 : width
  const responsiveHeight = isMobile ? height * 1.8 : isTablet ? height * 1.25 : height
  const [baseHorizontal, baseVertical] = squares
  const horizontal = isMobile ? Math.max(18, Math.round(baseHorizontal * 0.38)) : isTablet ? Math.round(baseHorizontal * 0.6) : baseHorizontal
  const vertical = isMobile ? Math.max(20, Math.round(baseVertical * 0.42)) : isTablet ? Math.round(baseVertical * 0.65) : baseVertical
  const totalSquares = horizontal * vertical

  useEffect(() => {
    if (!isMobile) return

    setHoveredSquare(0)

    const interval = window.setInterval(() => {
      setHoveredSquare((current) => {
        if (current === null) return 0
        return (current + 1) % totalSquares
      })
    }, 180)

    return () => window.clearInterval(interval)
  }, [isMobile, totalSquares])

  useEffect(() => {
    if (!isMobile && hoveredSquare === null) {
      setHoveredColorIndex(0)
      return
    }

    const interval = window.setInterval(() => {
      setHoveredColorIndex((current) => (current + 1) % 2)
    }, isMobile ? 180 : 450)

    return () => window.clearInterval(interval)
  }, [hoveredSquare, isMobile])

  return (
    <svg
      width={responsiveWidth * horizontal}
      height={responsiveHeight * vertical}
      preserveAspectRatio="none"
      viewBox={`0 0 ${responsiveWidth * horizontal} ${responsiveHeight * vertical}`}
      className={cn(
        "absolute inset-0 h-full w-full border border-gray-400/30",
        className
      )}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * responsiveWidth
        const y = Math.floor(index / horizontal) * responsiveHeight
        const hoveredFillClass =
          hoveredColorIndex === 0 ? "fill-orange-400/50" : "fill-sky-300/45"
        const mobileTrailLength = 4
        const isMobileActiveSquare =
          isMobile &&
          hoveredSquare !== null &&
          Array.from({ length: mobileTrailLength }).some((_, offset) => {
            const trailIndex = (hoveredSquare - offset + totalSquares) % totalSquares
            return trailIndex === index
          })

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={responsiveWidth}
            height={responsiveHeight}
            className={cn(
              "stroke-gray-400/30 transition-all duration-100 ease-in-out [&:not(:hover)]:duration-1000",
              isMobile ? (isMobileActiveSquare ? hoveredFillClass : "fill-transparent") : hoveredSquare === index ? hoveredFillClass : "fill-transparent",
              squaresClassName
            )}
            onMouseEnter={() => {
              if (isMobile) return
              setHoveredSquare(index)
            }}
            onMouseLeave={() => {
              if (isMobile) return
              setHoveredSquare(null)
            }}
          />
        )
      })}
    </svg>
  )
}
