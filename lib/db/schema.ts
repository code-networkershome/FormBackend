import {
    pgTable,
    text,
    timestamp,
    uuid,
    jsonb,
    pgEnum,
    primaryKey,
    integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- ENUMS ---
export const formStatusEnum = pgEnum("form_status", ["active", "paused", "test_mode", "revoked"]);
export const submissionStatusEnum = pgEnum("submission_status", ["unread", "read", "spam", "deleted"]);
export const webhookStatusEnum = pgEnum("webhook_status", ["active", "disabled"]);
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const userStatusEnum = pgEnum("user_status", ["active", "blocked"]);

// --- TABLES ---

// Users table (Auth.js compatible)
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    role: userRoleEnum("role").default("user").notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Accounts table (Auth.js compatible)
export const accounts = pgTable("accounts", {
    userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
}, (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
]);

// Sessions table (Auth.js compatible)
export const sessions = pgTable("sessions", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Verification Tokens (Auth.js compatible)
export const verificationTokens = pgTable("verificationToken", {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
}, (table) => [
    primaryKey({ columns: [table.identifier, table.token] }),
]);

// User Credentials (for Email/Password Auth)
export const userCredentials = pgTable("user_credentials", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    passwordHash: text("password_hash").notNull(),
    emailVerified: text("email_verified").default("false").notNull(), // "true" or "false"
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Forms
export const forms = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: formStatusEnum("status").default("active").notNull(),
    settings: jsonb("settings").$type<{
        success_url?: string;
        failure_url?: string;
        email_notifications?: boolean;
    }>().default({}),
    templateId: text("template_id"), // Optional: associated template from library
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Submissions
export const submissions = pgTable("submissions", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").notNull().references(() => forms.id, { onDelete: "cascade" }),
    payload: jsonb("payload").notNull(),
    metadata: jsonb("metadata").$type<{
        ip?: string;
        ua?: string;
        geo?: string;
    }>().default({}),
    status: submissionStatusEnum("status").default("unread").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// API Keys 🔑
export const apiKeys = pgTable("api_keys", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    keyHash: text("key_hash").notNull().unique(), // Salted hash of the key
    name: text("name").notNull(), // User-friendly label (e.g., "Production")
    status: text("status").default("active").notNull(), // 'active', 'revoked'
    lastUsedAt: timestamp("last_used_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Webhooks ⚡
export const webhooks = pgTable("webhooks", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").notNull().references(() => forms.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    secret: text("secret").notNull(), // Webhook signing secret
    status: webhookStatusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- RELATIONS ---

export const usersRelations = relations(users, ({ many }) => ({
    forms: many(forms),
    apiKeys: many(apiKeys),
}));

export const formsRelations = relations(forms, ({ one, many }) => ({
    owner: one(users, { fields: [forms.ownerId], references: [users.id] }),
    submissions: many(submissions),
    webhooks: many(webhooks),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
    form: one(forms, { fields: [submissions.formId], references: [forms.id] }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
    user: one(users, { fields: [apiKeys.userId], references: [users.id] }),
}));

export const webhooksRelations = relations(webhooks, ({ one }) => ({
    form: one(forms, { fields: [webhooks.formId], references: [forms.id] }),
}));

// Admin Audit Logs 🛡️
export const adminAuditLogs = pgTable("admin_audit_logs", {
    id: uuid("id").primaryKey().defaultRandom(),
    adminUserId: uuid("admin_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(), // 'user', 'api_key', 'form'
    targetId: text("target_id").notNull(),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminAuditLogsRelations = relations(adminAuditLogs, ({ one }) => ({
    admin: one(users, { fields: [adminAuditLogs.adminUserId], references: [users.id] }),
}));
