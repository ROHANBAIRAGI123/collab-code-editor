import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import NavigationHeader from "@/components/NavigationHeader";
import { Toaster } from "react-hot-toast";
import Header from "@/app/(root)/_components/Header";
import Home from "@/app/(root)/page"

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Code Craft",
  description: "Share and run code snippets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(children);
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={` antialiased min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 flex flex-col`}
        >
          {/* <Header>
            <NavigationHeader>

            </NavigationHeader>
          </Header>     */}
          <Home /> 

          <Footer />

          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

// https://emkc.org/api/v2/piston/runtimes