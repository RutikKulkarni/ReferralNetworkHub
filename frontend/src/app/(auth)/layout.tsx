"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add authentication redirect logic like legacy
  // const { user, loading } = useAuth();
  // Redirect authenticated users away from auth pages

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
    </div>
  );
}
