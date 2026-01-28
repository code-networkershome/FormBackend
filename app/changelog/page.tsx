"use client";

import { motion } from "framer-motion";
import {
    Zap,
    Sparkles,
    ShieldCheck,
    Rocket,
    Code,
    Globe,
    SquareStack
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const UPDATES = [
    {
        date: "Jan 28, 2026",
        version: "v2.0.0",
        title: "The High-Performance Overhaul",
        desc: "A massive update focusing on speed, visual excellence, and developer experience.",
        changes: [
            { type: "new", text: "Brand new Landing Page with rich content and advanced animations." },
            { type: "new", text: "Interactive 'Live Submission' playground on the landing page." },
            { type: "new", text: "Form Library with pre-built HTML templates for common use cases." },
            { type: "improvement", text: "Switched to Corporate Blue & Emerald Green light theme." },
            { type: "fix", text: "Resolved Dashboard navigation loops and UUID type mismatches." }
        ],
        icon: Rocket
    },
    {
        date: "Jan 20, 2026",
        version: "v1.5.0",
        title: "Security & Spam Focus",
        desc: "Enhancing our core engine to block more bots and protect user data.",
        changes: [
            { type: "new", text: "Smart Spam Shield powered by Upstash rate limiting." },
            { type: "improvement", text: "Encrypted storage for all form submissions." },
            { type: "fix", text: "Improved CSV export reliability for large datasets." }
        ],
        icon: ShieldCheck
    },
    {
        date: "Jan 12, 2026",
        version: "v1.2.0",
        title: "Developer SDKs",
        desc: "Making it easier to integrate FormVibe into any stack.",
        changes: [
            { type: "new", text: "Released @formvibe/react hook for type-safe submissions." },
            { type: "new", text: "Global CDN script for vanilla JS environments." },
            { type: "improvement", text: "Enhanced Edge runtime performance for global ingest." }
        ],
        icon: Code
    }
];

export default function ChangelogPage() {
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
                        <Button variant="premium" size="sm" asChild>
                            <Link href="/login">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-3xl px-6 py-16">
                <div className="space-y-16">
                    {/* Hero */}
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 ring-1 ring-inset ring-blue-700/10"
                        >
                            <Sparkles className="h-3 w-3" />
                            <span>What&apos;s New</span>
                        </motion.div>
                        <h1 className="font-display text-4xl font-bold sm:text-6xl text-slate-900">Changelog</h1>
                        <p className="text-lg text-slate-600 max-w-xl mx-auto">
                            Follow our journey as we build the best form backend for modern developers.
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-12">
                        {UPDATES.map((update, i) => (
                            <motion.div
                                key={update.version}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative pl-12 pb-12 last:pb-0"
                            >
                                {/* Connector Line */}
                                <div className="absolute left-[23px] top-10 bottom-0 w-px bg-slate-200" />

                                {/* Icon Hub */}
                                <div className="absolute left-0 top-0 h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center z-10">
                                    <update.icon className="h-6 w-6 text-blue-600" />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{update.version}</span>
                                        <span className="text-sm font-medium text-slate-400">{update.date}</span>
                                    </div>

                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-bold text-slate-900">{update.title}</h2>
                                        <p className="text-slate-600 leading-relaxed">{update.desc}</p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                                        {update.changes.map((change, j) => (
                                            <div key={j} className="flex items-start gap-3">
                                                <span className={cn(
                                                    "mt-1 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                                    change.type === "new" ? "bg-emerald-100 text-emerald-700" :
                                                        change.type === "improvement" ? "bg-blue-100 text-blue-700" :
                                                            "bg-slate-100 text-slate-600"
                                                )}>
                                                    {change.type}
                                                </span>
                                                <span className="text-sm text-slate-700">{change.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
                        <Link href="/changelog" className="text-sm text-slate-500 hover:text-blue-600 font-bold">Changelog</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
