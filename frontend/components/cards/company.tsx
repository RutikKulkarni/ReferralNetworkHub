import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Users } from "lucide-react";
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
    <div className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
      <div className="flex gap-4 p-6">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-muted">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={name}
              width={64}
              height={64}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10">
              <span className="text-lg font-bold text-primary">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Link href={`/company/${id}`} className="group-hover:text-primary">
              <h3 className="font-semibold tracking-tight">{name}</h3>
            </Link>
            <Badge variant="outline" className="text-xs">
              {industry}
            </Badge>
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>

          <div className="mt-auto flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5" />
              <span>{openPositions} open positions</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{employees.toLocaleString()} employees</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-border bg-muted/50 p-3">
        <Button variant="outline" size="sm" className="flex-1 text-xs">
          <Link href={`/company/${id}`}>View Details</Link>
        </Button>
        <Button size="sm" className="flex-1 text-xs">
          <Link href={`/jobs?company=${id}`}>View Jobs</Link>
        </Button>
      </div>
    </div>
  );
}
