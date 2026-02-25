import type { Metadata } from "next";
import "../../../../globals.css";
import Footer from "@/components/hub/Footer";

export const metadata: Metadata = {
  title: "AGM Trader Pro Download",
  description: "Download the latest AGM Trader Pro software and documentation.",
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
      {children}
      <Footer />
    </div>
  );
}