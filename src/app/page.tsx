"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Earth } from "@/components/Earth";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import {
  Mic, BookOpen, GraduationCap,
  Scale, Brain, Shield, ChevronDown,
  ArrowRight, MessageSquare
} from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";
import { useTranslation } from "@/lib/translations";
import { CustomCursor } from "@/components/CustomCursor";
import { ThemeToggle } from "@/components/ThemeToggle";

const features = [
  {
    icon: <Mic className="w-8 h-8 text-saffron" />,
    title: "Voice-Powered Learning",
    description: "Ask constitutional queries with natural voice input and receive clear, spoken answers driven by state-of-the-art TTS.",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-saffron" />,
    title: "Exhaustive Legal Context",
    description: "Direct access to the comprehensive text of the Constitution of India along with deeply researched case laws.",
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-saffron" />,
    title: "Exam Readiness",
    description: "Optimized for UPSC and GPSC candidates with precise article numbers and landmark supreme court precedents.",
  },
  {
    icon: <Scale className="w-8 h-8 text-saffron" />,
    title: "Scenario Analysis",
    description: "Learn fundamental rights and directive principles through meticulously crafted real-world scenario explorations.",
  },
  {
    icon: <Shield className="w-8 h-8 text-saffron" />,
    title: "Citizen Empowerment",
    description: "Understand your civilian rights and legal safeguards mapped intuitively from dense constitutional jargon.",
  },
  {
    icon: <Brain className="w-8 h-8 text-saffron" />,
    title: "RAG AI Architecture",
    description: "Built on an advanced Retrieval-Augmented Generation pipeline ensuring hallucinatory-free and precise answers.",
  },
];

const faqs = [
  {
    q: "Is the knowledge base up to date with recent amendments?",
    a: "Yes, our embedded vector database comprises the latest Constitutional text up to the most recent official amendments."
  },
  {
    q: "How does the Voice interaction work?",
    a: "Samvidhan AI uses high-fidelity speech-to-text to capture your specific legal question and synthesizes the response using ultra-realistic text-to-speech."
  },
  {
    q: "Is it suitable for professional Law students?",
    a: "Absolutely. You can toggle the 'Law Student' mode yielding exhaustive legal analysis, ratio decidendi, and obiter dicta breakdowns of case laws."
  },
  {
    q: "Do I need to sign up to ask queries?",
    a: "No, you can immediately begin asking questions. The interface is optimized for rapid, frictionless legal query routing."
  }
];

const stagger: Variants = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const fadeUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function StackedSection({ children, index }: { children: React.ReactNode, index: number }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.5], ["blur(0px)", "blur(12px)"]);

  return (
    <div ref={containerRef} className="relative h-screen sticky top-0 flex items-center justify-center overflow-hidden">
      <motion.div
        style={{ scale, opacity, filter: blur }}
        className="relative w-full h-full flex items-center justify-center bg-background"
      >
        {/* Section Start Indicator: Saffron dot with a pulsing outer ring - Only for index > 0 */}
        {index > 0 && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              {/* Pulsing Outer Ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.3 }}
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute w-8 h-8 rounded-full border border-saffron/50"
              />
              {/* Solid Outer Ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.1 }}
                className="absolute w-12 h-12 rounded-full border border-saffron/10"
              />
              {/* Central Sentinel Dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                className="w-2.5 h-2.5 rounded-full bg-saffron shadow-[0_0_15px_#FF9933] z-10"
              />
            </div>
            {/* Elegant Tapered Guide Line */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: 40, opacity: 0.2 }}
              className="w-[1.5px] bg-gradient-to-b from-saffron via-saffron/50 to-transparent mt-3"
            />
          </div>
        )}

        {children}
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const { language } = useSettings();
  const t = useTranslation(language);

  return (
    <div className="bg-background text-foreground font-sans selection:bg-saffron/30 relative">
      <CustomCursor />

      {/* Background Gradients & Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-saffron/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[80%] w-[20%] h-[20%] bg-india-green/5 blur-[100px] rounded-full" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 md:py-5 md:px-16 container mx-auto bg-background/50 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4"
        >
          <div className="w-10 h-10 overflow-hidden flex items-center justify-center rounded-xl bg-gradient-to-br from-black/10 dark:from-white/10 to-black/5 dark:to-white/5 border border-black/10 dark:border-white/10">
            <img src="/logo.png" alt="Samvidhan Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight text-foreground drop-shadow-md">
            {t.brandName}<span className="text-saffron">.ai</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4"
        >
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" className="text-foreground font-bold px-6 rounded-full hover:bg-black/5 dark:hover:bg-white/5 hidden md:flex">
              Login
            </Button>
          </Link>
          <Link href="/chat">
            <Button className="bg-saffron hover:bg-gold text-black font-bold px-6 rounded-full transition-all shadow-lg hidden md:flex">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </header>

      <main className="relative z-10">
        {/* Section 1: Hero */}
        <StackedSection index={0}>
          <section className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="flex flex-col items-start text-left max-w-2xl"
              initial="initial"
              animate="animate"
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-saffron/30 bg-saffron/10 mb-8 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
                <span className="text-sm font-medium text-saffron tracking-wide uppercase">{t.landing.superIntelligence}</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
                {t.landing.heroTitlePart1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron via-gold to-zinc-800 dark:to-white">Constitution</span>
                <br />{t.landing.heroTitlePart2}
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl leading-relaxed font-light">
                {t.landing.heroDesc}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                <Link href="/chat" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 bg-gradient-to-r from-saffron to-gold text-black font-bold text-lg px-8 rounded-2xl shadow-xl transition-all flex items-center gap-2 group">
                    <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Get Started
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-14 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-foreground font-bold text-lg px-8 rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <div className="relative h-[400px] lg:h-[600px] w-full flex items-center justify-center">
              <div className="absolute inset-0 z-0">
                <Earth />
              </div>
            </div>
          </section>
        </StackedSection>

        {/* Section 2: Pillars */}
        <StackedSection index={1}>
          <section className="container mx-auto px-6 md:px-16 pt-40 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-foreground mb-8 leading-tight">
                  The Five Pillars of <span className="text-saffron">Our Republic</span>
                </h2>
                <div className="space-y-6">
                  {[
                    { title: "Sovereign", desc: "Independent authority of the State. Not subject to external control." },
                    { title: "Socialist", desc: "Aims to end poverty, ignorance, and inequality." },
                    { title: "Secular", desc: "The State treats all religions with equal respect." }
                  ].map((pillar, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron font-black group-hover:bg-saffron group-hover:text-black transition-all">
                        0{i + 1}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-foreground mb-1 group-hover:text-saffron transition-colors">{pillar.title}</h4>
                        <p className="text-zinc-500 text-sm">{pillar.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="w-full max-w-md aspect-square rounded-[3rem] bg-gradient-to-br from-black/10 dark:from-white/10 to-transparent border border-black/10 dark:border-white/10 p-2 overflow-hidden shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-[2.8rem] bg-[#0a0a20] flex items-center justify-center">
                    <Scale className="w-24 h-24 text-saffron animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </StackedSection>

        {/* Section 3: Features */}
        <StackedSection index={2}>
          <section className="container mx-auto px-6 md:px-16 pt-40 pb-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">Precision <span className="text-saffron">Features</span></h2>
              <p className="text-zinc-400 max-w-xl mx-auto">Advanced RAG architecture combining legal accuracy with modern AI capabilities.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <div key={i} className="bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 p-6 rounded-3xl hover:border-saffron/40 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-saffron/10 transition-all">
                    {f.icon}
                  </div>
                  <h4 className="font-bold text-foreground mb-2">{f.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </section>
        </StackedSection>

        {/* Section 4: Landmark Cases */}
        <StackedSection index={3}>
          <section className="container mx-auto px-6 md:px-16 pt-32 pb-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">Landmark <span className="text-saffron">Precedents</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { case: "Kesavananda Bharati", tag: "Basic Structure", color: "from-saffron/20" },
                { case: "Maneka Gandhi", tag: "Personal Liberty", color: "from-blue-500/20" },
                { case: "S.R. Bommai", tag: "Secularism", color: "from-green-500/20" },
                { case: "K.S. Puttaswamy", tag: "Right to Privacy", color: "from-purple-500/20" },
              ].map((item, i) => (
                <div key={i} className={`bg-gradient-to-br ${item.color} to-black/[0.01] dark:to-white/[0.01] border border-black/10 dark:border-white/10 p-6 rounded-3xl hover:scale-[1.02] transition-all`}>
                  <p className="text-[10px] font-black uppercase text-saffron mb-2">{item.tag}</p>
                  <h4 className="font-bold text-foreground text-lg">{item.case}</h4>
                </div>
              ))}
            </div>
          </section>
        </StackedSection>

        {/* Section 5: Metrics & FAQ */}
        <StackedSection index={4}>
          <section className="container mx-auto px-6 md:px-16 pt-32 pb-12 flex flex-col gap-12">
            <div className="grid grid-cols-3 gap-4 bg-black/5 dark:bg-white/5 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5">
              <div className="text-center border-r border-black/5 dark:border-white/5">
                <h3 className="text-4xl font-black text-foreground">400+</h3>
                <p className="text-xs text-zinc-500 uppercase">Articles</p>
              </div>
              <div className="text-center border-r border-black/5 dark:border-white/5">
                <h3 className="text-4xl font-black text-foreground">100%</h3>
                <p className="text-xs text-zinc-500 uppercase">Accuracy</p>
              </div>
              <div className="text-center">
                <h3 className="text-4xl font-black text-foreground">&lt;1s</h3>
                <p className="text-xs text-zinc-500 uppercase">Latency</p>
              </div>
            </div>
            <div className="max-w-2xl mx-auto w-full space-y-3">
              {faqs.slice(0, 3).map((faq, i) => (
                <div key={i} className="bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-black/5 dark:border-white/5">
                  <h5 className="font-bold text-foreground text-sm flex gap-3 items-center">
                    <ChevronDown className="w-4 h-4 text-saffron" />
                    {faq.q}
                  </h5>
                </div>
              ))}
            </div>
          </section>
        </StackedSection>

        {/* Section 6: CTA & Footer */}
        <div className="relative h-screen bg-black flex flex-col justify-end">
          <section className="container mx-auto px-6 py-32 text-center">
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8">
              Become Constitutional <span className="text-saffron italic">Expert.</span>
            </h2>
            <Link href="/chat">
              <Button size="lg" className="h-20 bg-white text-black hover:bg-zinc-200 font-black text-2xl px-12 rounded-full transition-all flex items-center gap-4 mx-auto group">
                Enter Samvidhan
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </section>

          <footer className="border-t border-white/10 bg-black/40 py-10 mt-auto">
            <div className="container mx-auto px-6 flex justify-between items-center text-zinc-500 text-sm">
              <div className="flex items-center gap-3">
                <img src="/logo.png" className="w-8 h-8 border border-white/10 rounded" alt="logo" />
                <span className="font-bold text-white uppercase tracking-tighter">Samvidhan.ai</span>
              </div>
              <p>© 2026 Samvidhan AI. Justice, Liberty, Equality, Fraternity.</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
