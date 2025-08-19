'use client'
import "../../../globals.css";
import Sidebar from "@/components/dashboard/Sidebar";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatURL } from "@/utils/language/lang";
import { useTranslationProvider } from "@/utils/providers/TranslationProvider";
import { toast } from "@/hooks/use-toast";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { data: session } = useSession()
  const router = useRouter()
  const { lang } = useTranslationProvider()
  
  if (!session?.user.email?.includes('@agmtechnology.com') && !session?.user.email?.includes('@acobo.com')) {
    router.push(formatURL(`/`, lang))
    toast({
      title: "Access Denied",
      description: "You are not authorized to access this page",
      variant: "destructive",
    })
    return null
  }

  return (
    <div className="flex h-full w-full scroll-smooth">
      <Sidebar/>
      <Separator className="h-full" orientation="vertical" />
      <div className="p-5 w-full h-full">
        {children}
      </div>
    </div>    
  )
}