import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SCENARIOS, LEARNING_MODES, Scenario, LearningMode } from "@/lib/prompts";
import { useSettings } from "@/components/SettingsProvider";
import { useTranslation } from "@/lib/translations";

interface ScenarioSelectorProps {
    scenario: Scenario;
    mode: LearningMode;
    onScenarioChange: (value: Scenario) => void;
    onModeChange: (value: LearningMode) => void;
}

export function ScenarioSelector({
    scenario,
    mode,
    onScenarioChange,
    onModeChange,
}: ScenarioSelectorProps) {
    const { language } = useSettings();
    const t = useTranslation(language);

    // Map scenario values to translated labels
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

    // Map mode values to translated labels
    const getModeLabel = (val: LearningMode) => {
        switch (val) {
            case "upsc": return t.learningModes.upsc;
            case "law": return t.learningModes.law;
            case "civics": return t.learningModes.civics;
            case "citizen": return t.learningModes.citizen;
            default: return val;
        }
    };

    return (
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 p-4 bg-white/40 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 shadow-sm rounded-2xl backdrop-blur-md">
            {/* Scenario dropdown */}
            <div className="flex items-center gap-3 w-full xl:w-auto">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-500 whitespace-nowrap">
                    {t.topicLabel}
                </span>
                <Select value={scenario} onValueChange={(v) => onScenarioChange(v as Scenario)}>
                    <SelectTrigger
                        id="topic-select"
                        className="w-full xl:w-[240px] h-10 text-[13px] font-semibold bg-white dark:bg-[#0a0a1a] border-black/10 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-saffron/50 hover:shadow-lg transition-all rounded-xl"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#0a0a1a] border-black/10 dark:border-white/10 text-slate-900 dark:text-white shadow-2xl rounded-xl">
                        {SCENARIOS.map((s) => (
                            <SelectItem
                                key={s.value}
                                value={s.value}
                                className="text-sm font-medium py-2.5 cursor-pointer focus:bg-saffron/10 dark:focus:bg-saffron/20 focus:text-saffron-600 dark:focus:text-saffron transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg grayscale group-hover:grayscale-0 transition-opacity">{s.icon}</span>
                                    <span>{getScenarioLabel(s.value)}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Separator for desktop */}
            <div className="hidden xl:block w-px h-8 bg-black/5 dark:bg-white/5 mx-2" />

            {/* Mode pills */}
            <div className="flex items-center gap-2 flex-wrap w-full xl:w-auto">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-500 whitespace-nowrap mr-1">
                    {t.modeLabel}
                </span>
                <div className="flex flex-wrap gap-2">
                    {LEARNING_MODES.map((m) => (
                        <button
                            key={m.value}
                            id={`mode-${m.value}`}
                            onClick={() => onModeChange(m.value)}
                            className={`
                                flex items-center gap-2 text-xs px-4 py-2 rounded-xl transition-all duration-300 font-bold tracking-tight border
                                ${mode === m.value
                                    ? "bg-gradient-to-br from-saffron to-gold text-black border-transparent shadow-[0_4px_20px_-5px_rgba(255,153,51,0.5)] scale-[1.03]"
                                    : "bg-white dark:bg-[#0a0a1a] border-black/10 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-saffron/30 hover:bg-slate-50 dark:hover:bg-white/[0.04] active:scale-95 shadow-sm"
                                }
                            `}
                        >
                            <span className="text-base">{m.icon}</span>
                            <span>{getModeLabel(m.value)}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
