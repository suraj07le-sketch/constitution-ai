"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Scale, UserPlus, Mail, Lock, ArrowLeft, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const searchParams = new URLSearchParams(window.location.search);
        const errorParam = searchParams.get('error');

        // Break redirection loops
        if (errorParam === 'auth_loop') {
            console.warn("🔄 [Signup] Auth loop detected, clearing session...");
            supabase.auth.signOut().then(() => {
                if (isMounted) {
                    router.replace("/signup");
                }
            });
            return;
        }

        console.log("🔍 [Signup] Session check starting...");
        
        const timeout = setTimeout(() => {
            if (isMounted) {
                console.warn("⚠️ [Signup] Session check timed out (1s fallback).");
                setCheckingSession(false);
            }
        }, 1000); // 1 second fallback

        const checkSession = async () => {
            try {
                console.log("📡 [Signup] Fetching user from Supabase...");
                const { data: { user } } = await supabase.auth.getUser();
                console.log("📥 [Signup] User response received:", user ? "Active" : "None");
                
                if (user && isMounted) {
                    router.push("/chat");
                } else if (isMounted) {
                    setCheckingSession(false);
                }
            } catch (err) {
                console.error("❌ [Signup] Session check failed:", err);
                if (isMounted) setCheckingSession(false);
            } finally {
                clearTimeout(timeout);
            }
        };
        checkSession();
        return () => { isMounted = false; clearTimeout(timeout); };
    }, [router]);


    const handleSignup = async (e: React.FormEvent) => {
        if (loading) return;
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            setError("Configuration Error: Missing API keys. Please check your environment variables.");
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (error) throw error;

            // If Supabase is configured for auto-signin or doesn't require email confirm
            if (data.session) {
                console.log("Signup successful! Session created. Redirecting to chat...");
                window.location.href = "/chat";
                return;
            }

            // If email confirmation is required, session will be null
            setSuccess(true);
            // No auto-redirect - wait for user to confirm email and then log in manually
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] text-foreground flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Gradients & Agentic Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-india-green/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-saffron/10 blur-[120px] rounded-full" />
                
                {/* Sentinel Agent Elements */}
                <div className="absolute top-1/4 left-1/4 w-px h-64 bg-gradient-to-b from-transparent via-saffron/20 to-transparent blur-sm animate-pulse" />
                <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-12 h-12 rounded-full border border-saffron/10"
                    />
                    <div className="w-1.5 h-1.5 rounded-full bg-saffron/40 shadow-[0_0_10px_#FF9933] opacity-20" />
                </div>
            </div>

            <Link
                href="/"
                className="absolute top-6 left-6 md:top-10 md:left-10 z-50 inline-flex items-center gap-2 text-zinc-500 hover:text-saffron transition-colors group/back"
            >
                <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Back to Home</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10 py-4"
            >

                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-india-green via-white/20 to-saffron opacity-50" />

                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-india-green/50 transition-colors duration-500">
                            <UserPlus className="w-7 h-7 text-india-green" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight mb-1">Join the <span className="text-india-green">Republic</span></h1>
                        <p className="text-zinc-500 text-xs">Start your journey into constitutional wisdom</p>
                    </div>

                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8 space-y-4"
                        >
                            <div className="w-20 h-20 bg-india-green/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-india-green/20">
                                <ShieldCheck className="w-10 h-10 text-india-green" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Verification Sent!</h3>
                            <p className="text-zinc-400 text-sm">Please check your email to confirm your account.</p>
                            <div className="pt-4">
                                <Link href="/login">
                                    <Button className="w-full h-12 bg-india-green hover:bg-emerald-600 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-emerald-900/10 transition-all flex items-center justify-center gap-2">
                                        Go to Login
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Full Name</Label>
                                <div className="relative group/field">
                                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-india-green transition-colors" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="bg-white/5 border-white/5 h-11 pl-12 rounded-xl focus:border-india-green/50 focus:ring-0 transition-all font-medium"
                                        value={fullName}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</Label>
                                <div className="relative group/field">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-india-green transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="bg-white/5 border-white/5 h-11 pl-12 rounded-xl focus:border-india-green/50 focus:ring-0 transition-all"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Secure Password</Label>
                                <div className="relative group/field">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-india-green transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/5 h-11 pl-12 pr-12 rounded-xl focus:border-india-green/50 focus:ring-0 transition-all"
                                        value={password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-india-green transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-zinc-600 mt-1 ml-1 uppercase tracking-wider font-medium italic">Minimum 8 characters with symbols</p>
                            </div>

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
                                className="w-full h-11 bg-india-green hover:bg-emerald-600 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-emerald-900/10 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Create Account</>}
                            </Button>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-6 text-center border-t border-white/5 pt-6">
                            <p className="text-zinc-500 text-xs">
                                Already a citizen? {" "}
                                <Link href="/login" className="text-india-green font-bold hover:underline underline-offset-4">Sign in here</Link>
                            </p>
                        </div>
                    )}
                </div>

                <p className="text-center mt-4 text-[9px] text-zinc-600 uppercase tracking-[0.3em] font-medium italic">
                    Justice • Liberty • Equality • Fraternity
                </p>
            </motion.div>
        </div>
    );
}
