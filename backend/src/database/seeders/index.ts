import {
  testConnection,
  syncDatabase,
  closeConnection,
} from "../../config/database";
import { initAuthModels } from "../../modules/auth/models";
import sequelize from "../../config/database";
import { seedSuperAdmins } from "./superadmin.seeder";

const runSeeders = async (): Promise<void> => {
  try {
    console.log("Starting database seeding...\n");

    // Test connection
    await testConnection();

    // Initialize models
    initAuthModels(sequelize);

    // Sync database
    await syncDatabase(false);

    // Run seeders
    await seedSuperAdmins();

    console.log("\n✓ All seeders completed successfully");

    // Close connection
    await closeConnection();
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Seeding failed:", error);
    await closeConnection();
    process.exit(1);
  }
};

// Run seeders
runSeeders();
