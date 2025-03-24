import type { Metadata } from "next";
import "../../../globals.css";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AGM Technology",
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