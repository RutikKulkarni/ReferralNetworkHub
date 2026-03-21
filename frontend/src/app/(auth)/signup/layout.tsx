import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign Up | ReferralNetworkHub",
  description: "Create your ReferralNetworkHub account and start connecting",
};

export default function SignupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
