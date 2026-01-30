import { ApiKeyMonitoring } from "@/components/admin/api-key-monitoring";

export const metadata = {
    title: "Global API Keys | Admin | FormVibe",
    description: "Monitor and manage platform-wide API keys.",
};

export default function AdminApiKeysPage() {
    return <ApiKeyMonitoring />;
}
