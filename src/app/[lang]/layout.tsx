import { redirect } from "next/navigation"
import "../globals.css"
import { TranslationProvider } from "../TranslationProvider"

export default async function Layout({
  children, params:{lang}
}: Readonly<{
  children: React.ReactNode
  params:{lang:string}
}>) {

  return (
    <div className="h-full w-full flex flex-col">
      <TranslationProvider lang={lang}>
        {children}
      </TranslationProvider>
    </div>
  )
}