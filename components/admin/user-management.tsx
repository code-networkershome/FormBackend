"use client";

import { useState, useEffect } from "react";
import {
    Search,
    MoreHorizontal,
    ShieldCheck,
    ShieldAlert,
    UserX,
    UserCheck,
    Mail,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export function UserManagement() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?page=${page}&limit=10&search=${search}`);
            const data = await res.json();
            setUsers(data.data);
            setMeta(data.meta);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchUsers();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const toggleStatus = async (userId: string, currentStatus: string) => {
        const action = currentStatus === "active" ? "block" : "unblock";
        const confirmMsg = action === "block"
            ? "Are you sure you want to block this user? They will be immediately signed out and their API keys will be rejected."
            : "Are you sure you want to unblock this user?";

        if (!confirm(confirmMsg)) return;

        setUpdating(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });

            if (res.ok) {
                const data = await res.json();
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: data.status } : u));
            } else {
                const errData = await res.json();
                alert(errData.error || `Failed to ${action} user`);
            }
        } catch (err) {
            console.error(`Error ${action}ing user:`, err);
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
                <p className="text-slate-500">View and manage platform users and their access levels.</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search users by name or email..."
                        className="pl-9 bg-white border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[250px]">User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                            {user.name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900">{user.name || "Anonymous"}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn(
                                        "capitalize px-2 py-0.5 rounded-full border-none",
                                        user.role === "admin" ? "bg-purple-100 text-purple-700 font-bold" : "bg-slate-100 text-slate-600"
                                    )}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={cn(
                                        "capitalize px-2 py-0.5 rounded-full border-none",
                                        user.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                    )}>
                                        {user.status === "active" ? <ShieldCheck className="h-3 w-3 mr-1 inline" /> : <ShieldAlert className="h-3 w-3 mr-1 inline" />}
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" disabled={updating === user.id}>
                                                {updating === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {user.status === "active" ? (
                                                <DropdownMenuItem
                                                    className="text-rose-600 focus:bg-rose-50"
                                                    disabled={user.id === session?.user?.id}
                                                    onClick={() => toggleStatus(user.id, user.status)}
                                                >
                                                    <UserX className="h-4 w-4 mr-2" /> Block User
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem
                                                    className="text-emerald-600 focus:bg-emerald-50"
                                                    onClick={() => toggleStatus(user.id, user.status)}
                                                >
                                                    <UserCheck className="h-4 w-4 mr-2" /> Unblock User
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>View Forms</DropdownMenuItem>
                                            <DropdownMenuItem>View API Usage</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm text-slate-500 font-medium">
                        Showing page {page} of {meta.totalPages} ({meta.total} users total)
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="border-slate-200"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                            disabled={page === meta.totalPages}
                            className="border-slate-200"
                        >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
