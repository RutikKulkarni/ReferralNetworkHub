"use client";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Icons } from "@/components/icons";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("referral");

  useEffect(() => {
    const tabs = ["referral", "jobs", "network"];
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabs.indexOf(prev);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const floatingCardVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative py-16 sm:py-24 lg:py-36 overflow-hidden bg-background dark:bg-black">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_#e5e5e5_1px,_transparent_1px)] dark:bg-[radial-gradient(circle_at_center,_#333_1px,_transparent_1px)] bg-[length:20px_20px] opacity-30" />
      <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6 sm:space-y-8"
          >
            <motion.div variants={item}>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-200 dark:bg-gray-800 text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
                <Icons.briefcase className="mr-2 h-4 w-4" />
                Career Acceleration Platform
              </span>
            </motion.div>
            <motion.h1
              variants={item}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100"
            >
              Your career starts with{" "}
              <span className="text-gray-500 dark:text-gray-400">
                trusted Referrals
              </span>
            </motion.h1>
            <motion.p
              variants={item}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-md"
            >
              Connect with insiders who can vouch for you at top companies and
              land your dream job faster.
            </motion.p>
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => (window.location.href = "/jobs")}
                className="flex items-center justify-center flex-1 px-6 py-3 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                <Icons.briefcase className="mr-2 h-4 w-4" />
                Find Jobs
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center justify-center flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Icons.users className="mr-2 h-4 w-4" />
                Give Referrals
              </button>
            </motion.div>
            <motion.div
              variants={item}
              className="flex flex-wrap items-start justify-start gap-x-8 gap-y-4 pt-2"
            >
              <div className="flex items-center gap-2">
                <Icons.checkCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium">15,000+ Referrals</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.checkCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium">600+ Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.checkCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium">92% Success Rate</span>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Network card - top right */}
            <motion.div
              variants={floatingCardVariants}
              initial="initial"
              animate="animate"
              className="absolute -top-10 -right-8 hidden lg:block z-10"
            >
              <div className="bg-white/90 dark:bg-black/90 rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100">
                    <Icons.network className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Network
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      75,000+ professionals
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="bg-white/90 dark:bg-black/90 rounded-xl border border-gray-300 dark:border-gray-700 shadow-xl overflow-hidden">
              <div className="flex border-b border-gray-300 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab("referral")}
                  className={`flex-1 py-3 text-sm font-medium ${
                    activeTab === "referral"
                      ? "bg-white dark:bg-black text-gray-900 dark:text-gray-100"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Referral
                </button>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className={`flex-1 py-3 text-sm font-medium ${
                    activeTab === "jobs"
                      ? "bg-white dark:bg-black text-gray-900 dark:text-gray-100"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Jobs
                </button>
                <button
                  onClick={() => setActiveTab("network")}
                  className={`flex-1 py-3 text-sm font-medium ${
                    activeTab === "network"
                      ? "bg-white dark:bg-black text-gray-900 dark:text-gray-100"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Network
                </button>
              </div>
              <div className="p-6 min-h-64">
                {activeTab === "referral" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Icons.users className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                          Referral in Progress
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Software Developer at Google
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-300 dark:border-gray-700 pt-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-gray-100">
                          JD
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Jane Doe
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Referred by Alex Johnson
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-xs text-emerald-800 dark:text-emerald-200">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-300 dark:border-gray-700 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-gray-900 dark:text-gray-100">
                          MR
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Michael Rivera
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Referred by Sophia Chen
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-xs text-blue-800 dark:text-blue-200">
                        New
                      </span>
                    </div>
                  </motion.div>
                )}
                {activeTab === "jobs" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Icons.briefcase className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                          New Opportunities
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          1,200+ jobs added weekly
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Software Engineer at Meta
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Posted 2 days ago • 5 referrers available
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-xs text-blue-800 dark:text-blue-200">
                          New
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Product Manager at Google
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Posted 4 days ago • 3 referrers available
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeTab === "network" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Icons.network className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                          Growing Network
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          75,000+ professionals
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-gray-900 dark:text-gray-100">
                        MC
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Michael Chen
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Senior Engineer at Microsoft • 12 referrals
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-gray-900 dark:text-gray-100">
                        SP
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Sarah Patel
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Product Manager at Google • 8 referrals
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            {/* Jobs card - bottom left */}
            <motion.div
              variants={floatingCardVariants}
              initial="initial"
              animate="animate"
              className="absolute -bottom-8 -left-8 hidden lg:block"
            >
              <div className="bg-white/90 dark:bg-black/90 rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100">
                    <Icons.briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      New Jobs
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      1,200+ weekly
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
