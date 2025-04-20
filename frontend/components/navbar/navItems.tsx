"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import { cn } from "@/lib/utils";

interface MainNavProps {
  mobile?: boolean;
  className?: string;
}

export function MainNav({ mobile = false, className }: MainNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/jobs", label: "Jobs" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ].filter((link) => !user || link.href !== "/");

  return (
    <nav
      className={cn(
        "flex items-center space-x-4 lg:space-x-6",
        mobile && "flex-col items-start space-x-0 space-y-2",
        className
      )}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === link.href
              ? "text-foreground"
              : "text-muted-foreground",
            mobile && "w-full"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
