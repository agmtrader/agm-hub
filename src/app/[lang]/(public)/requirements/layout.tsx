import type { Metadata } from "next";
import "../../../globals.css";
import { StaticHeader } from "@/components/hub/Header";
import Footer from "@/components/hub/Footer";

export const metadata: Metadata = {
  title: "AGM Requirements",
  description: "Requirements for opening an AGM account.",
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