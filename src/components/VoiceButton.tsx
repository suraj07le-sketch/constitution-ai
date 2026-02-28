"use client";

interface VoiceButtonProps {
    isListening: boolean;
    isSupported: boolean;
    onClick: () => void;
}

export function VoiceButton({
    isListening,
    isSupported,
    onClick,
}: VoiceButtonProps) {
    if (!isSupported) {
        return (
            <button
                disabled
                className="relative w-14 h-14 rounded-full bg-muted flex items-center justify-center opacity-50 cursor-not-allowed"
                title="Speech recognition not supported in this browser. Try Chrome."
            >
                <span className="text-xl">🎤</span>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`
        relative w-14 h-14 rounded-full flex items-center justify-center
        transition-all duration-300 ease-out border border-black/10 dark:border-white/10
        ${isListening
                    ? "bg-gradient-to-r from-red-500 to-red-600 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.5)] border-red-400"
                    : "bg-gradient-to-r from-saffron to-gold hover:scale-105 shadow-[0_0_30px_-5px_rgba(255,153,51,0.6)]"
                }
      `}
            title={isListening ? "Stop listening" : "Start speaking"}
        >
            {/* Pulse rings when listening */}
            {isListening && (
                <>
                    <span className="absolute inset-0 rounded-full bg-red-500/30 pulse-ring" />
                    <span
                        className="absolute inset-0 rounded-full bg-red-500/20 pulse-ring"
                        style={{ animationDelay: "0.3s" }}
                    />
                    <span
                        className="absolute inset-0 rounded-full bg-red-500/10 pulse-ring"
                        style={{ animationDelay: "0.6s" }}
                    />
                </>
            )}

            {/* Mic icon */}
            <span className="relative z-10 text-xl">
                {isListening ? "⏹️" : "🎤"}
            </span>
        </button>
    );
}
