"use client";

import { useEffect, useRef } from "react";

export function BackgroundEffects() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animated gradient background
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let time = 0;
        const animate = () => {
            time += 0.005;
            
            // Create animated gradient
            const gradient = ctx.createLinearGradient(
                canvas.width / 2 + Math.sin(time) * 200,
                canvas.height / 2 + Math.cos(time) * 200,
                canvas.width / 2 - Math.sin(time) * 200,
                canvas.height / 2 - Math.cos(time) * 200
            );

            gradient.addColorStop(0, `rgba(139, 92, 246, ${0.03 + Math.sin(time) * 0.02})`);
            gradient.addColorStop(0.5, `rgba(168, 85, 247, ${0.02 + Math.cos(time * 1.5) * 0.02})`);
            gradient.addColorStop(1, `rgba(99, 102, 241, ${0.03 + Math.sin(time * 2) * 0.02})`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    useEffect(() => {
        // Floating particles
        const container = particlesRef.current;
        if (!container) return;

        const particleCount = 20;
        const particles: Array<{
            element: HTMLDivElement;
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
        }> = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.className = "floating-particle";
            
            const size = 2 + Math.random() * 3;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.opacity = (0.2 + Math.random() * 0.3).toString();
            particle.style.animationDelay = `${Math.random() * 20}s`;
            
            container.appendChild(particle);

            particles.push({
                element: particle,
                x,
                y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size
            });
        }

        const animateParticles = () => {
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = window.innerWidth;
                if (p.x > window.innerWidth) p.x = 0;
                if (p.y < 0) p.y = window.innerHeight;
                if (p.y > window.innerHeight) p.y = 0;

                p.element.style.left = `${p.x}px`;
                p.element.style.top = `${p.y}px`;
            });

            requestAnimationFrame(animateParticles);
        };

        animateParticles();

        return () => {
            particles.forEach((p) => p.element.remove());
        };
    }, []);

    return (
        <>
            {/* Animated gradient canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-0"
                style={{ mixBlendMode: "screen" }}
            />

            {/* Floating particles */}
            <div
                ref={particlesRef}
                className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            />

            {/* Radial gradient overlays */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    background: `
                        radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 70%)
                    `,
                    animation: "pulse 20s ease-in-out infinite"
                }}
            />

            <style jsx>{`
                .floating-particle {
                    position: absolute;
                    background: radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, transparent 100%);
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
                    animation: float 15s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    25% {
                        transform: translate(20px, -30px) scale(1.1);
                    }
                    50% {
                        transform: translate(-15px, 20px) scale(0.9);
                    }
                    75% {
                        transform: translate(30px, 10px) scale(1.05);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }
            `}</style>
        </>
    );
}
