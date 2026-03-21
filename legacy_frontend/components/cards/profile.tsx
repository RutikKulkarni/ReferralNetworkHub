import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useState } from "react";
import ReferralModal from "@/components/modals/referral";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  id: number;
  name: string;
  position: string;
  company: string;
  location: string;
  imageSrc: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
}

export default function ProfileCard({
  id,
  name,
  position,
  company,
  location,
  imageSrc,
  linkedinUrl,
  twitterUrl,
  githubUrl,
}: ProfileCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-lg shadow-md",
        "p-6 transition-all duration-300 hover:shadow-xl",
        "max-w-md w-full mx-auto flex flex-col"
      )}
    >
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-primary/20 group-hover:border-primary/50 transition-all duration-300 shadow-sm">
            <Image
              src={imageSrc}
              alt={name}
              width={80}
              height={80}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex-grow space-y-1.5 text-center sm:text-left">
          <Link href={`/profile/${id}`}>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">
            {position} at {company}
          </p>
          <p className="text-xs text-muted-foreground">{location}</p>

          {/* Social Icons */}
          <div className="flex justify-center sm:justify-start gap-3 pt-1">
            {/* {githubUrl && ( */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition"
            >
              <Icons.gitHub className="h-4 w-4" />
            </a>
            {/* )}
            {twitterUrl && ( */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition"
            >
              <Icons.twitter className="h-4 w-4" />
            </a>
            {/* )} */}
            {/* {linkedinUrl && ( */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition"
            >
              <Icons.linkedin className="h-4 w-4" />
            </a>
            {/* )} */}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-6 mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs font-medium border-primary/20 hover:border-primary hover:bg-primary/10 transition-all"
          onClick={() => setIsModalOpen(true)}
        >
          Ask for Referral
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs font-medium bg-primary hover:bg-primary/90 transition-all"
          asChild
        >
          <Link href={`/profile/${id}`}>View Profile</Link>
        </Button>
      </div>

      {/* Referral Modal */}
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
