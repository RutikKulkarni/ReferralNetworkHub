"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { X, Plus } from "lucide-react";
import { Skill, Certification, FormValues } from "@/lib/types";

export default function SkillsStep() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");

  const skills = watch("skills") || [];
  const certifications = watch("certifications") || [];

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setValue("skills", [...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: Skill) => {
    setValue(
      "skills",
      skills.filter((s: Skill) => s !== skill)
    );
  };

  const handleAddCertification = () => {
    if (certInput.trim() && !certifications.includes(certInput.trim())) {
      setValue("certifications", [...certifications, certInput.trim()]);
      setCertInput("");
    }
  };

  const handleRemoveCertification = (cert: Certification) => {
    setValue(
      "certifications",
      certifications.filter((c: Certification) => c !== cert)
    );
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <FormField
              control={control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Skills *</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Add a skill (e.g., JavaScript, Project Management)"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={handleAddSkill}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                  <FormDescription>
                    Add your key technical and professional skills
                  </FormDescription>
                  <FormMessage />

                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill: Skill, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          aria-label={`Remove skill ${skill}`}
                          title={`Remove skill ${skill}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={control}
              name="certifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifications or Licenses</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Add a certification (e.g., AWS Certified, PMP)"
                        value={certInput}
                        onChange={(e) => setCertInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCertification();
                          }
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={handleAddCertification}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                  <FormDescription>
                    Add any professional certifications or licenses you hold
                    (optional)
                  </FormDescription>
                  <FormMessage />

                  <div className="flex flex-wrap gap-2 mt-3">
                    {certifications.map(
                      (cert: Certification, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-3 py-1.5 text-sm"
                        >
                          {cert}
                          <button
                            type="button"
                            onClick={() => handleRemoveCertification(cert)}
                            className="ml-2 text-muted-foreground hover:text-foreground"
                            aria-label={`Remove certification ${cert}`}
                            title={`Remove certification ${cert}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    )}
                  </div>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
