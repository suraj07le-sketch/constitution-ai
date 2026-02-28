"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/ChatMessage";
import { VoiceButton } from "@/components/VoiceButton";
import { Sidebar } from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSettings } from "@/components/SettingsProvider";
import { useTranslation } from "@/lib/translations";
import { Scenario, LearningMode } from "@/lib/prompts";
import { supabase } from "@/lib/supabaseClient";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    articles?: string;
    isStreaming?: boolean;
    isError?: boolean;
}

export default function ChatPage() {
    const { language } = useSettings();
    const t = useTranslation(language);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [scenario, setScenario] = useState<Scenario>("general");
    const [mode, setMode] = useState<LearningMode>("citizen");
    const [ingestionStatus, setIngestionStatus] = useState<
        "unknown" | "ready" | "empty" | "ingesting" | "error"
    >("unknown");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [hasHydrated, setHasHydrated] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {
        transcript,
        isListening,
        isSupported: speechSupported,
        startListening,
        stopListening,
        resetTranscript,
    } = useSpeechRecognition();

    // Load chat history from Supabase on mount
    useEffect(() => {
        let isMounted = true;

        const loadHistory = async () => {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    if (isMounted) setHasHydrated(true);
                    return;
                }

                const { data, error } = await supabase
                    .from("chat_history")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: true });

                if (error) {
                    console.error("Failed to fetch chat history", error);
                } else if (data && data.length > 0 && isMounted) {
                    setMessages(data.map(item => ({
                        id: item.id,
                        role: item.role as "user" | "assistant",
                        content: item.content,
                        articles: item.articles || undefined
                    })));
                }
            } catch (err) {
                console.error("Load history auth error", err);
            } finally {
                if (isMounted) setHasHydrated(true);
            }
        };

        loadHistory();

        return () => {
            isMounted = false;
        };
    }, []);

    // Save new messages to Supabase and update session cookie
    useEffect(() => {
        if (hasHydrated && messages.length > 0) {
            // Set a cookie for 15 days to indicate session state
            const expires = new Date();
            expires.setDate(expires.getDate() + 15);
            document.cookie = `chat_session=active; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        }
    }, [messages, hasHydrated]);

    // Initialize welcome message based on language IF no history exists
    useEffect(() => {
        if (hasHydrated && messages.length === 0) {
            setMessages([
                {
                    id: "welcome",
                    role: "assistant",
                    content: `🙏 Namaste! I am **${t.brandName} AI** — ${t.tagline}.
        
Ask me anything about the Constitution of India:
• **Fundamental Rights** (Part III, Articles 12-35)
• **Directive Principles** (Part IV, Articles 36-51)
• **Fundamental Duties** (Article 51A)
• **Amendments**, **Schedules**, **Case Laws**

🎤 Tap the mic to speak, or type your question below!

> 💡 **Tip:** Select a topic from the dropdown and a learning mode to get tailored answers.`,
                },
            ]);
        }
    }, [t, messages.length]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // When voice transcript changes, update input
    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    const handleSubmit = useCallback(
        async (text?: string) => {
            const question = (text || input).trim();
            if (!question || isLoading) return;

            setInput("");
            const userMsgId = `user-${Date.now()}`;
            const assistantMsgId = `assistant-${Date.now()}`;

            setMessages((prev) => [
                ...prev,
                { id: userMsgId, role: "user", content: question },
                { id: assistantMsgId, role: "assistant", content: "", isStreaming: true },
            ]);

            setIsLoading(true);

            try {
                console.log(`[Chat] Querying: "${question.substring(0, 50)}..."`);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s total timeout

                const res = await fetch("/api/ask", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question, scenario, mode, language }),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    console.error("[Chat] Server rejected request:", res.status, errData);
                    throw new Error(errData.error || `Server responded with status ${res.status}. Please try again.`);
                }

                console.log("[Chat] Stream connected successfully.");
                const articlesCited = res.headers.get("X-Articles-Cited") || "";
                const reader = res.body?.getReader();
                const decoder = new TextDecoder();

                if (reader) {
                    console.log("[Chat] Starting to read stream data...");
                    let fullContent = "";
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value, { stream: true });
                        fullContent += chunk;
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === assistantMsgId
                                    ? { ...msg, content: fullContent, isStreaming: true }
                                    : msg
                            )
                        );
                    }

                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMsgId
                                ? {
                                    ...msg,
                                    content: fullContent,
                                    isStreaming: false,
                                    articles: articlesCited,
                                }
                                : msg
                        )
                    );

                    // Sync to Supabase
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        await supabase.from("chat_history").insert([
                            { user_id: user.id, role: "user", content: question },
                            { user_id: user.id, role: "assistant", content: fullContent, articles: articlesCited }
                        ]);
                    }
                }
            } catch (err: unknown) {
                let errorMessage = "Something went wrong";

                if (err instanceof Error) {
                    if (err.name === 'AbortError') {
                        errorMessage = "⏱️ Request Timed Out (90s). The AI service is currently slow, please try a shorter question or try again in a moment.";
                    } else {
                        errorMessage = err.message;
                    }
                }

                console.error("[Chat] UI Error:", err);

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMsgId
                            ? { ...msg, content: `❌ ${errorMessage}`, isStreaming: false, isError: true }
                            : msg
                    )
                );
            } finally {
                setIsLoading(false);
            }
        },
        [input, isLoading, scenario, mode, language]
    );

    // Auto-submit when voice stops
    useEffect(() => {
        if (!isListening && transcript) {
            handleSubmit(transcript);
            resetTranscript();
        }
    }, [isListening, transcript, handleSubmit, resetTranscript]);

    useEffect(() => {
        checkIngestionStatus();
    }, []);

    const checkIngestionStatus = async () => {
        try {
            const res = await fetch("/api/ingest");
            const data = await res.json();
            setIngestionStatus(data.populated ? "ready" : "empty");
        } catch {
            setIngestionStatus("error");
        }
    };

    const handleNewSession = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from("chat_history").delete().eq("user_id", user.id);
        }
        setMessages([]);
    };

    const handleIngest = async () => {
        setIngestionStatus("ingesting");
        try {
            const res = await fetch("/api/ingest", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                setIngestionStatus("ready");
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `system-${Date.now()}`,
                        role: "assistant",
                        content: `✅ Constitution PDF ingested successfully!\n\n📄 **${data.pdfPages} pages** processed → **${data.totalChunks} knowledge chunks** stored.`,
                    },
                ]);
            } else {
                setIngestionStatus("error");
            }
        } catch {
            setIngestionStatus("error");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const suggestedQuestions = [
        "What is Article 21?",
        "Explain Fundamental Rights",
        "What are Directive Principles?",
        "What is Article 370?",
        "Fundamental Duties",
    ];

    return (
        <div className="h-[100dvh] flex flex-row bg-slate-50 dark:bg-[#050510] text-slate-900 dark:text-foreground overflow-hidden font-sans selection:bg-saffron/30 relative transition-colors duration-500">
            {/* Sidebar Component */}
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                scenario={scenario}
                mode={mode}
                onScenarioChange={setScenario}
                onModeChange={setMode}
                onNewSession={handleNewSession}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative w-full h-full min-w-0 transition-colors duration-500">
                {/* Background Gradients & Glows matched to landing page */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-saffron/5 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
                </div>

                {/* Header - Fixed Height - Ultra Compact 28px/40px height */}
                <header className="flex-shrink-0 bg-white/70 dark:bg-[#050510]/80 backdrop-blur-3xl border-b border-black/5 dark:border-white/5 relative z-20 transition-colors duration-500">
                    <div className="w-full px-6 py-2 md:py-3 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Mobile Menu Toggle */}
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="md:hidden p-2 -ml-2 text-slate-600 dark:text-zinc-400 hover:text-saffron transition-colors"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>

                                <Link href="/" className="flex items-center gap-4 group relative">
                                    <div className="w-12 h-12 overflow-hidden flex items-center justify-center rounded-xl bg-white dark:bg-[#0a0a20] border border-black/10 dark:border-white/10 group-hover:border-saffron/50 transition-all duration-500 shadow-xl group-hover:shadow-saffron/20 relative z-10">
                                        <img src="/logo.png" alt="Samvidhan Logo" className="w-[85%] h-[85%] object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="relative z-10 hidden sm:block">
                                        <h1 className="font-black text-lg md:text-xl leading-tight text-slate-900 dark:text-white tracking-tighter">
                                            {t.brandName}<span className="text-saffron">.ai</span>
                                        </h1>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">
                                            {t.tagline}
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            <div className="flex items-center gap-4">
                                {ingestionStatus === "ready" ? null : ingestionStatus === "empty" ? (
                                    <Button size="sm" onClick={handleIngest} className="h-10 px-6 text-[10px] uppercase font-black tracking-widest bg-saffron text-white hover:bg-gold transition-all rounded-xl shadow-lg shadow-saffron/20">
                                        {t.initializeKnowledge}
                                    </Button>
                                ) : ingestionStatus === "ingesting" ? (
                                    <div className="flex items-center gap-3 bg-saffron/10 px-4 py-2 rounded-2xl border border-saffron/20 backdrop-blur-md">
                                        <div className="w-3 h-3 border-2 border-saffron/30 border-t-saffron rounded-full animate-spin" />
                                        <span className="text-[10px] font-black text-saffron uppercase tracking-[0.2em]">Ingesting...</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Chat Area - Scrollable */}
                <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar" ref={scrollRef}>
                    <div className="max-w-3xl mx-auto px-4 py-8 pb-40 space-y-6">
                        {messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                role={msg.role}
                                content={msg.content}
                                articles={msg.articles}
                                isStreaming={msg.isStreaming}
                                isError={msg.isError}
                            />
                        ))}

                        {messages.length === 1 && (
                            <div className="reveal-up delay-3 pt-6">
                                <div className="flex flex-wrap justify-center gap-2.5">
                                    {suggestedQuestions.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => handleSubmit(q)}
                                            className="text-xs px-4 py-2 rounded-full bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-saffron/40 hover:bg-slate-50 dark:hover:bg-white/[0.06] shadow-sm transition-all"
                                        >
                                            ✨ {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Bottom Command Center - Overlays footer of scroll */}
                <div className="command-center">
                    <div className="max-w-3xl mx-auto flex items-end gap-3 md:gap-4 px-2">
                        <VoiceButton
                            isListening={isListening}
                            isSupported={speechSupported}
                            onClick={() => isListening ? stopListening() : startListening()}
                        />

                        <div className="flex-1 relative group">
                            {isListening && (
                                <div className="absolute -top-10 left-4 text-xs font-bold text-saffron animate-pulse flex items-center gap-2 bg-saffron/10 px-3 py-1 rounded-full border border-saffron/20 backdrop-blur-md">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron"></span>
                                    </span>
                                    Voice Recognition Active...
                                </div>
                            )}
                            <div className="bg-white/90 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 backdrop-blur-xl rounded-2xl p-1 shadow-xl dark:shadow-2xl transition-all duration-300 focus-within:border-saffron/50 focus-within:bg-white dark:focus-within:bg-white/[0.05]">
                                <Textarea
                                    id="chat-input"
                                    ref={textareaRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t.chatPlaceholder}
                                    className="min-h-[50px] max-h-[160px] border-0 bg-transparent focus-visible:ring-0 text-sm md:text-base pr-12 py-3 resize-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                                    rows={1}
                                />
                                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                                    <Button
                                        id="send-btn"
                                        onClick={() => handleSubmit()}
                                        disabled={isLoading || !input.trim()}
                                        className="h-10 w-10 p-0 rounded-xl bg-gradient-to-br from-saffron to-gold text-black shadow-lg hover:scale-105 transition-transform disabled:opacity-30"
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="m22 2-7 20-4-9-9-4Z" />
                                                <path d="M22 2 11 13" />
                                            </svg>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto mt-4 mb-2 text-center pb-safe">
                        <p className="text-[10px] text-zinc-600 dark:text-zinc-500 uppercase tracking-[0.2em] font-medium">
                            {t.systemTag}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
