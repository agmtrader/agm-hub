import type { Metadata } from "next";
import "../../../globals.css";
import { Header } from "@/components/Header";
import { TranslationProvider } from "@/utils/providers/TranslationProvider";

export const metadata: Metadata = {
  title: "AGM Trader",
  description: "Discover the new trading world.",
};

export default function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <TranslationProvider lang={params.lang}>
      <div className="flex flex-col min-h-screen w-full">
        <Header />
        <main className="flex-grow">
            {children}
          </main>
      </div>
    </TranslationProvider>
  );
}