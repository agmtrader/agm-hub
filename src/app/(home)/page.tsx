"use client"
import Footer from "../../components/home/Footer"
import Title from "../../components/home/title/Title";
import Introduction from "../../components/home/introduction/Introduction"
import Services from "@/components/home/services/Services";
import FAQ from "@/components/home/faq/FAQ";

import MarketOverview from "@/components/home/MarketOverview";
import Team from "@/components/home/team/Team";
import { useSession } from "next-auth/react";

export default function Home() {
  const {data:session} = useSession()
  console.log(session)
  return (
    <div className="flex flex-col justify-center items-center h-[100%] w-[100%] gap-y-36">
      <Title />
      <Introduction />
      <Services />
      <Team />
      <FAQ />
      <Footer />
      {/*<MarketOverview/>*/}
    </div>
  );
}