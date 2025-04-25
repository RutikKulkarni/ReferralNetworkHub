"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ArrowRight, ChevronDown, X } from "lucide-react";
import ProfileCard from "@/components/cards/profile";
import CompanyCard from "@/components/cards/company";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Sample data for demonstration - Using specific, stable values
const PEOPLE_DATA = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  name: `User Name ${i + 1}`,
  position: "Software Engineer",
  company: "TechCorp",
  location: "San Francisco, CA",
  imageSrc: `/placeholder.svg?height=80&width=80&text=User${i + 1}`,
  mutualConnections: i + 3, // Using deterministic values based on index
}));

const COMPANIES_DATA = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  name: `Company ${i + 1}`,
  industry: "Technology",
  description:
    "Leading technology company with a focus on innovation and user experience.",
  location: "San Francisco, CA",
  openPositions: (i + 1) * 5, // Deterministic value
  employees: (i + 1) * 1000, // Deterministic value
}));

export default function ExplorePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  // These state variables would be used for the advanced filter functionality
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [experienceFilter, setExperienceFilter] = useState<string[]>([]);
  const [connectionFilter, setConnectionFilter] = useState<string[]>([]);

  return (
    <div className="container py-10">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Explore Network</h1>
        <p className="text-muted-foreground">
          Connect with professionals and find referral opportunities
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, company, or position..."
            className="pl-10 pr-4 py-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="min-w-[160px] whitespace-nowrap">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
            </SelectContent>
          </Select>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-sm sm:max-w-md">
              <SheetHeader className="mb-6">
                <SheetTitle>Filter Results</SheetTitle>
                <SheetDescription>
                  Narrow down your search with specific criteria
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Location Filter */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Location</h3>
                  <Separator />
                  <div className="space-y-2">
                    {["San Francisco", "New York", "London", "Remote"].map(
                      (location) => (
                        <div key={location} className="flex items-center gap-2">
                          <Checkbox
                            id={`location-${location}`}
                            checked={locationFilter.includes(location)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setLocationFilter([
                                  ...locationFilter,
                                  location,
                                ]);
                              } else {
                                setLocationFilter(
                                  locationFilter.filter((l) => l !== location)
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`location-${location}`}
                            className="text-sm"
                          >
                            {location}
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Experience Level</h3>
                  <Separator />
                  <div className="space-y-2">
                    {["Entry level", "Mid-level", "Senior", "Executive"].map(
                      (level) => (
                        <div key={level} className="flex items-center gap-2">
                          <Checkbox
                            id={`exp-${level}`}
                            checked={experienceFilter.includes(level)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setExperienceFilter([
                                  ...experienceFilter,
                                  level,
                                ]);
                              } else {
                                setExperienceFilter(
                                  experienceFilter.filter((e) => e !== level)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`exp-${level}`} className="text-sm">
                            {level}
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Connection Type Filter */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Connection</h3>
                  <Separator />
                  <div className="space-y-2">
                    {[
                      "1st connections",
                      "2nd connections",
                      "3rd+ connections",
                    ].map((connection) => (
                      <div key={connection} className="flex items-center gap-2">
                        <Checkbox
                          id={`conn-${connection}`}
                          checked={connectionFilter.includes(connection)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setConnectionFilter([
                                ...connectionFilter,
                                connection,
                              ]);
                            } else {
                              setConnectionFilter(
                                connectionFilter.filter((c) => c !== connection)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={`conn-${connection}`}
                          className="text-sm"
                        >
                          {connection}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter className="mt-8 flex gap-3 sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLocationFilter([]);
                    setExperienceFilter([]);
                    setConnectionFilter([]);
                  }}
                  className="flex-1"
                >
                  Reset All
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active filters display */}
      {(industryFilter ||
        locationFilter.length > 0 ||
        experienceFilter.length > 0 ||
        connectionFilter.length > 0) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {industryFilter && industryFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Industry: {industryFilter}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setIndustryFilter("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {locationFilter.map((location) => (
            <Badge
              key={location}
              variant="secondary"
              className="flex items-center gap-1"
            >
              Location: {location}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() =>
                  setLocationFilter(
                    locationFilter.filter((l) => l !== location)
                  )
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {/* Add similar badges for other active filters */}
          {experienceFilter.map((exp) => (
            <Badge
              key={exp}
              variant="secondary"
              className="flex items-center gap-1"
            >
              Experience: {exp}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() =>
                  setExperienceFilter(experienceFilter.filter((e) => e !== exp))
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {connectionFilter.map((conn) => (
            <Badge
              key={conn}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {conn}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() =>
                  setConnectionFilter(
                    connectionFilter.filter((c) => c !== conn)
                  )
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <Tabs defaultValue="people" className="mb-10">
        <TabsList className="mb-6 inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <TabsTrigger
            value="people"
            className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            People
          </TabsTrigger>
          <TabsTrigger
            value="companies"
            className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Companies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="people" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PEOPLE_DATA.map((person) => (
              <ProfileCard key={person.id} {...person} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              Load More
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {COMPANIES_DATA.map((company) => (
              <CompanyCard key={company.id} {...company} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              Load More
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-10 rounded-lg border border-border bg-card p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold">
          Looking for job opportunities?
        </h2>
        <p className="mb-6 text-muted-foreground">
          Explore open positions and find your next career move
        </p>
        <Button asChild>
          <Link href="/jobs" className="flex items-center gap-2">
            View Jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
