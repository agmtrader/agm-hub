'use client'
import { useSession } from "next-auth/react";
import "../../../globals.css";
import Sidebar from "@/components/dashboard/Sidebar";
import RoleProvider from "@/utils/providers/RoleProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <RoleProvider>
      <div className="flex h-full w-full scroll-smooth">
        <Sidebar/>
        <div className="p-5 w-full h-full">
          {children}
        </div>
      </div>
    </RoleProvider>
  )

}