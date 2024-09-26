import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

type Props = {}

const NotFound = (props: Props) => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-y-3">
      <h1 className="text-9xl font-extrabold text-red-600">404</h1>
      <p className="text-2xl font-semibold text-foreground mt-4">Page Not Found</p>
      <p className="text-lg text-subtitle mt-2">Sorry, the page you are looking for does not exist.</p>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}

export default NotFound