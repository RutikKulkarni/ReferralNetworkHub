"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreferencesValues } from "@/lib/types";

const referralOptions = [
  {
    value: "provide",
    label: "Available to provide referrals",
  },
  {
    value: "receive",
    label: "Looking for job referrals only",
  },
  {
    value: "both",
    label: "Both looking for jobs and able to provide referrals",
  },
];

export default function PreferencesStep() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PreferencesValues>();
  const [locationInput, setLocationInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");

  const preferredLocations = watch("preferredLocations") || [];
  const targetCompanies = watch("targetCompanies") || [];

  const handleAddLocation = () => {
    if (
      locationInput.trim() &&
      !preferredLocations.includes(locationInput.trim())
    ) {
      setValue("preferredLocations", [
        ...preferredLocations,
        locationInput.trim(),
      ]);
      setLocationInput("");
    }
  };

  const handleRemoveLocation = (location: string) => {
    setValue(
      "preferredLocations",
      preferredLocations.filter((l: string) => l !== location)
    );
  };

  const handleAddCompany = () => {
    if (companyInput.trim() && !targetCompanies.includes(companyInput.trim())) {
      setValue("targetCompanies", [...targetCompanies, companyInput.trim()]);
      setCompanyInput("");
    }
  };

  const handleRemoveCompany = (company: string) => {
    setValue(
      "targetCompanies",
      targetCompanies.filter((c: string) => c !== company)
    );
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6 space-y-6">
          <FormField
            control={control}
            name="referralAvailability"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Availability for Referrals *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {referralOptions.map((option) => (
                      <FormItem
                        key={option.value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.value} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Accept Terms & Conditions"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Accept Terms & Conditions *</FormLabel>
                  <FormDescription>
                    I agree to the terms of service and privacy policy.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={control}
              name="preferredLocations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Locations</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Add a location (e.g., New York, Remote)"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddLocation();
                          }
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={handleAddLocation}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                  <FormDescription>
                    Add your preferred work locations (optional)
                  </FormDescription>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {preferredLocations.map(
                      (location: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm"
                        >
                          {location}
                          <button
                            type="button"
                            onClick={() => handleRemoveLocation(location)}
                            className="ml-2 text-muted-foreground hover:text-foreground"
                            aria-label={`Remove ${location}`}
                            title={`Remove ${location}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={control}
              name="targetCompanies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Companies</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Add a company (e.g., Google, Microsoft)"
                        value={companyInput}
                        onChange={(e) => setCompanyInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCompany();
                          }
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={handleAddCompany}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                  <FormDescription>
                    Add companies you're interested in working for (optional)
                  </FormDescription>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {targetCompanies.map((company: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-3 py-1.5 text-sm"
                      >
                        {company}
                        <button
                          type="button"
                          onClick={() => handleRemoveCompany(company)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          aria-label={`Remove ${company}`}
                          title={`Remove ${company}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="jobPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Preferences</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your job preferences (e.g., role type, industry, work environment, salary expectations)"
                    className="min-h-[100px]"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormDescription>
                  Share any additional job preferences not covered elsewhere
                  (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
