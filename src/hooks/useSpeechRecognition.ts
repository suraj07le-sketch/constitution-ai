"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSettings } from "@/components/SettingsProvider";

interface SpeechRecognitionState {
    transcript: string;
    isListening: boolean;
    error: string | null;
    isSupported: boolean;
}

interface UseSpeechRecognitionReturn extends SpeechRecognitionState {
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

/**
 * Custom React hook wrapping the Web Speech API SpeechRecognition.
 * Works in Chrome/Edge (webkit prefix). Free, no API key needed.
 */
export function useSpeechRecognition(): UseSpeechRecognitionReturn {
    const [state, setState] = useState<SpeechRecognitionState>({
        transcript: "",
        isListening: false,
        error: null,
        isSupported: false,
    });

    const { language } = useSettings();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check browser support
        const SpeechRecognitionAPI =
            typeof window !== "undefined"
                ? window.webkitSpeechRecognition || window.SpeechRecognition
                : null;

        if (SpeechRecognitionAPI) {
            const recognition = new SpeechRecognitionAPI();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = language; // Configured via Settings

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onresult = (event: any) => {
                let finalTranscript = "";
                let interimTranscript = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript;
                    } else {
                        interimTranscript += result[0].transcript;
                    }
                }

                setState((prev) => ({
                    ...prev,
                    transcript: finalTranscript || interimTranscript,
                }));
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onerror = (event: any) => {
                setState((prev) => ({
                    ...prev,
                    error: event.error,
                    isListening: false,
                }));
            };

            recognition.onend = () => {
                setState((prev) => ({
                    ...prev,
                    isListening: false,
                }));
            };

            recognitionRef.current = recognition;
            setState((prev) => ({ ...prev, isSupported: true }));
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [language]);

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            setState((prev) => ({
                ...prev,
                isListening: true,
                error: null,
                transcript: "",
            }));
            recognitionRef.current.start();
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setState((prev) => ({ ...prev, isListening: false }));
        }
    }, []);

    const resetTranscript = useCallback(() => {
        setState((prev) => ({ ...prev, transcript: "" }));
    }, []);

    return {
        ...state,
        startListening,
        stopListening,
        resetTranscript,
    };
}
