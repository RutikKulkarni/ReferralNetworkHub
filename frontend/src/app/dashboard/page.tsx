"use client";

import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function DashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.firstName}!</CardTitle>
            <CardDescription>
              You are logged in as {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">User Type:</span> {user?.userType}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email Verified:</span>{" "}
                {user?.isEmailVerified ? "✅ Yes" : "❌ No"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Account Status:</span>{" "}
                {user?.isActive ? "✅ Active" : "❌ Inactive"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Info</CardTitle>
            <CardDescription>
              Cookie-based secure authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">✅ Refresh Token: HttpOnly Cookie</p>
              <p className="text-sm">✅ Access Token: In-Memory</p>
              <p className="text-sm">✅ XSS Protection: Enabled</p>
              <p className="text-sm">✅ CSRF Protection: Enabled</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Explore the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
              <Button variant="outline" className="w-full">
                Browse Jobs
              </Button>
              <Button variant="outline" className="w-full">
                Get Referrals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
