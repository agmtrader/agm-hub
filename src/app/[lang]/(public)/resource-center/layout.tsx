import type { Metadata } from 'next'
import '../../../globals.css'

export const metadata: Metadata = {
  title: 'AGM Resource Center',
  description: 'Browse resources for FAQs, account management, trading, and learning.',
}

export default function Layout(
  props: Readonly<{
    children: React.ReactNode
  }>
) {
  const { children } = props

  return <div className="flex flex-col w-full">{children}</div>
}
