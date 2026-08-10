import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./ScrollHint.css";

type Props = {
  hidden?: boolean;
};

export function ScrollHint({ hidden = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (hidden) {
      gsap.to(el, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.3,
        ease: "power2.inOut",
        overwrite: true,
      });
    } else {
      gsap.to(el, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      });
    }
  }, [hidden]);

  return (
    <div ref={ref} className="scroll-hint" aria-hidden="true">
      <style>{`
        .scroll-beam {
          stroke-dasharray: 20 100;
          stroke-dashoffset: 120;
          animation: beam-flow 2.4s cubic-bezier(0.2, 0.8, 0.8, 0.2) infinite;
        }
        @keyframes beam-flow {
          0% { stroke-dashoffset: 120; }
          100% { stroke-dashoffset: -120; }
        }
      `}</style>
      <svg width="18" height="48" viewBox="0 0 18 48" fill="none">
        <rect
          x="1"
          y="1"
          width="16"
          height="46"
          rx="8"
          stroke="currentColor"
          strokeOpacity="0.45"
        />
        <line
          className="scroll-beam"
          x1="9"
          y1="10"
          x2="9"
          y2="30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span>Scroll Down</span>
    </div>
  );
}
