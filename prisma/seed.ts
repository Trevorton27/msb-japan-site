import { PrismaClient } from "@prisma/client";
import {
  ALL_PERMISSIONS,
  ROLE_PERMISSIONS,
  ROLES,
} from "../src/lib/auth/permissions";

const prisma = new PrismaClient();

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

  if (process.env.NODE_ENV === "development") {
    console.log("Seeding dev admin user...");
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@msbjapan.org" },
      update: {},
      create: {
        email: "admin@msbjapan.org",
        name: "Admin User",
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

    console.log("Dev admin user seeded");
  }

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
