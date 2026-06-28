import React from "react";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  withTagline?: boolean; // Prop kept for compatibility but ignored
  className?: string;
};

const sizes = {
  sm: "h-6",
  md: "h-8",
  lg: "h-12",
  xl: "h-20",
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  const h = sizes[size];
  return (
    <img 
      src="/assets/logo-midtune.png" 
      alt="Midtune" 
      className={`${h} w-auto object-contain ${className}`} 
    />
  );
}
