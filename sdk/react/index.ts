"use client";

import { useState, FormEvent } from "react";

export interface UseFormVibeOptions {
    formId: string;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    resetOnSuccess?: boolean;
}

export function useFormVibe({
    formId,
    onSuccess,
    onError,
    resetOnSuccess = true,
}: UseFormVibeOptions) {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const endpoint = `${process.env.NEXT_PUBLIC_APP_URL || "https://formvibe.com"}/api/f/${formId}`;

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");
        setError(null);

        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to submit form");
            }

            setData(result);
            setStatus("success");

            if (resetOnSuccess) {
                (e.target as HTMLFormElement).reset();
            }

            onSuccess?.(result);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            setStatus("error");
            onError?.(err);
        }
    };

    return {
        submit,
        loading: status === "submitting",
        status,
        data,
        error,
        isSuccess: status === "success",
        isError: status === "error",
    };
}
