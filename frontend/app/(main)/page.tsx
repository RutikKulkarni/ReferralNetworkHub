import Link from "next/link";
import { ArrowRight, CheckCircle2, Network, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeroSection } from "@/components/hero-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
    </div>
  );
}
