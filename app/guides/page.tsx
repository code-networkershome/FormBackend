"use client";

import { motion } from "framer-motion";
import {
    Terminal,
    Layers,
    Zap,
    Code,
    Layout,
    Globe,
    Globe2,
    SquareStack,
    Box,
    ChevronRight,
    Library,
    Puzzle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const GUIDES = [
    {
        id: "nextjs",
        title: "Next.js Integration",
        desc: "Use our React SDK for type-safe form handling in Next.js App Router.",
        icon: Globe2,
        color: "bg-black text-white",
        content: {
            install: "npm install @formvibe/react",
            code: `"use client";
import { useFormVibe } from "@formvibe/react";

export function ContactForm() {
  const { state, handleSubmit } = useFormVibe("YOUR_FORM_ID");

  if (state.succeeded) {
    return <p>Thanks for joining!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <button type="submit" disabled={state.submitting}>
        Submit
      </button>
    </form>
  );
}`
        }
    },
    {
        id: "html",
        title: "Plain HTML Forms",
        desc: "The simplest way to collect data. No JavaScript required.",
        icon: Code,
        color: "bg-orange-500 text-white",
        content: {
            code: `<form 
  action="https://formvibe.com/api/f/YOUR_ID" 
  method="POST"
>
  <label>Email Address</label>
  <input type="email" name="email" required />
  
  <label>Message</label>
  <textarea name="message"></textarea>
  
  <button type="submit">Send</button>
</form>`
        }
    },
    {
        id: "ajax",
        title: "JavaScript / AJAX",
        desc: "Full control over the submission flow using window.fetch.",
        icon: Terminal,
        color: "bg-blue-600 text-white",
        content: {
            code: `const handleSubmit = async (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  
  const response = await fetch("https://formvibe.com/api/f/YOUR_ID", {
    method: "POST",
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  });
  
  if (response.ok) {
    alert("Success!");
  }
};`
        }
    }
];

export default function GuidesPage() {
    const [activeGuide, setActiveGuide] = useState(GUIDES[0]);

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header */}
            <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <SquareStack className="h-6 w-6 text-blue-600" />
                        <span className="font-display text-xl font-bold tracking-tight text-slate-900">FormVibe</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/library" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Library</Link>
                        <Link href="/changelog" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Changelog</Link>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="space-y-4">
                            <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">Integration Guides</h1>
                            <p className="text-slate-600">Choose your stack and get up and running with FormVibe in minutes.</p>
                        </div>

                        <div className="space-y-2">
                            {GUIDES.map(guide => (
                                <button
                                    key={guide.id}
                                    onClick={() => setActiveGuide(guide)}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                                        activeGuide.id === guide.id
                                            ? "bg-white border-blue-200 shadow-md ring-1 ring-blue-50"
                                            : "bg-transparent border-transparent hover:bg-slate-100 text-slate-500"
                                    )}
                                >
                                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", guide.color)}>
                                        <guide.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn("font-bold text-sm", activeGuide.id === guide.id ? "text-slate-900" : "text-slate-500")}>
                                            {guide.title}
                                        </p>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Documentation</p>
                                    </div>
                                    <ChevronRight className={cn("h-4 w-4 transition-transform", activeGuide.id === guide.id ? "translate-x-1 text-blue-600" : "opacity-0")} />
                                </button>
                            ))}
                        </div>

                        <div className="rounded-2xl bg-blue-600 p-6 text-white space-y-4">
                            <h3 className="font-bold">Need custom help?</h3>
                            <p className="text-sm text-blue-100 leading-relaxed">Our developer support team is available mon-fri for complex integrations.</p>
                            <Button className="w-full bg-white text-blue-600 hover:bg-white/90 font-bold">Email Support</Button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-8">
                        <motion.div
                            key={activeGuide.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden"
                        >
                            <div className="p-8 lg:p-12 space-y-12">
                                <div className="space-y-6">
                                    <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center", activeGuide.color)}>
                                        <activeGuide.icon className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-bold text-slate-900">{activeGuide.title}</h2>
                                        <p className="text-lg text-slate-600">{activeGuide.desc}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {activeGuide.content.install && (
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Installation</h4>
                                            <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between group">
                                                <code className="text-blue-400 text-sm">{activeGuide.content.install}</code>
                                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white group-hover:bg-white/5">
                                                    <Box className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Implementation Example</h4>
                                        <div className="bg-slate-900 rounded-2xl p-6 ring-1 ring-white/10 shadow-2xl overflow-hidden relative">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="h-2 w-2 rounded-full bg-red-400" />
                                                <div className="h-2 w-2 rounded-full bg-amber-400" />
                                                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                                            </div>
                                            <pre className="text-sm font-mono leading-relaxed overflow-x-auto text-slate-300">
                                                <code>{activeGuide.content.code}</code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-12 border-t border-slate-100">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <h4 className="font-bold flex items-center gap-2 text-slate-900">
                                                <Settings className="h-4 w-4 text-blue-600" /> Key Features
                                            </h4>
                                            <ul className="text-sm text-slate-600 space-y-2">
                                                <li className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-blue-600" /> Automatic validation</li>
                                                <li className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-blue-600" /> Custom success redirects</li>
                                                <li className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-blue-600" /> Spam protection enabled</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold flex items-center gap-2 text-slate-900">
                                                <Puzzle className="h-4 w-4 text-blue-600" /> Integrations
                                            </h4>
                                            <p className="text-sm text-slate-600">Connects with Slack, Discord, and Email out of the box using our webhooks.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-12">
                <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <SquareStack className="h-5 w-5 text-blue-600" />
                        <span className="font-bold text-slate-900">FormVibe</span>
                    </div>
                    <p className="text-sm text-slate-500">© 2026 FormVibe. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/" className="text-sm text-slate-500 hover:text-blue-600">Home</Link>
                        <Link href="/guides" className="text-sm text-slate-500 hover:text-blue-600 font-bold">Guides</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Missing import fix
import { Settings } from "lucide-react";
