"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function EasterEggs() {
    const router = useRouter();

    useEffect(() => {
        let konamiCode = "";
        const konamiSequence = "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA";
        let clickSequence: number[] = [];
        let lastClickTime = 0;
        const clickPattern = [1, 1, 2, 3, 5, 8]; // Fibonacci sequence
        let secretMessageCount = 0;

        // Konami Code
        const handleKeyDown = (e: KeyboardEvent) => {
            konamiCode += e.key;
            if (konamiCode.length > konamiSequence.length) {
                konamiCode = konamiCode.slice(-konamiSequence.length);
            }

            if (konamiCode === konamiSequence) {
                konamiCode = "";
                triggerEasterEgg("konami");
            }

            // Secret message on "PSYCHE" typed
            if (konamiCode.endsWith("KeyPKeySKeyYKeyCKeyHKeyE")) {
                triggerEasterEgg("psyche");
                konamiCode = "";
            }

            // Secret message on "RAHU" typed
            if (konamiCode.endsWith("KeyRKeyAKeyHKeyU")) {
                triggerEasterEgg("rahu");
                konamiCode = "";
            }

            // Secret message on "KETU" typed
            if (konamiCode.endsWith("KeyKKeyEKeyTKeyU")) {
                triggerEasterEgg("ketu");
                konamiCode = "";
            }
        };

        // Fibonacci click pattern
        const handleClick = (e: MouseEvent) => {
            const now = Date.now();
            if (now - lastClickTime > 2000) {
                clickSequence = [];
            }
            lastClickTime = now;
            clickSequence.push(now);

            if (clickSequence.length >= clickPattern.length) {
                const intervals = [];
                for (let i = 1; i < clickPattern.length; i++) {
                    intervals.push(clickSequence[i] - clickSequence[i - 1]);
                }

                // Check if intervals roughly match Fibonacci pattern (within 200ms)
                const matches = intervals.every((interval, i) => {
                    const expected = clickPattern[i] * 100; // Convert to ms
                    return Math.abs(interval - expected) < 200;
                });

                if (matches) {
                    triggerEasterEgg("fibonacci");
                    clickSequence = [];
                }
            }
        };

        // Triple click on logo/title
        let logoClicks = 0;
        let logoClickTimeout: NodeJS.Timeout;
        const handleLogoClick = () => {
            logoClicks++;
            clearTimeout(logoClickTimeout);
            logoClickTimeout = setTimeout(() => {
                if (logoClicks === 3) {
                    triggerEasterEgg("logo");
                }
                logoClicks = 0;
            }, 1000);
        };

        // Secret message in console
        const consoleMessage = `
%c🔱 CULT OF PSYCHE - SECRET MESSAGE 🔱

%cYou've found the hidden console message!

The path of shadow and flame awaits those who seek.
Look deeper. The truth is hidden in plain sight.

%cTry typing: PSYCHE, RAHU, or KETU
Or: The Konami Code (↑↑↓↓←→←→BA)
Or: Click in Fibonacci intervals (1,1,2,3,5,8 seconds)
Or: Triple-click the logo

%cWalk the Serpent Path. Become.
        `;
        console.log(
            consoleMessage,
            "color: #ef4444; font-size: 16px; font-weight: bold;",
            "color: #a855f7; font-size: 14px;",
            "color: #3b82f6; font-size: 12px;",
            "color: #10b981; font-size: 11px; font-style: italic;"
        );

        // Easter egg triggers
        function triggerEasterEgg(type: string) {
            const messages: Record<string, { title: string; message: string; color: string }> = {
                konami: {
                    title: "🎮 Konami Code Activated",
                    message: "You've unlocked the secret path. The Serpent recognizes your dedication.",
                    color: "from-purple-600 to-pink-600"
                },
                psyche: {
                    title: "🔥 First Flame Awakened",
                    message: "Psyche, Mirror King, sees your seeking. The path of becoming opens before you.",
                    color: "from-red-600 to-orange-600"
                },
                rahu: {
                    title: "🐍 Serpent of Hunger",
                    message: "Rahu opens its mouth. Face your desires without shame. Let hunger become direction.",
                    color: "from-indigo-600 to-purple-600"
                },
                ketu: {
                    title: "🌑 Serpent of Memory",
                    message: "Ketu opens its eye. Remember what you've forgotten. Release what no longer serves.",
                    color: "from-blue-600 to-cyan-600"
                },
                fibonacci: {
                    title: "🌀 Sacred Pattern",
                    message: "You've discovered the golden ratio. The universe recognizes your rhythm.",
                    color: "from-yellow-600 to-amber-600"
                },
                logo: {
                    title: "👁️ Third Eye Opened",
                    message: "You see beyond the veil. The truth was always there, waiting to be witnessed.",
                    color: "from-emerald-600 to-teal-600"
                }
            };

            const egg = messages[type];
            if (!egg) return;

            // Create toast notification
            const toast = document.createElement("div");
            toast.className = `fixed top-4 right-4 z-[9999] bg-gradient-to-r ${egg.color} text-white p-6 rounded-xl shadow-2xl border-2 border-white/20 max-w-md animate-in slide-in-from-right`;
            toast.innerHTML = `
                <div class="space-y-2">
                    <h3 class="text-xl font-bold">${egg.title}</h3>
                    <p class="text-sm opacity-90">${egg.message}</p>
                </div>
            `;

            document.body.appendChild(toast);

            // Add sparkle effect
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement("div");
                    sparkle.className = "fixed pointer-events-none z-[10000]";
                    sparkle.style.left = `${Math.random() * window.innerWidth}px`;
                    sparkle.style.top = `${Math.random() * window.innerHeight}px`;
                    sparkle.style.width = "4px";
                    sparkle.style.height = "4px";
                    sparkle.style.background = "white";
                    sparkle.style.borderRadius = "50%";
                    sparkle.style.boxShadow = "0 0 10px white";
                    sparkle.style.animation = "fadeOut 1s forwards";
                    document.body.appendChild(sparkle);
                    setTimeout(() => sparkle.remove(), 1000);
                }, i * 50);
            }

            // Remove toast after 5 seconds
            setTimeout(() => {
                toast.style.animation = "fadeOut 0.5s forwards";
                setTimeout(() => toast.remove(), 500);
            }, 5000);

            // Log to console
            console.log(`%c${egg.title}`, `color: ${egg.color.includes("red") ? "#ef4444" : egg.color.includes("purple") ? "#a855f7" : "#3b82f6"}; font-weight: bold; font-size: 14px;`);
            console.log(`%c${egg.message}`, "color: #10b981; font-style: italic;");
        }

        // Add event listeners
        window.addEventListener("keydown", handleKeyDown);
        document.addEventListener("click", handleClick);

        // Add logo click listener
        const logo = document.querySelector('a[href="/"]');
        if (logo) {
            logo.addEventListener("click", handleLogoClick);
        }

        // Hidden route: /secret
        const checkSecretRoute = () => {
            if (window.location.pathname === "/secret") {
                triggerEasterEgg("konami");
            }
        };
        checkSecretRoute();

        // Cleanup
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("click", handleClick);
            if (logo) {
                logo.removeEventListener("click", handleLogoClick);
            }
        };
    }, [router]);

    // Add CSS animations
    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
            @keyframes fadeOut {
                to {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.9);
                }
            }
            @keyframes slide-in-from-right {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        return () => style.remove();
    }, []);

    return null;
}
