"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    PlusCircle,
    FileText,
    Mail,
    ShieldAlert,
    TrendingUp,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const { data: stats, error: statsError } = useSWR("/api/v1/analytics", fetcher);
    const { data: forms, error: formsError, mutate } = useSWR("/api/v1/forms", fetcher);
    const [isCreating, setIsCreating] = useState(false);
    const [newFormName, setNewFormName] = useState("");
    const router = useRouter();

    const handleCreate = async () => {
        if (!newFormName) return;
        setIsCreating(true);
        const res = await fetch("/api/v1/forms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newFormName }),
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

    const isLoading = !stats || !forms;

    const statCards = [
        { name: "Total Submissions", value: stats?.total ?? 0, icon: FileText, color: "text-blue-600" },
        { name: "Unread", value: stats?.unread ?? 0, icon: Mail, color: "text-blue-500" },
        { name: "Spam", value: stats?.spam ?? 0, icon: ShieldAlert, color: "text-amber-500" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight">Overview</h1>
                    <p className="text-muted-foreground">Welcome back! Here's how your forms are performing.</p>
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
                        <div className="py-4">
                            <input
                                autoFocus
                                type="text"
                                placeholder="e.g. Contact Form"
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                value={newFormName}
                                onChange={(e) => setNewFormName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                variant="premium"
                                className="w-full"
                                onClick={handleCreate}
                                disabled={isCreating || !newFormName}
                            >
                                {isCreating ? "Creating..." : "Create Form"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="glass-card">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.name}
                                </CardTitle>
                                <stat.icon className={cn("h-4 w-4", stat.color)} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {isLoading ? <div className="h-9 w-16 animate-pulse rounded bg-muted" /> : stat.value}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Recent Forms Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recent Forms</h2>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/forms/list" className="gap-2">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-40 animate-pulse rounded-2xl bg-card/20" />
                        ))
                    ) : forms?.length > 0 ? (
                        forms.slice(0, 6).map((form: any, i: number) => (
                            <motion.div
                                key={form.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="glass-card group hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">{form.name}</CardTitle>
                                            <div className={cn(
                                                "h-2 w-2 rounded-full",
                                                form.status === "active" ? "bg-green-500" : "bg-orange-500"
                                            )} />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
                                            <TrendingUp className="h-3 w-3" />
                                            Status: {form.status}
                                        </div>
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href={`/forms/${form.id}/submissions`}>View Submissions</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-muted-foreground bg-card/10 rounded-2xl border border-dashed border-border">
                            No forms created yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

