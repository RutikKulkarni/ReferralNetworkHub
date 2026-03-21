import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

interface CompanyCardProps {
  id: number;
  name: string;
  industry: string;
  description: string;
  location: string;
  openPositions: number;
  employees: number;
  logoSrc?: string;
}

export default function CompanyCard({
  id,
  name,
  industry,
  description,
  location,
  openPositions,
  employees,
  logoSrc,
}: CompanyCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <div className="relative h-14 w-14 rounded-lg bg-muted overflow-hidden ring-1 ring-primary/10 transition-all group-hover:ring-primary/20">
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5">
                <span className="text-xl font-semibold text-primary">
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/company/${id}`}>
              <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {name}
              </h3>
            </Link>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full"
            >
              {industry}
            </Badge>
          </div>

          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Info Grid */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="flex items-left gap-2 text-xs text-muted-foreground">
              <Icons.mapPin className="h-3.5 w-3.5 text-primary" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-right gap-2 text-xs text-muted-foreground">
              <Icons.briefcase className="h-3.5 w-3.5 text-primary" />
              <span>{openPositions}</span>
              <Icons.user className="h-3.5 w-3.5 text-primary" />
              <span>{employees.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 border-t border-border bg-muted/20 p-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs font-medium transition-all duration-200 hover:bg-primary hover:text-primary-foreground border-primary/20"
          asChild
        >
          <Link href={`/company/${id}`}>Details</Link>
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs font-medium transition-all duration-200 hover:bg-primary/90"
          asChild
        >
          <Link href={`/jobs?company=${id}`}>Jobs</Link>
        </Button>
      </div>
    </div>
  );
}
