import { useEffect } from "react";
import { X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { lockScroll } from "@/lib/motion";

/** Full-screen player with controls. Closes on Escape, the close button or a click on the backdrop. */
export function VideoModal({ src, title, onClose }: { src: string | null; title?: string; onClose: () => void }) {
  const { t } = useLang();

  useEffect(() => {
    if (!src) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Video"}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex animate-[fade-in_0.4s_ease_both] items-center justify-center bg-ink/90 p-4 backdrop-blur-md sm:p-10"
    >
      <button
        onClick={onClose}
        aria-label={t("Mbyll videon", "Close video")}
        className="absolute top-4 right-4 flex size-12 items-center justify-center rounded-full bg-paper text-ink transition-transform hover:rotate-90 sm:top-8 sm:right-8"
      >
        <X className="size-5" />
      </button>
      <div className="w-full max-w-6xl animate-[zoom-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both]" onClick={(e) => e.stopPropagation()}>
        {title && <p className="mb-4 font-serif text-2xl text-paper">{title}</p>}
        <video src={src} controls autoPlay playsInline className="aspect-video w-full rounded-2xl bg-black object-cover shadow-2xl" />
      </div>
    </div>
  );
}
