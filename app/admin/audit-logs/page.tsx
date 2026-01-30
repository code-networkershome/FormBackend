import { AuditLogViewer } from "@/components/admin/audit-log-viewer";

export const metadata = {
    title: "Audit Logs | Admin | FormVibe",
    description: "View platform administrative action history.",
};

export default function AdminAuditLogsPage() {
    return <AuditLogViewer />;
}
