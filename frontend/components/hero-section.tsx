"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function HeroSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Get Referred",
      description:
        "Connect with professionals at top companies for job referrals",
      icon: <Icons.briefcase className="h-6 w-6 text-primary" />,
      stats: "100+ active referrers",
    },
    {
      title: "Track Progress",
      description: "Follow your referral journey from request to job offer",
      icon: <Icons.clock className="h-6 w-6 text-primary" />,
      stats: "95% successful referrals",
    },
    {
      title: "Direct Messaging",
      description: "Chat directly with referrers to improve your chances",
      icon: <Icons.message className="h-6 w-6 text-primary" />,
      stats: "24hr average response time",
    },
  ];

  // Auto-cycle through features every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  const companies = [
    { name: "Google", logo: "/logos/google.svg", color: "bg-blue-100" },
    { name: "Microsoft", logo: "/logos/microsoft.svg", color: "bg-green-100" },
    { name: "Amazon", logo: "/logos/amazon.svg", color: "bg-yellow-100" },
    { name: "Meta", logo: "/logos/meta.svg", color: "bg-blue-100" },
    { name: "Apple", logo: "/logos/apple.svg", color: "bg-gray-100" },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/80">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left column - Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="outline"
                className="px-4 py-1.5 bg-primary/10 text-primary border-primary/20 mb-4"
              >
                <Icons.checkCircle className="mr-2 h-4 w-4" />
                Open-Source Referral Platform
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Get <span className="text-primary">Referred</span> to Your Dream
                Company
              </h1>

              <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-lg">
                Connect with professionals, get referrals, and track your
                application journey - all in one platform.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                size="lg"
                className="rounded-md text-base gap-2 group shadow-lg shadow-primary/20"
              >
                <Link href="/signup" className="flex items-center">
                  Get Started
                  <Icons.arrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-md text-base border-primary/20"
              >
                <Link href="/jobs" className="flex items-center">
                  Browse the Jobs
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Icons.buildingSkyscraper className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm font-medium">250+ Companies</p>
                </CardContent>
              </Card>
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Icons.users className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm font-medium">100+ Referrers</p>
                </CardContent>
              </Card>
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Icons.checkCircle className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm font-medium">95% Success Rate</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right column */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="overflow-hidden backdrop-blur-sm border-primary/10 shadow-xl">
              <CardContent className="p-0">
                {/* Tabs Navigation */}
                <div className="flex border-b border-border">
                  {features.map((feature, index) => (
                    <button
                      key={index}
                      className={`flex-1 py-4 px-4 text-sm font-medium transition-colors relative ${
                        activeFeature === index
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setActiveFeature(index)}
                    >
                      {feature.title}
                      {activeFeature === index && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          layoutId="activeTab"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Feature Visualization */}
                <div className="p-6 min-h-[400px] md:min-h-[450px]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {features[activeFeature].icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">
                        {features[activeFeature].title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {features[activeFeature].description}
                      </p>
                    </div>
                  </div>

                  {activeFeature === 0 && (
                    <div className="bg-muted/50 rounded-lg p-6 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Available Referrers</h4>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {features[activeFeature].stats}
                        </Badge>
                      </div>
                      <div className="grid gap-3">
                        {[
                          {
                            name: "Alex Johnson",
                            company: "Google",
                            role: "Senior Engineer",
                          },
                          {
                            name: "Sarah Miller",
                            company: "Microsoft",
                            role: "Product Manager",
                          },
                          {
                            name: "David Chen",
                            company: "Amazon",
                            role: "Tech Lead",
                          },
                        ].map((person, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-background rounded-md p-3 border border-border/50"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {person.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {person.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {person.role} at {person.company}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="h-8">
                              <Icons.externalLink className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFeature === 1 && (
                    <div className="bg-muted/50 rounded-lg p-6 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Referral Tracking</h4>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {features[activeFeature].stats}
                        </Badge>
                      </div>
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute left-1.5 top-1.5 h-full w-0.5 bg-muted-foreground/20" />
                          {[
                            { status: "complete", text: "Referral requested" },
                            {
                              status: "complete",
                              text: "Referrer accepted request",
                            },
                            {
                              status: "active",
                              text: "Referral submitted to company",
                            },
                            { status: "pending", text: "Interview scheduled" },
                            { status: "pending", text: "Offer received" },
                          ].map((step, i) => (
                            <div key={i} className="flex gap-3 relative pb-6">
                              <div
                                className={`w-3 h-3 rounded-full mt-1.5 z-10 ${
                                  step.status === "complete"
                                    ? "bg-primary"
                                    : step.status === "active"
                                    ? "bg-primary border-4 border-primary/20"
                                    : "bg-muted-foreground/30"
                                }`}
                              />
                              <div className="flex-1">
                                <p
                                  className={`text-sm ${
                                    step.status === "pending"
                                      ? "text-muted-foreground"
                                      : "text-foreground"
                                  }`}
                                >
                                  {step.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature === 2 && (
                    <div className="bg-muted/50 rounded-lg p-6 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Direct Messaging</h4>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {features[activeFeature].stats}
                        </Badge>
                      </div>
                      <div className="border border-border rounded-md overflow-hidden">
                        <div className="bg-muted/70 px-4 py-2 border-b border-border">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium">
                              Sarah Miller - Microsoft
                            </p>
                          </div>
                        </div>
                        <div className="p-4 bg-background space-y-3">
                          <div className="flex gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted/50 p-2 rounded-md text-sm max-w-xs">
                              <p>
                                Hi! I'd be happy to refer you for the Senior Dev
                                position.
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <div className="bg-primary/10 p-2 rounded-md text-sm max-w-xs">
                              <p>
                                Thank you! I've attached my resume. Do you need
                                anything else?
                              </p>
                            </div>
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>Y</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted/50 p-2 rounded-md text-sm max-w-xs">
                              <p>
                                That's perfect. I'll submit the referral today
                                and keep you updated!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Floating elements */}
            <motion.div
              className="absolute -bottom-6 -right-6 rounded-full bg-background shadow-lg border border-primary/10 p-3"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Icons.checkCircle className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>
        </div>

        {/* Trusted by section */}
        <motion.div
          className="mt-16 pt-16 border-t border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="text-center mb-8">
            <p className="text-muted-foreground">
              Trusted by professionals from top companies
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            {companies.map((company, i) => (
              <motion.div
                key={i}
                className="text-xl font-bold text-muted-foreground/70 hover:text-foreground transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {company.name}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
