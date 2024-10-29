import type { Metadata } from "next";
import "../../../globals.css";
import FirebaseAuthProvider from "../../../../utils/providers/FirebaseAuthProvider";

export const metadata: Metadata = {
  title: "AGM Create Account",
  description: "Create Account",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <FirebaseAuthProvider>
      <div className="flex flex-col scrollbar-hide h-full w-full scroll-smooth">
        {children}
      </div>
    </FirebaseAuthProvider>
  );
}