"use client";

import Link from "next/link";
import { Icons } from "@/components/icons";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Logo width={120} height={40} />
            </Link>
            <p className="text-sm text-muted-foreground">
              The open-source platform for connecting professionals and
              facilitating job referrals.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/explore"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/messages"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Messages
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 space-y-4 md:col-span-1">
            <h3 className="text-sm font-medium">Contribute</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://github.com/RutikKulkarni/ReferralNetworkHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground"
                >
                  <Icons.github className="h-4 w-4 mr-1" />
                  Want to contribute to ReferralNetworkHub?
                </Link>
              </li>

              <p>
                Built by{" "}
                <Link
                  href="https://www.linkedin.com/in/rutikkulkarni/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-foreground hover:text-muted-foreground"
                >
                  @Rutik_Kulkarni.
                </Link>{" "}
                The open-source platform for connecting professionals.
              </p>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          <p className="mt-2">
            © 2025 ReferralNetworkHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
