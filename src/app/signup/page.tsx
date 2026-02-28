"use client";

import { useState } from "react";
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

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

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

            setSuccess(true);
            setTimeout(() => router.push("/login"), 5000);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] text-foreground flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-india-green/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-saffron/10 blur-[120px] rounded-full" />
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
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-india-green via-white/20 to-saffron opacity-50" />

                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-india-green/50 transition-colors duration-500">
                            <UserPlus className="w-8 h-8 text-india-green" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">Join the <span className="text-india-green">Republic</span></h1>
                        <p className="text-zinc-500 text-sm">Start your journey into constitutional wisdom</p>
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
                            <p className="text-zinc-400 text-sm">Please check your email to confirm your account. Redirecting you to login...</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Full Name</Label>
                                <div className="relative group/field">
                                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/field:text-india-green transition-colors" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="bg-white/5 border-white/5 h-12 pl-12 rounded-xl focus:border-india-green/50 focus:ring-0 transition-all font-medium"
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
                                        className="bg-white/5 border-white/5 h-12 pl-12 rounded-xl focus:border-india-green/50 focus:ring-0 transition-all"
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
                                        className="bg-white/5 border-white/5 h-12 pl-12 pr-12 rounded-xl focus:border-india-green/50 focus:ring-0 transition-all"
                                        value={password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-india-green transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                                className="w-full h-12 bg-india-green hover:bg-emerald-600 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-emerald-900/10 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Create Account</>}
                            </Button>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-10 text-center border-t border-white/5 pt-8">
                            <p className="text-zinc-500 text-sm">
                                Already a citizen? {" "}
                                <Link href="/login" className="text-india-green font-bold hover:underline underline-offset-4">Sign in here</Link>
                            </p>
                        </div>
                    )}
                </div>

                <p className="text-center mt-8 text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-medium italic">
                    Justice • Liberty • Equality • Fraternity
                </p>
            </motion.div>
        </div>
    );
}
