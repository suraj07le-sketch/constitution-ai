"use client";

import Link from "next/link";

import { PlusCircle, MessageSquare, BookOpen, Home, Settings, HelpCircle, ChevronLeft, ChevronRight, Languages, Zap, SunMoon, Target, GraduationCap, LogOut, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useSettings, LanguageCode, VoiceSpeed } from "@/components/SettingsProvider";
import { useTranslation } from "@/lib/translations";
import { ThemeToggle } from "./ThemeToggle";
import { SCENARIOS, LEARNING_MODES, Scenario, LearningMode } from "@/lib/prompts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    scenario: Scenario;
    mode: LearningMode;
    onScenarioChange: (value: Scenario) => void;
    onModeChange: (value: LearningMode) => void;
    onNewSession?: () => void;
}

const LANGUAGES: { code: LanguageCode; label: string }[] = [
    { code: "en-IN", label: "English" },
    { code: "hi-IN", label: "Hindi" },
    { code: "mr-IN", label: "Marathi" },
    { code: "gu-IN", label: "Gujarati" },
];

export function Sidebar({
    isOpen,
    setIsOpen,
    scenario,
    mode,
    onScenarioChange,
    onModeChange,
    onNewSession
}: SidebarProps) {
    const { language, setLanguage, voiceSpeed, setVoiceSpeed } = useSettings();
    const t = useTranslation(language);

    const getScenarioLabel = (val: Scenario) => {
        switch (val) {
            case "general": return t.topics.general;
            case "fundamental-rights": return t.topics.rights;
            case "dpsp": return t.topics.dpsp;
            case "education-rights": return t.topics.education;
            case "religious-freedom": return t.topics.religion;
            case "freedom-of-expression": return t.topics.expression;
            case "right-to-privacy": return t.topics.privacy;
            case "arrest-detention": return t.topics.arrest;
            case "social-media": return t.topics.social;
            default: return val;
        }
    };

    const getModeLabel = (val: LearningMode) => {
        switch (val) {
            case "upsc": return t.learningModes.upsc;
            case "law": return t.learningModes.law;
            case "civics": return t.learningModes.civics;
            case "citizen": return t.learningModes.citizen;
            default: return val;
        }
    };

    const commonTopics = [
        t.topics.rights,
        t.topics.dpsp,
        "Article 370",
        "Preamble",
        t.topics.arrest
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed md:relative top-0 left-0 h-[100dvh] z-[70] flex flex-col
                    bg-white dark:bg-[#050510] backdrop-blur-3xl
                    border-r border-black/10 dark:border-white/10
                    transition-all duration-300 ease-in-out shadow-2xl overflow-hidden
                    ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:w-72 md:translate-x-0'}
                `}
            >
                {/* Header / New Chat */}
                <div className="p-5 flex items-center gap-2 border-b border-black/5 dark:border-white/5">
                    <button
                        onClick={onNewSession}
                        className="flex items-center gap-3 flex-1 bg-slate-900 dark:bg-white/5 hover:bg-slate-800 dark:hover:bg-white/10 p-3 rounded-2xl transition-all duration-200 text-white shadow-lg shadow-black/10"
                    >
                        <PlusCircle className="w-5 h-5 flex-shrink-0 text-saffron" />
                        <span className="font-bold tracking-tight text-sm">
                            {t.newSession}
                        </span>
                    </button>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden flex items-center justify-center p-3 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-zinc-400 hover:text-red-500 transition-colors"
                        title="Close Sidebar"
                    >
                        <X className="w-5 h-5 flex-shrink-0" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-8">

                    {/* Knowledge Config - Moved from ChatHeader */}
                    <div className="space-y-6 px-1">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                                <Target className="w-3.5 h-3.5 text-saffron" />
                                {t.topicLabel}
                            </label>
                            <Select value={scenario} onValueChange={(v) => onScenarioChange(v as Scenario)}>
                                <SelectTrigger className="w-full h-11 text-xs font-bold bg-slate-50 dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-saffron/50 transition-all rounded-xl ring-0 focus:ring-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-[#0a0a20] border-black/10 dark:border-white/10 text-slate-900 dark:text-white shadow-2xl rounded-xl">
                                    {SCENARIOS.map((s) => (
                                        <SelectItem key={s.value} value={s.value} className="text-xs font-bold py-2.5">
                                            <div className="flex items-center gap-2">
                                                <span>{s.icon}</span>
                                                <span>{getScenarioLabel(s.value)}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                                <GraduationCap className="w-3.5 h-3.5 text-saffron" />
                                {t.modeLabel}
                            </label>
                            <div className="flex flex-col gap-2">
                                {LEARNING_MODES.map((m) => (
                                    <button
                                        key={m.value}
                                        onClick={() => onModeChange(m.value)}
                                        className={`
                                            flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 font-bold border text-xs
                                            ${mode === m.value
                                                ? "bg-gradient-to-br from-saffron to-gold text-black border-transparent shadow-lg shadow-saffron/20"
                                                : "bg-slate-50 dark:bg-white/5 border-transparent text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/10 whitespace-nowrap"
                                            }
                                        `}
                                    >
                                        <span className="text-base grayscale-0">{m.icon}</span>
                                        <span>{getModeLabel(m.value)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Topics Section */}
                    <div className="flex flex-col gap-1">
                        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                            {t.suggestedQuestionsTitle}
                        </div>

                        {commonTopics.map((topic, i) => (
                            <button key={i} className={`
                                flex items-center gap-3 w-full p-3 rounded-xl
                                text-sm font-medium text-slate-600 dark:text-zinc-400
                                hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white
                                transition-all group
                            `}>
                                <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-70 group-hover:opacity-100 group-hover:text-saffron" />
                                <span className={`whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-200`}>
                                    {topic}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col gap-1 pt-4 border-t border-black/5 dark:border-white/5">
                        <Link href="/" className={`
                            flex items-center gap-3 w-full p-3 rounded-xl
                            text-sm font-medium text-slate-600 dark:text-zinc-400
                            hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white
                            transition-all group
                        `}>
                            <Home className="w-4 h-4 flex-shrink-0 opacity-70 group-hover:opacity-100" />
                            <span className="whitespace-nowrap transition-opacity duration-200">
                                {t.homePage}
                            </span>
                        </Link>

                        <button className={`
                            flex items-center gap-3 w-full p-3 rounded-xl
                            text-sm font-medium text-slate-600 dark:text-zinc-400
                            hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white
                            transition-all group
                        `}>
                            <BookOpen className="w-4 h-4 flex-shrink-0 opacity-70 group-hover:opacity-100" />
                            <span className="whitespace-nowrap transition-opacity duration-200">
                                {t.constitutionIndex}
                            </span>
                        </button>

                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                window.location.href = "/";
                            }}
                            className={`
                                flex items-center gap-3 w-full p-3 rounded-xl
                                text-sm font-bold text-red-500/70 hover:text-red-500
                                hover:bg-red-500/10 transition-all group
                            `}
                        >
                            <LogOut className="w-4 h-4 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                                {language === 'hi-IN' ? 'लॉग आउट' : 'Logout'}
                            </span>
                        </button>
                    </div>

                    {/* Settings Section In Sidebar */}
                    <div className="pt-6 mt-4 border-t border-black/5 dark:border-white/5">
                        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-4">
                            Preferences
                        </div>

                        <div className="px-3 space-y-6 pb-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400">
                                    <Languages className="w-4 h-4 text-saffron" />
                                    {t.outputLanguage}
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {LANGUAGES.map((l) => (
                                        <button
                                            key={l.code}
                                            onClick={() => setLanguage(l.code)}
                                            className={`
                                                px-3 py-2.5 text-xs font-bold rounded-xl border transition-all text-left flex items-center justify-between
                                                ${language === l.code
                                                    ? 'bg-saffron/10 border-saffron text-saffron'
                                                    : 'bg-transparent border-black/5 dark:border-white/10 text-zinc-500 hover:border-saffron/50'}
                                            `}
                                        >
                                            {l.label}
                                            {language === l.code && <div className="w-1.5 h-1.5 rounded-full bg-saffron shadow-[0_0_8px_saffron]" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400">
                                        <SunMoon className="w-4 h-4 text-saffron" />
                                        Dark Mode
                                    </div>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="p-5 border-t border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-10 h-10 flex-shrink-0 rounded-2xl bg-white dark:bg-[#050510] 
                            border border-black/10 dark:border-white/10 
                            shadow-xl flex items-center justify-center overflow-hidden
                        `}>
                            <img src="/logo.png" alt="Samvidhan AI" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex flex-col whitespace-nowrap transition-opacity duration-200">
                            <span className="font-black text-sm text-slate-900 dark:text-white tracking-tight">{t.brandName}<span className="text-saffron">.ai</span></span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
