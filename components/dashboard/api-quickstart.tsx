"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Terminal, Code, AlertTriangle, ShieldCheck, Zap, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ApiQuickstart() {
    return (
        <div className="space-y-6 mt-12">
            <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-slate-900">Developer Tools (Advanced)</h2>
                <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-widest">Guide</span>
            </div>

            <Card className="bg-white border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <Terminal className="h-5 w-5 text-blue-600" />
                        <div>
                            <CardTitle className="text-lg">Programmatic Access Guide</CardTitle>
                            <CardDescription>Common examples for integrating FormVibe into your applications.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                    {/* Scope Notice & Security */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4 space-y-2">
                            <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                                <Info className="h-4 w-4" />
                                Scope Notice
                            </div>
                            <p className="text-xs text-blue-600/80 leading-relaxed">
                                This guide shows common programmatic examples. It is not an exhaustive API reference.
                                API keys inherit the permissions of the user who created them (limited to forms you own).
                            </p>
                        </div>
                        <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4 space-y-2">
                            <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
                                <AlertTriangle className="h-4 w-4" />
                                Security Warning
                            </div>
                            <p className="text-xs text-amber-600/80 leading-relaxed">
                                <strong>Never expose API keys in client-side/browser code.</strong> Use them only in secure backend
                                environments (Node.js, Python, Go, etc.) to prevent account compromise.
                            </p>
                        </div>
                    </div>

                    {/* Auth Section */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            Authentication
                        </h4>
                        <p className="text-sm text-slate-500">
                            Include your API key in the <code className="bg-slate-100 px-1 rounded">Authorization</code> header for all requests.
                        </p>
                        <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-blue-400">
                            Authorization: Bearer YOUR_API_KEY
                        </div>
                    </div>

                    {/* API Examples */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Code className="h-4 w-4 text-blue-600" />
                            Example Endpoints
                        </h4>

                        <Tabs defaultValue="submissions" className="w-full border rounded-xl overflow-hidden">
                            <TabsList className="bg-slate-50 border-b border-slate-100 rounded-none w-full justify-start h-12 px-2 gap-2">
                                <TabsTrigger
                                    value="submissions"
                                    className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                >
                                    Fetch Submissions
                                </TabsTrigger>
                                <TabsTrigger
                                    value="webhooks"
                                    className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                >
                                    Manage Webhooks
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="submissions" className="p-4 space-y-4 mt-0">
                                <div className="space-y-1">
                                    <p className="text-xs font-mono font-semibold text-blue-600">GET /api/v1/forms/&#123;formId&#125;/submissions</p>
                                    <p className="text-[11px] text-slate-500">Retrieve all submissions collected by a specific form.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">cURL Example</p>
                                        <pre className="bg-slate-900 rounded-xl p-4 text-[11px] font-mono text-slate-300 overflow-x-auto">
                                            <code>{`curl -X GET "https://formvibe.com/api/v1/forms/FORM_ID/submissions" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                                        </pre>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Node.js Example (Server-side)</p>
                                        <pre className="bg-slate-900 rounded-xl p-4 text-[11px] font-mono text-slate-300 overflow-x-auto">
                                            <code>{`const response = await fetch("https://formvibe.com/api/v1/forms/FORM_ID/submissions", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
});

const { data } = await response.json();
console.log(data); // Array of submissions`}</code>
                                        </pre>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="webhooks" className="p-4 space-y-4 mt-0">
                                <div className="space-y-1">
                                    <p className="text-xs font-mono font-semibold text-blue-600">POST /api/v1/forms/&#123;formId&#125;/webhooks</p>
                                    <p className="text-[11px] text-slate-500">Subscribe to new submissions via a target URL.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">cURL Example</p>
                                        <pre className="bg-slate-900 rounded-xl p-4 text-[11px] font-mono text-slate-300 overflow-x-auto">
                                            <code>{`curl -X POST "https://formvibe.com/api/v1/forms/FORM_ID/webhooks" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://your-api.com/webhook"}'`}</code>
                                        </pre>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Node.js Example (Server-side)</p>
                                        <pre className="bg-slate-900 rounded-xl p-4 text-[11px] font-mono text-slate-300 overflow-x-auto">
                                            <code>{`await fetch("https://formvibe.com/api/v1/forms/FORM_ID/webhooks", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ 
    url: "https://your-api.com/webhook" 
  })
});`}</code>
                                        </pre>
                                    </div>
                                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 flex gap-3 text-xs text-slate-600">
                                        <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                                        <p>
                                            <strong>Guardrail:</strong> Webhooks are best-effort delivery. Payload is signed
                                            with an HMAC secret provided upon creation for secure verification.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
