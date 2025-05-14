"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormState } from "@/contexts/UserFormContext";

const jobTypeSchema = z.object({
  jobType: z.string().min(1, { message: "Job type is required" }),
});

const locationSchema = z.object({
  location: z.string().min(1, { message: "Location is required" }),
});

const companySchema = z.object({
  company: z.string().min(1, { message: "Company name is required" }),
});

const preferencesSchema = z.object({
  referralStatus: z.string(),
  termsAccepted: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
  }),
});

type JobTypeValues = z.infer<typeof jobTypeSchema>;
type LocationValues = z.infer<typeof locationSchema>;
type CompanyValues = z.infer<typeof companySchema>;
type PreferencesValues = z.infer<typeof preferencesSchema>;

export function PreferencesForm() {
  const {
    formData,
    updatePreferences,
    addJobType,
    removeJobType,
    addLocation,
    removeLocation,
    addTargetCompany,
    removeTargetCompany,
  } = useFormState();

  // Main preferences form
  const form = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      referralStatus: formData.preferences.referralStatus || "open",
      termsAccepted: formData.preferences.termsAccepted || false,
    },
  });

  // Job type form
  const jobTypeForm = useForm<JobTypeValues>({
    resolver: zodResolver(jobTypeSchema),
    defaultValues: {
      jobType: "",
    },
  });

  // Location form
  const locationForm = useForm<LocationValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      location: "",
    },
  });

  // Company form
  const companyForm = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company: "",
    },
  });

  // Handle preferences form submission (updates on change)
  function onPreferencesChange(data: PreferencesValues) {
    updatePreferences(data);
  }

  // Handle adding a job type
  function onAddJobType(data: JobTypeValues) {
    addJobType(data.jobType);
    jobTypeForm.reset();
  }

  // Handle adding a location
  function onAddLocation(data: LocationValues) {
    addLocation(data.location);
    locationForm.reset();
  }

  // Handle adding a company
  function onAddCompany(data: CompanyValues) {
    addTargetCompany(data.company);
    companyForm.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Set your referral and job preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Referral Status */}
          <Form {...form}>
            <form
              onChange={form.handleSubmit(onPreferencesChange)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="referralStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability for Referrals</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your referral status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open to Referrals</SelectItem>
                        <SelectItem value="selective">
                          Selective (Case by Case)
                        </SelectItem>
                        <SelectItem value="closed">
                          Not Available for Referrals
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This controls whether others can request referrals from
                      you
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms & Conditions */}
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Accept Terms & Conditions</FormLabel>
                      <FormDescription>
                        I agree to the terms of service and privacy policy.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* Job Types */}
          <div>
            <Form {...jobTypeForm}>
              <form
                onSubmit={jobTypeForm.handleSubmit(onAddJobType)}
                className="space-y-4"
              >
                <FormField
                  control={jobTypeForm.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Preferences</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.preferences.jobTypes.map((jobType) => (
                          <div
                            key={jobType}
                            className="flex items-center rounded-full bg-muted px-3 py-1 text-sm"
                          >
                            {jobType}
                            <button
                              type="button"
                              onClick={() => removeJobType(jobType)}
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              aria-label={`Remove ${jobType}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="Add job preference..."
                            {...field}
                          />
                        </FormControl>
                        <Button type="submit">Add</Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          {/* Locations */}
          <div>
            <Form {...locationForm}>
              <form
                onSubmit={locationForm.handleSubmit(onAddLocation)}
                className="space-y-4"
              >
                <FormField
                  control={locationForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Locations</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.preferences.locations.map((location) => (
                          <div
                            key={location}
                            className="flex items-center rounded-full bg-muted px-3 py-1 text-sm"
                          >
                            {location}
                            <button
                              type="button"
                              onClick={() => removeLocation(location)}
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              aria-label={`Remove ${location}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Add location..." {...field} />
                        </FormControl>
                        <Button type="submit">Add</Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          {/* Target Companies */}
          <div>
            <Form {...companyForm}>
              <form
                onSubmit={companyForm.handleSubmit(onAddCompany)}
                className="space-y-4"
              >
                <FormField
                  control={companyForm.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Companies</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.preferences.targetCompanies.map((company) => (
                          <div
                            key={company}
                            className="flex items-center rounded-full bg-muted px-3 py-1 text-sm"
                          >
                            {company}
                            <button
                              type="button"
                              onClick={() => removeTargetCompany(company)}
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              aria-label={`Remove ${company}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Add company..." {...field} />
                        </FormControl>
                        <Button type="submit">Add</Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
