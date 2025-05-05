"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Add useSearchParams
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
import { Icons } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  emailSchema,
  passwordSchema,
  companyNameSchema,
  userTypeEmailRefinement,
} from "@/lib/auth-validations";
import toast from "react-hot-toast";

const userFormSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: emailSchema,
    password: passwordSchema,
    userType: z.literal("user"),
  })
  .superRefine((data, ctx) => {
    userTypeEmailRefinement(data, ctx);
  });

const recruiterFormSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    companyName: companyNameSchema.refine((val) => val && val.length >= 2, {
      message: "Company name must be at least 2 characters.",
    }),
    email: emailSchema,
    password: passwordSchema,
    userType: z.literal("recruiter"),
  })
  .superRefine((data, ctx) => {
    userTypeEmailRefinement(data, ctx);
  });

type UserFormValues = z.infer<typeof userFormSchema>;
type RecruiterFormValues = z.infer<typeof recruiterFormSchema>;

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [selectedUserType, setSelectedUserType] = useState<
    "user" | "recruiter"
  >("user");
  const { register, error, clearError } = useAuth();

  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userType: "user",
    },
    mode: "onChange",
  });

  const recruiterForm = useForm<RecruiterFormValues>({
    resolver: zodResolver(recruiterFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      password: "",
      userType: "recruiter",
    },
    mode: "onChange",
  });

  const switchUserType = (type: "user" | "recruiter") => {
    setSelectedUserType(type);
    setConfirmPassword("");
    setConfirmPasswordError(null);
  };

  const handleSubmit = async (values: UserFormValues | RecruiterFormValues) => {
    if (confirmPassword !== values.password) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    setConfirmPasswordError(null);
    setIsLoading(true);
    clearError();

    try {
      const userData = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.userType,
        companyName:
          values.userType === "recruiter"
            ? (values as RecruiterFormValues).companyName
            : undefined,
      };

      await register(userData);
      toast.success(
        `You have successfully created a ${values.userType} account!`
      );
      const from = searchParams.get("from") || "/profile";
      router.push(decodeURIComponent(from));
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderNameFields = (form: any) => (
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
  );

  // Render password fields (common to both forms)
  const renderPasswordFields = (form: any) => (
    <>
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
    </>
  );

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Card
          className={cn(
            "cursor-pointer transition-all",
            selectedUserType === "user" && "border-primary bg-primary/10"
          )}
          onClick={() => switchUserType("user")}
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
            selectedUserType === "recruiter" && "border-primary bg-primary/10"
          )}
          onClick={() => switchUserType("recruiter")}
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

      {/* User Registration Form */}
      {selectedUserType === "user" && (
        <Form {...userForm}>
          <form
            onSubmit={userForm.handleSubmit((values) => handleSubmit(values))}
            className="space-y-4"
          >
            {renderNameFields(userForm)}

            <FormField
              control={userForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderPasswordFields(userForm)}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create User Account
            </Button>
          </form>
        </Form>
      )}

      {/* Recruiter Registration Form */}
      {selectedUserType === "recruiter" && (
        <Form {...recruiterForm}>
          <form
            onSubmit={recruiterForm.handleSubmit((values) =>
              handleSubmit(values)
            )}
            className="space-y-4"
          >
            {renderNameFields(recruiterForm)}

            <FormField
              control={recruiterForm.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Batman Tech" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={recruiterForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@company.com" {...field} />
                  </FormControl>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Icons.info className="h-4 w-4" />
                    You must use a work email to get a login.
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderPasswordFields(recruiterForm)}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Recruiter Account
            </Button>
          </form>
        </Form>
      )}

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
