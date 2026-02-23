'use client'
import About from "@/components/hub/main/about/About"
import FAQ from "@/components/hub/main/faq/FAQ"
import Products from "@/components/hub/main/products/Products"
import Title from "@/components/hub/main/title/Title"
import Steps from '@/components/hub/main/steps/Steps'
import GetStarted from '@/components/hub/main/modern-tools/ModernTools'

export default function Home() {
    
  return (
    <div className="flex min-h-screen flex-col">
        
        <section id="title" className="relative py-24">
            <Title />
        </section>

        <section id="about" className="bg-muted/50 py-24">
            <About />
        </section>

        <section id="steps" className="py-24">
            <Steps />
        </section>

        <section id="get-started" className="bg-muted/50 py-32">
            <GetStarted />
        </section>

        <section id="products" className="py-24">
            <Products />
        </section>

    </div>
  )
}
