"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">
          We are committed to protecting your privacy. Details coming soon.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.shield className="h-6 w-6 text-gray-800" />
            Privacy Policy Overview
          </CardTitle>
          <CardDescription>
            Learn how we handle your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-3">
            <Icons.info className="mt-0.5 h-5 w-5 text-gray-800" />
            <div>
              <h3 className="font-medium">Under Development</h3>
              <p className="text-sm text-muted-foreground">
                Our project is currently in the development stage. We are
                working diligently to craft a comprehensive Privacy Policy that
                outlines how we collect, use, and protect your personal
                information. Please check back soon for the full policy.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icons.mail className="mt-0.5 h-5 w-5 text-gray-800" />
            <div>
              <h3 className="font-medium">Contact Us</h3>
              <p className="text-sm text-muted-foreground">
                Have questions about our privacy practices? Reach out to us at{" "}
                <a href="mailto:" className="text-primary hover:underline">
                  mail
                </a>
                .
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
