"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {user && (
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          {user.companyName && (
            <p>
              <strong>Company:</strong> {user.companyName}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
