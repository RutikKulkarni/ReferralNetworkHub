"use client";
import { motion, Variants } from "framer-motion";
import { Icons } from "@/components/icons";

export default function HowItWorks() {
  const howItWorks = [
    {
      role: "Job Seeker",
      icon: <Icons.briefcase className="h-6 w-6" />,
      steps: [
        {
          title: "Search Jobs",
          description: "Browse and apply for jobs or save them for later.",
        },
        {
          title: "Request Referral",
          description: "Connect with referrers from your target company.",
        },
        {
          title: "Track Progress",
          description: "Follow your referral and interview status.",
        },
      ],
    },
    {
      role: "Referrer",
      icon: <Icons.users className="h-6 w-6" />,
      steps: [
        {
          title: "Receive Requests",
          description: "Get referral requests from job seekers.",
        },
        {
          title: "Chat & Review",
          description: "Message candidates and review their profiles.",
        },
        {
          title: "Submit Referral",
          description: "Refer candidates and track successful hires.",
        },
      ],
    },
    {
      role: "Recruiter",
      icon: <Icons.network className="h-6 w-6" />,
      steps: [
        {
          title: "Post Jobs",
          description: "Create and publish job listings for your company.",
        },
        {
          title: "Review Applications",
          description: "View applicant profiles and referrals.",
        },
        {
          title: "Track Analytics",
          description: "Monitor job post performance and hiring progress.",
        },
      ],
    },
  ];
  // Animation variants
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-white dark:bg-black">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_#e5e5e5_1px,_transparent_1px)] dark:bg-[radial-gradient(circle_at_center,_#333_1px,_transparent_1px)] bg-[length:20px_20px] opacity-30" />
      <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center space-y-4 mb-12"
        >
          <motion.h2
            variants={item}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground"
          >
            How It <span className="text-muted-foreground">Works</span>
          </motion.h2>
          <motion.p
            variants={item}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            A seamless process for job seekers, referrers, and recruiters to
            connect and succeed.
          </motion.p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {howItWorks.map((role, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-card rounded-xl border border-border hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    {role.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {role.role}
                  </h3>
                </div>
                <div className="space-y-4">
                  {role.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-foreground">
                        {stepIndex + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {step.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
