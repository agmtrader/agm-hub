import Title from "../../../components/home/title/Title";
import Introduction from "../../../components/home/introduction/Introduction"
import Services from "@/components/home/services/Services";
import FAQ from "@/components/home/faq/FAQ";

import Team from "@/components/home/team/Team";
import Footer from "@/components/Footer";

export default function Home() {
  
  return (
    <div className="flex flex-col h-full w-full gap-y-20">
      <Title />
      <Introduction />
      <Services />
      <Team />
      <FAQ />
      <Footer />
    </div>
  )
}