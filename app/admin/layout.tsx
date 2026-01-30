import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import Link from "next/link";

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
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-6 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full">
                    <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
                    <p className="text-slate-500 mb-6 text-sm">
                        You are logged in as <span className="font-bold text-slate-800">{(session.user as any).email}</span>, but your current role is <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-mono font-bold uppercase text-[10px]">{(session.user as any).role || "user"}</span>.
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/forms/list"
                            className="block w-full py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                        <p className="text-[10px] text-slate-400">
                            Tip: If you recently updated your role, try signing out and back in to refresh your session.
                        </p>
                    </div>
                </div>
            </div>
        );
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
