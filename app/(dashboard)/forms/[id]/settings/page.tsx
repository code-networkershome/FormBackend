"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Save, Trash2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
    const params = useParams();
    const formId = params.id as string;
    const router = useRouter();
    const { data: form, mutate } = useSWR(`/api/v1/forms/${formId}`, fetcher);

    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const [successUrl, setSuccessUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (form) {
            setName(form.name);
            setStatus(form.status);
            setSuccessUrl(form.settings?.success_url || "");
        }
    }, [form]);

    const handleSave = async () => {
        setIsSaving(true);
        await fetch(`/api/v1/forms/${formId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                status,
                settings: { ...form?.settings, success_url: successUrl },
            }),
        });
        mutate();
        setIsSaving(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure? This will delete all submissions for this form.")) return;
        await fetch(`/api/v1/forms/${formId}`, { method: "DELETE" });
        router.push("/forms/list");
    };

    if (!form) return <div className="h-96 animate-pulse rounded-2xl bg-card/20" />;

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="font-display text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Configure your form's behavior and endpoint settings.</p>
            </div>

            <div className="grid gap-8">
                {/* General Settings */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>General Configuration</CardTitle>
                        <CardDescription>Update your form's basic information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Form Name</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="active">Active (Collecting Submissions)</option>
                                <option value="test_mode">Test Mode (Submissions flagged)</option>
                                <option value="paused">Paused (Submissions rejected)</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Behavior & Redirects */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Behavior & Redirects</CardTitle>
                        <CardDescription>What happens after a user submits the form?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Success Redirect URL</label>
                            <input
                                type="url"
                                placeholder="https://your-site.com/thanks"
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                                value={successUrl}
                                onChange={(e) => setSuccessUrl(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">If left empty, we'll show a default success message.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-border/40 pt-6">
                        <Button variant="premium" className="gap-2" onClick={handleSave} disabled={isSaving}>
                            <Save className="h-4 w-4" />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" /> Danger Zone
                        </CardTitle>
                        <CardDescription>Irreversible actions for your form.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between border-t border-destructive/10 pt-6">
                        <div>
                            <p className="font-medium">Delete this form</p>
                            <p className="text-sm text-muted-foreground">Once deleted, you cannot recover the submissions.</p>
                        </div>
                        <Button variant="destructive" className="gap-2" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4" />
                            Delete Form
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
