import type { Metadata } from "next";
import "../../../globals.css";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AGM Downloads",
  description: "Download the latest AGM software and documentation.",
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