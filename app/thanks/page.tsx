import { Button } from "@/components/ui/button";
import { SquareStack, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ThanksPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            <div className="w-full max-w-md text-center space-y-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="rounded-2xl bg-primary/10 p-4 ring-1 ring-primary/20 animate-in zoom-in duration-500">
                        <SquareStack className="h-10 w-10 text-primary" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-in slide-in-from-bottom-4 duration-700" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight font-display">Submission Received!</h1>
                    <p className="text-muted-foreground text-lg">
                        Thank you for your message. The form was submitted successfully through FormVibe.
                    </p>
                </div>

                <div className="pt-8">
                    <Button asChild variant="outline" size="lg" className="rounded-full px-8 gap-2 group transition-all hover:pr-10">
                        <Link href="/">
                            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Return to Website
                        </Link>
                    </Button>
                </div>

                <div className="pt-20 text-sm text-muted-foreground/50 font-medium tracking-widest uppercase">
                    Powered by <span className="text-primary/70">FormVibe</span>
                </div>
            </div>
        </div>
    );
}
