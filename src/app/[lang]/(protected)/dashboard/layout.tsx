'use client'
import { useSession } from "next-auth/react";
import "../../../globals.css";
import Sidebar from "@/components/dashboard/Sidebar";
import DevelopmentPage from "@/components/misc/DevelopmentPage";
import { FormHeader, Header } from "@/components/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { data: session } = useSession()

  if (session?.user.role !== 'admin') {
    return (
      <DevelopmentPage/>
    )
  }

  return (
    <div className="flex h-full w-full scroll-smooth">
      <Sidebar/>
      <div className="p-5 w-full h-full">
        {children}
      </div>
    </div>
  )
}