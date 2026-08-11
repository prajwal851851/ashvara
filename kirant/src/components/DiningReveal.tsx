import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { brand } from "../data/brand";
import "./DiningReveal.css";

gsap.registerPlugin(ScrollTrigger);

const TASTES = [
  {
    id: "chef",
    label: "Chef's table",
    note: "Eight seats. One fire. A mountain tasting paced to the night.",
    pos: "55% 40%",
  },
  {
    id: "harvest",
    label: "Valley harvest",
    note: "Market herbs, ridge honey, and plates that taste of the foothills.",
    pos: "35% 55%",
  },
  {
    id: "cellar",
    label: "Cellar & ember",
    note: "Slow pours beside warm stone — evenings meant to linger.",
    pos: "70% 60%",
  },
] as const;

/** Split-title open, then an interactive tasting overlay (not a static poster). */
export function DiningReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [taste, setTaste] = useState(0);
  const [live, setLive] = useState(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const imageWrap = imageWrapRef.current;
      const line1 = line1Ref.current;
      const line2 = line2Ref.current;
      const overlay = overlayRef.current;
      const video = videoRef.current;
      if (!section || !imageWrap || !line1 || !line2 || !overlay) return;

      gsap.set(imageWrap, { scale: 0 });
      gsap.set([line1, line2], { yPercent: 0 });
      gsap.set(overlay, { opacity: 0, y: 28 });
      if (video) gsap.set(video, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=160%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const open = self.progress > 0.42;
            section.classList.toggle("is-open", open);
            setLive((prev) => (prev === open ? prev : open));
            if (video) {
              if (open) void video.play().catch(() => {});
              else video.pause();
            }
          },
        },
      });

      tl.to(line1, { yPercent: -130, ease: "power2.inOut" }, 0)
        .to(line2, { yPercent: 130, ease: "power2.inOut" }, 0)
        .to(imageWrap, { scale: 1, ease: "power2.inOut" }, 0.06)
        .to(overlay, { opacity: 1, y: 0, ease: "power2.out" }, 0.45);
      if (video) tl.to(video, { opacity: 0.5, ease: "power1.out" }, 0.5);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  /* Cursor parallax — only once the plate is open */
  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media) return;

    const onMove = (e: PointerEvent) => {
      if (!section.classList.contains("is-open")) return;
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(media, {
        x: x * 18,
        y: y * 12,
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const onLeave = () => {
      gsap.to(media, { x: 0, y: 0, duration: 0.7, ease: "power2.out" });
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const active = TASTES[taste];

  return (
    <section
      ref={sectionRef}
      className="dining-reveal"
      aria-label="Exquisite Dining"
    >
      <div className="dining-reveal__media" ref={mediaRef}>
        <div ref={imageWrapRef} className="dining-reveal__image-wrap">
          <img
            src="/images/ashvara/dining.jpg"
            alt=""
            draggable={false}
            style={{ objectPosition: active.pos }}
          />
          <video
            ref={videoRef}
            className="dining-reveal__video"
            src="/videos/dining-3.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="dining-reveal__copy" aria-hidden={live}>
        <div className="dining-reveal__clip">
          <div ref={line1Ref} className="dining-reveal__line">
            Exquisite
          </div>
        </div>
        <div className="dining-reveal__clip">
          <div ref={line2Ref} className="dining-reveal__line">
            Dining
          </div>
        </div>
      </div>

      <div
        ref={overlayRef}
        className="dining-reveal__overlay"
        aria-hidden={!live}
      >
        <p className="dining-reveal__eyebrow">At the table</p>
        <p className="dining-reveal__note" key={active.id}>
          {active.note}
        </p>

        <div className="dining-reveal__tastes" role="tablist" aria-label="Dining moods">
          {TASTES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={taste === i}
              className={`dining-reveal__taste${taste === i ? " is-active" : ""}`}
              tabIndex={live ? 0 : -1}
              onClick={() => setTaste(i)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <Link
          to="/dining"
          className="dining-reveal__cta"
          tabIndex={live ? 0 : -1}
        >
          Explore the menu
          <span aria-hidden="true">→</span>
        </Link>
        <p className="dining-reveal__place">{brand.location}</p>
      </div>

      <h2 className="sr-only">Exquisite Dining</h2>
    </section>
  );
}
