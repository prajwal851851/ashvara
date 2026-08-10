import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { brand } from "../data/brand";
import { useLenis } from "../hooks/useLenis";
import "./Gallery.css";

gsap.registerPlugin(Observer);

const SLIDES = [
  "/images/ashvara/gallery-1.jpg",
  "/images/ashvara/gallery-2.jpg",
  "/images/ashvara/gallery-3.jpg",
  "/images/ashvara/gallery-4.jpg",
  "/images/ashvara/rooms/suite.jpg",
  "/images/ashvara/rooms/luxury-1.jpg",
  "/images/ashvara/rooms/rooftop.jpg",
  "/images/ashvara/rooms/king.jpg",
  "/images/ashvara/rooms/double.jpg",
  "/images/ashvara/rooms/luxury-2.jpg",
  "/images/ashvara/meditation.jpg",
  "/images/ashvara/welcome-lobby.jpg",
];

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const indexRef = useRef(0);
  const animating = useRef(false);
  const goToRef = useRef<(next: number, dir: 1 | -1) => void>(() => {});
  const [index, setIndex] = useState(0);
  const { lenis } = useLenis();

  useEffect(() => {
    lenis?.stop();
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [lenis]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const show = (i: number) => {
      slidesRef.current.forEach((slide, n) => {
        if (!slide) return;
        const on = n === i;
        slide.classList.toggle("is-active", on);
        gsap.set(slide, {
          autoAlpha: on ? 1 : 0,
          zIndex: on ? 5 : 1,
          clipPath: on ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)",
        });
        const img = slide.querySelector("img");
        if (img) gsap.set(img, { scale: 1, xPercent: 0 });
      });
    };

    show(0);

    const goTo = (next: number, dir: 1 | -1) => {
      if (animating.current) return;
      const current = indexRef.current;
      if (next === current || next < 0 || next >= SLIDES.length) return;

      const from = slidesRef.current[current];
      const to = slidesRef.current[next];
      if (!from || !to) return;

      animating.current = true;
      indexRef.current = next;
      setIndex(next);

      to.classList.add("is-active");
      gsap.set(to, {
        zIndex: 10,
        autoAlpha: 1,
        clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
      });
      gsap.set(from, { zIndex: 5 });

      const toImg = to.querySelector("img");
      const fromImg = from.querySelector("img");
      if (toImg) gsap.set(toImg, { scale: 1.08 });

      gsap
        .timeline({
          onComplete: () => {
            from.classList.remove("is-active");
            gsap.set(from, {
              autoAlpha: 0,
              zIndex: 1,
              clipPath: "inset(0% 0% 0% 100%)",
            });
            gsap.set(to, { zIndex: 5 });
            animating.current = false;
          },
        })
        .to(
          to,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power2.inOut" },
          0
        )
        .to(
          fromImg || from,
          {
            scale: fromImg ? 0.96 : 1,
            xPercent: fromImg ? (dir > 0 ? -8 : 8) : 0,
            duration: 1.1,
            ease: "power2.inOut",
          },
          0
        )
        .to(toImg || to, { scale: 1, duration: 1.1, ease: "power2.inOut" }, 0);
    };

    goToRef.current = goTo;

    const observer = Observer.create({
      target: section,
      type: "wheel,touch",
      preventDefault: true,
      tolerance: 10,
      wheelSpeed: -1,
      onUp: () => goTo(indexRef.current + 1, 1),
      onDown: () => goTo(indexRef.current - 1, -1),
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goTo(indexRef.current + 1, 1);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goTo(indexRef.current - 1, -1);
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      observer.kill();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="gallery-page">
      <section
        ref={sectionRef}
        className="gallery"
        aria-label={`${brand.name} gallery`}
      >
        {SLIDES.map((src, i) => (
          <div
            key={src}
            ref={(el) => {
              slidesRef.current[i] = el;
            }}
            className={`gallery__slide${i === 0 ? " is-active" : ""}`}
          >
            <img
              src={`${src}?v=4`}
              alt={`Gallery slide ${i + 1}`}
              decoding="async"
              fetchPriority={i === 0 ? "high" : "auto"}
            />
            <div className="gallery__shade" />
          </div>
        ))}

        <div className="gallery__controls">
          <button
            type="button"
            aria-label="Previous slide"
            disabled={index === 0}
            onClick={() => goToRef.current(index - 1, -1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <span>
            {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label="Next slide"
            disabled={index >= SLIDES.length - 1}
            onClick={() => goToRef.current(index + 1, 1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
