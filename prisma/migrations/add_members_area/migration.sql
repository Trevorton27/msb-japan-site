-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('ARTICLE', 'PDF', 'AUDIO', 'VIDEO', 'LINK', 'PRACTICE_TEXT', 'COURSE_MATERIAL', 'RETREAT_MATERIAL');

-- CreateEnum
CREATE TYPE "MemberEventRegistrationStatus" AS ENUM ('REGISTERED', 'CANCELLED', 'WAITLISTED', 'ATTENDED');

-- CreateTable
CREATE TABLE "member_resources" (
    "id" TEXT NOT NULL,
    "slugJa" TEXT NOT NULL,
    "slugEn" TEXT,
    "titleJa" TEXT NOT NULL,
    "titleEn" TEXT,
    "descriptionJa" TEXT,
    "descriptionEn" TEXT,
    "contentJa" TEXT,
    "contentEn" TEXT,
    "resourceType" "ResourceType" NOT NULL DEFAULT 'ARTICLE',
    "fileUrl" TEXT,
    "externalUrl" TEXT,
    "videoUrl" TEXT,
    "audioUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_event_registrations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "MemberEventRegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_announcements" (
    "id" TEXT NOT NULL,
    "titleJa" TEXT NOT NULL,
    "titleEn" TEXT,
    "contentJa" TEXT NOT NULL,
    "contentEn" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_resources_slugJa_key" ON "member_resources"("slugJa");

-- CreateIndex
CREATE UNIQUE INDEX "member_resources_slugEn_key" ON "member_resources"("slugEn");

-- CreateIndex
CREATE INDEX "member_resources_published_resourceType_idx" ON "member_resources"("published", "resourceType");

-- CreateIndex
CREATE UNIQUE INDEX "member_event_registrations_userId_eventId_key" ON "member_event_registrations"("userId", "eventId");

-- CreateIndex
CREATE INDEX "member_announcements_published_pinned_publishedAt_idx" ON "member_announcements"("published", "pinned", "publishedAt");

-- AddForeignKey
ALTER TABLE "member_event_registrations" ADD CONSTRAINT "member_event_registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_event_registrations" ADD CONSTRAINT "member_event_registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

