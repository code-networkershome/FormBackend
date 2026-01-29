"use client";

import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CodeBlock } from "@/components/dashboard/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Terminal, Code2, Globe, CheckCircle2, ChevronRight, Copy, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { TEMPLATES, getTemplateById } from "@/lib/constants";

export default function SetupPage() {
    const params = useParams();
    const formId = params.id as string;
    const { data: form } = useSWR(`/api/v1/forms/${formId}`, fetcher);
    const baseUrl = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "https://formvibe.com");
    const endpointUrl = `${baseUrl}/api/f/${formId}`;

    // Get template code if exists from our metadata
    const template = form?.templateId ? getTemplateById(form.templateId) : null;

    const renderSnippet = (snippet: string) => {
        return snippet.replace(/\{\{ENDPOINT\}\}/g, endpointUrl);
    };

    const htmlCode = template
        ? renderSnippet(template.example_html)
        : `<form action="${endpointUrl}" method="POST">
  <!-- Required for identifier -->
  <input type="email" name="email" required placeholder="User Email" />
  <textarea name="message" required placeholder="Your Message"></textarea>

  <button type="submit">Submit</button>

  <!-- Optional Configuration -->
  <!-- <input type="hidden" name="_next" value="${baseUrl}/thanks" /> -->
  <!-- <input type="hidden" name="_subject" value="New Submission" /> -->
</form>`;

    const reactCode = `import { useFormVibe } from "@formvibe/react";

function SampleForm() {
  const { submit, loading } = useFormVibe({
    formId: "${formId}"
  });

  return (
    <form onSubmit={submit}>
      <input name="email" type="email" placeholder="email@example.com" />
      <button disabled={loading}>Submit</button>
    </form>
  );
}`;

    const fetchCode = template
        ? renderSnippet(template.example_fetch)
        : `fetch("${endpointUrl}", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json" 
  },
  body: JSON.stringify({ 
    email: "user@example.com", 
    message: "Hello!",
    _subject: "Custom AJAX Subject"
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));`;

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                    <span className="p-1.5 rounded-lg bg-blue-50">
                        <Code2 className="h-4 w-4" />
                    </span>
                    Integration Hub
                </div>
                <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900">Form Setup</h1>
                <p className="text-lg text-slate-600">Integrate your form with our endpoint in three simple steps.</p>
            </div>

            {/* Steps Guide */}
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        step: "01",
                        title: "Copy Endpoint",
                        desc: "Your unique secure URL for submissions.",
                        icon: Globe,
                        color: "blue"
                    },
                    {
                        step: "02",
                        title: "Paste Code",
                        desc: "Add our snippet to your project stack.",
                        icon: Terminal,
                        color: "emerald"
                    },
                    {
                        step: "03",
                        title: "Verify Flow",
                        desc: "Send a test entry to see it in action.",
                        icon: CheckCircle2,
                        color: "amber"
                    }
                ].map((s, i) => (
                    <div key={i} className="relative group">
                        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-4xl font-black text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity">{s.step}</span>
                                <div className={`h-12 w-12 rounded-2xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    <s.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                        </div>
                        {i < 2 && (
                            <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                                <ChevronRight className="h-8 w-8 text-slate-200" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Left side: Endpoint & Tabs */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="p-8 pb-0">
                            <div className="flex items-center justify-between mb-2">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-blue-600">Step 1: Your Endpoint</CardTitle>
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 font-mono text-sm text-slate-600 group">
                                <div className="flex-1 truncate">{endpointUrl}</div>
                                <Button size="sm" variant="ghost" className="h-8 gap-2 hover:bg-white" onClick={() => navigator.clipboard.writeText(endpointUrl)}>
                                    <Copy className="h-3.5 w-3.5" />
                                    Copy
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Step 2: Integration Example</h2>

                        <Tabs defaultValue="html" className="w-full">
                            <TabsList className="w-full p-1 bg-slate-100/50 rounded-2xl h-14">
                                <TabsTrigger value="html" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-xs gap-2">
                                    <Globe className="h-4 w-4" /> HTML
                                </TabsTrigger>
                                <TabsTrigger value="react" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-xs gap-2">
                                    <Code2 className="h-4 w-4" /> React
                                </TabsTrigger>
                                <TabsTrigger value="fetch" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-xs gap-2">
                                    <Terminal className="h-4 w-4" /> JavaScript
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="html" className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-sm text-slate-500 flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                            {template ? `Using template: ${template.display_name}` : "Copy this code into any HTML file. Supports _next, _subject, and _replyto fields."}
                                        </div>
                                    </div>
                                    {form ? (
                                        <CodeBlock
                                            code={htmlCode}
                                            language="html"
                                        />
                                    ) : (
                                        <div className="h-48 w-full bg-slate-50 animate-pulse rounded-2xl" />
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="react" className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                    <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                        Use our lightweight hook for built-in AJAX state management.
                                    </div>
                                    <CodeBlock code={reactCode} language="tsx" />
                                </div>
                            </TabsContent>

                            <TabsContent value="fetch" className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                    <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                        AJAX submissions automatically return JSON responses.
                                    </div>
                                    <CodeBlock
                                        code={fetchCode}
                                        language="javascript"
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Advanced Configuration Table */}
                        <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm transition-transform hover:scale-110">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-slate-900">Advanced Configuration</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white rounded-xl">
                                        <tr>
                                            <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-widest text-[10px]">Field</th>
                                            <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-widest text-[10px]">Behavior</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="px-4 py-4 font-mono font-bold text-blue-600">_next</td>
                                            <td className="px-4 py-4 text-slate-500">Redirects the user to this URL after a successful submission.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-4 font-mono font-bold text-blue-600">_subject</td>
                                            <td className="px-4 py-4 text-slate-500">Sets the subject line for the notification email.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-4 font-mono font-bold text-blue-600">_replyto</td>
                                            <td className="px-4 py-4 text-slate-500">Sets the Reply-To address (defaults to the 'email' field).</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-4 font-mono font-bold text-blue-600">_format=json</td>
                                            <td className="px-4 py-4 text-slate-500">Forces the API to return JSON regardless of headers.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side: Verification */}
                <div className="lg:col-span-4 space-y-6 md:sticky md:top-24">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl bg-blue-600 text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CheckCircle2 className="h-24 w-24" />
                        </div>
                        <CardHeader className="p-8 relative">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Step 3: Verify</CardTitle>
                            <h3 className="text-2xl font-bold mt-2">Ready to test?</h3>
                            <CardDescription className="text-blue-100 leading-relaxed pt-2">
                                Send a submission to verify that your data is reaching our servers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 relative">
                            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold h-12 rounded-2xl shadow-lg shadow-black/10 group-hover:shadow-xl transition-all" asChild>
                                <a href={`/forms/${formId}/submissions`}>
                                    Go to Submissions
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-4">
                        <h4 className="font-bold text-slate-900">Need more templates?</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Check out our library for ready-to-use forms for contact, RSVP, and more.</p>
                        <Button variant="outline" className="w-full h-11 rounded-2xl border-slate-100 bg-slate-50 hover:bg-white transition-colors" asChild>
                            <a href="/library">Browse Library</a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
