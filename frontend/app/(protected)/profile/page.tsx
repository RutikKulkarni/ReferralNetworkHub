import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  MapPin,
  Building,
  Briefcase,
  Mail,
  Calendar,
  Users,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Profile Picture"
                    width={128}
                    height={128}
                    className="rounded-full"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-background"
                    asChild
                  >
                    <Link href="/profile/edit">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit profile</span>
                    </Link>
                  </Button>
                </div>
                <h1 className="mt-4 text-2xl font-bold">Alex Johnson</h1>
                <p className="text-muted-foreground">
                  Senior Software Engineer
                </p>
                <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>React</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>Node.js</Badge>
                  <Badge>AWS</Badge>
                  <Badge>Docker</Badge>
                </div>
                <Button className="mt-6 w-full" asChild>
                  <Link href="/profile/edit">Edit Profile</Link>
                </Button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-2">
                  <Building className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Current Company</p>
                    <p className="text-sm text-muted-foreground">
                      TechCorp Inc.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Experience</p>
                    <p className="text-sm text-muted-foreground">8+ years</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      alex.johnson@example.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      January 2023
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Network</p>
                    <p className="text-sm text-muted-foreground">
                      245 connections
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
            </TabsList>
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Senior Software Engineer with 8+ years of experience in
                    building scalable web applications. Passionate about clean
                    code, performance optimization, and mentoring junior
                    developers. Currently working at TechCorp Inc., focusing on
                    cloud-native applications and microservices architecture.
                  </p>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <h3 className="font-medium">Programming Languages</h3>
                      <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                        <li>JavaScript/TypeScript</li>
                        <li>Python</li>
                        <li>Go</li>
                        <li>Java</li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-medium">Cloud & DevOps</h3>
                      <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                        <li>AWS, GCP</li>
                        <li>Docker, Kubernetes</li>
                        <li>CI/CD (GitHub Actions, Jenkins)</li>
                        <li>Terraform</li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-medium">Databases</h3>
                      <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                        <li>PostgreSQL, MySQL</li>
                        <li>MongoDB</li>
                        <li>Redis</li>
                        <li>Elasticsearch</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-l-2 border-primary pl-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">
                          Senior Software Engineer
                        </h3>
                        <Badge variant="outline">Current</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        TechCorp Inc. • 2020 - Present
                      </p>
                      <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                        <li>
                          Lead a team of 5 engineers in developing cloud-native
                          applications
                        </li>
                        <li>
                          Implemented microservices architecture using Node.js
                          and Docker
                        </li>
                        <li>
                          Reduced API response time by 40% through performance
                          optimizations
                        </li>
                        <li>
                          Mentored junior developers and conducted code reviews
                        </li>
                      </ul>
                    </div>
                    <div className="border-l-2 border-muted pl-4">
                      <h3 className="font-semibold">Software Engineer</h3>
                      <p className="text-sm text-muted-foreground">
                        InnovateTech • 2017 - 2020
                      </p>
                      <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                        <li>
                          Developed and maintained RESTful APIs using Express.js
                        </li>
                        <li>
                          Built responsive front-end applications with React
                        </li>
                        <li>
                          Implemented CI/CD pipelines using GitHub Actions
                        </li>
                        <li>
                          Collaborated with product managers to define feature
                          requirements
                        </li>
                      </ul>
                    </div>
                    <div className="border-l-2 border-muted pl-4">
                      <h3 className="font-semibold">Junior Developer</h3>
                      <p className="text-sm text-muted-foreground">
                        WebSolutions • 2015 - 2017
                      </p>
                      <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                        <li>
                          Developed and maintained client websites using
                          JavaScript and PHP
                        </li>
                        <li>
                          Implemented responsive designs using CSS and Bootstrap
                        </li>
                        <li>
                          Collaborated with designers to implement UI/UX
                          improvements
                        </li>
                        <li>Participated in agile development processes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-l-2 border-muted pl-4">
                      <h3 className="font-semibold">
                        Master of Science in Computer Science
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Stanford University • 2013 - 2015
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Specialized in Artificial Intelligence and Machine
                        Learning
                      </p>
                    </div>
                    <div className="border-l-2 border-muted pl-4">
                      <h3 className="font-semibold">
                        Bachelor of Science in Computer Engineering
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        University of California, Berkeley • 2009 - 2013
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Minor in Mathematics. Graduated with honors.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="referrals">
              <Card>
                <CardHeader>
                  <CardTitle>Referral Activity</CardTitle>
                  <CardDescription>
                    Track your referral requests and offers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold">Referrals Provided</h3>
                      <div className="mt-4 rounded-lg border">
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium">Sarah Chen</p>
                            <p className="text-sm text-muted-foreground">
                              Senior UX Designer at TechCorp Inc.
                            </p>
                          </div>
                          <Badge className="bg-green-500 hover:bg-green-600">
                            Hired
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between border-t p-4">
                          <div>
                            <p className="font-medium">Michael Rodriguez</p>
                            <p className="text-sm text-muted-foreground">
                              Frontend Developer at TechCorp Inc.
                            </p>
                          </div>
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            In Process
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Referrals Received</h3>
                      <div className="mt-4 rounded-lg border">
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium">
                              Product Manager at InnovateTech
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Referred by James Wilson
                            </p>
                          </div>
                          <Badge>Completed</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button asChild>
                        <Link href="/referral-request">Request a Referral</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
