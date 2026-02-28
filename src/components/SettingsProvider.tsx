"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type LanguageCode = "en-IN" | "hi-IN" | "mr-IN" | "gu-IN" | "bn-IN" | "ta-IN";
export type VoiceSpeed = 0.8 | 1.0 | 1.25 | 1.5 | 1.75 | 2.0;

interface SettingsContextValue {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    voiceSpeed: VoiceSpeed;
    setVoiceSpeed: (speed: VoiceSpeed) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
    language: "en-IN",
    setLanguage: () => { },
    voiceSpeed: 1.0,
    setVoiceSpeed: () => { },
});

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<LanguageCode>("en-IN");
    const [voiceSpeed, setVoiceSpeedState] = useState<VoiceSpeed>(1.0);

    useEffect(() => {
        const storedLang = localStorage.getItem("samvidhan-lang") as LanguageCode | null;
        if (storedLang) setLanguageState(storedLang);

        const storedSpeed = localStorage.getItem("samvidhan-speed");
        if (storedSpeed) setVoiceSpeedState(parseFloat(storedSpeed) as VoiceSpeed);
    }, []);

    const setLanguage = (lang: LanguageCode) => {
        setLanguageState(lang);
        localStorage.setItem("samvidhan-lang", lang);
    };

    const setVoiceSpeed = (speed: VoiceSpeed) => {
        setVoiceSpeedState(speed);
        localStorage.setItem("samvidhan-speed", speed.toString());
    };

    return (
        <SettingsContext.Provider value={{ language, setLanguage, voiceSpeed, setVoiceSpeed }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
