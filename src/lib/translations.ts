import { LanguageCode } from "@/components/SettingsProvider";

export interface Translations {
    brandName: string;
    tagline: string;
    topicLabel: string;
    modeLabel: string;
    chatPlaceholder: string;
    knowledgeOnline: string;
    initializeKnowledge: string;
    newSession: string;
    homePage: string;
    constitutionIndex: string;
    settingsTitle: string;
    outputLanguage: string;
    speechSpeed: string;
    themeLabel: string;
    suggestedQuestionsTitle: string;
    systemTag: string;
    welcomeTitle: string;
    welcomeSubtitle: string;
    learningModes: {
        upsc: string;
        law: string;
        civics: string;
        citizen: string;
    };
    topics: {
        general: string;
        rights: string;
        dpsp: string;
        education: string;
        religion: string;
        expression: string;
        privacy: string;
        arrest: string;
        social: string;
    };
    landing: {
        enterPlatform: string;
        superIntelligence: string;
        heroTitlePart1: string;
        heroTitlePart2: string;
        heroDesc: string;
        startInteraction: string;
        exploreFeatures: string;
        metricsTitle: string;
        metricsSubtitle: string;
        metricsDesc: string;
        metric1Label: string;
        metric2Label: string;
        metric3Label: string;
        faqTitle: string;
        faqSubtitle: string;
        ctaTitle: string;
        ctaSubtitle: string;
        ctaDesc: string;
        launchPlatform: string;
        allRightsReserved: string;
    };
}

const en: Translations = {
    brandName: "Samvidhan",
    tagline: "Indian Constitution Voice Tutor",
    topicLabel: "Topic:",
    modeLabel: "Mode:",
    chatPlaceholder: "Ask about Article 21, Fundamental Rights...",
    knowledgeOnline: "Knowledge Online",
    initializeKnowledge: "Initialize Knowledge",
    newSession: "New Session",
    homePage: "Home Page",
    constitutionIndex: "Constitution Index",
    settingsTitle: "Settings",
    outputLanguage: "Output & Voice Language",
    speechSpeed: "Speech Speed",
    themeLabel: "App Theme",
    suggestedQuestionsTitle: "Suggested Questions",
    systemTag: "Samvidhan AI • Indian Constitutional Framework",
    welcomeTitle: "Namaste! I am Samvidhan AI",
    welcomeSubtitle: "Your Indian Constitution Voice Tutor",
    learningModes: {
        upsc: "UPSC/GPSC Prep",
        law: "Law Student",
        civics: "School Civics",
        citizen: "Citizen Awareness"
    },
    topics: {
        general: "General Constitution",
        rights: "Fundamental Rights",
        dpsp: "Directive Principles",
        education: "Education Rights",
        religion: "Religious Freedom",
        expression: "Freedom of Expression",
        privacy: "Right to Privacy",
        arrest: "Arrest & Detention",
        social: "Online Speech"
    },
    landing: {
        enterPlatform: "Enter Platform",
        superIntelligence: "AI Legal Superintelligence",
        heroTitlePart1: "Navigate the",
        heroTitlePart2: "with Intelligence.",
        heroDesc: "Experience the world's most advanced constitutional AI tutor. Ask intricate legal questions via text or voice, and receive perfectly cited, hallucination-free guidance.",
        startInteraction: "Start Interaction",
        exploreFeatures: "Explore Features",
        metricsTitle: "Unrivaled",
        metricsSubtitle: "Capabilities",
        metricsDesc: "A state-of-the-art intelligent routing system paired with extreme-scale vector embeddings of the entire Indian Constitution framework.",
        metric1Label: "Articles Embedded",
        metric2Label: "Data Accuracy",
        metric3Label: "Inference Latency",
        faqTitle: "Frequently",
        faqSubtitle: "Asked",
        ctaTitle: "Ready to",
        ctaSubtitle: "Master It?",
        ctaDesc: "Step into the future of legal tech. Access unparalleled constitutional insights instantly.",
        launchPlatform: "Launch Platform",
        allRightsReserved: "All rights reserved."
    }
};

const hi: Translations = {
    brandName: "संविधान",
    tagline: "भारतीय संविधान वॉयस ट्यूटर",
    topicLabel: "विषय:",
    modeLabel: "स्तर:",
    chatPlaceholder: "अनुच्छेद 21, मौलिक अधिकारों के बारे में पूछें...",
    knowledgeOnline: "ज्ञान सक्रिय",
    initializeKnowledge: "ज्ञान शुरू करें",
    newSession: "नया सत्र",
    homePage: "होम पेज",
    constitutionIndex: "संविधान सूचकांक",
    settingsTitle: "सेटिंग्स",
    outputLanguage: "भाषा और आवाज",
    speechSpeed: "बोलने की गति",
    themeLabel: "ऐप थीम",
    suggestedQuestionsTitle: "सुझाए गए प्रश्न",
    systemTag: "संविधान AI • भारतीय संवैधानिक ढांचा",
    welcomeTitle: "नमस्ते! मैं संविधान AI हूँ",
    welcomeSubtitle: "आपका भारतीय संविधान वॉयस ट्यूटर",
    learningModes: {
        upsc: "UPSC परीक्षा",
        law: "कानून के छात्र",
        civics: "स्कूली नागरिक शास्त्र",
        citizen: "नागरिक जागरूकता"
    },
    topics: {
        general: "सामान्य संविधान",
        rights: "मौलिक अधिकार",
        dpsp: "नीति निदेशक तत्व",
        education: "शिक्षा के अधिकार",
        religion: "धार्मिक स्वतंत्रता",
        expression: "अभिव्यक्ति की स्वतंत्रता",
        privacy: "निजता का अधिकार",
        arrest: "गिरफ्तारी और हिरासत",
        social: "ऑनलाइन भाषण"
    },
    landing: {
        enterPlatform: "प्लेटफॉर्म में प्रवेश करें",
        superIntelligence: "AI कानूनी सुपरइंटेलिजेंस",
        heroTitlePart1: "समझें",
        heroTitlePart2: "बुद्धिमानी के साथ।",
        heroDesc: "दुनिया के सबसे उन्नत संवैधानिक AI ट्यूटर का अनुभव करें। टेक्स्ट या वॉयस के माध्यम से जटिल कानूनी प्रश्न पूछें, और सटीक मार्गदर्शन प्राप्त करें।",
        startInteraction: "बातचीत शुरू करें",
        exploreFeatures: "विशेषताएं देखें",
        metricsTitle: "अद्वितीय",
        metricsSubtitle: "क्षमताएं",
        metricsDesc: "पूरे भारतीय संविधान ढांचे के साथ एक आधुनिक इंटेलिजेंट राउटिंग सिस्टम।",
        metric1Label: "अनुच्छेद शामिल",
        metric2Label: "डेटा सटीकता",
        metric3Label: "प्रतिक्रिया समय",
        faqTitle: "अक्सर",
        faqSubtitle: "पूछे जाने वाले प्रश्न",
        ctaTitle: "क्या आप",
        ctaSubtitle: "तैयार हैं?",
        ctaDesc: "कानूनी तकनीक के भविष्य में कदम रखें। तुरंत अद्वितीय संवैधानिक जानकारी प्राप्त करें।",
        launchPlatform: "प्लेटफॉर्म लॉन्च करें",
        allRightsReserved: "सर्वाधिकार सुरक्षित।"
    }
};

const mr: Translations = {
    brandName: "संविधान",
    tagline: "भारतीय संविधान व्हॉइस ट्यूटर",
    topicLabel: "विषय:",
    modeLabel: "स्तर:",
    chatPlaceholder: "कलम २१, मूलभूत हक्कांबद्दल विचारा...",
    knowledgeOnline: "ज्ञान सक्रिय",
    initializeKnowledge: "ज्ञान सुरू करा",
    newSession: "नवीन सत्र",
    homePage: "होम पेज",
    constitutionIndex: "संविधान अनुक्रमणिका",
    settingsTitle: "सेटिंग्ज",
    outputLanguage: "भाषा आणि आवाज",
    speechSpeed: "बोलण्याचा वेग",
    themeLabel: "अॅप थीम",
    suggestedQuestionsTitle: "सुचवलेले प्रश्न",
    systemTag: "संविधान AI • भारतीय संवैधानिक संरचना",
    welcomeTitle: "नमस्ते! मी संविधान AI आहे",
    welcomeSubtitle: "तुमचा भारतीय संविधान व्हॉइस ट्यूटर",
    learningModes: {
        upsc: "UPSC तयारी",
        law: "कायदा विद्यार्थी",
        civics: "शालेय नागरिकशास्त्र",
        citizen: "नागरिक जागृती"
    },
    topics: {
        general: "सामान्य संविधान",
        rights: "मूलभूत हक्क",
        dpsp: "मार्गदर्शक तत्वे",
        education: "शिक्षणाचे हक्क",
        religion: "धार्मिक स्वातंत्र्य",
        expression: "अभिव्यक्ती स्वातंत्र्य",
        privacy: "गोपनीयतेचा हक्क",
        arrest: "अटक आणि कोठडी",
        social: "ऑनलाइन भाषण"
    },
    landing: {
        enterPlatform: "प्लॅटफॉर्मवर जा",
        superIntelligence: "AI कायदेशीर सुपरइंटेलिजन्स",
        heroTitlePart1: "समजून घ्या",
        heroTitlePart2: "हुशारीने।",
        heroDesc: "जगातील प्रगत संवैधानिक AI ट्यूटरचा अनुभव घ्या. मजकूर किंवा आवाजाद्वारे कायदेशीर प्रश्न विचारा आणि अचूक मार्गदर्शन मिळवा।",
        startInteraction: "संभाषण सुरू करा",
        exploreFeatures: "वैशिष्ट्ये पहा",
        metricsTitle: "अतुलनीय",
        metricsSubtitle: "क्षमता",
        metricsDesc: "संपूर्ण भारतीय संविधान संरचनेसह अत्याधुनिक इंटेलिजेंट राउटिंग सिस्टम।",
        metric1Label: "कलमे समाविष्ट",
        metric2Label: "डेटा अचूकता",
        metric3Label: "प्रतिसाद वेळ",
        faqTitle: "नेहमी विचारले",
        faqSubtitle: "जाणारे प्रश्न",
        ctaTitle: "तुम्ही",
        ctaSubtitle: "तयार आहात का?",
        ctaDesc: "कायदेशीर तंत्रज्ञानाच्या भविष्यात पाऊल टाका. त्वरित अद्वितीय संवैधानिक माहिती मिळवा।",
        launchPlatform: "प्लॅटफॉर्म सुरू करा",
        allRightsReserved: "सर्व हक्क राखीव।"
    }
};

const gu: Translations = {
    brandName: "સંવિધાન",
    tagline: "ભારતીય બંધારણ વોઇસ ટ્યુટર",
    topicLabel: "વિષય:",
    modeLabel: "સ્તર:",
    chatPlaceholder: "અનુચ્છેદ ૨૧, મૂળભૂત અધિકારો વિશે પૂછો...",
    knowledgeOnline: "જ્ઞાન સક્રિય",
    initializeKnowledge: "જ્ઞાન શરૂ કરો",
    newSession: "નવું સત્ર",
    homePage: "હોમ પેજ",
    constitutionIndex: "બંધારણ અનુક્રમણિકા",
    settingsTitle: "સેટિંગ્સ",
    outputLanguage: "ભાષા અને અવાજ",
    speechSpeed: "બોલવાની ઝડપ",
    themeLabel: "એપ થીમ",
    suggestedQuestionsTitle: "સૂચવેલા પ્રશ્નો",
    systemTag: "સંવિધાન AI • ભારતીય બંધારણીય માળખું",
    welcomeTitle: "નમસ્તે! હું સંવિધાન AI છું",
    welcomeSubtitle: "તમારું ભારતીય બંધારણ વોઇસ ટ્યુટર",
    learningModes: {
        upsc: "UPSC તૈયારી",
        law: "કાયદાના વિદ્યાર્થીઓ",
        civics: "શાળા નાગરિકશાસ્ત્ર",
        citizen: "નાગરિક જાગૃતિ"
    },
    topics: {
        general: "સામાન્ય બંધારણ",
        rights: "મૂળભૂત અધિકારો",
        dpsp: "નીતિ નિર્દેશક તત્વો",
        education: "શિક્ષણના અધિકારો",
        religion: "ધાર્મિક સ્વતંત્રતા",
        expression: "અભિવ્યક્તિની સ્વતંત્રતા",
        privacy: "નિજતાનો અધિકાર",
        arrest: "ધરપકડ અને અટકાયત",
        social: "ઓનલાઇન ભાષણ"
    },
    landing: {
        enterPlatform: "પ્લેટફોર્મમાં પ્રવેશ કરો",
        superIntelligence: "AI કાયદાકીય સુપરઇન્ટેલિજન્સ",
        heroTitlePart1: "સમજો",
        heroTitlePart2: "બુદ્ધિશાળી રીતે।",
        heroDesc: "દુનિયાના સૌથી અદ્યતન બંધારણીય AI ટ્યુટરનો અનુભવ કરો. ટેક્સ્ટ અથવા વોઇસ દ્વારા જટિલ કાયદાકીય પ્રશ્નો પૂછો અને સચોટ માર્ગદર્શન મેળવો।",
        startInteraction: "વાતચીત શરૂ કરો",
        exploreFeatures: "વિશેષતાઓ જુઓ",
        metricsTitle: "અજોડ",
        metricsSubtitle: "ક્ષમતાઓ",
        metricsDesc: "આખા ભારતીય બંધારણીય માળખા સાથે આધુનિક ઇન્ટેલિજન્ટ રાઉટિંગ સિસ્ટમ।",
        metric1Label: "અનુચ્છેદ સામેલ",
        metric2Label: "ડેટા ચોકસાઈ",
        metric3Label: "પ્રતિક્રિયા સમય",
        faqTitle: "વારંવાર પૂછાતા",
        faqSubtitle: "પ્રશ્નો",
        ctaTitle: "શું તમે",
        ctaSubtitle: "તૈયાર છો?",
        ctaDesc: "કાયદાકીય ટેકનોલોજીના ભવિષ્યમાં ડગ માંડો. તરત જ અજોડ બંધારણીય માહિતી મેળવો।",
        launchPlatform: "પ્લેટફોર્મ લોન્ચ કરો",
        allRightsReserved: "સર્વાધિકાર સુરક્ષિત।"
    }
};

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
    "en-IN": en,
    "hi-IN": hi,
    "mr-IN": mr,
    "gu-IN": gu,
    "bn-IN": hi, // Fallback for now
    "ta-IN": hi  // Fallback for now
};

export function useTranslation(language: LanguageCode): Translations {
    return TRANSLATIONS[language] || en;
}
