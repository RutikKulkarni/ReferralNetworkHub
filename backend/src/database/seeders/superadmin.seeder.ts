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

const SUPER_ADMINS: SuperAdminSeedData[] = [
  {
    email: "superadmin@referralnetworkhub.com",
    password: "SuperAdmin@2026!",
    firstName: "Super",
    lastName: "Admin",
  },
];

export const seedSuperAdmins = async (): Promise<void> => {
  try {
    console.log("Seeding platform super admins...");

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
