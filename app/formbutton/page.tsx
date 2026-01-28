"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    X,
    Send,
    CheckCircle2,
    SquareStack,
    Layout,
    Globe,
    Settings,
    Palette,
    Code
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

// This is the implementation of the floating button FEATURE page
export default function FormButtonPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setIsOpen(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <SquareStack className="h-6 w-6 text-blue-600" />
                        <span className="font-display text-xl font-bold tracking-tight text-slate-900">FormVibe</span>
                    </Link>
                    <div className="flex gap-4">
                        <Link href="/guides" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors py-2">Guides</Link>
                        <Button variant="premium" size="sm" asChild>
                            <Link href="/login">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero */}
                <section className="py-24 px-6 overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

                    <div className="mx-auto max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                        <Layout className="h-3 w-3" />
                                        <span>New Component</span>
                                    </div>
                                    <h1 className="font-display text-5xl font-bold sm:text-7xl text-slate-900 leading-[1.1]">
                                        Interactive <br />
                                        <span className="text-blue-600">Pop-up Forms</span>
                                    </h1>
                                    <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                                        Add a professional feedback button to any website with just two lines of code. No design skills or complex setup required.
                                    </p>
                                </motion.div>

                                <div className="flex gap-4">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-2xl text-lg font-bold" onClick={() => setIsOpen(true)}>
                                        Try the Demo
                                    </Button>
                                    <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl text-lg font-bold border-slate-200" asChild>
                                        <a href="#setup">Setup Guide</a>
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-slate-900">2 min</p>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Setup Time</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-slate-900">Zero</p>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dependencies</p>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Box */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                className="relative"
                            >
                                <div className="aspect-[4/3] bg-slate-100 rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <Globe className="h-12 w-12 text-slate-300 mx-auto" />
                                            <p className="text-slate-400 font-medium italic">Your Beautiful Website</p>
                                        </div>
                                    </div>

                                    {/* The Actual Demo Floating UI */}
                                    <div className="absolute bottom-8 right-8">
                                        <div className="relative">
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                                        className="absolute bottom-16 right-0 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden"
                                                    >
                                                        {isSubmitted ? (
                                                            <div className="p-12 text-center space-y-4">
                                                                <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                                                                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                                                </div>
                                                                <h3 className="text-xl font-bold text-slate-900">Thank You!</h3>
                                                                <p className="text-sm text-slate-500">We appreciate your feedback.</p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="bg-blue-600 p-6 text-white text-center">
                                                                    <h3 className="font-bold">Send Feedback</h3>
                                                                    <p className="text-xs text-blue-100 mt-1">We typically reply in 2 hours.</p>
                                                                </div>
                                                                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                                                                    <input placeholder="Email" type="email" required className="w-full h-11 px-4 text-sm border rounded-xl" />
                                                                    <textarea placeholder="How can we help?" required className="w-full h-24 p-4 text-sm border rounded-xl resize-none" />
                                                                    <Button className="w-full h-11 bg-blue-600 rounded-xl font-bold">Send Message</Button>
                                                                </form>
                                                            </>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <button
                                                onClick={() => setIsOpen(!isOpen)}
                                                className="h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform"
                                            >
                                                {isOpen ? <X /> : <MessageSquare />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="py-24 bg-slate-50">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid md:grid-cols-3 gap-12">
                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                    <Palette className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Fully Customizable</h3>
                                <p className="text-slate-600">Change colors, fonts, and fields to perfectly match your brand identity.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                    <Settings className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Direct Integrations</h3>
                                <p className="text-slate-600">Connect submissions to Slack, Email, or Discord instantly with zero code.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Works Everywhere</h3>
                                <p className="text-slate-600">Works with Webflow, Wix, Squarespace, and any custom-built website.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Setup Section */}
                <section id="setup" className="py-24 px-6">
                    <div className="mx-auto max-w-4xl space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl font-bold text-slate-900">Getting Started is Easy</h2>
                            <p className="text-slate-600">Follow these two steps to add FormVibe Button to your site.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm group">
                                <div className="flex gap-6 items-start">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">1</div>
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-xl">Create a FormVibe form</h4>
                                        <p className="text-slate-500">First, create a form endpoint in your dashboard to start receiving data.</p>
                                        <Button variant="outline" className="h-11 rounded-xl" asChild>
                                            <Link href="/login">Create endpoint</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm group">
                                <div className="flex gap-6 items-start">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">2</div>
                                    <div className="space-y-4 w-full">
                                        <h4 className="font-bold text-xl">Add the script to your HTML</h4>
                                        <p className="text-slate-500">Paste the following script before the closing <code>&lt;/body&gt;</code> tag.</p>

                                        <div className="rounded-2xl bg-slate-900 p-6 overflow-hidden relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Code className="h-4 w-4 text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global CDN</span>
                                                </div>
                                                <Button size="sm" variant="secondary" className="h-8 bg-white/10 text-white hover:bg-white/20">Copy Code</Button>
                                            </div>
                                            <pre className="text-sm font-mono text-slate-300 leading-relaxed overflow-x-auto">
                                                <code>{`<script src="https://cdn.formvibe.com/v1.js" defer></script>
<script>
  window.formvibe = window.formvibe || function() {
    (formvibe.q = formvibe.q || []).push(arguments)
  };
  formvibe("create", { 
    action: "YOUR_FORM_ID" 
  });
</script>`}</code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 py-12">
                <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400">
                        <SquareStack className="h-5 w-5" />
                        <span className="font-bold">FormVibe</span>
                    </div>
                    <p className="text-sm text-slate-400">© 2026 FormVibe. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-slate-400">
                        <Link href="/" className="hover:text-blue-600">Privacy</Link>
                        <Link href="/" className="hover:text-blue-600">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
