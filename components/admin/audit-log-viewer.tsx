"use client";

import { useState, useEffect } from "react";
import {
    ShieldCheck,
    ShieldAlert,
    User,
    Key,
    FileText,
    Clock,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Info
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AuditLogViewer() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/audit-logs?page=${page}&limit=10`);
            const data = await res.json();
            if (res.ok) {
                setLogs(data.data || []);
                setMeta(data.meta);
            } else {
                console.error("API Error:", data.error);
                setLogs([]);
            }
        } catch (err) {
            console.error("Failed to fetch audit logs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const getActionIcon = (action: string) => {
        switch (action) {
            case "BLOCK_USER": return <ShieldAlert className="h-4 w-4 text-rose-600" />;
            case "UNBLOCK_USER": return <ShieldCheck className="h-4 w-4 text-emerald-600" />;
            case "REVOKE_API_KEY": return <Key className="h-4 w-4 text-amber-600" />;
            default: return <Info className="h-4 w-4 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Audit Logs</h1>
                <p className="text-slate-500">A transparent record of all administrative actions on the platform.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead>Admin</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                    Loading audit logs...
                                </TableCell>
                            </TableRow>
                        ) : logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                    No audit logs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
                                                {log.admin?.name?.charAt(0) || "A"}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{log.admin?.name || "Admin"}</div>
                                                <div className="text-[10px] text-slate-500">{log.admin?.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getActionIcon(log.action)}
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{log.action.replace("_", " ")}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {log.targetType === "user" ? <User className="h-3 w-3 text-slate-400" /> : <Key className="h-3 w-3 text-slate-400" />}
                                            <span className="text-xs text-slate-600 truncate max-w-[200px]">{log.targetId}</span>
                                            <Badge variant="outline" className="text-[9px] h-4 px-1 capitalize">{log.targetType}</Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs text-slate-500 flex flex-col">
                                            <span className="flex items-center gap-1 font-medium"><Clock className="h-3 w-3" /> {new Date(log.createdAt).toLocaleTimeString()}</span>
                                            <span className="text-[10px]">{new Date(log.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm text-slate-500 font-medium">
                        Showing page {page} of {meta.totalPages} ({meta.total} logs total)
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
