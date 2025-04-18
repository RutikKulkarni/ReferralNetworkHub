"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "lucide-react";

export default function ExplorePage() {
  const { user } = useAuth();
  return (
    <div className="container py-6">
      <h1>Explore Opportunities</h1>
      {user ? (
        <>
          <p>
            Welcome, {user.firstName} {user.lastName}!
          </p>
          <p>Explore jobs or connect with recruiters.</p>
        </>
      ) : (
        <p>
          Please <Link href="/login">log in</Link> to explore opportunities.
        </p>
      )}
    </div>
  );
}
