"use client";

import { TEMPLATES } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowRight, Eye, Stars } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LibraryPage() {
    const [isCreating, setIsCreating] = useState<string | null>(null);
    const router = useRouter();

    const handleCreateFromTemplate = async (templateId: string, name: string) => {
        setIsCreating(templateId);
        try {
            const res = await fetch("/api/v1/forms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `My ${name}`,
                    templateId
                }),
            });
            const data = await res.json();

            if (res.ok && data.id) {
                router.push(`/forms/${data.id}/setup`);
            } else {
                alert("Failed to create form from template");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreating(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                    <span className="p-1.5 rounded-lg bg-blue-50">
                        <Stars className="h-4 w-4" />
                    </span>
                    Template Library
                </div>
                <div>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900">Choose a starting point</h1>
                    <p className="text-lg text-slate-600">Accelerate your workflow with our professionally designed form templates.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {TEMPLATES.map((template) => (
                    <Card key={template.id} className="group relative overflow-hidden border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                        <CardHeader className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                    "bg-blue-50 text-blue-600"
                                )}>
                                    <template.icon className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                                    {template.category}
                                </span>
                            </div>
                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                                {template.display_name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-2 leading-relaxed">
                                {template.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="flex flex-wrap gap-2">
                                {template.suggested_fields.map((field) => (
                                    <span key={field.name} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100 font-medium">
                                        {field.label}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="px-6 pb-6 pt-0 flex gap-2">
                            <Button
                                className="flex-1 gap-2 rounded-xl h-11 font-bold shadow-lg shadow-blue-500/10"
                                variant="premium"
                                onClick={() => handleCreateFromTemplate(template.id, template.display_name)}
                                disabled={!!isCreating}
                            >
                                {isCreating === template.id ? (
                                    "Creating..."
                                ) : (
                                    <>
                                        <PlusCircle className="h-4 w-4" />
                                        Use Template
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {/* Blank Form Card */}
                <Card className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer group" onClick={() => router.push("/forms/list")}>
                    <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <PlusCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">Start from scratch</h3>
                    <p className="text-sm text-slate-500 mt-2 text-center">Create a custom form with only the fields you need.</p>
                </Card>
            </div>
        </div>
    );
}
