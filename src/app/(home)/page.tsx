"use client"
import Footer from "../../components/Footer"
import Title from "../../components/home/title/Title";
import Introduction from "../../components/home/introduction/Introduction"
import Services from "@/components/home/services/Services";
import FAQ from "@/components/home/faq/FAQ";

import MarketOverview from "@/components/MarketOverview";
import Team from "@/components/home/team/Team";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-y-36">
      <Title />
      <Introduction />
      <Services />
      <Team />
      <FAQ />
      {/*<MarketOverview/>*/}
    </div>
  );
}