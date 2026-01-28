"use client";

import { motion } from "framer-motion";
import {
    Search,
    Copy,
    Check,
    Mail,
    MessageSquare,
    Calendar,
    ShoppingBag,
    UserPlus,
    FileText,
    Layout,
    Globe,
    SquareStack,
    ArrowRight
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { TEMPLATES } from "@/lib/constants";

const CATEGORIES = ["All", "Contact", "Feedback", "Registration", "Signup"];

export default function LibraryPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filtered = TEMPLATES.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.desc.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "All" || t.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const placeholderEndpoint = "https://formvibe.com/api/v1/f/YOUR_FORM_ID";

    const copyToClipboard = (id: string, htmlFn: (endpoint: string) => string) => {
        const text = htmlFn(placeholderEndpoint);
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header */}
            <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <SquareStack className="h-6 w-6 text-blue-600" />
                        <span className="font-display text-xl font-bold tracking-tight">FormVibe</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
                        <Button variant="premium" size="sm" asChild>
                            <Link href="/login">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-6 py-12">
                <div className="space-y-12">
                    {/* Hero */}
                    <div className="max-w-3xl space-y-4">
                        <h1 className="font-display text-4xl font-bold sm:text-5xl text-slate-900">Form Library</h1>
                        <p className="text-lg text-slate-600">
                            High-quality, pre-built HTML templates for every use case. Copy, paste, and start receiving submissions in seconds.
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                        activeCategory === cat
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((t) => (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group h-full"
                            >
                                <Card className="h-full border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-white">
                                    <CardHeader className="space-y-4">
                                        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                            <t.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">{t.category}</span>
                                            </div>
                                            <CardTitle className="text-xl font-bold text-slate-900">{t.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <p className="text-sm text-slate-600 leading-relaxed">{t.desc}</p>

                                        <div className="relative group/code">
                                            <div className="absolute right-2 top-2 z-10 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="h-8 gap-2 bg-white/90 backdrop-blur-sm"
                                                    onClick={() => copyToClipboard(t.id, t.html)}
                                                >
                                                    {copiedId === t.id ? (
                                                        <><Check className="h-3 w-3 text-emerald-600" /> Copied</>
                                                    ) : (
                                                        <><Copy className="h-3 w-3" /> Copy HTML</>
                                                    )}
                                                </Button>
                                            </div>
                                            <div className="rounded-xl bg-slate-900 p-4 overflow-hidden max-h-48 relative">
                                                <pre className="text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto">
                                                    <code>{t.html(placeholderEndpoint)}</code>
                                                </pre>
                                                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-900 to-transparent" />
                                            </div>
                                        </div>

                                        <Button className="w-full bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200" onClick={() => copyToClipboard(t.id, t.html("https://formvibe.com/api/f/YOUR_ID"))}>
                                            Copy Full Code
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-12 mt-24">
                <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <SquareStack className="h-5 w-5 text-blue-600" />
                        <span className="font-bold text-slate-900">FormVibe</span>
                    </div>
                    <p className="text-sm text-slate-500">© 2026 FormVibe. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/" className="text-sm text-slate-500 hover:text-blue-600">Home</Link>
                        <Link href="/library" className="text-sm text-slate-500 hover:text-blue-600 font-bold">Library</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
