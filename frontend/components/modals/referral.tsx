import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
  company: string;
}

// Sample data for companies and jobs
const PLATFORM_COMPANIES = [
  { id: 1, name: "TechCorp" },
  { id: 2, name: "InnoSystems" },
  { id: 3, name: "DataLabs" },
  { id: 4, name: "CloudTech" },
  { id: 5, name: "DigitalInc" },
];

const COMPANY_JOBS = {
  1: [
    { id: 101, title: "Software Engineer" },
    { id: 102, title: "Product Manager" },
    { id: 103, title: "UX Designer" },
  ],
  2: [
    { id: 201, title: "Data Scientist" },
    { id: 202, title: "AI Engineer" },
  ],
  3: [
    { id: 301, title: "Backend Developer" },
    { id: 302, title: "Frontend Developer" },
  ],
  4: [
    { id: 401, title: "Cloud Architect" },
    { id: 402, title: "DevOps Engineer" },
  ],
  5: [
    { id: 501, title: "Marketing Specialist" },
    { id: 502, title: "Sales Representative" },
  ],
};

export default function ReferralModal({
  isOpen,
  onClose,
  profileName,
  company,
}: ReferralModalProps) {
  const [jobLocation, setJobLocation] = useState<"platform" | "external">(
    "platform"
  );
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [jobLink, setJobLink] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    setSelectedJob("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Close modal and reset form
    setIsSubmitting(false);
    resetForm();
    onClose();

    // You would add toast notification here in a real app
  };

  const resetForm = () => {
    setJobLocation("platform");
    setSelectedCompany("");
    setSelectedJob("");
    setJobLink("");
    setMessage("");
  };

  const availableJobs = selectedCompany
    ? COMPANY_JOBS[parseInt(selectedCompany) as keyof typeof COMPANY_JOBS] || []
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request a Referral</DialogTitle>
          <DialogDescription>
            Ask {profileName} for a referral at {company}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-3">
            <Label>Is this job listed on Referral Network Hub?</Label>
            <RadioGroup
              value={jobLocation}
              onValueChange={(value) =>
                setJobLocation(value as "platform" | "external")
              }
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="platform" id="platform" />
                <Label htmlFor="platform" className="cursor-pointer">
                  Yes, it's on the platform
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="external" id="external" />
                <Label htmlFor="external" className="cursor-pointer">
                  No, it's an external position
                </Label>
              </div>
            </RadioGroup>
          </div>

          {jobLocation === "platform" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="company">Select Company</Label>
                <Select
                  value={selectedCompany}
                  onValueChange={handleCompanyChange}
                >
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Choose a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORM_COMPANIES.map((company) => (
                      <SelectItem
                        key={company.id}
                        value={company.id.toString()}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCompany && (
                <div className="space-y-2">
                  <Label htmlFor="job">Select Position</Label>
                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger id="job">
                      <SelectValue placeholder="Choose a position" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableJobs.map((job) => (
                        <SelectItem key={job.id} value={job.id.toString()}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="job-link">Job Posting URL</Label>
              <Input
                id="job-link"
                type="url"
                placeholder="https://company.com/careers/job-posting"
                value={jobLink}
                onChange={(e) => setJobLink(e.target.value)}
                required={jobLocation === "external"}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">
              Why are you a good fit for this position?
            </Label>
            <Textarea
              id="message"
              placeholder="Briefly describe your relevant skills and experience..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className="resize-none"
            />
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                (jobLocation === "platform" &&
                  (!selectedCompany || !selectedJob)) ||
                (jobLocation === "external" && !jobLink) ||
                !message
              }
            >
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
