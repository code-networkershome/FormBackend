"use client";

import { Button } from "@/components/ui/button";
import {
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  Check,
  Code,
  Copy,
  Cpu,
  Globe,
  Lock,
  MessageSquare,
  ChevronDown,
  Layout,
  Terminal,
  Layers,
  Fingerprint,
  SquareStack
} from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
};

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoName, setDemoName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoStatus, setDemoStatus] = useState<"idle" | "loading" | "success">("idle");
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={containerRef} className="relative flex min-h-screen flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-700 overflow-x-hidden">

      {/* Dynamic Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.05)_0%,rgba(255,255,255,0)_50%)]"
      />

      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <SquareStack className="h-7 w-7 text-blue-600" />
            </motion.div>
            <span className="font-display text-2xl font-bold tracking-tight text-slate-900">FormVibe</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {["How it Works", "Features", "Developers", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-slate-600 hover:text-blue-600">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="premium" size="sm" asChild className="shadow-blue-500/20">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="relative pt-32 pb-24 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                >
                  <Zap className="h-4 w-4 fill-blue-600" />
                  <span>v2.0 is now live</span>
                </motion.div>

                <div className="space-y-6">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-6xl font-extrabold tracking-tight sm:text-8xl leading-[1.1]"
                  >
                    The Smart <br />
                    <span className="text-gradient-primary">Form Backend</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                  >
                    Connect your existing forms to our API in seconds. We handle the validation, spam, notifications, and analytics so you don&apos;t have to.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                >
                  <Button variant="premium" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto" asChild>
                    <Link href="/login">
                      Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-slate-200 text-slate-600 w-full sm:w-auto hover:bg-slate-50">
                    <a href="#developers">View Documentation</a>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center lg:justify-start gap-6 text-slate-400"
                >
                  <div className="flex -space-x-3">
                    {[
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100"
                    ].map((src, i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white overflow-hidden bg-slate-100 flex items-center justify-center">
                        <img src={src} alt="Developer" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm">Trusted by <span className="text-slate-900 font-semibold">1,000+</span> developers</p>
                </motion.div>
              </div>

              {/* Animated Floating UI Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative hidden lg:block"
              >
                <div className="aspect-[4/3] rounded-3xl bg-slate-900 p-2 shadow-2xl ring-1 ring-slate-800">
                  <div className="h-full w-full rounded-2xl bg-white overflow-hidden flex flex-col">
                    {/* Dashboard Header Mockup */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest text-slate-500">Recent Submissions</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-2 w-10 rounded-full bg-slate-200" />
                        <div className="h-2 w-2 rounded-full bg-slate-200" />
                      </div>
                    </div>

                    {/* Submissions List Feed */}
                    <div className="flex-1 p-4 space-y-3">
                      {[
                        { name: "Sarah Chen", email: "sarah@design.co", status: "unread", time: "2m ago", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=50&h=50" },
                        { name: "Marcus Aurelius", email: "marcus@rome.gov", status: "read", time: "15m ago", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=50&h=50" },
                        { name: "Jane Doe", email: "jane@startup.io", status: "spam", time: "1h ago", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=50&h=50" },
                        { name: "Arjun Mehta", email: "arjun@dev.in", status: "unread", time: "3h ago", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=50&h=50" }
                      ].map((sub, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full border border-slate-100 overflow-hidden bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                              <img src={sub.image} alt={sub.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="space-y-0.5 text-left">
                              <p className="text-xs font-bold text-slate-900">{sub.name}</p>
                              <p className="text-[10px] text-slate-500">{sub.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider",
                              sub.status === "unread" ? "bg-blue-50 text-blue-600 ring-1 ring-blue-100" :
                                sub.status === "read" ? "bg-slate-100 text-slate-500" :
                                  "bg-amber-50 text-amber-600 ring-1 ring-amber-100"
                            )}>
                              {sub.status}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Success State Overlay Visual */}
                    <div className="mx-4 mb-4 h-16 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <div className="text-center flex items-center gap-3">
                        <Check className="h-4 w-4 text-blue-600 font-bold" />
                        <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Analytics Ready</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Card */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-12 -right-8 glass-card border-slate-200/60 bg-white/80 p-4 rounded-2xl shadow-xl w-48"
                >
                  <p className="text-xs text-slate-500 font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold text-emerald-600">+12.4%</p>
                  <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "70%" }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </motion.div>

                {/* Floating API Success */}
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-8 -left-8 bg-white border border-slate-100 p-4 rounded-2xl shadow-xl flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Success Status</p>
                    <p className="text-[10px] text-emerald-500 font-semibold uppercase">200 OK</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-24 bg-slate-50/50">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
              <motion.h2 {...fadeIn} className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Ready in 3 Simple Steps
              </motion.h2>
              <motion.p {...fadeIn} className="text-lg text-slate-600">
                Integration is frictionless. No backend maintenance required.
              </motion.p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-12"
            >
              {[
                {
                  step: "01",
                  title: "Create Endpoint",
                  desc: "Name your form in the dashboard and get a unique submission URL instantly.",
                  icon: Layout
                },
                {
                  step: "02",
                  title: "Paste URL",
                  desc: "Add our endpoint to your HTML form action or use our React SDK for custom flows.",
                  icon: Code
                },
                {
                  step: "03",
                  title: "Collect Data",
                  desc: "View submissions in real-time, get email alerts, and export data anytime.",
                  icon: MessageSquare
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="relative group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="text-6xl font-black text-slate-50 absolute right-6 top-6 transition-colors group-hover:text-blue-50">
                    {item.step}
                  </div>
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Feature Deep Dive (Bento Grid) */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...fadeIn} className="text-center space-y-4 mb-20">
              <h2 className="font-display text-4xl font-bold sm:text-5xl">Everything you need, <br /> nothing you don&apos;t</h2>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Feature - Large */}
              <motion.div
                {...fadeIn}
                className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-slate-900 p-8 lg:p-12 text-white"
              >
                <div className="relative z-10 max-w-md space-y-6">
                  <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
                    <Fingerprint className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold">Privacy First Strategy</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    GDPR compliant out of the box. Single-click data erasure and encrypted storage ensure your users&apos; data stays safe and under your control.
                  </p>
                  <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                    Learn about Security
                  </Button>
                </div>
                {/* Abstract background element */}
                <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-blue-500/20 to-transparent blur-3xl" />
              </motion.div>

              {/* Edge Runtime */}
              <motion.div
                {...fadeIn}
                className="rounded-3xl border border-slate-100 bg-emerald-50 p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-sm"
              >
                <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <Cpu className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Edge Runtime</h3>
                <p className="text-slate-600 text-sm">
                  Processed on Vercel Edge for sub-50ms ingestion latency globally.
                </p>
              </motion.div>

              {/* Spam Protection */}
              <motion.div
                {...fadeIn}
                className="rounded-3xl border border-slate-100 bg-white p-8 space-y-4 shadow-sm hover:border-blue-200 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Smart Spam Shield</h3>
                <p className="text-slate-600 text-sm">
                  Advanced honeypots and rate-limiting powered by Upstash. Stop the bot noise instantly.
                </p>
              </motion.div>

              {/* Analytics */}
              <motion.div
                {...fadeIn}
                className="rounded-3xl border border-slate-100 bg-white p-8 space-y-4 shadow-sm hover:border-blue-200 transition-colors"
                transition={{ delay: 0.1 }}
              >
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Visual Analytics</h3>
                <p className="text-slate-600 text-sm">
                  Track conversion trends, unread counts, and export everything to CSV for deep analysis.
                </p>
              </motion.div>

              {/* Seamless Export */}
              <motion.div
                {...fadeIn}
                className="rounded-3xl border border-slate-100 bg-slate-950 p-8 space-y-4 shadow-sm hover:bg-black transition-colors"
                transition={{ delay: 0.2 }}
              >
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Data Portability</h3>
                <p className="text-slate-400 text-sm">
                  Connect your data to your favorite tools via Zapier, Webhooks, or direct API access.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Developer Experience (Code Section) */}
        <section id="developers" className="py-24 bg-slate-900 overflow-hidden relative">
          {/* Background Glow */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-blue-500/10 blur-[150px]" />

          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <motion.div {...fadeIn} className="space-y-4">
                  <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">Built for Developers</h2>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    Integrate into any stack in minutes. Use our React hook for type-safe submissions or a simple HTML action for static sites.
                  </p>
                </motion.div>

                <motion.div
                  {...fadeIn}
                  className="space-y-4"
                >
                  {[
                    "Zero dependencies for basic integration",
                    "Fully type-safe React SDK included",
                    "Custom success/failure redirects",
                    "Internal API secret protection"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="h-3 w-3 text-emerald-500" />
                      </div>
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {/* Code Block */}
                <div className="rounded-2xl bg-slate-800/50 p-1 ring-1 ring-white/10 backdrop-blur-sm overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-slate-800/80">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400/50" />
                      <div className="h-3 w-3 rounded-full bg-amber-400/50" />
                      <div className="h-3 w-3 rounded-full bg-emerald-400/50" />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                      <Terminal className="h-3 w-3" />
                      submission.html
                    </div>
                  </div>
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-sm font-mono leading-relaxed">
                      <code className="text-slate-300">
                        {`<form 
  action="https://formvibe.com/api/f/demo" 
  method="POST"
>
  <input type="text" name="name" />
  <input name="email" type="email" />
  <button type="submit">Send</button>
</form>`}
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Live Demo Playground */}
                <div className="rounded-3xl bg-white p-8 shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center gap-2 mb-8 text-slate-400">
                    <Zap className="h-4 w-4 fill-blue-500 text-blue-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Live Integration Preview</span>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (demoStatus !== "idle") return;

                      setDemoStatus("loading");
                      // Simulate network delay
                      await new Promise(r => setTimeout(r, 1500));
                      setDemoStatus("success");

                      setTimeout(() => {
                        setDemoStatus("idle");
                      }, 3000);
                    }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Alex Johnson"
                        required
                        value={demoName}
                        onChange={(e) => setDemoName(e.target.value)}
                        className="h-12 w-full rounded-xl bg-slate-50 border border-slate-100 px-4 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="alex@example.com"
                        required
                        value={demoEmail}
                        onChange={(e) => setDemoEmail(e.target.value)}
                        className="h-12 w-full rounded-xl bg-slate-50 border border-slate-100 px-4 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>

                    <Button
                      disabled={demoStatus !== "idle"}
                      className={cn(
                        "w-full h-14 rounded-2xl font-bold text-base transition-all duration-500 shadow-lg",
                        demoStatus === "idle" && "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 hover:scale-[1.02] active:scale-95",
                        demoStatus === "loading" && "bg-slate-100 text-slate-400 cursor-not-allowed",
                        demoStatus === "success" && "bg-emerald-500 text-white shadow-emerald-500/20"
                      )}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {demoStatus === "idle" && (
                          <>
                            Send Test Data
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                        {demoStatus === "loading" && (
                          <>
                            <div className="h-4 w-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                            Connecting to API...
                          </>
                        )}
                        {demoStatus === "success" && (
                          <>
                            <Check className="h-5 w-5" />
                            Submission Verified!
                          </>
                        )}
                      </div>
                    </Button>
                  </form>

                  {/* Glassmorphism success overlay */}
                  <AnimatePresence>
                    {demoStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[2px] pointer-events-none flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-2xl"
                        >
                          <Check className="h-10 w-10" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center space-y-4 mb-20">
              <motion.h2 {...fadeIn} className="font-display text-4xl font-bold sm:text-5xl">Transparent Pricing</motion.h2>
              <motion.p {...fadeIn} className="text-lg text-slate-600">Start free, upgrade as you grow.</motion.p>
            </div>

            <div className="mx-auto max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border-2 border-blue-600 bg-white p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-xs font-bold rounded-bl-xl uppercase">
                  Popular
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">Standard Tier</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">$0</span>
                      <span className="text-slate-500 font-medium tracking-tight">/mo - forever</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6">
                    {[
                      "Standard monthly submissions",
                      "Email notifications",
                      "Advanced dashboard access",
                      "Spam protection",
                      "CSV data exports"
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-slate-600">
                        <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button variant="premium" className="w-full h-12 text-lg shadow-blue-200" asChild>
                    <Link href="/login">Get Started</Link>
                  </Button>
                  <p className="text-center text-xs text-slate-400">No credit card required</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-slate-50/50">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-display text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Is it really zero configuration?",
                  a: "Yes! Simply point your HTML form's action attribute to our unique endpoint URL and you're good to go. No server-side code needed."
                },
                {
                  q: "How does the spam protection work?",
                  a: "We use a combination of hidden 'honeypot' fields, IP rate limiting via Upstash, and heuristic analysis to identify and block bot traffic before it hits your inbox."
                },
                {
                  q: "Can I use it with React or Vue?",
                  a: "Absolutely. You can submit data via standard fetch/axios requests or use our upcoming React SDK which provides type-safe hooks for form state and submissions."
                },
                {
                  q: "Where is my data stored?",
                  a: "All data is securely stored in a professional-grade PostgreSQL database on Neon, located in high-availability regions."
                }
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    {faq.q}
                    <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform", activeFaq === i && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed text-sm">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-[3rem] bg-blue-600 p-12 lg:p-24 text-center text-white relative shadow-2xl shadow-blue-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <h2 className="font-display text-4xl font-bold sm:text-6xl">Ready to stop worrying about backends?</h2>
              <p className="text-xl text-blue-100 leading-relaxed">Join 1,000+ developers building faster with FormVibe. No setup, no servers, no headaches.</p>
              <Button className="bg-white text-blue-600 hover:bg-slate-50 h-16 px-10 text-xl font-bold rounded-2xl shadow-lg ring-4 ring-white/20" asChild>
                <Link href="/login">Create My Account</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <SquareStack className="h-6 w-6 text-blue-600" />
                <span className="font-display text-2xl font-bold tracking-tight text-slate-900">FormVibe</span>
              </Link>
              <p className="text-slate-500 max-w-xs leading-relaxed">
                Modern form backend for frontend developers. Secure, scalable, and completely serverless.
              </p>
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer text-slate-400 hover:text-blue-600">
                    <Globe className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Product</h4>
              <ul className="space-y-4">
                {[
                  { name: "Features", href: "#features" },
                  { name: "Form Library", href: "/library" },
                  { name: "Pricing", href: "#pricing" },
                  { name: "Changelog", href: "/changelog" }
                ].map(link => (
                  <li key={link.name}><Link href={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Resources</h4>
              <ul className="space-y-4">
                {[
                  { name: "Documentation", href: "/guides" },
                  { name: "Integration Guides", href: "/guides" },
                  { name: "FormVibe Button", href: "/formbutton" },
                  { name: "Community", href: "#" }
                ].map(link => (
                  <li key={link.name}><Link href={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Company</h4>
              <ul className="space-y-4">
                {["About", "Blog", "Privacy", "Terms"].map(link => (
                  <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-400">© {new Date().getFullYear()} FormVibe. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
