// app/(logined-users)/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "A very basic Next.js layout",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />
        <main>{children}</main>
    </div>
        
  );
}
