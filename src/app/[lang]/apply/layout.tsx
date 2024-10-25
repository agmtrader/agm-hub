import type { Metadata } from "next";
import "../../globals.css";
import FirebaseAuthProvider from "../../../utils/providers/FirebaseAuthProvider";

export const metadata: Metadata = {
  title: "AGM Technology",
  description: "Discover the new trading world.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="h-full w-full flex flex-row">
      <FirebaseAuthProvider>
        <div className="flex flex-col scrollbar-hide h-full w-full scroll-smooth">
          {children}
        </div>
      </FirebaseAuthProvider>
    </div>
  );
}