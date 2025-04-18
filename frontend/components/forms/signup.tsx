"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  emailSchema,
  passwordSchema,
  userTypeSchema,
  companyNameSchema,
  userTypeEmailRefinement,
} from "@/lib/auth-validations";

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: emailSchema,
    password: passwordSchema,
    userType: userTypeSchema,
    companyName: companyNameSchema,
  })
  .superRefine((data, ctx) => {
    userTypeEmailRefinement(data, ctx);
    if (data.userType === "recruiter" && !data.companyName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyName"],
        message: "Company name is required for recruiters.",
      });
    }
  });

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [selectedUserType, setSelectedUserType] = useState<
    "user" | "recruiter"
  >("user");
  const { signup } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userType: "user",
      companyName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (confirmPassword !== values.password) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    setConfirmPasswordError(null);
    setIsLoading(true);

    try {
      await signup(
        `${values.firstName} ${values.lastName}`,
        values.email,
        values.password,
        values.userType,
        values.userType === "recruiter" ? values.companyName : undefined
      );
      toast({
        title: "Account created!",
        description: "You have successfully created an account.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Rutik" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Kulkarni" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {selectedUserType === "recruiter" && (
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError(null);
                }}
              />
            </FormControl>
            {confirmPasswordError && (
              <p className="text-sm font-medium text-destructive">
                {confirmPasswordError}
              </p>
            )}
          </FormItem>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Account
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
    </div>
  );
}
