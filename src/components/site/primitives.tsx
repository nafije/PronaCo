import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SplitText } from "@/components/fx/SplitText";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[90rem] px-4 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

/** Text that rolls up to a copy of itself on hover. Needs a `group` ancestor. */
export function RollText({ children }: { children: string }) {
  return (
    <span className="relative inline-block overflow-hidden align-top">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

type ButtonProps = {
  to: string;
  children: string;
  variant?: "clay" | "ink" | "outline" | "light";
  external?: boolean;
  className?: string;
};

const buttonStyles = {
  clay: "bg-clay text-paper hover:bg-ink",
  ink: "bg-ink text-paper hover:bg-clay",
  outline: "border border-ink/20 text-ink hover:border-ink",
  light: "border border-paper/30 text-paper hover:bg-paper hover:text-ink",
};

const arrowStyles = {
  clay: "bg-paper text-clay",
  ink: "bg-paper text-ink",
  outline: "bg-ink text-paper",
  light: "bg-paper text-ink group-hover:bg-clay group-hover:text-paper",
};

export function ButtonLink({ to, children, variant = "clay", external = false, className = "" }: ButtonProps) {
  const classes = `group relative inline-flex items-center gap-4 overflow-hidden rounded-full py-2 pr-2 pl-6 text-sm font-semibold transition-colors duration-300 ${buttonStyles[variant]} ${className}`;
  const content = (
    <>
      {/* Sheen that sweeps across on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full -skew-x-12 bg-white/25 transition-transform duration-700 ease-out group-hover:translate-x-[400%]"
      />
      <RollText>{children}</RollText>
      <span
        className={`flex size-9 items-center justify-center rounded-full transition-[transform,background-color,color] duration-500 group-hover:rotate-45 ${arrowStyles[variant]}`}
      >
        <ArrowUpRight className="size-4" />
      </span>
    </>
  );
  return external ? (
    <a href={to} className={classes} target={to.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {content}
    </a>
  ) : (
    <Link to={to} className={classes}>
      {content}
    </Link>
  );
}

export function Eyebrow({ children, className = "text-clay" }: { children: ReactNode; className?: string }) {
  return <span className={`eyebrow ${className}`}>{children}</span>;
}

export function InstagramIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H6.5v3.5H9V21h3.5v-8.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2m0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2m4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.7-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3" />
    </svg>
  );
}

/**
 * Section heading pair used across pages: eyebrow over a serif title whose words rise into view.
 * `title` uses SplitText markup — "*word*" for the clay italic accent.
 */
export function SectionHead({
  eyebrow,
  title,
  className = "",
  light = false,
}: {
  eyebrow: string;
  title: string;
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={className}>
      <Eyebrow className={light ? "text-clay-2" : "text-clay"}>{eyebrow}</Eyebrow>
      <h2 className={`mt-5 font-serif text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] font-light tracking-tight ${light ? "text-paper" : "text-ink"}`}>
        <SplitText text={title} />
      </h2>
    </div>
  );
}
