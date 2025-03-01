import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  subtitleClassName?: string;
  decorative?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  align = "center",
  className,
  subtitleClassName,
  decorative = true,
}) => {
  return (
    <div
      className={cn(
        "space-y-3 mb-10",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
        {title}
      </h2>

      {decorative && (
        <div
          className={cn(
            "flex gap-1.5",
            align === "center" && "justify-center",
            align === "right" && "justify-end"
          )}
        >
          <span className="h-1 w-1 rounded-full bg-primary opacity-70" />
          <span className="h-1 w-1 rounded-full bg-primary opacity-80" />
          <span className="h-1 w-3 rounded-full bg-primary" />
          <span className="h-1 w-1 rounded-full bg-primary opacity-80" />
          <span className="h-1 w-1 rounded-full bg-primary opacity-70" />
        </div>
      )}

      {subtitle && (
        <p
          className={cn(
            "text-muted-foreground text-lg text-balance max-w-3xl",
            align === "center" && "mx-auto",
            align === "right" && "ml-auto",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
