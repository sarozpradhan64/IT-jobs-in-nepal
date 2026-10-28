import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  position?: "left" | "center" | "right";
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  position = "left",
  className = "",
}: SectionTitleProps) {
  const alignClass =
    position === "center"
      ? "flex flex-col items-center text-center"
      : position === "right"
      ? "flex flex-col items-end text-right"
      : "flex flex-col items-start text-left";

  return (
    <div className={`${alignClass} mb-8 ${className}`}>
      {subtitle && (
        <p className="font-mono text-xs text-secondary uppercase tracking-widest font-bold mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight font-sans">
        {title}
      </h2>
      <div className="flex items-center gap-2">
        <span className="h-[3px] w-20 bg-secondary rounded-full shadow-[0_0_12px_rgba(245,161,77,0.4)]"></span>
        <span className="h-[3px] w-5 bg-secondary/30 rounded-full"></span>
      </div>
    </div>
  );
}

export default SectionTitle;
