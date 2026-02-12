import type { Metadata } from "next";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "AGM Sitemap",
  description: "Sitemap of all pages on AGM Trader Broker & Advisor.",
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
    </div>
  );
}
