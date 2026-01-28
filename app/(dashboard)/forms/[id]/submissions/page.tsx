"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MailOpen,
    AlertCircle,
    Trash2,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Filter
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SubmissionsPage() {
    const params = useParams();
    const formId = params.id as string;
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [cursor, setCursor] = useState<string | null>(null);

    const queryUrl = `/api/v1/forms/${formId}/submissions?limit=20${statusFilter ? `&status=${statusFilter}` : ""}${cursor ? `&cursor=${cursor}` : ""}`;
    const { data, error, mutate } = useSWR(queryUrl, fetcher);

    const isLoading = !data && !error;

    const updateStatus = async (submissionId: string, newStatus: string) => {
        await fetch(`/api/v1/forms/${formId}/submissions`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ submissionIds: [submissionId], status: newStatus }),
        });
        mutate();
    };

    const handleExportCSV = () => {
        if (!data?.data) return;

        // Flatten the submissions for CSV
        const headers = ["ID", "Status", "Created At", ...new Set(data.data.flatMap((s: any) => Object.keys(s.payload)))];
        const rows = data.data.map((sub: any) => {
            const row: any = {
                ID: sub.id,
                Status: sub.status,
                "Created At": new Date(sub.createdAt).toLocaleString(),
                ...sub.payload
            };
            return headers.map(header => `"${(row[header] || "").toString().replace(/"/g, '""')}"`).join(",");
        });

        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `submissions-${formId}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setStatusFilter(null);
        setCursor(null);
        mutate();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight">Submissions</h1>
                    <p className="text-muted-foreground">Manage and review your form entries.</p>
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Filter className="h-4 w-4" />
                                {statusFilter ? `Filter: ${statusFilter}` : "Filter"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => { setStatusFilter(null); setCursor(null); }}>All</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setStatusFilter("unread"); setCursor(null); }}>Unread</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setStatusFilter("read"); setCursor(null); }}>Read</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setStatusFilter("spam"); setCursor(null); }}>Spam</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={!data?.data?.length}>
                        Export CSV
                    </Button>
                </div>
            </div>

            <Card className="bg-white border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-6 w-16 rounded-full bg-slate-100" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-48 rounded bg-slate-100" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-24 rounded bg-slate-100" /></td>
                                            <td className="px-6 py-4 text-right"><div className="ml-auto h-8 w-8 rounded-full bg-slate-100" /></td>
                                        </tr>
                                    ))
                                ) : data?.data?.length > 0 ? (
                                    data.data.map((sub: any) => (
                                        <motion.tr
                                            key={sub.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-blue-50/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                                                    sub.status === "unread" ? "bg-blue-50 text-blue-600 ring-1 ring-blue-100" :
                                                        sub.status === "read" ? "bg-slate-100 text-slate-500" :
                                                            "bg-amber-50 text-amber-600 ring-1 ring-amber-100"
                                                )}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs truncate text-sm text-slate-700">
                                                    {Object.entries(sub.payload).map(([k, v]) => `${k}: ${v}`).join(", ")}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                                {new Date(sub.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {sub.status === "unread" && (
                                                        <Button variant="ghost" size="icon" onClick={() => updateStatus(sub.id, "read")} className="text-blue-600 hover:bg-blue-50">
                                                            <MailOpen className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" onClick={() => updateStatus(sub.id, "spam")} className="text-amber-600 hover:bg-amber-50">
                                                        <AlertCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            No submissions found.
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4">
                    <p className="text-sm text-slate-500">
                        Showing {data?.data?.length ?? 0} submissions
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-200 text-slate-600"
                            disabled={!cursor && !statusFilter}
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-slate-200 text-slate-600"
                            disabled={!data?.nextCursor}
                            onClick={() => setCursor(data?.nextCursor)}
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

