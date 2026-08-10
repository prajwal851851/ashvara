import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "./Button";
import "./Preloader.css";

type Props = {
  onComplete?: () => void;
};

function Digit({ value }: { value: string }) {
  const i = Number.parseInt(value, 10) || 0;
  return (
    <span className="preloader-digit">
      <motion.span
        className="preloader-digit__strip"
        animate={{ y: `-${10 * i}%` }}
        transition={{ type: "tween", duration: 0.12, ease: "easeOut" }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </motion.span>
    </span>
  );
}

const ASSETS = [
  "/images/key-hole-1.webp",
  "/images/ashvara/hero-lobby.jpg",
  "/images/ashvara/hero-reception.jpg",
  "/images/ashvara/welcome-v3.jpg",
  "/images/ashvara/dining.jpg",
  "/images/ashvara/meditation.jpg",
];

const PEEK_IMAGE = "/images/ashvara/hero-lobby.jpg";
const AUDIO_SRC = "/audios/bgm.mp3";

export function Preloader({ onComplete }: Props) {
  const [doorOpen, setDoorOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [entered, setEntered] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const loads = useState<Record<string, number>>(() => ({}))[0];

  const doorSwing = entered || hovered;

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const width = w >= 1280 ? 0.3 * w : 0.7 * w;
      const height = (768 / 1376) * width;
      setBounds({ x: (w - width) / 2, y: (h - height) / 2, width, height });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    ASSETS.forEach((src) => {
      const img = new Image();
      const mark = () => {
        if (!cancelled) loads[src] = 1;
      };
      img.onload = mark;
      img.onerror = mark;
      img.src = src;
      if (img.complete) mark();
    });
    const audio = new Audio();
    const markAudio = () => {
      if (!cancelled) loads[AUDIO_SRC] = 1;
    };
    audio.addEventListener("canplaythrough", markAudio, { once: true });
    audio.addEventListener("error", markAudio, { once: true });
    audio.preload = "auto";
    audio.src = AUDIO_SRC;
    const failSafe = window.setTimeout(() => {
      ASSETS.forEach((src) => {
        loads[src] = 1;
      });
      loads[AUDIO_SRC] = 1;
    }, 6000);
    return () => {
      cancelled = true;
      window.clearTimeout(failSafe);
    };
  }, [visible, loads]);

  useEffect(() => {
    if (!visible) return;
    const total = ASSETS.length + 1;
    const id = window.setInterval(() => {
      const values = Object.values(loads);
      const target =
        values.length > 0
          ? Math.round((values.reduce((a, b) => a + b, 0) / total) * 100)
          : 0;
      setProgress((p) => {
        if (p >= 100) {
          window.clearInterval(id);
          return 100;
        }
        const ceiling = Math.max(target, Math.min(p + 1, 92));
        return Math.min(p + 1, target >= 100 ? 100 : ceiling);
      });
    }, 18);
    return () => window.clearInterval(id);
  }, [visible, loads]);

  function enter(withAudio: boolean) {
    window.hasEnteredIntro = true;
    localStorage.setItem("audioPreference", withAudio ? "on" : "off");
    window.dispatchEvent(new Event("audioPreferenceChanged"));
    setEntered(true);
    setDoorOpen(true);
    window.setTimeout(() => setZooming(true), 900);
  }

  if (!visible) return null;

  const ready = progress >= 100;

  return (
    <AnimatePresence>
      <motion.div
        className="preloader"
        initial={{ opacity: 1 }}
        animate={zooming ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1, delay: 1.2, ease: "easeInOut" }}
        onAnimationComplete={() => {
          if (!zooming) return;
          setVisible(false);
          onComplete?.();
          window.setTimeout(() => ScrollTrigger.refresh(), 120);
        }}
      >
        <svg className="preloader__defs" aria-hidden="true">
          <defs>
            <mask
              id="keyhole-punch"
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <svg
                viewBox="0 0 1376 768"
                x={bounds.x}
                y={bounds.y}
                width={bounds.width}
                height={bounds.height}
                preserveAspectRatio="none"
              >
                <path
                  d="M 688,185 L 781,238 L 781,337 L 732,381 L 732,388 L 758,552 L 688,599 L 618,552 L 644,388 L 644,381 L 596,337 L 596,238 Z"
                  fill="black"
                />
              </svg>
            </mask>
            <clipPath id="hexagon-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0.5 0.24089 L 0.56759 0.30990 L 0.56759 0.43880 L 0.53198 0.49609 L 0.53198 0.50521 L 0.55087 0.71875 L 0.5 0.77995 L 0.44913 0.71875 L 0.46802 0.50521 L 0.46802 0.49609 L 0.43241 0.43880 L 0.43241 0.30990 Z" />
            </clipPath>
          </defs>
        </svg>

        <motion.svg
          className="preloader__veil"
          animate={zooming ? { scale: 25 } : { scale: 1 }}
          transition={{ duration: 2.8, ease: [0.7, 0, 0.3, 1] }}
        >
          <rect
            width="100%"
            height="100%"
            fill="#f3dfc1"
            mask={ready ? "url(#keyhole-punch)" : undefined}
          />
        </motion.svg>

        <motion.div
          className="preloader__stage"
          animate={{ scale: zooming ? 25 : 1 }}
          transition={{
            opacity: { duration: 0.8, ease: "easeInOut" },
            scale: { duration: 2.8, ease: [0.7, 0, 0.3, 1] },
          }}
        >
          <div
            className={`preloader__keyhole${ready ? " is-ready" : ""}`}
            onMouseEnter={() => {
              if (ready && !entered) setHovered(true);
            }}
            onMouseLeave={() => {
              if (!entered) setHovered(false);
            }}
          >
            {/* Hotel image visible through keyhole when door swings open */}
            <div className="preloader__peek">
              <img src={PEEK_IMAGE} alt="" draggable={false} />
            </div>

            <div className="preloader__door-clip">
              <motion.div
                className="preloader__door"
                initial={{ rotate: 0 }}
                animate={{ rotate: doorSwing || doorOpen ? 90 : 0 }}
                transition={{ type: "spring", duration: 3.6, bounce: 0.15 }}
              />
            </div>

            <img
              src="/images/key-hole-1.webp"
              alt="Sculpted brass keyhole cover plate"
              className="preloader__plate"
              draggable={false}
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {!ready ? (
            <motion.div
              key="loader-digits"
              className="preloader__counter"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="preloader__digits">
                {String(progress)
                  .padStart(3, "0")
                  .split("")
                  .map((d, i) => (
                    <Digit key={i} value={d} />
                  ))}
                <span>%</span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="preloader__actions">
          <AnimatePresence>
            {ready && !zooming ? (
              <motion.div
                key="enter-buttons-ui"
                className="preloader__buttons"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Button variant="solid" onClick={() => enter(true)}>
                  Discover the Stay
                </Button>
                <Button variant="outline" onClick={() => enter(false)}>
                  Silent Entrance
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
