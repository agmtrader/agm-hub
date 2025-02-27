'use client'
import "../../../globals.css";
import Sidebar from "@/components/dashboard/Sidebar";
import RoleProvider from "@/utils/providers/RoleProvider";
import { Separator } from "@/components/ui/separator";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <RoleProvider>
      <div className="flex h-full w-full scroll-smooth">
        <Sidebar/>
        <Separator className="h-full" orientation="vertical" />
        <div className="p-5 w-full h-full">
          {children}
        </div>
      </div>
    </RoleProvider>
  )

}