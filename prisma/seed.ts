import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import {
  ALL_PERMISSIONS,
  ROLE_PERMISSIONS,
  ROLES,
} from "../src/lib/auth/permissions";
import {
  legacyVenues,
  legacyTeachers,
  legacyPosts,
  legacyProducts,
  legacyEventSeries,
  legacyEvents,
} from "./seed-data/legacy-content";

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

  // ─── Migrated content from the old msbjapan.org site ──────────────────────

  console.log("Seeding venues...");
  const venueIds: Record<string, string> = {};
  for (const v of legacyVenues) {
    const existing = await prisma.venue.findFirst({
      where: { nameJa: v.nameJa },
    });
    const venue = existing
      ? await prisma.venue.update({
          where: { id: existing.id },
          data: {
            nameEn: v.nameEn,
            addressJa: v.addressJa,
            addressEn: v.addressEn,
          },
        })
      : await prisma.venue.create({
          data: {
            nameJa: v.nameJa,
            nameEn: v.nameEn,
            addressJa: v.addressJa,
            addressEn: v.addressEn,
          },
        });
    venueIds[v.key] = venue.id;
  }

  console.log("Seeding teachers...");
  const teacherIds: Record<string, string> = {};
  for (const t of legacyTeachers) {
    const teacher = await prisma.teacher.upsert({
      where: { slugJa: t.slugJa },
      update: {
        slugEn: t.slugEn,
        nameJa: t.nameJa,
        nameEn: t.nameEn,
        bioJa: t.bioJa,
        bioEn: t.bioEn,
        imageUrl: t.imageUrl,
        sortOrder: t.sortOrder,
      },
      create: {
        slugJa: t.slugJa,
        slugEn: t.slugEn,
        nameJa: t.nameJa,
        nameEn: t.nameEn,
        bioJa: t.bioJa,
        bioEn: t.bioEn,
        imageUrl: t.imageUrl,
        sortOrder: t.sortOrder,
      },
    });
    teacherIds[t.slugJa] = teacher.id;
  }

  console.log("Seeding content posts...");
  for (const p of legacyPosts) {
    const data = {
      slugEn: p.slugEn,
      titleJa: p.titleJa,
      titleEn: p.titleEn,
      excerptJa: p.excerptJa,
      excerptEn: p.excerptEn,
      bodyJa: p.bodyJa,
      bodyEn: p.bodyEn,
      type: p.type,
      status: "PUBLISHED" as const,
      imageUrl: p.imageUrl ?? null,
      teacherId: p.teacherSlug ? (teacherIds[p.teacherSlug] ?? null) : null,
      publishedAt: new Date(p.publishedAt),
    };
    await prisma.contentPost.upsert({
      where: { slugJa: p.slugJa },
      update: data,
      create: { slugJa: p.slugJa, ...data },
    });
  }
  console.log(`Seeded ${legacyPosts.length} content posts`);

  console.log("Seeding products...");
  for (const p of legacyProducts) {
    const product = await prisma.product.upsert({
      where: { slugJa: p.slugJa },
      update: {
        slugEn: p.slugEn,
        nameJa: p.nameJa,
        nameEn: p.nameEn,
        descriptionJa: p.descriptionJa,
        descriptionEn: p.descriptionEn,
        imageUrl: p.imageUrl ?? null,
        sortOrder: p.sortOrder,
        active: true,
      },
      create: {
        slugJa: p.slugJa,
        slugEn: p.slugEn,
        nameJa: p.nameJa,
        nameEn: p.nameEn,
        descriptionJa: p.descriptionJa,
        descriptionEn: p.descriptionEn,
        imageUrl: p.imageUrl ?? null,
        sortOrder: p.sortOrder,
      },
    });
    for (const v of p.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          nameJa: v.nameJa,
          nameEn: v.nameEn,
          priceAmount: v.priceAmount,
          digital: v.digital,
          stockQuantity: v.stockQuantity,
          active: true,
        },
        create: {
          productId: product.id,
          nameJa: v.nameJa,
          nameEn: v.nameEn,
          sku: v.sku,
          priceAmount: v.priceAmount,
          digital: v.digital,
          stockQuantity: v.stockQuantity,
        },
      });
    }
  }
  console.log(`Seeded ${legacyProducts.length} products`);

  console.log("Seeding events...");
  const seriesIds: Record<string, string> = {};
  for (const s of legacyEventSeries) {
    const series = await prisma.eventSeries.upsert({
      where: { slugJa: s.slugJa },
      update: {
        slugEn: s.slugEn,
        titleJa: s.titleJa,
        titleEn: s.titleEn,
        descriptionJa: s.descriptionJa,
        descriptionEn: s.descriptionEn,
      },
      create: {
        slugJa: s.slugJa,
        slugEn: s.slugEn,
        titleJa: s.titleJa,
        titleEn: s.titleEn,
        descriptionJa: s.descriptionJa,
        descriptionEn: s.descriptionEn,
      },
    });
    seriesIds[s.slugJa] = series.id;
  }
  for (const e of legacyEvents) {
    const data = {
      slugEn: e.slugEn,
      titleJa: e.titleJa,
      titleEn: e.titleEn,
      descriptionJa: e.descriptionJa,
      descriptionEn: e.descriptionEn,
      status: e.status,
      mode: e.mode,
      priceType: e.priceType,
      priceAmount: e.priceAmount ?? null,
      capacity: e.capacity ?? null,
      beginnerFriendly: e.beginnerFriendly,
      startsAt: new Date(e.startsAt),
      endsAt: new Date(e.endsAt),
      venueId: e.venueKey ? (venueIds[e.venueKey] ?? null) : null,
      imageUrl: e.imageUrl ?? null,
      seriesId: e.seriesSlug ? (seriesIds[e.seriesSlug] ?? null) : null,
    };
    await prisma.event.upsert({
      where: { slugJa: e.slugJa },
      update: data,
      create: { slugJa: e.slugJa, ...data },
    });
  }
  console.log(
    `Seeded ${legacyEventSeries.length} series and ${legacyEvents.length} events`
  );

  // Legacy .html redirects are served from next.config.ts, not the
  // admin-managed Redirect table, which nothing applies to requests yet.

  // Seed admin user from env vars
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? "Admin";

  if (!adminEmail || !adminPassword) {
    console.log(
      "Skipping admin user seed (ADMIN_EMAIL / ADMIN_PASSWORD not set)"
    );
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
