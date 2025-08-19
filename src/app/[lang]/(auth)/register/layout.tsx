import type { Metadata } from "next";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "AGM Registration",
  description: "Register for an AGM User",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex flex-col scrollbar-hide h-full w-full scroll-smooth">
      {children}
    </div>
  );
}