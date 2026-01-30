import { db } from "@/lib/db";
import { adminAuditLogs } from "@/lib/db/schema";

export type AdminAction =
    | "BLOCK_USER"
    | "UNBLOCK_USER"
    | "REVOKE_API_KEY"
    | "CHANGE_ROLE"
    | "DELETE_FORM";

export interface AuditLogOptions {
    adminUserId: string;
    action: AdminAction;
    targetType: "user" | "api_key" | "form";
    targetId: string;
    metadata?: any;
}

/**
 * Records an administrative action in the audit log.
 */
export async function recordAuditLog(options: AuditLogOptions) {
    try {
        await db.insert(adminAuditLogs).values({
            adminUserId: options.adminUserId,
            action: options.action,
            targetType: options.targetType,
            targetId: options.targetId,
            metadata: options.metadata || {},
        });
    } catch (error) {
        console.error("Failed to record audit log:", error);
        // We don't throw here to avoid blocking the main action if logging fails,
        // but in a strict system we might want to.
    }
}
