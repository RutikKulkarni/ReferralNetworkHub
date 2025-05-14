import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Info, Plus, Trash2, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useFormState, WorkExperience } from "@/contexts/UserFormContext";

// Experience Form Schema
const experienceSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  company: z.string().min(1, { message: "Company name is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional(),
  current: z.boolean().optional(),
  responsibilities: z.string().optional(),
});

// Experience Edit Schema (same as experience schema but with an id)
const experienceEditSchema = experienceSchema.extend({
  id: z.string(),
});

// Professional Form Schema
const professionalSchema = z.object({
  experienceType: z.enum(["experienced", "fresher"]),
  currentTitle: z.string().optional(),
  currentCompany: z.string().optional(),
  industry: z.string().optional(),
  yearsOfExperience: z.string().optional(),
});

type ExperienceValues = z.infer<typeof experienceSchema>;
type ExperienceEditValues = z.infer<typeof experienceEditSchema>;
type ProfessionalValues = z.infer<typeof professionalSchema>;

export function ProfessionalForm() {
  const {
    formData,
    updateProfessional,
    addWorkExperience,
    removeWorkExperience,
    updateWorkExperience,
    addInternship,
    removeInternship,
    updateInternship,
  } = useFormState();
  const [isAddingWorkExperience, setIsAddingWorkExperience] = useState(false);
  const [isAddingInternship, setIsAddingInternship] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<WorkExperience | null>(null);
  const [isEditingWork, setIsEditingWork] = useState(false);
  const [isEditingInternship, setIsEditingInternship] = useState(false);

  // Main professional form
  const form = useForm<ProfessionalValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      experienceType: formData.professional.experienceType || "experienced",
      currentTitle: formData.professional.currentTitle || "",
      currentCompany: formData.professional.currentCompany || "",
      industry: formData.professional.industry || "",
      yearsOfExperience: formData.professional.yearsOfExperience || "",
    },
  });

  // Work experience form
  const workExperienceForm = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      company: "",
      startDate: undefined,
      endDate: undefined,
      current: false,
      responsibilities: "",
    },
  });

  // Internship form
  const internshipForm = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      company: "",
      startDate: undefined,
      endDate: undefined,
      current: false,
      responsibilities: "",
    },
  });

  // Edit experience form
  const editExperienceForm = useForm<ExperienceEditValues>({
    resolver: zodResolver(experienceEditSchema),
    defaultValues: {
      id: "",
      title: "",
      company: "",
      startDate: undefined,
      endDate: undefined,
      current: false,
      responsibilities: "",
    },
  });

  // Watch the experience type to conditionally render sections
  const experienceType = form.watch("experienceType");

  // Handle main form submission (updates on change)
  function onProfessionalChange(data: ProfessionalValues) {
    updateProfessional(data);
  }

  // Handle work experience form submission
  function onAddWorkExperience(data: ExperienceValues) {
    const newExperience: WorkExperience = {
      id: crypto.randomUUID(),
      title: data.title,
      company: data.company,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate
        ? data.endDate.toISOString()
        : data.current
        ? ""
        : "",
      current: data.current,
      responsibilities: data.responsibilities,
    };

    addWorkExperience(newExperience);
    workExperienceForm.reset();
    setIsAddingWorkExperience(false);
  }

  // Handle internship form submission
  function onAddInternship(data: ExperienceValues) {
    const newInternship: WorkExperience = {
      id: crypto.randomUUID(),
      title: data.title,
      company: data.company,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate
        ? data.endDate.toISOString()
        : data.current
        ? ""
        : "",
      current: data.current,
      responsibilities: data.responsibilities,
    };

    addInternship(newInternship);
    internshipForm.reset();
    setIsAddingInternship(false);
  }

  // Handle edit experience form submission
  function onEditExperience(data: ExperienceEditValues) {
    const updatedExperience: Partial<WorkExperience> = {
      title: data.title,
      company: data.company,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate
        ? data.endDate.toISOString()
        : data.current
        ? ""
        : "",
      current: data.current,
      responsibilities: data.responsibilities,
    };

    if (isEditingWork) {
      updateWorkExperience(data.id, updatedExperience);
    } else {
      updateInternship(data.id, updatedExperience);
    }

    editExperienceForm.reset();
    setEditingExperience(null);
    setIsEditingWork(false);
    setIsEditingInternship(false);
  }

  // Start editing an experience
  function startEditingExperience(experience: WorkExperience, isWork: boolean) {
    setEditingExperience(experience);
    setIsEditingWork(isWork);
    setIsEditingInternship(!isWork);

    editExperienceForm.reset({
      id: experience.id,
      title: experience.title,
      company: experience.company,
      startDate: experience.startDate
        ? new Date(experience.startDate)
        : undefined,
      endDate: experience.endDate ? new Date(experience.endDate) : undefined,
      current: experience.current,
      responsibilities: experience.responsibilities,
    });
  }

  // Delete an experience
  function deleteExperience(id: string, isWork: boolean) {
    if (isWork) {
      removeWorkExperience(id);
    } else {
      removeInternship(id);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Information</CardTitle>
        <CardDescription>Update your professional details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onChange={form.handleSubmit(onProfessionalChange)}
            className="space-y-6"
          >
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="experienceType"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Experience Level</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="experienced" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Experienced
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="fresher" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Fresher
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                If you're experienced but not working, fill in
                                'Industry' & 'Years of Experience' only. Enter
                                'NA' for job title, company name, etc.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {experienceType === "experienced" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="currentTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Job Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Senior Software Engineer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="TechCorp Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technology">
                              Technology
                            </SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="healthcare">
                              Healthcare
                            </SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">
                              Manufacturing
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
                    name="yearsOfExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select years" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 year</SelectItem>
                            <SelectItem value="2">2 years</SelectItem>
                            <SelectItem value="3">3 years</SelectItem>
                            <SelectItem value="4">4 years</SelectItem>
                            <SelectItem value="5">5 years</SelectItem>
                            <SelectItem value="6">6 years</SelectItem>
                            <SelectItem value="7">7 years</SelectItem>
                            <SelectItem value="8">8 years</SelectItem>
                            <SelectItem value="9">9 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Work History Section */}
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Label>Work History</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Add your previous work experiences. You can add
                            multiple entries.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-4">
                    {/* List of work experiences */}
                    {formData.professional.workHistory.map((experience) => (
                      <div
                        key={experience.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">
                            {experience.title} at {experience.company}
                          </h3>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                startEditingExperience(experience, true)
                              }
                            >
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() =>
                                deleteExperience(experience.id, true)
                              }
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(experience.startDate).getFullYear()} -
                          {experience.current
                            ? " Present"
                            : experience.endDate
                            ? ` ${new Date(experience.endDate).getFullYear()}`
                            : ""}
                          {experience.responsibilities && (
                            <span className="block mt-1">
                              {experience.responsibilities}
                            </span>
                          )}
                        </p>
                      </div>
                    ))}

                    {/* Add work experience form */}
                    {isAddingWorkExperience ? (
                      <div className="rounded-lg border p-4">
                        <Form {...workExperienceForm}>
                          <form
                            onSubmit={workExperienceForm.handleSubmit(
                              onAddWorkExperience
                            )}
                            className="space-y-4"
                          >
                            <FormField
                              control={workExperienceForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Job Title</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., Software Developer"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={workExperienceForm.control}
                              name="company"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., Tech Solutions Inc."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={workExperienceForm.control}
                                name="startDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Start Date</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "pl-3 text-left font-normal",
                                              !field.value &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              format(field.value, "PPP")
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <Calendar
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={workExperienceForm.control}
                                name="current"
                                render={({ field }) => (
                                  <FormItem className="flex items-end space-x-2">
                                    <FormControl>
                                      <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="h-4 w-4 rounded border-gray-300"
                                      />
                                    </FormControl>
                                    <FormLabel>I currently work here</FormLabel>
                                  </FormItem>
                                )}
                              />
                            </div>

                            {!workExperienceForm.watch("current") && (
                              <FormField
                                control={workExperienceForm.control}
                                name="endDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>End Date</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "pl-3 text-left font-normal",
                                              !field.value &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              format(field.value, "PPP")
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <Calendar
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            <FormField
                              control={workExperienceForm.control}
                              name="responsibilities"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Responsibilities and Achievements (Optional)
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Describe your key responsibilities and achievements in this role"
                                      rows={3}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex justify-end space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddingWorkExperience(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">Save</Button>
                            </div>
                          </form>
                        </Form>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingWorkExperience(true)}
                        className="w-full"
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Work Experience
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}

            {experienceType === "fresher" && (
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <Label>Internship History (Optional)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Add any internships or part-time work experience you
                          may have.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="space-y-4">
                  {/* List of internships */}
                  {formData.professional.internships.map((internship) => (
                    <div key={internship.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">
                          {internship.title} at {internship.company}
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              startEditingExperience(internship, false)
                            }
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              deleteExperience(internship.id, false)
                            }
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(internship.startDate).toLocaleDateString()} -
                        {internship.current
                          ? " Present"
                          : internship.endDate
                          ? ` ${new Date(
                              internship.endDate
                            ).toLocaleDateString()}`
                          : ""}
                      </p>
                      {internship.responsibilities && (
                        <p className="mt-2 text-sm">
                          {internship.responsibilities}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Add internship form */}
                  {isAddingInternship ? (
                    <div className="rounded-lg border p-4">
                      <Form {...internshipForm}>
                        <form
                          onSubmit={internshipForm.handleSubmit(
                            onAddInternship
                          )}
                          className="space-y-4"
                        >
                          <FormField
                            control={internshipForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Internship Title</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Software Development Intern"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={internshipForm.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Tech Solutions Inc."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={internshipForm.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Start Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "pl-3 text-left font-normal",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={internshipForm.control}
                              name="current"
                              render={({ field }) => (
                                <FormItem className="flex items-end space-x-2">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="h-4 w-4 rounded border-gray-300"
                                    />
                                  </FormControl>
                                  <FormLabel>I currently work here</FormLabel>
                                </FormItem>
                              )}
                            />
                          </div>

                          {!internshipForm.watch("current") && (
                            <FormField
                              control={internshipForm.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>End Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "pl-3 text-left font-normal",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          <FormField
                            control={internshipForm.control}
                            name="responsibilities"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Responsibilities and Achievements (Optional)
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Describe your key responsibilities and achievements in this internship"
                                    rows={3}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsAddingInternship(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingInternship(true)}
                      className="w-full"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Internship
                    </Button>
                  )}
                </div>
              </div>
            )}
          </form>
        </Form>

        {/* Edit Experience Modal */}
        {editingExperience && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg rounded-lg bg-background p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Edit {isEditingWork ? "Work Experience" : "Internship"}
              </h3>

              <Form {...editExperienceForm}>
                <form
                  onSubmit={editExperienceForm.handleSubmit(onEditExperience)}
                  className="space-y-4"
                >
                  <FormField
                    control={editExperienceForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Software Developer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editExperienceForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Tech Solutions Inc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editExperienceForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editExperienceForm.control}
                      name="current"
                      render={({ field }) => (
                        <FormItem className="flex items-end space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </FormControl>
                          <FormLabel>I currently work here</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  {!editExperienceForm.watch("current") && (
                    <FormField
                      control={editExperienceForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={editExperienceForm.control}
                    name="responsibilities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Responsibilities and Achievements (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your key responsibilities and achievements in this role"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingExperience(null);
                        setIsEditingWork(false);
                        setIsEditingInternship(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
