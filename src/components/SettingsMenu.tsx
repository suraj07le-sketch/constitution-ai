"use client";

import { useState, useRef, useEffect } from "react";
import { useSettings, LanguageCode, VoiceSpeed } from "./SettingsProvider";
import { ThemeToggle } from "./ThemeToggle";
import { useTranslation } from "@/lib/translations";

const LANGUAGES: { code: LanguageCode; label: string }[] = [
    { code: "en-IN", label: "English (India)" },
    { code: "hi-IN", label: "Hindi (हिंदी)" },
    { code: "mr-IN", label: "Marathi (मराठी)" },
    { code: "gu-IN", label: "Gujarati (ગુજરાતી)" },
];

const SPEEDS: { value: VoiceSpeed; label: string }[] = [
    { value: 0.8, label: "0.8x" },
    { value: 1.0, label: "1.0x" },
    { value: 1.25, label: "1.25x" },
    { value: 1.5, label: "1.5x" },
];

export function SettingsMenu() {
    const { language, setLanguage, voiceSpeed, setVoiceSpeed } = useSettings();
    const t = useTranslation(language);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 hover:border-saffron/40 hover:bg-white/[0.08] transition-all text-zinc-300 hover:text-white group"
                aria-label="Settings"
                title="Voice & App Settings"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:rotate-45 transition-transform duration-300"
                >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 md:w-72 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-saffron">
                            {t.settingsTitle}
                        </h3>
                    </div>

                    <div className="p-4 space-y-5">
                        {/* Language Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                {t.outputLanguage}
                            </label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-saffron/50 focus:ring-1 focus:ring-saffron/50 transition-all appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23A1A1AA'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "right 12px center",
                                    backgroundSize: "16px",
                                }}
                            >
                                {LANGUAGES.map((l) => (
                                    <option key={l.code} value={l.code} className="bg-slate-900 border-none">
                                        {l.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Speech Rate */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                {t.speechSpeed}
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {SPEEDS.map((s) => (
                                    <button
                                        key={s.value}
                                        onClick={() => setVoiceSpeed(s.value)}
                                        className={`px-3 py-1.5 text-xs rounded-lg transition-all ${voiceSpeed === s.value
                                            ? "bg-saffron text-black font-bold shadow-md"
                                            : "bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/5"
                                            }`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme */}
                        <div className="space-y-2 pt-2 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                {t.themeLabel}
                            </span>
                            <div className="scale-90 origin-right">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
