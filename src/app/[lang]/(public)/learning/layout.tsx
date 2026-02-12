import type { Metadata } from "next";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "AGM Learning Center",
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
    <div className="flex flex-col w-full">
      {children}
    </div>
  );
}