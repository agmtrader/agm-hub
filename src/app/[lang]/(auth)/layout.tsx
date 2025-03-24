import { StaticHeader } from "@/components/Header";
import "../../globals.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex flex-col scrollbar-hide h-full w-full scroll-smooth">
      <StaticHeader />
      {children}
    </div>
  );
}