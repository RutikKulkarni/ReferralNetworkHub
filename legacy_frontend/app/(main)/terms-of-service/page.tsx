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

export default function TermsConditionsPage() {
  return (
    <div className="container py-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Terms of Services</h1>
        <p className="text-muted-foreground">
          Our terms govern your use of our platform. Details coming soon.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.post className="h-6 w-6 text-gray-800" />
            Terms of Services Overview
          </CardTitle>
          <CardDescription>
            Understand the rules and guidelines for using our services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-3">
            <Icons.info className="mt-0.5 h-5 w-5 text-gray-800" />
            <div>
              <h3 className="font-medium">Under Development</h3>
              <p className="text-sm text-muted-foreground">
                Our project is in active development. We are carefully drafting
                our Terms of Services to ensure clarity and fairness in how you
                interact with our platform. The complete terms will be available
                soon.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icons.mail className="mt-0.5 h-5 w-5 text-gray-800" />
            <div>
              <h3 className="font-medium">Contact Us</h3>
              <p className="text-sm text-muted-foreground">
                Need clarification or have questions? Contact us at{" "}
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
