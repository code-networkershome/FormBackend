"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SquareStack, ChevronLeft, Mail, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to process request");

            setMessage(data.message);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative">
            <Link
                href="/login"
                className="absolute left-8 top-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
                <ChevronLeft className="h-4 w-4" />
                Back to Login
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
                </div>

                <Card className="glass-card overflow-hidden">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>
                            Enter your email to receive a secure reset link.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-4">
                        <AnimatePresence mode="wait">
                            {!message ? (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <input
                                                required
                                                type="email"
                                                placeholder="Enter your email"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-primary/5 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <Button className="w-full" size="lg" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Send Reset Link
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-4 py-4"
                                >
                                    <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-emerald-900">Check your inbox</h3>
                                        <p className="text-sm text-emerald-700/80 leading-relaxed px-4">
                                            {message}
                                        </p>
                                    </div>
                                    <Button variant="outline" className="w-full mt-4" asChild>
                                        <Link href="/login">
                                            Return to Login <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100"
                            >
                                {error}
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
