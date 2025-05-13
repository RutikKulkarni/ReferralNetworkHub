"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ArrowLeft, Upload, Info, Trash2 } from "lucide-react";

export default function ProfileEditPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [experienceType, setExperienceType] = useState("experienced");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      if (file.size <= 2 * 1024 * 1024) {
        // 2MB max
        setResumeFile(file);
      } else {
        alert("File size exceeds 2MB limit");
      }
    } else {
      alert("Please upload a DOC, DOCX, or PDF file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      if (file.size <= 2 * 1024 * 1024) {
        // 2MB max
        setResumeFile(file);
      } else {
        alert("File size exceeds 2MB limit");
      }
    } else {
      alert("Please upload a DOC, DOCX, or PDF file");
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to profile</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="mb-6 grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                  <div className="relative">
                    <Image
                      src={
                        profileImage || "/placeholder.svg?height=128&width=128"
                      }
                      alt="Profile Picture"
                      width={128}
                      height={128}
                      className="rounded-full object-cover"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full bg-background"
                    >
                      <label htmlFor="profile-image" className="cursor-pointer">
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Upload new photo</span>
                        <input
                          id="profile-image"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                        />
                      </label>
                    </Button>
                  </div>
                  <div className="w-full space-y-2">
                    <p className="text-sm font-medium">Profile Photo</p>
                    <p className="text-xs text-muted-foreground">
                      Upload a clear, professional photo. Square images work
                      best.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <label
                          htmlFor="profile-image-btn"
                          className="cursor-pointer"
                        >
                          Upload New
                          <input
                            id="profile-image-btn"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                          />
                        </label>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProfileImage(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" defaultValue="Alex Johnson" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="alex.johnson@example.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location (City, Country)</Label>
                    <Input id="location" defaultValue="San Francisco, CA" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Gender</Label>
                  <RadioGroup defaultValue="male" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="github">
                      GitHub Profile URL (Optional)
                    </Label>
                    <Input
                      id="github"
                      type="url"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="website">Website URL (Optional)</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Resume</Label>
                  <div
                    className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {resumeFile ? (
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="rounded bg-primary/10 p-2">
                            <Upload className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {resumeFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setResumeFile(null)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
                        <p className="mb-1 text-sm font-medium">
                          Choose Resume or drag & drop it here
                        </p>
                        <p className="mb-4 text-xs text-muted-foreground">
                          DOC, DOCX and PDF with a maximum file size of 2 MB
                        </p>
                        <Button variant="outline" size="sm">
                          <label
                            htmlFor="resume-upload"
                            className="cursor-pointer"
                          >
                            Browse File
                            <input
                              id="resume-upload"
                              type="file"
                              className="hidden"
                              accept=".doc,.docx,.pdf"
                              onChange={handleResumeChange}
                            />
                          </label>
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">
                    Personal Bio or Summary (in 200 Words Only)
                  </Label>
                  <Textarea
                    id="bio"
                    rows={5}
                    maxLength={1200} // Approximately 200 words
                    defaultValue="Senior Software Engineer with 8+ years of experience in building scalable web applications. Passionate about clean code, performance optimization, and mentoring junior developers."
                  />
                  <p className="text-xs text-muted-foreground">
                    Briefly describe yourself, your career goals, and what
                    you're looking for.
                  </p>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/profile">Cancel</Link>
              </Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Update your professional details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Label>Experience Level</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            If you're experienced but not working, fill in
                            'Industry' & 'Years of Experience' only. Enter 'NA'
                            for job title, company name, etc.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <RadioGroup
                    defaultValue="experienced"
                    className="flex space-x-4"
                    onValueChange={setExperienceType}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="experienced" id="experienced" />
                      <Label htmlFor="experienced">Experienced</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fresher" id="fresher" />
                      <Label htmlFor="fresher">Fresher</Label>
                    </div>
                  </RadioGroup>
                </div>

                {experienceType === "experienced" && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="job-title">Current Job Title</Label>
                        <Input
                          id="job-title"
                          defaultValue="Senior Software Engineer"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input id="company-name" defaultValue="TechCorp Inc." />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select defaultValue="technology">
                          <SelectTrigger id="industry">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
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
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="experience-years">
                          Years of Experience
                        </Label>
                        <Select defaultValue="8">
                          <SelectTrigger id="experience-years">
                            <SelectValue placeholder="Select years" />
                          </SelectTrigger>
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
                      </div>
                    </div>

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
                                If you have experience, fill in these fields. If
                                disabled, select 'Experienced' in Professional
                                Information.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">
                              Software Engineer at InnovateTech
                            </h3>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            2017 - 2020 • San Francisco, CA
                          </p>
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">
                              Junior Developer at WebSolutions
                            </h3>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            2015 - 2017 • San Francisco, CA
                          </p>
                        </div>

                        <div className="rounded-lg border border-dashed p-4">
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="previous-title">
                                Previous Job Title
                              </Label>
                              <Input
                                id="previous-title"
                                placeholder="e.g., Software Developer"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="previous-company">
                                Company Name
                              </Label>
                              <Input
                                id="previous-company"
                                placeholder="e.g., Tech Solutions Inc."
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Employment Dates</Label>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label
                                    htmlFor="start-date"
                                    className="text-xs"
                                  >
                                    Start Date
                                  </Label>
                                  <Input
                                    id="start-date"
                                    type="month"
                                    placeholder="Start Date"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="end-date" className="text-xs">
                                    End Date
                                  </Label>
                                  <Input
                                    id="end-date"
                                    type="month"
                                    placeholder="End Date"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="responsibilities">
                                Responsibilities and Achievements (Optional)
                              </Label>
                              <Textarea
                                id="responsibilities"
                                placeholder="Describe your key responsibilities and achievements in this role"
                                rows={3}
                              />
                            </div>
                            <Button className="w-full">
                              Add Work Experience
                            </Button>
                          </div>
                        </div>
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
                              Add any internships or part-time work experience
                              you may have.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="rounded-lg border border-dashed p-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="internship-title">
                            Internship Title
                          </Label>
                          <Input
                            id="internship-title"
                            placeholder="e.g., Software Development Intern"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="internship-company">
                            Company Name
                          </Label>
                          <Input
                            id="internship-company"
                            placeholder="e.g., Tech Solutions Inc."
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Internship Dates</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label
                                htmlFor="internship-start-date"
                                className="text-xs"
                              >
                                Start Date
                              </Label>
                              <Input
                                id="internship-start-date"
                                type="month"
                                placeholder="Start Date"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label
                                htmlFor="internship-end-date"
                                className="text-xs"
                              >
                                End Date
                              </Label>
                              <Input
                                id="internship-end-date"
                                type="month"
                                placeholder="End Date"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="internship-responsibilities">
                            Responsibilities and Achievements (Optional)
                          </Label>
                          <Textarea
                            id="internship-responsibilities"
                            placeholder="Describe your key responsibilities and achievements in this internship"
                            rows={3}
                          />
                        </div>
                        <Button className="w-full">Add Internship</Button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/profile">Cancel</Link>
              </Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Add or update your education</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      Master of Science in Computer Science at Stanford
                      University
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">2013 - 2015</p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      Bachelor of Science in Computer Engineering at University
                      of California, Berkeley
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">2009 - 2013</p>
                </div>

                <div className="rounded-lg border border-dashed p-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="degree">Highest Degree Attained</Label>
                      <Select>
                        <SelectTrigger id="degree">
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
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
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="university">
                        University/Institution Name
                      </Label>
                      <Input
                        id="university"
                        placeholder="e.g., Stanford University"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="field">Field of Study</Label>
                      <Input id="field" placeholder="e.g., Computer Science" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="graduation-year">Graduation Year</Label>
                      <Select>
                        <SelectTrigger id="graduation-year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 30 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Add Education</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/profile">Cancel</Link>
              </Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills and Expertise</CardTitle>
              <CardDescription>
                Add or update your skills and expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="skills">Key Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      React
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      TypeScript
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      Node.js
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      AWS
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      Docker
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input id="skills" placeholder="Add a skill..." />
                    <Button>Add</Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="certifications">
                    Certifications or Licenses
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      AWS Certified Solutions Architect
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      Certified Scrum Master
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="certifications"
                      placeholder="Add a certification..."
                    />
                    <Button>Add</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/profile">Cancel</Link>
              </Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Set your referral and job preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="referral-status">
                    Availability for Referrals
                  </Label>
                  <Select defaultValue="open">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your referral status" />
                    </SelectTrigger>
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
                  <p className="text-xs text-muted-foreground">
                    This controls whether others can request referrals from you
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="job-types">Job Preferences</Label>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      Full-time
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      Remote
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      Senior Level
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input id="job-types" placeholder="Add job preference..." />
                    <Button>Add</Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="locations">Preferred Locations</Label>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      San Francisco, CA
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      New York, NY
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      Remote
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input id="locations" placeholder="Add location..." />
                    <Button>Add</Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="companies">Target Companies</Label>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      Google
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      Microsoft
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      Amazon
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input id="companies" placeholder="Add company..." />
                    <Button>Add</Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 rounded border-gray-300"
                    aria-label="Accept Terms & Conditions"
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Accept Terms & Conditions
                  </Label>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/profile">Cancel</Link>
              </Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
