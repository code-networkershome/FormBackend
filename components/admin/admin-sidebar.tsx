"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    BarChart3,
    Users,
    Key,
    ShieldAlert,
    LogOut,
    SquareStack,
    ArrowLeft,
    FileText
} from "lucide-react";
import { signOut } from "next-auth/react";

const adminNavigation = [
    { name: "Overview", href: "/admin", icon: BarChart3, exact: true },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Global Forms", href: "/admin/forms", icon: FileText },
    { name: "Global API Keys", href: "/admin/api-keys", icon: Key },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-300">
            <div className="flex h-16 items-center px-6 border-b border-white/10">
                <Link href="/admin" className="flex items-center gap-2">
                    <SquareStack className="h-6 w-6 text-blue-500" />
                    <span className="font-display text-xl font-bold tracking-tight text-white">FormVibe <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded ml-1 uppercase">Admin</span></span>
                </Link>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-6">
                {adminNavigation.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                isActive
                                    ? "bg-white/10 text-white shadow-sm"
                                    : "hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-blue-500" : "text-slate-500 group-hover:text-blue-400")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 space-y-2">
                <Link
                    href="/forms/list"
                    className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white"
                >
                    <ArrowLeft className="mr-3 h-5 w-5" />
                    Back to App
                </Link>
                <div className="border-t border-white/10 pt-2">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-destructive/10 hover:text-destructive-foreground"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out Admin
                    </button>
                </div>
            </div>
        </div>
    );
}
