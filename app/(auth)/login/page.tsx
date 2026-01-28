"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SquareStack, Github, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
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
                    <p className="text-center text-muted-foreground">
                        The premium form backend for speed and style.
                    </p>
                </div>

                <Card className="glass-card">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in to manage your forms and submissions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Button
                            variant="premium"
                            size="lg"
                            className="w-full gap-2"
                            onClick={() => signIn("github", { callbackUrl: "/forms" })}
                        >
                            <Github className="h-5 w-5" />
                            Continue with GitHub
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full gap-2 border-primary/20 hover:bg-primary/5"
                            onClick={() => signIn("credentials", {
                                email: "guest@vibe.com",
                                password: "guest123",
                                callbackUrl: "/forms"
                            })}
                        >
                            <SquareStack className="h-5 w-5 text-primary" />
                            Local Guest Access
                        </Button>
                        <div className="relative text-center text-xs uppercase text-muted-foreground before:absolute before:left-0 before:top-1/2 before:h-px before:w-[30%] before:bg-border/50 after:absolute after:right-0 after:top-1/2 after:h-px after:w-[30%] after:bg-border/50">
                            <span className="bg-transparent px-2">Secure access</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
