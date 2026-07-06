import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | ReferralNetworkHub",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
