"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";

export default function ContactPage() {
  const { user } = useAuth();

  return (
    <div className="container py-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      First name
                    </label>
                    <Input
                      id="first-name"
                      placeholder="Enter your first name"
                      value={user ? user.firstName : ""}
                      disabled={!!user}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      Last name
                    </label>
                    <Input
                      id="last-name"
                      placeholder="Enter your last name"
                      value={user ? user.lastName : ""}
                      disabled={!!user}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={user ? user.email : ""}
                    disabled={!!user}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="partnership">
                        Partnership Opportunities
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message"
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={true}>
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Here are the different ways you can reach us.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Icons.mail className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    <a
                      href="mailto:rutikkulkarni2001@gmail.com"
                      className="hover:underline"
                    >
                      Write an email
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">How do I request a referral?</h3>
                <p className="text-sm text-muted-foreground">
                  You can request a referral by connecting with a professional
                  on our platform and using the "Request Referral" button on
                  their profile.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">
                  Is ReferralNetworkHub free to use?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes, basic features are free. We also offer premium plans with
                  additional features for job seekers and recruiters.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">How do I become a referrer?</h3>
                <p className="text-sm text-muted-foreground">
                  Simply create an account, complete your profile with your
                  current company information, and set your referral
                  preferences.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href="/faq"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all FAQs →
                </Link>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
