"use client";

import { useState, useEffect } from "react";
import {
    Search,
    MoreHorizontal,
    FileText,
    User,
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
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function FormsManagement() {
    const searchParams = useSearchParams();
    const [forms, setForms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);
    const router = useRouter();

    const fetchForms = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/forms?page=${page}&limit=10&search=${search}`);
            const data = await res.json();
            if (res.ok) {
                setForms(data.data || []);
                setMeta(data.meta);
            } else {
                console.error("API Error:", data.error);
                setForms([]);
            }
        } catch (err) {
            console.error("Failed to fetch admin forms:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchForms();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchForms();
    }, [page]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Global Forms</h1>
                <p className="text-slate-500">Monitor and manage all forms created on the platform.</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search forms by name or owner..."
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
                            <TableHead className="w-[300px]">Form</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Submissions</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {forms.map((form) => (
                            <TableRow key={form.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="font-semibold text-slate-900 truncate max-w-[200px]">{form.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-900">{form.owner?.name || "Unknown"}</span>
                                        <span className="text-xs text-slate-500">{form.owner?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-mono">
                                        {form.submissionCount || 0}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(form.createdAt).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuLabel>Form Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => router.push(`/admin/users?search=${encodeURIComponent(form.owner?.email || "")}`)}>
                                                <User className="h-4 w-4 mr-2" /> View Owner Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push(`/forms/${form.id}/submissions`)}>
                                                <FileText className="h-4 w-4 mr-2" /> View Responses
                                            </DropdownMenuItem>
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
                        Showing page {page} of {meta.totalPages} ({meta.total} forms total)
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
