import type { Metadata } from "next";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "AGM Risk Profile",
  description: "Complete your personalized risk profile and receive a tailored investment proposal. We use your goals and risk tolerance to recommend the best strategy for you using real time market data.",
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