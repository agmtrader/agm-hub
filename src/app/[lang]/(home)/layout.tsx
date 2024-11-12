import type { Metadata } from "next";
import "../../globals.css";
import { Header } from "@/components/Header";
import FirebaseAuthProvider from "../../../utils/providers/FirebaseAuthProvider";

export const metadata: Metadata = {
  title: "AGM Technology",
  description: "Discover the new trading world.",
};

export default async function Layout(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {

  const {
    children
  } = props;

  return (
    <FirebaseAuthProvider>
      <div className="flex flex-col min-h-screen w-full">
        <Header />
        {children}
      </div>
    </FirebaseAuthProvider>
  );
}