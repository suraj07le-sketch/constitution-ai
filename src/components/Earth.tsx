"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export function Earth() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;
        let width = 0;

        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
            }
        };
        window.addEventListener('resize', onResize);
        onResize();

        if (!canvasRef.current) return;

        // Golden theme matching our 'saffron to gold' gradient
        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3, // Tilt slightly
            dark: 1, // Dark theme
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.1, 0.1, 0.1], // Dark gray
            markerColor: [1, 0.6, 0.2], // Orange/Saffron
            glowColor: [1, 0.8, 0.2], // Gold
            markers: [
                // India location
                { location: [20.5937, 78.9629], size: 0.1 },
            ],
            onRender: (state) => {
                // Automatically rotate
                state.phi = phi;
                phi += 0.005;
                state.width = width * 2;
                state.height = width * 2;
            },
        });

        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <div className="w-full max-w-[600px] aspect-square mx-auto flex items-center justify-center">
            <canvas
                ref={canvasRef}
                style={{ width: "100%", height: "100%", opacity: 0.9 }}
            />
        </div>
    );
}
