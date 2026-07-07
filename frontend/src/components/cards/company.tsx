import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

interface CompanyCardProps {
  id: number;
  name: string;
  industry: string;
  description: string;
  location: string;
  openPositions: number;
  employees: number;
}

export function CompanyCard({
  id,
  name,
  industry,
  description,
  location,
  openPositions,
  employees,
}: CompanyCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-lg font-bold text-muted-foreground">
          {name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{name}</h3>
          <Badge variant="secondary" className="mt-1 text-xs">
            {industry}
          </Badge>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Icons.mapPin className="h-3 w-3" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Icons.briefcase className="h-3 w-3" />
          <span>{openPositions} open positions</span>
        </div>
        <div className="flex items-center gap-1">
          <Icons.users className="h-3 w-3" />
          <span>{employees.toLocaleString()} employees</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/company/${id}`}>Details</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/jobs?company=${id}`}>Jobs</Link>
        </Button>
      </div>
    </div>
  );
}
