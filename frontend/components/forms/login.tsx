"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Icons } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  emailSchema,
  passwordSchema,
  userTypeSchema,
  userTypeEmailRefinement,
} from "@/lib/auth-validations";

const formSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    userType: userTypeSchema,
  })
  .superRefine(userTypeEmailRefinement);

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<
    "user" | "recruiter"
  >("user");
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: "user",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    toast.promise(
      login(values.email, values.password, values.userType)
        .then(() => {
          router.push("/");
        })
        .finally(() => setIsLoading(false)),
      {
        loading: "Logging in...",
        success: "You have successfully logged in!",
        error: (err: Error) =>
          err?.message || "Something went wrong. Please try again.",
      }
    );
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am:</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-4">
                    <Card
                      className={cn(
                        "cursor-pointer transition-all",
                        field.value === "user" && "border-primary bg-primary/10"
                      )}
                      onClick={() => {
                        field.onChange("user");
                        setSelectedUserType("user");
                      }}
                    >
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h3 className="font-semibold">User</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Looking for job opportunities
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className={cn(
                        "cursor-pointer transition-all",
                        field.value === "recruiter" &&
                          "border-primary bg-primary/10"
                      )}
                      onClick={() => {
                        field.onChange("recruiter");
                        setSelectedUserType("recruiter");
                      }}
                    >
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h3 className="font-semibold">Recruiter</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Hiring for my company
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      selectedUserType === "recruiter"
                        ? "name@company.com"
                        : "name@gmail.com"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" disabled={isLoading}>
          <Icons.gitHub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" disabled={isLoading}>
          <Icons.twitter className="mr-2 h-4 w-4" />
          Twitter
        </Button>
      </div>
      <div className="text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-sm underline underline-offset-4 hover:text-primary"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
