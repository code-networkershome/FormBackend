"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SquareStack, ChevronLeft, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError("Missing reset token. Please check your email link.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    password: formData.password
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to reset password");

            setIsSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center space-y-4 py-8">
                <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <ChevronLeft className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900">Invalid Link</h3>
                    <p className="text-sm text-slate-500">
                        This password reset link is invalid or missing a token.
                    </p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/forgot-password">Request New Link</Link>
                </Button>
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            {!isSuccess ? (
                <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4 pt-4"
                >
                    <div className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                required
                                type="password"
                                placeholder="New Password"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-primary/5 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                required
                                type="password"
                                placeholder="Confirm New Password"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-primary/5 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <Button className="w-full" size="lg" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Reset Password
                    </Button>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100"
                        >
                            {error}
                        </motion.div>
                    )}
                </motion.form>
            ) : (
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4 py-8"
                >
                    <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-emerald-900">Success!</h3>
                        <p className="text-sm text-emerald-700/80 leading-relaxed px-4">
                            Your password has been updated. Redirecting to login...
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative">
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
                        <CardTitle className="text-2xl">New Password</CardTitle>
                        <CardDescription>
                            Set a strong password for your account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 min-h-[200px]">
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-full py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                            </div>
                        }>
                            <ResetPasswordForm />
                        </Suspense>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
