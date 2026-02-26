import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";
import { UserSync } from "@/components/user-sync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vidmaxx: AI Video Generator and Scheduler App",
  description: "Vidmaxx is a video generation and scheduling app that uses AI to generate videos and schedule them for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer data-tracker="7f12607e-73a3-409e-991a-3c393ce9e279" data-hosts="vidmaxx.vercel.app" src="https://www.webtracky.com/analytics.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <UserSync />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
