"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Edit, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormState, Education } from "@/contexts/UserFormContext";

const educationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, { message: "Degree is required" }),
  institution: z.string().min(1, { message: "Institution name is required" }),
  field: z.string().min(1, { message: "Field of study is required" }),
  year: z.string().min(1, { message: "Graduation year is required" }),
});

type EducationValues = z.infer<typeof educationSchema>;

export function EducationForm() {
  const { formData, addEducation, removeEducation, updateEducation } =
    useFormState();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: "",
      institution: "",
      field: "",
      year: new Date().getFullYear().toString(),
    },
  });

  // Handle adding new education
  function onSubmit(data: EducationValues) {
    if (isEditing && editId) {
      updateEducation(editId, data);
      setIsEditing(false);
      setEditId(null);
    } else {
      const newEducation: Education = {
        id: crypto.randomUUID(),
        degree: data.degree,
        institution: data.institution,
        field: data.field,
        year: data.year,
      };
      addEducation(newEducation);
    }

    form.reset();
    setIsAdding(false);
  }

  // Start editing an education item
  function handleEdit(education: Education) {
    setIsEditing(true);
    setEditId(education.id);
    setIsAdding(true);

    form.reset({
      degree: education.degree,
      institution: education.institution,
      field: education.field,
      year: education.year,
    });
  }

  // Cancel adding/editing
  function handleCancel() {
    setIsAdding(false);
    setIsEditing(false);
    setEditId(null);
    form.reset();
  }

  // Delete an education item
  function handleDelete(id: string) {
    removeEducation(id);
  }

  // Current year for the year dropdown
  const currentYear = new Date().getFullYear();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Add or update your education</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* List of education items */}
          {formData.education.map((education) => (
            <div key={education.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {education.degree} in {education.field} at{" "}
                  {education.institution}
                </h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(education)}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(education.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{education.year}</p>
            </div>
          ))}

          {/* Add/Edit education form */}
          {isAdding ? (
            <div className="rounded-lg border p-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highest Degree Attained</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select degree" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high-school">
                              High School Diploma
                            </SelectItem>
                            <SelectItem value="associate">
                              Associate's Degree
                            </SelectItem>
                            <SelectItem value="bachelor">
                              Bachelor's Degree
                            </SelectItem>
                            <SelectItem value="master">
                              Master's Degree
                            </SelectItem>
                            <SelectItem value="doctorate">
                              Doctorate/PhD
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University/Institution Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Stanford University"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="field"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Computer Science"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Year</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 30 }, (_, i) => {
                              const year = currentYear - i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEditing ? "Save Changes" : "Add Education"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdding(true)}
              className="w-full"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Education
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
