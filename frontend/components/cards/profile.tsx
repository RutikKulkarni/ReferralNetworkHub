import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase } from "lucide-react";
import { useState } from "react";
import ReferralModal from "@/components/modals/referral";

interface ProfileCardProps {
  id: number;
  name: string;
  position: string;
  company: string;
  location: string;
  imageSrc: string;
}

export default function ProfileCard({
  id,
  name,
  position,
  company,
  location,
  imageSrc,
}: ProfileCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-16 w-16 overflow-hidden rounded-full">
            <Image
              src={imageSrc}
              alt={name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex-grow space-y-3">
          <div>
            <Link href={`/profile/${id}`} className="group-hover:text-primary">
              <h3 className="font-semibold tracking-tight">{name}</h3>
            </Link>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5" />
              <span>
                {position} at {company}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setIsModalOpen(true)}
            >
              Ask for referral
            </Button>
            <Button size="sm" className="flex-1 text-xs" asChild>
              <Link href={`/profile/${id}`}>View Profile</Link>
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ReferralModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          profileName={name}
          company={company}
        />
      )}
    </div>
  );
}
