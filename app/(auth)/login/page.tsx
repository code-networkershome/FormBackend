"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SquareStack, Github, ChevronLeft, Mail, Lock, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: ""
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to register");

            setMessage(data.message);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const res = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
        });

        if (res?.error) {
            if (res.error === "EMAIL_NOT_VERIFIED") {
                setError("Please verify your email address before logging in.");
            } else {
                setError("Invalid email or password.");
            }
            setIsLoading(false);
        } else {
            window.location.href = "/forms";
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative">
            <Link
                href="/"
                className="absolute left-8 top-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
                <ChevronLeft className="h-4 w-4" />
                Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="mb-8 flex flex-col items-center gap-4">
                    <div className="rounded-2xl bg-primary/10 p-4 ring-1 ring-primary/20">
                        <SquareStack className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="font-display text-4xl font-bold tracking-tight">FormVibe</h1>
                    <p className="text-center text-muted-foreground italic">
                        The premium form backend for speed and style.
                    </p>
                </div>

                <Card className="glass-card overflow-hidden">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">Identity Hub</CardTitle>
                        <CardDescription>
                            Access your mission control dashboard.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Button
                            variant="premium"
                            size="lg"
                            className="w-full gap-2 shadow-xl shadow-primary/20"
                            onClick={() => signIn("github", { callbackUrl: "/forms" })}
                        >
                            <Github className="h-5 w-5" />
                            Continue with GitHub
                        </Button>

                        <div className="relative text-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50 before:absolute before:left-0 before:top-1/2 before:h-px before:w-[35%] before:bg-border/50 after:absolute after:right-0 after:top-1/2 after:h-px after:w-[35%] after:bg-border/50">
                            <span className="bg-transparent px-2">Secure Email Access</span>
                        </div>

                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="login">Log In</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            <AnimatePresence mode="wait">
                                <TabsContent value="login" key="login">
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="Personal Email"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-primary/5 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <input
                                                    required
                                                    type="password"
                                                    placeholder="Secure Password"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-primary/5 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <Button className="w-full" disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Sign In
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="signup" key="signup">
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Your Name"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-primary/5 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="Personal Email"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-primary/5 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <input
                                                    required
                                                    type="password"
                                                    placeholder="Secure Password (8+ chars)"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-primary/5 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <Button className="w-full" disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Create Account
                                        </Button>
                                    </form>
                                </TabsContent>
                            </AnimatePresence>
                        </Tabs>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100"
                                >
                                    {error}
                                </motion.div>
                            )}
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-xs font-medium border border-emerald-100"
                                >
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
