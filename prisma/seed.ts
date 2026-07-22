import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import {
  ALL_PERMISSIONS,
  ROLE_PERMISSIONS,
  ROLES,
} from "../src/lib/auth/permissions";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding permissions...");
  const permissionRecords: Record<string, string> = {};

  for (const key of ALL_PERMISSIONS) {
    const permission = await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, description: key.replace(".", ": ") },
    });
    permissionRecords[key] = permission.id;
  }

  console.log(`Seeded ${ALL_PERMISSIONS.length} permissions`);

  console.log("Seeding roles...");
  for (const [, roleName] of Object.entries(ROLES)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, description: `${roleName} role` },
    });

    const permissions = ROLE_PERMISSIONS[roleName];
    for (const permKey of permissions) {
      const permId = permissionRecords[permKey];
      if (permId) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: { roleId: role.id, permissionId: permId },
          },
          update: {},
          create: { roleId: role.id, permissionId: permId },
        });
      }
    }
  }

  console.log(`Seeded ${Object.keys(ROLES).length} roles`);

  // Seed admin user from env vars
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? "Admin";

  if (!adminEmail || !adminPassword) {
    console.log("Skipping admin user seed (ADMIN_EMAIL / ADMIN_PASSWORD not set)");
    console.log("Seed completed");
    return;
  }

  console.log("Seeding admin user...");
  const passwordHash = await hash(adminPassword, 12);
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase().trim() },
    update: { passwordHash },
    create: {
      email: adminEmail.toLowerCase().trim(),
      name: adminName,
      passwordHash,
      emailVerified: new Date(),
    },
  });

  const adminRole = await prisma.role.findUnique({
    where: { name: ROLES.ADMINISTRATOR },
  });

  if (adminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: { userId: adminUser.id, roleId: adminRole.id },
      },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id },
    });
  }

  console.log("Admin user seeded");
  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
