import { StaticHeader } from "@/components/Header";
import "../../globals.css";
import FirebaseAuthProvider from "@/utils/providers/FirebaseAuthProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <FirebaseAuthProvider>
      <div className="flex flex-col scrollbar-hide h-full w-full scroll-smooth">
        <StaticHeader />
        {children}
      </div>
    </FirebaseAuthProvider>
  );
}