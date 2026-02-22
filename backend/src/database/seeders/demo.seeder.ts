import { User } from "../../modules/auth/models";
import { Organization } from "../models/Organization";
import { Job } from "../models/Job";
import { PasswordUtil } from "../../shared/utils";
import { USER_TYPES } from "../../constants";

/**
 * Demo Seeder
 * Creates sample development data: 2 orgs, org admins, 3 jobs per org, 5 job seekers.
 * Run via: ts-node src/database/seeders/demo.seeder.ts
 * Only safe to run in development environment.
 */

export const seedDemoData = async (): Promise<void> => {
  if (process.env.NODE_ENV === "production") {
    console.warn("Demo seeder should not run in production. Aborting.");
    return;
  }

  console.log("\n🌱 Starting demo data seeding...\n");

  // ==================== ORGANIZATIONS ====================
  const orgs = [
    {
      name: "TechCorp Innovations",
      description: "A leading technology company building the future of software.",
      industry: "Technology",
      size: "100-500",
      location: "San Francisco, CA",
      website: "https://techcorp-demo.com",
      isActive: true,
      isVerified: true,
    },
    {
      name: "StartupHub Inc",
      description: "Fast-growing startup disrupting the fintech industry.",
      industry: "Finance",
      size: "10-50",
      location: "New York, NY",
      website: "https://startuphub-demo.com",
      isActive: true,
      isVerified: false,
    },
  ];

  const createdOrgs: any[] = [];
  for (const orgData of orgs) {
    const existing = await Organization.findOne({ where: { name: orgData.name } });
    if (existing) {
      console.log(`  ✓ Org already exists: ${orgData.name}`);
      createdOrgs.push(existing);
    } else {
      const org = await Organization.create(orgData as any);
      console.log(`  ✅ Created org: ${orgData.name}`);
      createdOrgs.push(org);
    }
  }

  // ==================== ORG ADMIN USERS ====================
  const demoPassword = await PasswordUtil.hashPassword("Demo@12345");

  const orgAdmins = [
    {
      email: "admin@techcorp-demo.com",
      firstName: "Alice",
      lastName: "Admin",
      userType: USER_TYPES.ORGANIZATION_ADMIN,
    },
    {
      email: "admin@startuphub-demo.com",
      firstName: "Bob",
      lastName: "Manager",
      userType: USER_TYPES.ORGANIZATION_ADMIN,
    },
  ];

  const createdAdmins: any[] = [];
  for (const adminData of orgAdmins) {
    const existing = await User.findOne({ where: { email: adminData.email } });
    if (existing) {
      console.log(`  ✓ Admin already exists: ${adminData.email}`);
      createdAdmins.push(existing);
    } else {
      const admin = await User.create({
        ...adminData,
        password: demoPassword,
        emailVerified: true,
        isActive: true,
        isBlocked: false,
        tokenVersion: 0,
      } as any);
      console.log(`  ✅ Created org admin: ${adminData.email}`);
      createdAdmins.push(admin);
    }
  }

  // ==================== JOB SEEKERS ====================
  const jobSeekers = [
    { email: "john.doe@demo.com", firstName: "John", lastName: "Doe" },
    { email: "jane.smith@demo.com", firstName: "Jane", lastName: "Smith" },
    { email: "alex.jones@demo.com", firstName: "Alex", lastName: "Jones" },
    { email: "sam.wilson@demo.com", firstName: "Sam", lastName: "Wilson" },
    { email: "chris.lee@demo.com", firstName: "Chris", lastName: "Lee" },
  ];

  for (const seekerData of jobSeekers) {
    const existing = await User.findOne({ where: { email: seekerData.email } });
    if (!existing) {
      await User.create({
        ...seekerData,
        password: demoPassword,
        userType: USER_TYPES.JOB_SEEKER,
        emailVerified: true,
        isActive: true,
        isBlocked: false,
        tokenVersion: 0,
      } as any);
      console.log(`  ✅ Created job seeker: ${seekerData.email}`);
    } else {
      console.log(`  ✓ Job seeker already exists: ${seekerData.email}`);
    }
  }

  // ==================== JOBS ====================
  const jobTemplates = [
    {
      title: "Senior Software Engineer",
      description: "We are looking for a senior engineer to architect and build scalable systems with 5+ years of experience.",
      job_type: "full_time",
      experience_level: "senior",
      location: "San Francisco, CA",
      salary_range_min: 120000,
      salary_range_max: 180000,
      currency: "USD",
      skills_required: ["TypeScript", "Node.js", "PostgreSQL"],
      is_active: true,
      is_referral_eligible: true,
      referral_bonus: 5000,
    },
    {
      title: "Frontend Developer",
      description: "Join our team building beautiful, responsive UIs using modern React and TypeScript.",
      job_type: "full_time",
      experience_level: "mid",
      location: "Remote",
      salary_range_min: 90000,
      salary_range_max: 130000,
      currency: "USD",
      skills_required: ["React", "TypeScript", "CSS"],
      is_active: true,
      is_referral_eligible: true,
      referral_bonus: 3000,
    },
    {
      title: "DevOps Engineer",
      description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines.",
      job_type: "full_time",
      experience_level: "senior",
      location: "New York, NY",
      salary_range_min: 110000,
      salary_range_max: 160000,
      currency: "USD",
      skills_required: ["AWS", "Docker", "Kubernetes", "Terraform"],
      is_active: true,
      is_referral_eligible: false,
      referral_bonus: 0,
    },
  ];

  for (const org of createdOrgs) {
    const adminForOrg = createdAdmins[createdOrgs.indexOf(org)];
    for (const jobTemplate of jobTemplates) {
      const existing = await Job.findOne({
        where: { title: jobTemplate.title, organization_id: org.id },
      });
      if (!existing) {
        await Job.create({
          ...jobTemplate,
          organization_id: org.id,
          posted_by: adminForOrg?.id || "system",
          posted_date: new Date(),
        } as any);
        console.log(`  ✅ Created job: "${jobTemplate.title}" for ${org.name}`);
      } else {
        console.log(`  ✓ Job already exists: "${jobTemplate.title}" for ${org.name}`);
      }
    }
  }

  console.log("\n✅ Demo data seeding complete!\n");
  console.log("Demo credentials (password: Demo@12345):");
  console.log("  Org Admin 1: admin@techcorp-demo.com");
  console.log("  Org Admin 2: admin@startuphub-demo.com");
  console.log("  Job Seeker:  john.doe@demo.com\n");
};
