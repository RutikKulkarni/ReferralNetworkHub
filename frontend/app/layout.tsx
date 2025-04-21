import type React from "react";
import { Inter as FontSans } from "next/font/google"; // ✅ use Inter instead of Mona_Sans
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";

const fontInter = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Referral Network Hub",
  description:
    "Connect with professionals and get referrals for your dream job",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontInter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                // background: "hsl(var(--popover))",
                // color: "hsl(var(--popover-foreground))",
                // border: "1px solid hsl(var(--border))",
                // borderRadius: "var(--radius)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
