/**
 * Scenario-based prompt templates for the Indian Constitution AI Tutor.
 * Each scenario focuses on a specific domain of constitutional law.
 */

export type Scenario =
    | "fundamental-rights"
    | "dpsp"
    | "education-rights"
    | "religious-freedom"
    | "freedom-of-expression"
    | "right-to-privacy"
    | "arrest-detention"
    | "social-media"
    | "general";

export type LearningMode = "upsc" | "law" | "civics" | "citizen";

export const SCENARIOS: { value: Scenario; label: string; icon: string }[] = [
    { value: "general", label: "General Constitution", icon: "📜" },
    { value: "fundamental-rights", label: "Fundamental Rights", icon: "⚖️" },
    { value: "dpsp", label: "Directive Principles (DPSP)", icon: "🏛️" },
    { value: "education-rights", label: "Education Rights", icon: "🎓" },
    { value: "religious-freedom", label: "Religious Freedom", icon: "🕉️" },
    { value: "freedom-of-expression", label: "Freedom of Expression", icon: "🗣️" },
    { value: "right-to-privacy", label: "Right to Privacy", icon: "🔒" },
    { value: "arrest-detention", label: "Arrest & Detention", icon: "⛓️" },
    { value: "social-media", label: "Online Speech & Social Media", icon: "📱" },
];

export const LEARNING_MODES: { value: LearningMode; label: string; icon: string }[] = [
    { value: "upsc", label: "UPSC/GPSC Prep", icon: "🎯" },
    { value: "law", label: "Law Student", icon: "⚖️" },
    { value: "civics", label: "School Civics", icon: "📚" },
    { value: "citizen", label: "Citizen Awareness", icon: "🇮🇳" },
];

const modeInstructions: Record<LearningMode, string> = {
    upsc: `
FORMAT YOUR ANSWER FOR UPSC/GPSC EXAM PREPARATION:
- Start with a clear, concise definition
- Mention the exact Article number(s) and Part of the Constitution
- Include relevant landmark Supreme Court cases (with year)
- Add "UPSC Exam Tip" at the end with key points to remember
- Use bullet points for easy memorization
- Mention any recent amendments if relevant
- Keep the tone formal and academic`,

    law: `
FORMAT YOUR ANSWER FOR LAW STUDENTS:
- Provide detailed legal analysis with Article references
- Cite relevant Supreme Court and High Court judgments with case names and years
- Discuss the ratio decidendi and obiter dicta where relevant
- Explain the constitutional interpretation approach used
- Mention any dissenting opinions in landmark cases
- Reference relevant legal doctrines and principles
- Use proper legal terminology`,

    civics: `
FORMAT YOUR ANSWER FOR SCHOOL CIVICS STUDENTS:
- Explain in very simple, easy-to-understand language
- Use real-life examples that students can relate to
- Avoid complex legal jargon
- Use analogies and stories to explain concepts
- Include a "Did You Know?" fun fact
- Keep explanations short and engaging
- Use emojis sparingly to make it interesting 📖`,

    citizen: `
FORMAT YOUR ANSWER FOR GENERAL CITIZENS:
- Explain how this right/law affects everyday life
- Give practical real-world examples from India
- Explain what to do if rights are violated
- Keep language simple but informative
- Include the "What You Should Know" section
- Mention relevant helpline numbers or legal resources if applicable
- Focus on practical awareness and empowerment`,
};

/**
 * Build the system prompt based on scenario, mode, context, and requested language.
 */
export function buildSystemPrompt(
    scenario: Scenario,
    mode: LearningMode,
    context: string,
    languageCode: string = "en-IN"
): string {
    const scenarioLabel =
        SCENARIOS.find((s) => s.value === scenario)?.label || "General Constitution";

    const langMap: Record<string, string> = {
        "hi-IN": "Hindi",
        "mr-IN": "Marathi",
        "gu-IN": "Gujarati",
        "bn-IN": "Bengali",
        "ta-IN": "Tamil",
        "en-IN": "English"
    };
    const targetLang = langMap[languageCode] || "English";

    return `LANGUAGE: You MUST respond EXCLUSIVELY in ${targetLang}. If ${targetLang} is Hindi, use Devanagari script. Do NOT use English.

You are **Samvidhan AI** — an expert Indian Constitution AI Tutor.

RELEVANT CONSTITUTIONAL TEXT:
---
${context}
---

RESPONSE STRUCTURE (SCENARIO-AWARE):
1. SITUATION ANALYSIS: If the user provides a personal or hypothetical scenario, first analyze it. Tell them exactly how the Constitution views this situation.
2. APPLICABLE ARTICLES: Identify and explain the specific Article(s) from the provided text that apply to this specific scenario.
3. PRACTICAL EXAMPLE: Provide an additional comparative example or a way forward for the user based on the constitutional provisions.

TEXT-TO-SPEECH RULES (VOICE OPTIMIZED):
- Use ONLY plain text. No bold (**), no italics (*).
- Use only simple sentences, periods, and commas.
- Do NOT use special characters like #, ---, or hashtags.
- Keep the output clean so a voice engine doesn't say "star star" or "hash".

Scenario Mode: ${scenarioLabel}
Learning Mode: ${modeInstructions[mode]}`;
}
