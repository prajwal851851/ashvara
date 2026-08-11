import { useEffect, useRef } from "react";
import "./WellnessHeroReel.css";

const DESKTOP_SOURCES = [
  "/videos/wellness-hero/1.mp4",
  "/videos/wellness-hero/2.mp4",
  "/videos/wellness-hero/3.mp4",
] as const;

const MOBILE_SOURCES = [
  "/videos/wellness-hero/1-mobile.mp4",
  "/videos/wellness-hero/2-mobile.mp4",
  "/videos/wellness-hero/3-mobile.mp4",
] as const;

const CROSSFADE_SEC = 1.15;

function preferMobile() {
  if (typeof window === "undefined") return false;
  const narrow = window.matchMedia("(max-width: 900px)").matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  const slow =
    Boolean(conn?.saveData) ||
    conn?.effectiveType === "2g" ||
    conn?.effectiveType === "slow-2g" ||
    conn?.effectiveType === "3g";
  return narrow || slow;
}

/**
 * Dual-buffer hero reel with soft crossfades so three clips feel like one film.
 * Prefetches next clip; pauses when off-screen to protect mobile performance.
 */
export function WellnessHeroReel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const idxRef = useRef(0);
  const activeRef = useRef<"a" | "b">("a");
  const fadingRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const va = aRef.current;
    const vb = bRef.current;
    if (!wrap || !va || !vb) return;

    const sources = preferMobile() ? [...MOBILE_SOURCES] : [...DESKTOP_SOURCES];
    let cancelled = false;
    let raf = 0;

    const front = () => (activeRef.current === "a" ? va : vb);
    const back = () => (activeRef.current === "a" ? vb : va);

    const setLayer = (el: HTMLVideoElement, on: boolean) => {
      el.classList.toggle("is-front", on);
      el.classList.toggle("is-back", !on);
      el.style.opacity = on ? "1" : "0";
    };

    const prepare = async (el: HTMLVideoElement, src: string) => {
      if (el.getAttribute("src") !== src) {
        el.src = src;
        el.load();
      }
      await new Promise<void>((resolve) => {
        if (el.readyState >= 2) {
          resolve();
          return;
        }
        const done = () => {
          el.removeEventListener("loadeddata", done);
          el.removeEventListener("error", done);
          resolve();
        };
        el.addEventListener("loadeddata", done, { once: true });
        el.addEventListener("error", done, { once: true });
      });
      try {
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
    };

    const crossfadeToNext = async () => {
      if (cancelled || fadingRef.current || sources.length < 2) return;
      fadingRef.current = true;

      const nextIdx = (idxRef.current + 1) % sources.length;
      const incoming = back();
      const outgoing = front();

      await prepare(incoming, sources[nextIdx]);
      if (cancelled) return;

      setLayer(incoming, true);
      incoming.style.opacity = "0";
      void incoming.play().catch(() => {});

      const start = performance.now();
      const duration = CROSSFADE_SEC * 1000;

      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / duration);
        const e = t * t * (3 - 2 * t);
        incoming.style.opacity = String(e);
        outgoing.style.opacity = String(1 - e);

        if (t < 1) {
          raf = requestAnimationFrame(tick);
          return;
        }

        outgoing.pause();
        try {
          outgoing.currentTime = 0;
        } catch {
          /* ignore */
        }
        outgoing.style.opacity = "0";
        incoming.style.opacity = "1";
        setLayer(incoming, true);
        setLayer(outgoing, false);
        activeRef.current = activeRef.current === "a" ? "b" : "a";
        idxRef.current = nextIdx;
        fadingRef.current = false;
        void prepare(outgoing, sources[(nextIdx + 1) % sources.length]);
      };

      raf = requestAnimationFrame(tick);
    };

    const onTimeUpdate = () => {
      const el = front();
      if (!el.duration || Number.isNaN(el.duration) || fadingRef.current) return;
      if (el.duration - el.currentTime <= CROSSFADE_SEC + 0.08) {
        void crossfadeToNext();
      }
    };

    const onEnded = () => {
      void crossfadeToNext();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false;
        if (visible) {
          void front().play().catch(() => {});
        } else {
          va.pause();
          vb.pause();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(wrap);

    const onVisibility = () => {
      if (document.hidden) {
        va.pause();
        vb.pause();
      } else {
        void front().play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    va.addEventListener("timeupdate", onTimeUpdate);
    vb.addEventListener("timeupdate", onTimeUpdate);
    va.addEventListener("ended", onEnded);
    vb.addEventListener("ended", onEnded);

    void (async () => {
      setLayer(va, true);
      setLayer(vb, false);
      await prepare(va, sources[0]);
      if (cancelled) return;
      void va.play().catch(() => {});
      if (sources.length > 1) void prepare(vb, sources[1]);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      va.removeEventListener("timeupdate", onTimeUpdate);
      vb.removeEventListener("timeupdate", onTimeUpdate);
      va.removeEventListener("ended", onEnded);
      vb.removeEventListener("ended", onEnded);
      va.pause();
      vb.pause();
    };
  }, []);

  return (
    <div ref={wrapRef} className="wellness-hero-reel" aria-hidden="true">
      <video
        ref={aRef}
        className="wellness-hero-reel__video is-front"
        muted
        playsInline
        preload="auto"
      />
      <video
        ref={bRef}
        className="wellness-hero-reel__video is-back"
        muted
        playsInline
        preload="metadata"
      />
    </div>
  );
}
