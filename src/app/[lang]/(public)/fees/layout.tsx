import type { Metadata } from "next";
import "../../../globals.css";
import { StaticHeader } from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AGM Fees",
  description: "Fees for using an AGM account.",
};

export default function Layout(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  const {
    children
  } = props;

  return (
    <div className="flex flex-col min-h-screen w-full">
      <StaticHeader />
      {children}
      <Footer />
    </div>
  );
}