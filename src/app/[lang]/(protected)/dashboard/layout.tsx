'use client'
import "../../../globals.css";
import Sidebar from "@/components/dashboard/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex h-full w-full scroll-smooth py-10">
        <Sidebar/>
        {children}
    </div>
  )
}