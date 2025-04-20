"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function NotFoundPage() {
  const { user } = useAuth();

  // Determine redirect link based on user role
  const getHomeLink = () => {
    if (!user) return "/";

    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "recruiter":
        return "/dashboard";
      case "user":
        return "/jobs";
      default:
        return "/";
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute left-4 top-4">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center text-sm"
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">404</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Page Not Found
          </h2>
          <p className="text-sm text-muted-foreground">
            Sorry, we couldn’t find the page you’re looking for or you don't
            have permission to access it.{" "}
            <Link
              href="/contact"
              className="underline underline-offset-4 hover:text-primary"
            >
              Contact Support
            </Link>
          </p>
          <Button asChild className="w-full">
            <Link href={getHomeLink()}>Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
