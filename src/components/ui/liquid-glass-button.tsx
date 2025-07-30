"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useState } from "react";

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function LiquidGlassButton({
  children,
  className,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
}: LiquidGlassButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const variants = {
    primary: {
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
      border: "1px solid rgba(255,255,255,0.2)",
      shadow: "0 8px 32px rgba(0,0,0,0.1)",
      glow: "0 0 20px rgba(59,130,246,0.3)",
    },
    secondary: {
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
      border: "1px solid rgba(255,255,255,0.15)",
      shadow: "0 8px 32px rgba(0,0,0,0.08)",
      glow: "0 0 20px rgba(107,114,128,0.2)",
    },
    success: {
      background:
        "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))",
      border: "1px solid rgba(34,197,94,0.3)",
      shadow: "0 8px 32px rgba(34,197,94,0.1)",
      glow: "0 0 20px rgba(34,197,94,0.3)",
    },
    danger: {
      background:
        "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))",
      border: "1px solid rgba(239,68,68,0.3)",
      shadow: "0 8px 32px rgba(239,68,68,0.1)",
      glow: "0 0 20px rgba(239,68,68,0.3)",
    },
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const currentVariant = variants[variant];

  return (
    <motion.button
      className={cn(
        "relative overflow-hidden rounded-2xl font-medium transition-all duration-300",
        "backdrop-blur-xl",
        "hover:scale-105 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size],
        className
      )}
      style={{
        background: currentVariant.background,
        border: currentVariant.border,
        boxShadow: currentVariant.shadow,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: isPressed
          ? `${currentVariant.shadow}, ${currentVariant.glow}`
          : currentVariant.shadow,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
    >
      {/* Liquid effect overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15) 0%, transparent 50%)`,
          opacity: mousePosition.x === 0 && mousePosition.y === 0 ? 0 : 1,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Inner glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 70%)`,
          opacity: mousePosition.x === 0 && mousePosition.y === 0 ? 0 : 0.5,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>

      {/* Border glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
          opacity: isPressed ? 0.8 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}

// Specialized button variants
export function LiquidGlassPrimaryButton({
  children,
  ...props
}: Omit<LiquidGlassButtonProps, "variant">) {
  return (
    <LiquidGlassButton variant="primary" {...props}>
      {children}
    </LiquidGlassButton>
  );
}

export function LiquidGlassSecondaryButton({
  children,
  ...props
}: Omit<LiquidGlassButtonProps, "variant">) {
  return (
    <LiquidGlassButton variant="secondary" {...props}>
      {children}
    </LiquidGlassButton>
  );
}

export function LiquidGlassSuccessButton({
  children,
  ...props
}: Omit<LiquidGlassButtonProps, "variant">) {
  return (
    <LiquidGlassButton variant="success" {...props}>
      {children}
    </LiquidGlassButton>
  );
}

export function LiquidGlassDangerButton({
  children,
  ...props
}: Omit<LiquidGlassButtonProps, "variant">) {
  return (
    <LiquidGlassButton variant="danger" {...props}>
      {children}
    </LiquidGlassButton>
  );
}
