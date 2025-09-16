import type { Metadata } from "next";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "AGM Account Application",
  description: "Start your trading journey with AGM.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex flex-col h-full w-full scroll-smooth">
      {children}
    </div>
  );
}