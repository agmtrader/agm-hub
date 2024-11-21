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
    <div className="flex flex-col h-full w-full scroll-smooth">
        <FormHeader/>
        <div className="flex flex-row h-full w-full">
          <Sidebar/>
          {children}
        </div>
    </div>
  )
}