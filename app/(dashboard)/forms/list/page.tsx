"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    PlusCircle,
    MoreVertical,
    Settings,
    Eye,
    Trash2,
    ExternalLink,
    Code
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATES } from "@/lib/constants";

export default function FormsListPage() {
    const { data: forms, error, mutate } = useSWR("/api/v1/forms", fetcher);
    const [isCreating, setIsCreating] = useState(false);
    const [newFormName, setNewFormName] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const router = useRouter();

    const handleCreate = async () => {
        if (!newFormName) return;
        setIsCreating(true);
        const res = await fetch("/api/v1/forms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newFormName, templateId: selectedTemplate }),
        });
        const data = await res.json();
        setIsCreating(false);

        if (!res.ok || !data.id) {
            alert(`Failed to create form: ${data.error || "Unknown error"}`);
            return;
        }

        mutate();
        router.push(`/forms/${data.id}/setup`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? All data will be lost.")) return;
        await fetch(`/api/v1/forms/${id}`, { method: "DELETE" });
        mutate();
    };

    const isLoading = !forms && !error;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight">Your Forms</h1>
                    <p className="text-muted-foreground">Manage and configure all your active form endpoints.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="premium" className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            New Form
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Form</DialogTitle>
                            <DialogDescription>
                                Give your form a name to get started. You can change this later.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Form Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Website Contact"
                                    className="w-full rounded-xl border border-slate-200 bg-background px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                                    value={newFormName}
                                    onChange={(e) => setNewFormName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Choose a Template (Optional)</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setSelectedTemplate(null)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all text-sm font-medium",
                                            selectedTemplate === null
                                                ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                                        )}
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                            <PlusCircle className="h-4 w-4" />
                                        </div>
                                        Blank Form
                                    </button>
                                    {TEMPLATES.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setSelectedTemplate(t.id)}
                                            className={cn(
                                                "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all text-sm font-medium",
                                                selectedTemplate === t.id
                                                    ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                                                    : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                                            )}
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                                <t.icon className="h-4 w-4" />
                                            </div>
                                            {t.title.split(' ')[0]} {/* Show first word for brevity */}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="premium" onClick={handleCreate} disabled={isCreating || !newFormName}>
                                {isCreating ? "Creating..." : "Create Form"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100" />
                    ))
                ) : forms?.length > 0 ? (
                    forms.map((form: any) => (
                        <Card key={form.id} className="bg-white border-slate-100 shadow-sm group hover:border-blue-300 transition-colors">
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl text-slate-900">{form.name}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            form.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                                        )} />
                                        <span className="text-xs text-slate-500 capitalize">{form.status}</span>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/forms/${form.id}/submissions`} className="gap-2">
                                                <Eye className="h-4 w-4" /> View Submissions
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/forms/${form.id}/setup`} className="gap-2">
                                                <Code className="h-4 w-4" /> Setup Guide
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/forms/${form.id}/settings`} className="gap-2">
                                                <Settings className="h-4 w-4" /> Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-500 focus:text-red-600 gap-2"
                                            onClick={() => handleDelete(form.id)}
                                        >
                                            <Trash2 className="h-4 w-4" /> Delete Form
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="pt-4 flex flex-col gap-3">
                                <div className="text-xs text-slate-400">
                                    Updated {new Date(form.updatedAt).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1 text-xs border-slate-200 text-slate-600" size="sm" asChild>
                                        <Link href={`/forms/${form.id}/submissions`}>Data</Link>
                                    </Button>
                                    <Button variant="outline" className="flex-1 text-xs border-slate-200 text-slate-600" size="sm" asChild>
                                        <Link href={`/forms/${form.id}/setup`}>Setup</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center space-y-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                            <PlusCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-display text-xl font-bold text-slate-900">No forms yet</h3>
                            <p className="text-slate-500">Create your first form to start collecting data.</p>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="premium">Create My First Form</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Your First Form</DialogTitle>
                                    <DialogDescription>
                                        Start collecting submissions in seconds. Give your form a name below.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Form Name</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="e.g. My Website Form"
                                            className="w-full rounded-xl border border-slate-200 bg-background px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                                            value={newFormName}
                                            onChange={(e) => setNewFormName(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Choose a Template (Optional)</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setSelectedTemplate(null)}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all text-sm font-medium",
                                                    selectedTemplate === null
                                                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                                                        : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                                                )}
                                            >
                                                <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                                    <PlusCircle className="h-4 w-4" />
                                                </div>
                                                Blank Form
                                            </button>
                                            {TEMPLATES.map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setSelectedTemplate(t.id)}
                                                    className={cn(
                                                        "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all text-sm font-medium",
                                                        selectedTemplate === t.id
                                                            ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                                                            : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                                                    )}
                                                >
                                                    <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                                        <t.icon className="h-4 w-4" />
                                                    </div>
                                                    {t.title.split(' ')[0]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="premium" onClick={handleCreate} disabled={isCreating || !newFormName}>
                                        {isCreating ? "Creating..." : "Create Form"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        </div>
    );
}

