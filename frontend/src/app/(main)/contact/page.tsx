"use client";

import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { ContactForm } from "@/features/contact";
import { useSendContactMessage } from "@/hooks/useContactQueries";

export default function ContactPage() {
  const { user } = useAuth();
  const sendContactMessage = useSendContactMessage();

  const handleSubmit = async (data: Parameters<typeof sendContactMessage.mutateAsync>[0]) => {
    await sendContactMessage.mutateAsync(data, {
      onSuccess: () => {
        toast.success("Message sent! We'll get back to you soon.");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send message. Please try again.");
      },
    });
  };

  return (
    <div className="container py-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground">
          Have a question or want to get in touch? We&apos;d love to hear from
          you.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we&apos;ll get back to you as soon as
              possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm
              onSubmit={handleSubmit}
              defaultValues={{
                firstName: user?.firstName ?? "",
                lastName: user?.lastName ?? "",
                email: user?.email ?? "",
              }}
              disabled={!!user}
            />
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Icons.mail className="h-5 w-5 text-muted-foreground" />
                <a
                  href="mailto:rutikkulkarni2001@gmail.com"
                  className="text-sm hover:underline"
                >
                  rutikkulkarni2001@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Icons.globe className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">ReferralNetworkHub</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">How do I request a referral?</h4>
                <p className="text-sm text-muted-foreground">
                  Browse the explore page to find professionals in your target
                  company and click &quot;Ask for Referral&quot; on their
                  profile.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Is this platform free?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! ReferralNetworkHub is free for job seekers. We believe in
                  making professional connections accessible.
                </p>
              </div>
              <div>
                <h4 className="font-medium">How do I become a referrer?</h4>
                <p className="text-sm text-muted-foreground">
                  Sign up as an Employee Referrer and start helping others
                  connect with opportunities at your company.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
