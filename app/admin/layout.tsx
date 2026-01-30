import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // 1. Strict Auth Check
    if (!session) {
        redirect("/login");
    }

    // 2. Role Check
    if ((session.user as any).role !== "admin") {
        redirect("/forms/list"); // Send regular users back to dashboard
    }

    // 3. Status Check
    if ((session.user as any).status === "blocked") {
        redirect("/login?error=account_blocked");
    }

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-7xl px-8 py-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
