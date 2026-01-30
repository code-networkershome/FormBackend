"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Settings,
    PlusCircle,
    LogOut,
    SquareStack,
    ShieldCheck
} from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
    { name: "Dashboard", href: "/forms/list", icon: LayoutDashboard },
    { name: "Library", href: "/library", icon: SquareStack },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ role }: { role?: string }) {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r border-border/40 bg-card/20 backdrop-blur-xl">
            <div className="flex h-16 items-center px-6">
                <Link href="/forms" className="flex items-center gap-2">
                    <SquareStack className="h-6 w-6 text-blue-600" />
                    <span className="font-display text-xl font-bold tracking-tight text-slate-900">FormVibe</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-blue-50 hover:text-blue-600",
                                isActive
                                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100"
                                    : "text-slate-600"
                            )}
                        >
                            <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600")} />
                            {item.name}
                        </Link>
                    );
                })}

                {role === "admin" && (
                    <Link
                        href="/admin"
                        className={cn(
                            "group mt-4 flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all bg-slate-900 text-white shadow-lg hover:bg-slate-800"
                        )}
                    >
                        <ShieldCheck className="mr-3 h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                        Admin Dashboard
                    </Link>
                )}
            </nav>

            <div className="border-t border-slate-200 p-4">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
