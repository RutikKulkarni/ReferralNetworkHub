import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface ProfileCardProps {
  id: number;
  name: string;
  position: string;
  company: string;
  location: string;
  imageSrc: string;
  mutualConnections: number;
}

export function ProfileCard({
  id,
  name,
  position,
  company,
  location,
  imageSrc,
  mutualConnections,
}: ProfileCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{name}</h3>
          <p className="truncate text-sm text-muted-foreground">
            {position} at {company}
          </p>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Icons.mapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {mutualConnections} mutual connections
        </span>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/profile/${id}`}>View Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
