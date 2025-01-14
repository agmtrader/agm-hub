import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import LoadingComponent from './LoadingComponent'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  children?: React.ReactNode
}

const LoadingCard = ({className, children}: Props) => {
  return (
    <Card className={cn('w-full h-full flex items-center justify-center', className)}>
        <CardContent className='flex items-center justify-center gap-2'>
          <LoadingComponent className='w-64 h-64'>
            {children}
          </LoadingComponent>
        </CardContent>
    </Card>
  )
}

export default LoadingCard