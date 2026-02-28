"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
    articles?: string;
    isStreaming?: boolean;
}

/** Render simple markdown: **bold**, *italic*, `code`, > blockquote, bullet lists */
function renderMarkdown(text: string) {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
        // Blockquote
        if (line.trim().startsWith("> ")) {
            elements.push(
                <blockquote
                    key={i}
                    className="border-l-4 border-saffron/80 pl-4 my-4 text-slate-700 dark:text-zinc-300 italic text-sm md:text-base bg-black/5 dark:bg-white/[0.03] py-3 pr-4 rounded-r-xl"
                >
                    {inlineFormat(line.trim().slice(2))}
                </blockquote>
            );
            // Bullet point
        } else if (line.trim().match(/^[•\-\*] /)) {
            elements.push(
                <li key={i} className="ml-5 list-disc text-sm md:text-base leading-relaxed mb-1">
                    {inlineFormat(line.trim().slice(2))}
                </li>
            );
            // Regular line
        } else if (line.trim() === "") {
            elements.push(<div key={i} className="h-3" />);
        } else {
            elements.push(
                <p key={i} className="text-sm md:text-base text-slate-700 dark:text-zinc-300 leading-relaxed mb-1.5">
                    {inlineFormat(line)}
                </p>
            );
        }
    });

    return elements;
}

/** Apply bold, italic, inline code to a line */
function inlineFormat(text: string): React.ReactNode {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i} className="font-bold text-slate-900 dark:text-white drop-shadow-sm">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
            return <em key={i} className="italic text-slate-800 dark:text-zinc-200">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
            return (
                <code key={i} className="text-[0.85em] bg-black/5 dark:bg-black/40 text-saffron px-2 py-0.5 rounded-md font-mono border border-black/10 dark:border-white/10">
                    {part.slice(1, -1)}
                </code>
            );
        }
        return part;
    });
}

export function ChatMessage({
    role,
    content,
    articles,
    isStreaming,
    isError,
}: ChatMessageProps & { isError?: boolean }) {
    const { speak, stop, isSpeaking } = useTextToSpeech();

    const articleTags = articles
        ? articles
            .split(/[|,]/g)
            .map((a) => a.trim())
            .filter(Boolean)
        : [];

    if (role === "user") {
        return (
            <div className="flex justify-end reveal-up mb-6">
                <div className="max-w-[85%] md:max-w-[70%] group">
                    <div className="bg-gradient-to-br from-slate-900 to-[#1e1b4b] dark:from-[#1e1b4b] dark:to-slate-900 border border-white/10 rounded-[2rem] rounded-tr-md p-5 shadow-xl group-hover:shadow-saffron/20 transition-all duration-500 border-r-4 border-r-saffron/40">
                        <p className="text-sm md:text-base leading-relaxed font-medium text-white tracking-wide">
                            {content}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex justify-start gap-3 md:gap-5 reveal-up mb-8 ${isError ? 'opacity-90' : ''}`}>
            <div className="flex-shrink-0 w-9 h-9 md:w-11 md:h-11 overflow-hidden flex items-center justify-center rounded-2xl bg-white dark:bg-[#0a0a20] border border-black/10 dark:border-white/10 shadow-lg mt-1 group-hover:scale-110 transition-transform">
                <img src="/logo.png" alt="Samvidhan Logo" className="w-[85%] h-[85%] object-cover" />
            </div>

            <div className="max-w-[88%] md:max-w-[80%] group">
                <div className={`backdrop-blur-2xl border px-6 py-5 rounded-[2rem] rounded-tl-md relative transition-all duration-500 shadow-2xl ${isError
                    ? 'bg-red-50/90 dark:bg-red-500/10 border-red-500/30 group-hover:border-red-500/50'
                    : 'bg-white/95 dark:bg-white/[0.07] border-black/5 dark:border-white/10 group-hover:border-saffron/30 dark:group-hover:border-saffron/40 group-hover:shadow-[0_0_30px_rgba(255,153,51,0.15)]'
                    }`}>
                    {isError ? (
                        <div className="flex items-start gap-3">
                            <span className="text-red-500 mt-1">⚠️</span>
                            <div className="text-red-700 dark:text-red-200 text-sm md:text-base leading-relaxed">
                                {content.replace('❌ ', '')}
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            {content ? (
                                <>
                                    {renderMarkdown(content)}
                                    {isStreaming && (
                                        <div className="flex gap-1.5 mt-4 items-center h-4">
                                            <span className="typing-dot w-1.5 h-1.5 bg-saffron rounded-full" />
                                            <span className="typing-dot w-1.5 h-1.5 bg-saffron rounded-full" />
                                            <span className="typing-dot w-1.5 h-1.5 bg-saffron rounded-full" />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4 py-1">
                                    <div className="flex gap-1.5 items-center">
                                        <span className="typing-dot w-1.5 h-1.5 bg-saffron rounded-full" />
                                        <span className="typing-dot w-1.5 h-1.5 bg-saffron rounded-full" />
                                        <span className="typing-dot w-1.5 h-1.5 bg-saffron rounded-full" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron/70 ml-2 animate-pulse">Thinking...</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="relative overflow-hidden rounded-full bg-slate-100 dark:bg-white/5 h-2 w-3/4">
                                            <div className="absolute inset-0 animate-shimmer" />
                                        </div>
                                        <div className="relative overflow-hidden rounded-full bg-slate-100 dark:bg-white/5 h-2 w-1/2">
                                            <div className="absolute inset-0 animate-shimmer" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {content && articleTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-black/[0.03] dark:border-white/[0.03]">
                            {articleTags.map((tag, i) => (
                                <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-[9px] font-black uppercase tracking-widest bg-saffron/5 dark:bg-white/[0.02] text-saffron dark:text-saffron border-saffron/20 py-1.5 px-3 rounded-lg shadow-sm whitespace-normal h-auto leading-tight max-w-full"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {!isStreaming && content && (
                    <div className="flex items-center gap-3 mt-3 ml-2 transition-opacity duration-300">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-4 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 hover:text-white dark:hover:text-black hover:bg-saffron transition-all rounded-lg border border-zinc-200 dark:border-white/5"
                            onClick={() => isSpeaking ? stop() : speak(content)}
                        >
                            {isSpeaking ? "Stop Audio" : "Play Voice"}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-4 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 hover:text-white dark:hover:text-black hover:bg-gold transition-all rounded-lg border border-zinc-200 dark:border-white/5"
                            onClick={() => navigator.clipboard.writeText(content)}
                        >
                            Copy Text
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
