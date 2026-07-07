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
import { Search, Filter, X } from "lucide-react";
import { ProfileCard } from "@/components/cards/profile";
import { CompanyCard } from "@/components/cards/company";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const PEOPLE_DATA = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  name: `User Name ${i + 1}`,
  position: "Software Engineer",
  company: "TechCorp",
  location: "San Francisco, CA",
  imageSrc: `/placeholder.svg?height=80&width=80&text=User${i + 1}`,
  mutualConnections: i + 3,
}));

const COMPANIES_DATA = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  name: `Company ${i + 1}`,
  industry: "Technology",
  description:
    "Leading technology company with a focus on innovation and user experience.",
  location: "San Francisco, CA",
  openPositions: (i + 1) * 5,
  employees: (i + 1) * 1000,
}));

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
];

const LOCATIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Boston, MA",
];

const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead",
  "Executive",
];

const CONNECTION_TYPES = [
  "Direct Connection",
  "2nd Degree",
  "Alumni Network",
  "Industry Peer",
];

export default function ExplorePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [experienceFilter, setExperienceFilter] = useState<string[]>([]);
  const [connectionFilter, setConnectionFilter] = useState<string[]>([]);

  const activeFilters = [
    ...locationFilter.map((f) => ({ type: "Location", value: f })),
    ...experienceFilter.map((f) => ({ type: "Experience", value: f })),
    ...connectionFilter.map((f) => ({ type: "Connection", value: f })),
  ];

  const removeFilter = (type: string, value: string) => {
    if (type === "Location") {
      setLocationFilter((prev) => prev.filter((v) => v !== value));
    } else if (type === "Experience") {
      setExperienceFilter((prev) => prev.filter((v) => v !== value));
    } else if (type === "Connection") {
      setConnectionFilter((prev) => prev.filter((v) => v !== value));
    }
  };

  const toggleFilter = (
    value: string,
    filter: string[],
    setFilter: (v: string[]) => void,
  ) => {
    if (filter.includes(value)) {
      setFilter(filter.filter((v) => v !== value));
    } else {
      setFilter([...filter, value]);
    }
  };

  const resetAllFilters = () => {
    setLocationFilter([]);
    setExperienceFilter([]);
    setConnectionFilter([]);
    setIndustryFilter("");
    setSearchQuery("");
  };

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Explore Network</h1>
        <p className="text-muted-foreground">
          Discover professionals and companies in your network. Find the right
          connections for your career.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search people or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your search with additional filters.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 py-4">
              {/* Location Filter */}
              <div className="space-y-3">
                <h4 className="font-medium">Location</h4>
                {LOCATIONS.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`loc-${location}`}
                      checked={locationFilter.includes(location)}
                      onCheckedChange={() =>
                        toggleFilter(
                          location,
                          locationFilter,
                          setLocationFilter,
                        )
                      }
                    />
                    <Label htmlFor={`loc-${location}`} className="text-sm">
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
              <Separator />
              {/* Experience Filter */}
              <div className="space-y-3">
                <h4 className="font-medium">Experience Level</h4>
                {EXPERIENCE_LEVELS.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`exp-${level}`}
                      checked={experienceFilter.includes(level)}
                      onCheckedChange={() =>
                        toggleFilter(
                          level,
                          experienceFilter,
                          setExperienceFilter,
                        )
                      }
                    />
                    <Label htmlFor={`exp-${level}`} className="text-sm">
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
              <Separator />
              {/* Connection Filter */}
              <div className="space-y-3">
                <h4 className="font-medium">Connection Type</h4>
                {CONNECTION_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`conn-${type}`}
                      checked={connectionFilter.includes(type)}
                      onCheckedChange={() =>
                        toggleFilter(
                          type,
                          connectionFilter,
                          setConnectionFilter,
                        )
                      }
                    />
                    <Label htmlFor={`conn-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={resetAllFilters}>
                Reset All
              </Button>
              <Button onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={`${filter.type}-${filter.value}`} variant="secondary">
              {filter.value}
              <button
                onClick={() => removeFilter(filter.type, filter.value)}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAllFilters}
            className="h-6 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="people" className="space-y-6">
        <TabsList>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
        </TabsList>

        <TabsContent value="people" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PEOPLE_DATA.map((person) => (
              <ProfileCard key={person.id} {...person} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPANIES_DATA.map((company) => (
              <CompanyCard key={company.id} {...company} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* CTA Banner */}
      <div className="mt-12 rounded-lg bg-muted p-8 text-center">
        <h2 className="text-2xl font-bold">Looking for job opportunities?</h2>
        <p className="mt-2 text-muted-foreground">
          Browse open positions and apply to your dream job.
        </p>
        <Button asChild className="mt-4">
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </div>
    </div>
  );
}
