"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Plus, Trash2, Copy, Check, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export function ApiKeyManager() {
    const [keys, setKeys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [revealedKey, setRevealedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const res = await fetch("/api/v1/developer/keys");
            const data = await res.json();
            setKeys(data);
        } catch (error) {
            console.error("Failed to fetch keys:", error);
        } finally {
            setLoading(false);
        }
    };

    const createKey = async () => {
        if (!newKeyName.trim()) return;
        setCreating(true);
        try {
            const res = await fetch("/api/v1/developer/keys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newKeyName }),
            });
            const data = await res.json();
            setRevealedKey(data.apiKey);
            setNewKeyName("");
            fetchKeys();
        } catch (error) {
            console.error("Failed to create key:", error);
        } finally {
            setCreating(false);
        }
    };

    const revokeKey = async (id: string) => {
        if (!confirm("Are you sure? This will immediately break any applications using this key.")) return;
        try {
            const res = await fetch(`/api/v1/developer/keys/${id}`, { method: "DELETE" });
            if (res.ok) {
                setKeys(keys.filter(k => k.id !== id));
            }
        } catch (error) {
            console.error("Failed to revoke key:", error);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            {revealedKey && (
                <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-3 text-emerald-700 mb-4 font-semibold">
                        <Check className="h-5 w-5" />
                        Key Generated Successfully
                    </div>
                    <p className="text-sm text-emerald-600 mb-4">
                        Please copy your new API key now. For security reasons, <strong>we cannot show it again</strong>.
                    </p>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-white border border-emerald-200 rounded-lg px-4 py-2 font-mono text-sm break-all select-all flex items-center">
                            {revealedKey}
                        </div>
                        <Button
                            variant="outline"
                            className="bg-white border-emerald-200 hover:bg-emerald-50 text-emerald-700"
                            onClick={() => copyToClipboard(revealedKey)}
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        className="mt-4 text-emerald-700 hover:bg-emerald-100"
                        onClick={() => setRevealedKey(null)}
                    >
                        I've stored it safely
                    </Button>
                </div>
            )}

            <Card className="bg-white border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30">
                    <div className="space-y-1">
                        <CardTitle className="text-slate-900 flex items-center gap-2">
                            <Key className="h-5 w-5 text-blue-600" />
                            Active API Keys
                        </CardTitle>
                        <CardDescription>Programmatic access to the FormVibe API.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-12 text-center text-slate-400">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                            Loading keys...
                        </div>
                    ) : keys.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <Key className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No API keys found. Create one to get started.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {keys.map((k) => (
                                <div key={k.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-slate-900">{k.name}</h4>
                                        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                                            <span>{k.preview}...</span>
                                            <span>Created {new Date(k.createdAt).toLocaleDateString()}</span>
                                            {k.lastUsedAt && <span>Used {new Date(k.lastUsedAt).toLocaleDateString()}</span>}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => revokeKey(k.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
                <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Key name (e.g. My Website)"
                            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                        />
                        <Button onClick={createKey} disabled={creating || !newKeyName.trim()}>
                            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                            Create Key
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4 flex gap-3 text-sm text-blue-700/80">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>
                    <strong>Security Tip:</strong> Use unique API keys for different applications. If a key is compromised, you can revoke it individually without affecting other integrations.
                </p>
            </div>
        </div>
    );
}
