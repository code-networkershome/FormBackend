"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
    code: string;
    language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group relative rounded-lg bg-zinc-950 p-4 font-mono text-sm text-zinc-300 ring-1 ring-white/10 shadow-2xl">
            <button
                onClick={copy}
                className="absolute right-3 top-3 rounded-md bg-white/5 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/10"
            >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>
            <pre className="overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    );
}
