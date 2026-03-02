import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";
import { UserSync } from "@/components/user-sync";

const inter = Inter({
  variable: "--font-inter",
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
        className={`${inter.variable} antialiased font-sans`}
      >
        <AuthProvider>
          <UserSync />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
