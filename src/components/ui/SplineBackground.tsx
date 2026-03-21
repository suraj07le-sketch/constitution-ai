"use client";

import Spline from "@splinetool/react-spline";

export function SplineBackground({
    scene = "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode",
    className = "",
}: {
    scene?: string;
    className?: string;
}) {
    return (
        <div className={`fixed inset-0 z-[-1] pointer-events-none ${className}`}>
            <Spline scene={scene} />
        </div>
    );
}
