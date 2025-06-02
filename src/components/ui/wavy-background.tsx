"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, useCallback, HTMLAttributes } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
    children,
    className,
    containerClassName,
    colors,
    waveWidth,
    backgroundFill,
    blur = 10,
    speed = "fast",
    waveOpacity = 0.5,
    ...props
}: {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    colors?: string[];
    waveWidth?: number;
    backgroundFill?: string;
    blur?: number;
    speed?: "slow" | "fast";
    waveOpacity?: number;
} & HTMLAttributes<HTMLDivElement>
) => {
    const noise = createNoise3D();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationIdRef = useRef<number | null>(null);

    // Determine speed numeric value
    const getSpeed = useCallback(() => {
        switch (speed) {
            case "slow":
                return 0.1; // Increased from 0.001 for more visible movement
            case "fast":
                return 0.5; // Increased from 0.002 for more visible movement
            default:
                return 0.1;
        }
    }, [speed]);

    // Draw waves on canvas context
    const drawWave = useCallback(
        (
            ctx: CanvasRenderingContext2D,
            w: number,
            h: number,
            nt: number,
            waveColors: string[],
            waveCount: number,
            currentWaveWidth: number
        ) => {
            for (let i = 0; i < waveCount; i++) {
                ctx.beginPath();
                ctx.lineWidth = currentWaveWidth;
                ctx.strokeStyle = waveColors[i % waveColors.length];
                for (let x = 0; x < w; x += 5) {
                    const y = noise(x / 800, 0.3 * i, nt) * 100;
                    ctx.lineTo(x, y + h * 0.5);
                }
                ctx.stroke();
                ctx.closePath();
            }
        },
        [noise]
    );

    // Main render function to update canvas animation frame
    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const waveColors = colors ?? [
            "#38bdf8",
            "#818cf8",
            "#c084fc",
            "#e879f9",
            "#22d3ee",
        ];

        const nt = performance.now() * 0.001 * getSpeed(); // 0.001 converts ms to seconds

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = backgroundFill ?? "black";
        ctx.globalAlpha = waveOpacity;
        ctx.fillRect(0, 0, w, h);

        drawWave(ctx, w, h, nt, waveColors, 5, waveWidth ?? 50);

        animationIdRef.current = requestAnimationFrame(render);
    }, [backgroundFill, colors, waveOpacity, waveWidth, getSpeed, drawWave]);

    // Setup canvas size and blur filter, add resize listener
    const init = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.filter = `blur(${blur}px)`;
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        // Start rendering animation
        render();

        // Cleanup function to remove resize listener and cancel animation
        return () => {
            window.removeEventListener("resize", setCanvasSize);
            if (animationIdRef.current !== null) {
                cancelAnimationFrame(animationIdRef.current);
            }
        };
    }, [blur, render]);

    useEffect(() => {
        // init returns a cleanup function directly, which is handled by React
        return init();
    }, [init]);

    // Detect Safari for CSS filter fallback
    const [isSafari, setIsSafari] = useState(false);
    useEffect(() => {
        setIsSafari(
            typeof window !== "undefined" &&
            navigator.userAgent.includes("Safari") &&
            !navigator.userAgent.includes("Chrome")
        );
    }, []);

    return (
        <div
            className={cn(
                "h-screen flex flex-col items-center justify-center",
                containerClassName
            )}
            {...props}
        >
            <canvas
                className="absolute inset-0 z-0"
                ref={canvasRef}
                id="canvas"
                style={{
                    ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
                }}
            ></canvas>
            <div className={cn("relative z-10", className)}>
                {children}
            </div>
        </div>
    );
};