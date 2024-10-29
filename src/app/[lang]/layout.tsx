import "../globals.css"
import { TranslationProvider } from "../../utils/providers/TranslationProvider"
import { NextAuthProvider } from "../../utils/providers/NextAuthProvider"

export default async function Layout({
  children, params:{lang}
}: Readonly<{
  children: React.ReactNode
  params:{lang:string}
}>) {

  return (
    <NextAuthProvider>
      <TranslationProvider lang={lang}>
        {children}
      </TranslationProvider>
    </NextAuthProvider>
  )
}