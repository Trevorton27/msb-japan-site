export const PERMISSIONS = {
  CONTENT_READ: "content.read",
  CONTENT_CREATE: "content.create",
  CONTENT_EDIT: "content.edit",
  CONTENT_REVIEW: "content.review",
  CONTENT_PUBLISH: "content.publish",
  EVENTS_MANAGE: "events.manage",
  REGISTRATIONS_MANAGE: "registrations.manage",
  CONTACTS_MANAGE: "contacts.manage",
  DONATIONS_READ: "donations.read",
  COMMERCE_MANAGE: "commerce.manage",
  SOCIAL_PUBLISH: "social.publish",
  ANALYTICS_READ: "analytics.read",
  USERS_MANAGE: "users.manage",
  SETTINGS_MANAGE: "settings.manage",
} as const;

export type PermissionKey =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const ROLES = {
  ADMINISTRATOR: "Administrator",
  EDITOR: "Editor",
  TRANSLATOR: "Translator",
  EVENT_COORDINATOR: "Event Coordinator",
  COMMERCE_MANAGER: "Commerce Manager",
  ANALYST: "Analyst",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_PERMISSIONS: Record<RoleName, PermissionKey[]> = {
  [ROLES.ADMINISTRATOR]: ALL_PERMISSIONS,
  [ROLES.EDITOR]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_REVIEW,
    PERMISSIONS.CONTENT_PUBLISH,
  ],
  [ROLES.TRANSLATOR]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_EDIT,
  ],
  [ROLES.EVENT_COORDINATOR]: [
    PERMISSIONS.EVENTS_MANAGE,
    PERMISSIONS.REGISTRATIONS_MANAGE,
    PERMISSIONS.CONTACTS_MANAGE,
  ],
  [ROLES.COMMERCE_MANAGER]: [
    PERMISSIONS.COMMERCE_MANAGE,
    PERMISSIONS.DONATIONS_READ,
  ],
  [ROLES.ANALYST]: [
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.DONATIONS_READ,
  ],
};
