"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/navbar/navItems";
import { ModeToggle } from "@/components/button/theme-toggle";
import { UserNav } from "@/components/navbar/userNav";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/logo";

export function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo width={100} height={20} />
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex md:justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
          <MainNav />
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop: Theme toggle and User or Login buttons */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <ModeToggle />

            {user ? (
              <UserNav />
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link
                    href="/login"
                    className={cn(
                      pathname === "/login" &&
                        "bg-muted font-medium text-foreground"
                    )}
                  >
                    Login
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link
                    href="/signup"
                    className={cn(
                      pathname === "/signup" &&
                        "bg-background font-medium text-foreground"
                    )}
                  >
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile: User profile or empty div as placeholder */}
          <div className="md:hidden">
            {user ? (
              <UserNav />
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile: Menu button with animation */}
          <button
            className="flex items-center justify-center md:hidden transition-transform duration-200 ease-in-out hover:scale-110"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="animate-in zoom-in duration-200" />
            ) : (
              <Menu className="animate-in zoom-in duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu with slide-down animation */}
      {showMobileMenu && (
        <div className="container pb-4 md:hidden animate-in slide-in-from-top duration-300 ease-out">
          <MainNav mobile />

          <div className="mt-4 flex items-center animate-in fade-in duration-500 delay-100">
            <span className="text-sm mr-2">Theme:</span>
            <ModeToggle />
          </div>

          <div className="mt-4 flex flex-col space-y-2 animate-in fade-in duration-500 delay-200">
            {user ? (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 mr-2"></div>
                  <div>
                    <p className="text-sm font-medium">{`${user.firstName} ${user.lastName}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-colors duration-200"
                  onClick={() => {}}
                >
                  Profile
                </Button>
              </div>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="transition-transform hover:translate-x-1 duration-200"
                >
                  <Link
                    href="/login"
                    className={cn(
                      pathname === "/login" &&
                        "bg-muted font-medium text-foreground"
                    )}
                  >
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="transition-transform hover:translate-x-1 duration-200"
                >
                  <Link
                    href="/signup"
                    className={cn(
                      pathname === "/signup" &&
                        "bg-background font-medium text-foreground"
                    )}
                  >
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
