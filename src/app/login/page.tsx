"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Scale, LogIn, Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e?: React.FormEvent) => {
        if (loading) return;
        if (e) e.preventDefault();
        setError(null);
        setLoading(true);

        console.log("🔥 LOGIN HANDLER TRIGGERED");
        console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET ✅" : "MISSING ❌");
        console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET ✅" : "MISSING ❌");

        // Debug logging for the user to verify client state
        console.log("Attempting login for:", email);

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error("Supabase environment variables are missing at runtime.");
            setError("Configuration Error: Please restart your terminal running 'npm run dev' to pick up the new environment variables.");
            setLoading(false);
            return;
        }

        if (!supabase) {
            console.error("Supabase client is not initialized.");
            setError("Critical Error: Database connection is not ready.");
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Auth Error:", error.message);
                throw error;
            }

            console.log("Login successful! Redirecting...");
            window.location.href = "/chat";
        } catch (err: any) {
            console.error("Login catch block:", err);
            setError(err.message || "Invalid email or password");
        } finally {
            // Trigger Vercel Rebuild
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] text-foreground flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-saffron/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-saffron transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron via-gold to-india-green opacity-50" />

                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-saffron/50 transition-colors duration-500">
                            <Scale className="w-8 h-8 text-saffron" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">Welcome <span className="text-saffron">Back</span></h1>
                        <p className="text-zinc-500 text-sm">Sign in to access your legal companion</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</Label>
                            <div className="relative group/field">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-saffron transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="bg-white/5 border-white/5 h-12 pl-12 rounded-xl focus:border-saffron/50 focus:ring-0 transition-all"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-zinc-500">Password</Label>
                                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-saffron/70 hover:text-saffron">Forgot?</Link>
                            </div>
                            <div className="relative group/field">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-saffron transition-colors" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/5 h-12 pl-12 pr-12 rounded-xl focus:border-saffron/50 focus:ring-0 transition-all"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-saffron transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                            <div className="text-amber-500 text-xs font-bold bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                                ⚠️ Environment keys are missing. Please add <strong>NEXT_PUBLIC_SUPABASE_URL</strong> and <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> to your .env.local file.
                            </div>
                        ) : null}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-red-400 text-xs font-bold bg-red-400/10 border border-red-400/20 p-3 rounded-xl flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-saffron hover:bg-gold text-black font-black uppercase tracking-widest rounded-xl shadow-xl shadow-saffron/10 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-4 h-4" /> Sign In</>}
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-zinc-500 text-sm">
                            New to the Republic? {" "}
                            <Link href="/signup" className="text-saffron font-bold hover:underline underline-offset-4">Create account</Link>
                        </p>
                    </div>
                </div>

                <p className="text-center mt-8 text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-medium italic">
                    Justice • Liberty • Equality • Fraternity
                </p>
            </motion.div>
        </div>
    );
}
