"use client";
import { motion } from "framer-motion";
import { Icons } from "@/components/icons";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Icons.network className="h-6 w-6" />,
      title: "Trusted Network",
      description:
        "Connect with verified professionals from top companies who are ready to refer qualified candidates.",
    },
    {
      icon: <Icons.shield className="h-6 w-6" />,
      title: "Transparent Process",
      description:
        "Track referrals from request to job offer with our clear status updates and milestone tracking.",
    },
    {
      icon: <Icons.briefcase className="h-6 w-6" />,
      title: "Quality Opportunities",
      description:
        "Access exclusive job listings directly from company recruiters and internal employees.",
    },
    {
      icon: <Icons.arrowRight className="h-6 w-6" />,
      title: "Career Acceleration",
      description:
        "Candidates with referrals are 15x more likely to be hired and experience faster interview cycles.",
    },
    {
      icon: <Icons.messageSquare className="h-6 w-6" />,
      title: "Direct Communication",
      description:
        "Chat directly with referrers and recruiters without intermediaries slowing down the process.",
    },
    {
      icon: <Icons.users className="h-6 w-6" />,
      title: "Dual-Purpose Platform",
      description:
        "Whether you're seeking referrals or want to help others, our platform supports both needs.",
    },
  ];

  const companies = [
    { name: "Google" },
    { name: "Microsoft" },
    { name: "Amazon" },
    { name: "Apple" },
    { name: "Meta" },
    { name: "Netflix" },
  ];

  return (
    <section className="py-16 sm:py-24 bg-secondary dark:bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
          >
            Why Choose{" "}
            <span className="text-primary dark:text-primary">
              Trusted Referral Network
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Our platform bridges the gap between talented professionals and
            their dream jobs through trusted connections.
          </motion.p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card text-card-foreground rounded-xl shadow-md border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-secondary dark:bg-accent flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-24 pt-8 border-t border-border mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                Trusted by professionals from top companies
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
              {companies.map((company, i) => (
                <motion.div
                  key={i}
                  className="text-xl font-bold text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {company.name}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
