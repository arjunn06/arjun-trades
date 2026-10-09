import { useEffect, useState, type ReactNode } from "react";
import { Play } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export const ytThumb = (id: string, quality: "maxresdefault" | "hqdefault" | "mqdefault" = "hqdefault") =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`;

interface YouTubeFacadeProps {
  id: string;
  title: string;
  className?: string;
  /** Shown in place of the thumbnail when YouTube has none yet (unpublished or private video). */
  fallback?: ReactNode;
}

/**
 * Shows the thumbnail and only mounts the YouTube iframe after a click.
 * Keeps the page light (no third-party player on load) and avoids six simultaneous embeds.
 */
const YouTubeFacade = ({ id, title, className, fallback }: YouTubeFacadeProps) => {
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState(ytThumb(id, "maxresdefault"));
  const [noThumb, setNoThumb] = useState(false);

  useEffect(() => {
    setPlaying(false);
    setSrc(ytThumb(id, "maxresdefault"));
    setNoThumb(false);
  }, [id]);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        className={cn("aspect-video w-full bg-panel", className)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className={cn("group relative block aspect-video w-full overflow-hidden bg-panel text-left", className)}
    >
      {noThumb ? (
        fallback
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          onLoad={(e) => {
            // YouTube serves a 120px grey placeholder when a thumbnail doesn't exist for a video.
            if (e.currentTarget.naturalWidth > 120) return;
            if (src.includes("maxres")) setSrc(ytThumb(id, "hqdefault"));
            else setNoThumb(true);
          }}
          onError={() => (src.includes("maxres") ? setSrc(ytThumb(id, "hqdefault")) : setNoThumb(true))}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        />
      )}
      <span className="absolute bottom-0 left-0 flex h-14 w-14 items-center justify-center bg-primary text-primary-foreground transition-[width,background-color] duration-300 ease-out-expo group-hover:w-[4.5rem] group-hover:bg-foreground group-hover:text-background sm:h-16 sm:w-16 sm:group-hover:w-24">
        <Play className="h-6 w-6" weight="fill" />
      </span>
    </button>
  );
};

export default YouTubeFacade;
