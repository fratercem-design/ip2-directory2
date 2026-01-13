"use client";

import { useEffect, useRef } from "react";

export function CursorEffects() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const trailRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const trail = trailRef.current;
        if (!cursor || !trail) return;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let trailX = 0;
        let trailY = 0;

        const updateCursor = () => {
            // Smooth cursor movement
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            // Trail movement (slower)
            trailX += (mouseX - trailX) * 0.05;
            trailY += (mouseY - trailY) * 0.05;
            trail.style.left = `${trailX}px`;
            trail.style.top = `${trailY}px`;

            requestAnimationFrame(updateCursor);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleMouseEnter = () => {
            cursor.style.opacity = "1";
            trail.style.opacity = "1";
        };

        const handleMouseLeave = () => {
            cursor.style.opacity = "0";
            trail.style.opacity = "0";
        };

        // Create particles on click
        const handleClick = (e: MouseEvent) => {
            createParticles(e.clientX, e.clientY);
        };

        const createParticles = (x: number, y: number) => {
            if (!particlesRef.current) return;

            for (let i = 0; i < 6; i++) {
                const particle = document.createElement("div");
                particle.className = "cursor-particle";
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                
                const angle = (Math.PI * 2 * i) / 6;
                const velocity = 20 + Math.random() * 20;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                
                particlesRef.current.appendChild(particle);

                let px = x;
                let py = y;
                let opacity = 1;
                const size = 4 + Math.random() * 4;

                const animate = () => {
                    px += vx * 0.1;
                    py += vy * 0.1;
                    opacity -= 0.02;
                    
                    particle.style.left = `${px}px`;
                    particle.style.top = `${py}px`;
                    particle.style.opacity = opacity.toString();
                    particle.style.transform = `scale(${1 - (1 - opacity)})`;

                    if (opacity > 0) {
                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                };

                requestAnimationFrame(animate);
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("click", handleClick);
        updateCursor();

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <>
            {/* Main cursor */}
            <div
                ref={cursorRef}
                className="fixed pointer-events-none z-[9999] w-4 h-4 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300"
                style={{
                    background: "radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(139, 92, 246, 0.4) 50%, transparent 100%)",
                    borderRadius: "50%",
                    boxShadow: "0 0 20px rgba(168, 85, 247, 0.6), 0 0 40px rgba(139, 92, 246, 0.4)",
                    mixBlendMode: "screen"
                }}
            />

            {/* Cursor trail */}
            <div
                ref={trailRef}
                className="fixed pointer-events-none z-[9998] w-8 h-8 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-500"
                style={{
                    background: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(8px)"
                }}
            />

            {/* Particles container */}
            <div ref={particlesRef} className="fixed pointer-events-none z-[9997] inset-0" />
            
            <style jsx>{`
                .cursor-particle {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: radial-gradient(circle, rgba(168, 85, 247, 1) 0%, rgba(139, 92, 246, 0.5) 100%);
                    border-radius: 50%;
                    pointer-events: none;
                    box-shadow: 0 0 10px rgba(168, 85, 247, 0.8);
                }
            `}</style>
        </>
    );
}
