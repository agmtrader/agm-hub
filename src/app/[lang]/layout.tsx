import { redirect } from "next/navigation"
import "../globals.css"
import { TranslationProvider } from "../../utils/TranslationProvider"
import { NextAuthProvider } from "../../utils/NextAuthProvider"

export default async function Layout({
  children, params:{lang}
}: Readonly<{
  children: React.ReactNode
  params:{lang:string}
}>) {

  return (
    <div className="h-full w-full">
      <NextAuthProvider>
        <TranslationProvider lang={lang}>
          {children}
        </TranslationProvider>
      </NextAuthProvider>
    </div>
  )
}