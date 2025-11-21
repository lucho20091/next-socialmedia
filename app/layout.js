import "aos/dist/aos.css";
import { Geist, Geist_Mono } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GetInfo from "@/components/GetInfo";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import HasSeenPopUp from "@/components/HasSeenPopUp";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SMedia",
  description:
    "Share videos, images, like, and comment. Built with Next.js, Prisma, and Stack Auth.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-neutral-950 overflow-x-hidden`}
      >
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Navbar />
              <HasSeenPopUp />
              {children}
              <GetInfo />
            </ThemeProvider>
          </StackTheme>
        </StackProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
