import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion } from "framer-motion";
import "./Moments.css";

const REELS = [
  "/videos/reels/reel-0.mp4",
  "/videos/reels/reel-2.mp4",
  "/videos/reels/reel-3.mp4",
  "/videos/reels/reel-4.mp4",
  "/videos/reels/reel-5.mp4",
  "/videos/reels/reel-6.mp4",
];

function wrapOffset(index: number, active: number, length: number) {
  let offset = index - active;
  const half = Math.floor(length / 2);
  if (offset < -half) offset += length;
  if (offset > half) offset -= length;
  return offset;
}

export function Moments() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const didDrag = useRef(false);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setProgress(0);
    videosRef.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        video.currentTime = 0;
        video.muted = muted;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active]);

  useEffect(() => {
    const video = videosRef.current[active];
    if (video) video.muted = muted;
  }, [muted, active]);

  function next() {
    setActive((i) => (i + 1) % REELS.length);
  }

  function prev() {
    setActive((i) => (i - 1 + REELS.length) % REELS.length);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    setDragging(true);
    startX.current = e.clientX;
    didDrag.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const delta = e.clientX - startX.current;
    setDragX(delta);
    if (Math.abs(delta) > 10) didDrag.current = true;
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (dragX < -60) next();
    else if (dragX > 60) prev();
    setDragX(0);
  }

  return (
    <div className="moments">
      <div className="moments__heading-wrap">
        <h2 className="moments__heading">
          Each moment is different and that makes them unique.
        </h2>
      </div>

      <section
        className="moments__section"
        aria-roledescription="carousel"
        aria-label="Guest moments"
      >
        <div
          className="moments__stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {REELS.map((src, i) => {
            const offset = wrapOffset(i, active, REELS.length);
            const isActive = offset === 0;
            const isNear = Math.abs(offset) <= 2;
            const z =
              offset === 0 ? 20 : Math.abs(offset) === 1 ? 10 : 5;

            return (
              <motion.div
                key={src}
                className={`moments__slide ${isActive ? "is-active" : ""}`}
                animate={{
                  x: `calc(${115 * offset}% + ${dragX}px)`,
                  scale: isActive ? 1 : 0.88,
                  opacity: isNear ? 1 : 0,
                  filter: isActive ? "brightness(1)" : "brightness(0.35)",
                }}
                whileHover={
                  !isActive && isNear ? { filter: "brightness(0.8)" } : undefined
                }
                transition={{
                  duration: dragging ? 0.05 : 0.8,
                  ease: dragging ? "linear" : [0.16, 1, 0.3, 1],
                }}
                style={{ zIndex: z }}
                onClick={(e) => {
                  if (didDrag.current) {
                    e.preventDefault();
                    return;
                  }
                  if (offset === -1) prev();
                  if (offset === 1) next();
                }}
              >
                <video
                  ref={(el) => {
                    videosRef.current[i] = el;
                  }}
                  src={src}
                  playsInline
                  muted={muted}
                  onEnded={isActive ? next : undefined}
                  onTimeUpdate={
                    isActive
                      ? (e) => {
                          const t = e.currentTarget;
                          if (t.duration) {
                            setProgress((t.currentTime / t.duration) * 100);
                          }
                        }
                      : undefined
                  }
                  className="moments__video"
                />

                {isActive ? (
                  <>
                    <div
                      className="moments__bars"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {REELS.map((_, barIndex) => (
                        <button
                          key={barIndex}
                          type="button"
                          className="moments__bar"
                          aria-label={`Go to moment ${barIndex + 1}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActive(barIndex);
                          }}
                        >
                          {barIndex === active ? (
                            <span style={{ width: `${progress}%` }} />
                          ) : barIndex < active ? (
                            <span style={{ width: "100%" }} />
                          ) : null}
                        </button>
                      ))}
                    </div>

                    <div
                      className="moments__actions"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="moments__icon-btn"
                        aria-label={liked[active] ? "Unlike reel" : "Like reel"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLiked((prev) => ({
                            ...prev,
                            [active]: !prev[active],
                          }));
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className={liked[active] ? "is-liked" : undefined}
                          fill={liked[active] ? "currentColor" : "none"}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="moments__icon-btn"
                        aria-label={muted ? "Unmute video" : "Mute video"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMuted((m) => !m);
                        }}
                      >
                        {muted ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                            />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </>
                ) : null}
              </motion.div>
            );
          })}
        </div>

        <div className="moments__nav">
          <button type="button" onClick={prev} aria-label="Previous moment">
            ←
          </button>
          <span>
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(REELS.length).padStart(2, "0")}
          </span>
          <button type="button" onClick={next} aria-label="Next moment">
            →
          </button>
        </div>
      </section>
    </div>
  );
}
