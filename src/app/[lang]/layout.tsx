import "../globals.css"
import { TranslationProvider } from "../../utils/providers/TranslationProvider"
import Header from "@/components/hub/Header"
import Footer from "@/components/hub/Footer"

export default async function Layout(
  props: Readonly<{
    children: React.ReactNode
    params:Promise<{lang:string}>
  }>
) {
  const params = await props.params;

  const {
    lang
  } = params;

  const {
    children
  } = props;

  return (
    <div className="flex flex-col min-h-screen w-full">
      <TranslationProvider lang={lang}>
        <Header />
        {children}
        <Footer />
      </TranslationProvider>
    </div>
  )
}