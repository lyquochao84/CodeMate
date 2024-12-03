import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header/page";
// import Footer from "@/components/layout/footer/page";
import { AuthProvider } from "@/contexts/authContext";
import { CodingProvider } from "@/contexts/codingContext";

export const metadata: Metadata = {
  title: "CodeMate",
  description: "A Collaborative Coding Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <CodingProvider>{children}</CodingProvider>
          {/* <Footer /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
