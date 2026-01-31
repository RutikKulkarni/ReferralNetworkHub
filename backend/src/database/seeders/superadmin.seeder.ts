/**
 * Platform Super Admin Seeder
 * Seeds initial super admin users
 */

import { User } from "../../modules/auth/models";
import { PasswordUtil } from "../../shared/utils";
import { USER_TYPES } from "../../constants";

interface SuperAdminSeedData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Load super admin credentials from environment variables
 * This prevents hardcoding sensitive credentials in source code
 */
const getSuperAdminsFromEnv = (): SuperAdminSeedData[] => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const firstName = process.env.SUPER_ADMIN_FIRST_NAME || "Super";
  const lastName = process.env.SUPER_ADMIN_LAST_NAME || "Admin";

  if (!email || !password) {
    console.warn(
      "⚠️  Super admin credentials not found in environment variables.",
    );
    console.warn(
      "   Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD to seed super admins.",
    );
    return [];
  }

  return [
    {
      email,
      password,
      firstName,
      lastName,
    },
  ];
};

export const seedSuperAdmins = async (): Promise<void> => {
  try {
    console.log("Seeding platform super admins...");

    const SUPER_ADMINS = getSuperAdminsFromEnv();

    if (SUPER_ADMINS.length === 0) {
      console.log(
        "⚠️  No super admin credentials configured. Skipping seeding.",
      );
      return;
    }

    for (const adminData of SUPER_ADMINS) {
      // Check if admin already exists
      const existingAdmin = await User.findOne({
        where: { email: adminData.email },
      });

      if (existingAdmin) {
        console.log(`✓ Super admin already exists: ${adminData.email}`);
        continue;
      }

      // Hash password
      const hashedPassword = await PasswordUtil.hashPassword(
        adminData.password,
      );

      // Create super admin
      await User.create({
        userType: USER_TYPES.PLATFORM_SUPER_ADMIN,
        email: adminData.email,
        password: hashedPassword,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        emailVerified: true,
        isActive: true,
        isBlocked: false,
        tokenVersion: 0,
      });

      console.log(`✓ Super admin created: ${adminData.email}`);
    }

    console.log("✓ Platform super admin seeding complete");
  } catch (error) {
    console.error("✗ Error seeding super admins:", error);
    throw error;
  }
};
