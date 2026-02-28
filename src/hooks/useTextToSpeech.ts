"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSettings } from "@/components/SettingsProvider";

interface UseTextToSpeechReturn {
    speak: (text: string) => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
    isSpeaking: boolean;
    isPaused: boolean;
    isSupported: boolean;
}

/**
 * Custom React hook wrapping the Web Speech API SpeechSynthesis.
 * Free, offline-capable, no API key needed.
 * Auto-selects the requested language via settings.
 */
export function useTextToSpeech(): UseTextToSpeechReturn {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
    const { language, voiceSpeed } = useSettings();

    useEffect(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            setIsSupported(true);

            // Select appropriate language voice
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                // 1. Try exact match for selected language (e.g. hi-IN)
                let selectedVoice = voices.find((v) => v.lang === language);

                // 2. Fallback to any voice that starts with the same language code (e.g. 'hi')
                if (!selectedVoice) {
                    const baseLangCode = language.split('-')[0];
                    selectedVoice = voices.find((v) => v.lang.startsWith(baseLangCode));
                }

                // 3. Last resort fallback to English
                if (!selectedVoice) {
                    selectedVoice = voices.find((v) => v.lang.startsWith("en"));
                }

                voiceRef.current = selectedVoice || voices[0] || null;
            };

            loadVoices();
            window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

            return () => {
                window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
            };
        }
    }, [language]);

    const speak = useCallback(
        (text: string) => {
            if (!isSupported) return;

            // Stop any current speech
            window.speechSynthesis.cancel();

            // Clean text for speech: strip markdown symbols and special chars
            const cleanText = text
                .replace(/\*\*/g, "")                    // Bold
                .replace(/\*/g, "")                     // Italic
                .replace(/#/g, "")                      // Headers
                .replace(/`/g, "")                      // Code
                .replace(/>/g, "")                      // Blockquotes
                .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Links
                .replace(/[-]{2,}/g, "")                // Multi-dashes
                .replace(/[_]{2,}/g, "")                // Multi-underscores
                .trim();

            const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];

            // Split long text into chunks (some browsers have a character limit)
            const maxLength = 200;

            let currentChunk = "";
            const chunks: string[] = [];

            for (const sentence of sentences) {
                if ((currentChunk + sentence).length > maxLength) {
                    if (currentChunk) chunks.push(currentChunk.trim());
                    currentChunk = sentence;
                } else {
                    currentChunk += sentence;
                }
            }
            if (currentChunk) chunks.push(currentChunk.trim());

            // Speak each chunk sequentially
            let chunkIndex = 0;

            const speakNextChunk = () => {
                if (chunkIndex >= chunks.length) {
                    setIsSpeaking(false);
                    setIsPaused(false);
                    return;
                }

                const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
                if (voiceRef.current) {
                    utterance.voice = voiceRef.current;
                }
                utterance.rate = voiceSpeed;
                utterance.pitch = 1.0;

                utterance.onend = () => {
                    chunkIndex++;
                    speakNextChunk();
                };

                utterance.onerror = () => {
                    setIsSpeaking(false);
                    setIsPaused(false);
                };

                window.speechSynthesis.speak(utterance);
            };

            setIsSpeaking(true);
            setIsPaused(false);
            speakNextChunk();
        },
        [isSupported, voiceSpeed]
    );

    const stop = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setIsPaused(false);
        }
    }, [isSupported]);

    const pause = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    }, [isSupported]);

    const resume = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    }, [isSupported]);

    return {
        speak,
        stop,
        pause,
        resume,
        isSpeaking,
        isPaused,
        isSupported,
    };
}
