import { UserManagement } from "@/components/admin/user-management";

export const metadata = {
    title: "User Management | Admin | FormVibe",
    description: "Manage platform users and access control.",
};

export default function AdminUsersPage() {
    return <UserManagement />;
}
