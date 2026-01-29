"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Webhook, Plus, Trash2, Copy, Check, Radio, Signal, Loader2, Link2, Key } from "lucide-react";

interface WebhookManagerProps {
    formId: string;
    disabled?: boolean;
}

export function WebhookManager({ formId, disabled }: WebhookManagerProps) {
    const [webhooks, setWebhooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newUrl, setNewUrl] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        if (formId) fetchWebhooks();
    }, [formId]);

    const fetchWebhooks = async () => {
        try {
            const res = await fetch(`/api/v1/forms/${formId}/webhooks`);
            const data = await res.json();
            setWebhooks(data);
        } catch (error) {
            console.error("Failed to fetch webhooks:", error);
        } finally {
            setLoading(false);
        }
    };

    const addWebhook = async () => {
        if (!newUrl.trim()) return;
        setAdding(true);
        try {
            const res = await fetch(`/api/v1/forms/${formId}/webhooks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: newUrl }),
            });
            if (res.ok) {
                setNewUrl("");
                fetchWebhooks();
            }
        } catch (error) {
            console.error("Failed to add webhook:", error);
        } finally {
            setAdding(false);
        }
    };

    const deleteWebhook = async (webhookId: string) => {
        if (!confirm("Are you sure? This will stop real-time data flow to this URL.")) return;
        try {
            const res = await fetch(`/api/v1/forms/${formId}/webhooks/${webhookId}`, { method: "DELETE" });
            if (res.ok) {
                setWebhooks(webhooks.filter(w => w.id !== webhookId));
            }
        } catch (error) {
            console.error("Failed to delete webhook:", error);
        }
    };

    const copySecret = (id: string, secret: string) => {
        navigator.clipboard.writeText(secret);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <Card className="bg-white border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30">
                <div className="space-y-1">
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                        <Signal className="h-5 w-5 text-blue-600" /> Webhooks
                        <span className="ml-2 text-[10px] uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                            Advanced
                        </span>
                    </CardTitle>
                    <CardDescription>Receive real-time JSON POST requests when this form is submitted.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        Loading webhooks...
                    </div>
                ) : webhooks.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <Webhook className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No webhooks configured for this form.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {webhooks.map((w) => (
                            <div key={w.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <Link2 className="h-4 w-4" />
                                        </div>
                                        <div className="font-mono text-sm text-slate-900 truncate max-w-md">
                                            {w.url}
                                        </div>
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Active
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => deleteWebhook(w.id)}
                                        disabled={disabled}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                {w.secret && (
                                    <div className="flex items-center justify-between bg-slate-900 rounded-lg p-3 group">
                                        <div className="flex items-center gap-2">
                                            <Key className="h-3.5 w-3.5 text-slate-500" />
                                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Signing Secret</span>
                                            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                                {copiedId === w.id ? "Copied!" : "••••••••••••••••"}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-[10px] text-slate-400 hover:text-white hover:bg-slate-800"
                                            onClick={() => copySecret(w.id, w.secret)}
                                        >
                                            {copiedId === w.id ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                                            Copy
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                <div className="flex gap-4">
                    <input
                        type="url"
                        placeholder="https://api.myapp.com/webhooks"
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        disabled={disabled || adding}
                    />
                    <Button onClick={addWebhook} disabled={adding || !newUrl.trim() || disabled}>
                        {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                        Add Webhook
                    </Button>
                </div>
            </div>
        </Card>
    );
}
