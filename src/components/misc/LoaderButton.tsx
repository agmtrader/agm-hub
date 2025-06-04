import { Loader2 } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

type Props = {
    isLoading: boolean,
    text: string,
}

const LoaderButton = ({isLoading, text}: Props) => {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
        <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {text}
        </>
        ) : (
            text
        )}
  </Button>
  )
}

export default LoaderButton