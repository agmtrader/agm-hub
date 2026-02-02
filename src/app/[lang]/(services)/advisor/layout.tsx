import type { Metadata } from "next";
import "../../../globals.css";
import { Header } from "@/components/hub/Header";
import Footer from "@/components/hub/Footer";

export const metadata: Metadata = {
  title: "AGM Advisor",
  description: "Discover the new trading world.",
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
      <Header />
      {children}
      <Footer />
    </div>
  );
}