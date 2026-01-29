import { auth } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Mail, Database } from "lucide-react";
import { redirect } from "next/navigation";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";

export default async function GlobalSettingsPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="font-display text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">Manage your profile and platform preferences.</p>
            </div>

            <div className="grid gap-8">
                {/* Profile Section */}
                <Card className="bg-white border-slate-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-900">Profile Information</CardTitle>
                        <CardDescription>Your account details harvested from your login provider.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-blue-100 bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-600">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt={session.user.name || "User"} className="h-full w-full object-cover" />
                                ) : (
                                    session.user?.name?.charAt(0) || "U"
                                )}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold text-slate-900">{session.user?.name}</h3>
                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> {session.user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 pt-4">
                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Account Status</p>
                                        <p className="text-xs text-slate-500">Verified & Active</p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                                    Premium
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                                <div className="flex items-center gap-3">
                                    <Database className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Data Region</p>
                                        <p className="text-xs text-slate-500">Europe (Frankfurt)</p>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500">
                                    Auto-selected
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* API & Developer Section */}
                <div id="developer">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Developer Settings</h2>
                        <p className="text-slate-500">Advanced tools for platform integration and automation.</p>
                    </div>
                    <ApiKeyManager />
                </div>
            </div>
        </div>
    );
}
