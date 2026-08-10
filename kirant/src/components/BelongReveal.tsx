import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { brand } from "../data/brand";
import "./BelongReveal.css";

gsap.registerPlugin(ScrollTrigger);

const IMAGE = "/images/ashvara/welcome-legendary.jpg";

/** Third home beat — emotional wordmark (Welcome stays on hero 1) */
export function BelongReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const clipId = useId().replace(/:/g, "");
  const [view, setView] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const svg = svgRef.current;
    if (!section || !text || !svg) return;

    const sync = () => {
      const w = section.clientWidth || window.innerWidth;
      const h = section.clientHeight || window.innerHeight;
      setView({ w, h });
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

      const size = Math.min(w * 0.13, h * 0.24);
      text.setAttribute("font-size", String(size));
      text.setAttribute("letter-spacing", String(size * 0.12));
      text.setAttribute("x", String(w / 2));
      text.setAttribute("y", String(h * 0.48));
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(section);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const veil = veilRef.current;
      const clip = clipRef.current;
      const quote = quoteRef.current;
      if (!section || !veil || !clip) return;

      const media = clip.querySelector("img");
      gsap.set(veil, { opacity: 0 });
      gsap.set(clip, { scale: 0.82, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(quote, { opacity: 0, y: 24 });
      if (media) gsap.set(media, { scale: 1.2, transformOrigin: "50% 40%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(veil, { opacity: 0.78, ease: "none" }, 0)
        .to(clip, { scale: 1, opacity: 1, ease: "power2.out" }, 0)
        .to(quote, { opacity: 1, y: 0, ease: "power2.out" }, 0.25);
      if (media) tl.to(media, { scale: 1, ease: "power2.out" }, 0);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="belong-reveal"
      aria-label="A place to belong"
    >
      <div className="belong-reveal__bg">
        <img src={IMAGE} alt="" draggable={false} />
        <div className="belong-reveal__shade" />
      </div>

      <div ref={veilRef} className="belong-reveal__veil" />

      <svg
        ref={svgRef}
        className="belong-reveal__svg"
        viewBox={`0 0 ${view.w} ${view.h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <text
              ref={textRef}
              x={view.w / 2}
              y={view.h * 0.48}
              textAnchor="middle"
              dominantBaseline="middle"
              className="belong-reveal__clip-text"
            >
              BELONG
            </text>
          </clipPath>
        </defs>
      </svg>

      <div className="belong-reveal__masked">
        <div
          ref={clipRef}
          className="belong-reveal__clip"
          style={{
            clipPath: `url(#${clipId})`,
            WebkitClipPath: `url(#${clipId})`,
          }}
        >
          <img src={IMAGE} alt="" draggable={false} />
        </div>
      </div>

      <p ref={quoteRef} className="belong-reveal__quote">
        A place the mountains remember you
      </p>

      <h2 className="sr-only">Belong at {brand.name}</h2>
    </section>
  );
}
