"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Save, Trash2, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { WebhookManager } from "@/components/dashboard/webhook-manager";

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
        try {
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
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRevoke = async () => {
        if (!confirm("Are you sure you want to REVOKE this form? This action is permanent and cannot be undone. The endpoint will be strictly disabled.")) return;

        setIsSaving(true);
        try {
            await fetch(`/api/v1/forms/${formId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "revoked",
                }),
            });
            mutate();
        } catch (error) {
            console.error("Revoke error:", error);
        } finally {
            setIsSaving(false);
        }
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

            {form.status === "revoked" && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                        <h3 className="font-bold text-destructive">Form Revoked</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            This form has been permanently decommissioned. The endpoint is disabled and no longer accepts submissions.
                            Settings are now read-only to preserve historical configuration.
                        </p>
                    </div>
                </div>
            )}

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
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={form.status === "revoked"}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                disabled={form.status === "revoked"}
                            >
                                <option value="active">Active (Collecting Submissions)</option>
                                <option value="test_mode">Test Mode (Submissions flagged)</option>
                                <option value="paused">Paused (Submissions rejected)</option>
                                {form.status === "revoked" && <option value="revoked">Revoked (Permanently Disabled)</option>}
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
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                value={successUrl}
                                onChange={(e) => setSuccessUrl(e.target.value)}
                                disabled={form.status === "revoked"}
                            />
                            <p className="text-xs text-muted-foreground">If left empty, we'll show a default success message.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-border/40 pt-6">
                        <Button
                            variant="premium"
                            className="gap-2"
                            onClick={handleSave}
                            disabled={isSaving || form.status === "revoked"}
                        >
                            <Save className="h-4 w-4" />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Automation & Webhooks Section */}
                <div id="webhooks">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                            Automation & Webhooks
                        </h3>
                        <p className="text-sm text-slate-500">Connect FormVibe to your internal apps and third-party services.</p>
                    </div>
                    <WebhookManager formId={formId} disabled={form.status === "revoked"} />
                </div>

                {/* Danger Zone */}
                <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" /> Danger Zone
                        </CardTitle>
                        <CardDescription>Irreversible actions for your form.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 border-t border-destructive/10 pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Revoke this form</p>
                                <p className="text-sm text-muted-foreground">Stop all future submissions permanently.</p>
                            </div>
                            <Button
                                variant="outline"
                                className="gap-2 border-destructive/20 text-destructive hover:bg-destructive/10"
                                onClick={handleRevoke}
                                disabled={form.status === "revoked" || isSaving}
                            >
                                <ShieldCheck className="h-4 w-4" />
                                {form.status === "revoked" ? "Revoked" : "Revoke Form"}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between opacity-80 italic">
                            <div>
                                <p className="font-medium">Delete this form</p>
                                <p className="text-sm text-muted-foreground text-opacity-70">Irreversibly delete form and submmissions.</p>
                            </div>
                            <Button variant="destructive" className="gap-2 opacity-50 gray-scale hover:opacity-100" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4" />
                                Delete Form
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
