import type { Metadata } from "next";
import "../../globals.css";
import FirebaseAuthProvider from "../../FirebaseAuthProvider";
import Footer from "@/components/Footer";

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
    <div className="h-full w-full">
        <FirebaseAuthProvider>
        <div className="bg-background text-background h-full w-full scroll-smooth">
          {children}
        </div>
        </FirebaseAuthProvider>
    </div>
  );
}