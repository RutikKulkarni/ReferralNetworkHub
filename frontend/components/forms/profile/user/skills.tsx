"use client";

import { useState } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormState } from "@/contexts/UserFormContext";

const skillSchema = z.object({
  skill: z.string().min(1, { message: "Skill is required" }),
});

const certificationSchema = z.object({
  certification: z
    .string()
    .min(1, { message: "Certification name is required" }),
});

type SkillValues = z.infer<typeof skillSchema>;
type CertificationValues = z.infer<typeof certificationSchema>;

export function SkillsForm() {
  const {
    formData,
    addSkill,
    removeSkill,
    addCertification,
    removeCertification,
  } = useFormState();

  const skillForm = useForm<SkillValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill: "",
    },
  });

  const certificationForm = useForm<CertificationValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      certification: "",
    },
  });

  // Handle adding a skill
  function onAddSkill(data: SkillValues) {
    addSkill(data.skill);
    skillForm.reset();
  }

  // Handle adding a certification
  function onAddCertification(data: CertificationValues) {
    addCertification(data.certification);
    certificationForm.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills and Expertise</CardTitle>
        <CardDescription>
          Add or update your skills and expertise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Skills Section */}
          <div>
            <Form {...skillForm}>
              <form
                onSubmit={skillForm.handleSubmit(onAddSkill)}
                className="space-y-4"
              >
                <FormField
                  control={skillForm.control}
                  name="skill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Skills</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.skills.skills.map((skill) => (
                          <div
                            key={skill}
                            className="flex items-center rounded-full bg-muted px-3 py-1 text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              aria-label={`Remove ${skill}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Add a skill..." {...field} />
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

          {/* Certifications Section */}
          <div>
            <Form {...certificationForm}>
              <form
                onSubmit={certificationForm.handleSubmit(onAddCertification)}
                className="space-y-4"
              >
                <FormField
                  control={certificationForm.control}
                  name="certification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certifications or Licenses</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.skills.certifications.map((cert) => (
                          <div
                            key={cert}
                            className="flex items-center rounded-full bg-muted px-3 py-1 text-sm"
                          >
                            {cert}
                            <button
                              type="button"
                              onClick={() => removeCertification(cert)}
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              aria-label={`Remove ${cert}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="Add a certification..."
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
        </div>
      </CardContent>
    </Card>
  );
}
