import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | ReferralNetworkHub",
  description: "Sign in to your ReferralNetworkHub account",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
