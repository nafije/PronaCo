import { useEffect, useRef } from "react";
import type { Media } from "@/lib/data";

type MediaViewProps = {
  item: Media;
  alt: string;
  className?: string;
  /** Load immediately instead of lazily (above-the-fold media). */
  eager?: boolean;
} & Record<`data-${string}`, string | undefined>;

/** Shows a photo, or a muted looping video that only plays while it is on screen. */
export function MediaView({ item, alt, className = "", eager = false, ...rest }: MediaViewProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [item.video]);

  if (!item.video) {
    return <img src={item.image} alt={alt} loading={eager ? "eager" : "lazy"} className={className} {...rest} />;
  }
  return (
    <video
      ref={ref}
      src={item.video}
      poster={item.image}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      aria-label={alt}
      className={className}
      {...rest}
    />
  );
}
