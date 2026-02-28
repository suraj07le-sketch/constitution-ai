"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "dark",
    toggleTheme: () => { },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");

    // Read from localStorage once mounted
    useEffect(() => {
        const stored = localStorage.getItem("samvidhan-theme") as Theme | null;
        if (stored === "light" || stored === "dark") {
            setTheme(stored);
            applyTheme(stored);
        } else {
            applyTheme("dark");
        }
    }, []);

    const applyTheme = (t: Theme) => {
        const html = document.documentElement;
        if (t === "dark") {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
    };

    const toggleTheme = () => {
        setTheme((prev) => {
            const next = prev === "dark" ? "light" : "dark";
            localStorage.setItem("samvidhan-theme", next);
            applyTheme(next);
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
