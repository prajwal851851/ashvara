import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "../components/Button";
import { Reveal, ClipReveal } from "../components/Reveal";
import { ScrollHint } from "../components/ScrollHint";
import { brand } from "../data/brand";
import "./Dining.css";

gsap.registerPlugin(ScrollTrigger);

const DISHES = [
  "/images/dining/dish-1.webp",
  "/images/dining/dish-2.webp",
  "/images/dining/dish-3.webp",
  "/images/dining/dish-7.webp",
  "/images/dining/dish-8.webp",
  "/images/dining/dish-9.webp",
];

function DiningHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const clipId = useId().replace(/:/g, "");

  useEffect(() => {
    const text = textRef.current;
    const section = sectionRef.current;
    if (!text || !section) return;

    const sync = () => {
      const w = section.clientWidth || window.innerWidth;
      const size =
        w >= 1280 ? w * 0.15 : w >= 768 ? w * 0.18 : w * 0.2;
      text.setAttribute("font-size", String(size));
      text.setAttribute("letter-spacing", String(size * 0.12));
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const veil = veilRef.current;
      const clip = clipRef.current;
      if (!section || !veil || !clip) return;

      const video = clip.querySelector("video");
      gsap.set(veil, { opacity: 0 });
      gsap.set(clip, { scale: 0.7, opacity: 0 });
      if (video) gsap.set(video, { scale: 1.2 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(veil, { opacity: 0.7, ease: "none" }, 0).to(
        clip,
        { scale: 1.1, opacity: 1, ease: "power2.out" },
        0
      );
      if (video) tl.to(video, { scale: 1.7, ease: "power2.out" }, 0);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="dining-hero-anim" aria-label="Dining">
      <div className="dining-hero-anim__bg">
        <video src="/videos/dining-hero.mp4" autoPlay muted loop playsInline />
        <div className="dining-hero-anim__shade" />
      </div>

      <div ref={veilRef} className="dining-hero-anim__veil" />

      <svg className="dining-hero-anim__svg" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <text
              ref={textRef}
              x="50%"
              y="52%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="dining-hero-anim__clip-text"
            >
              DINING
            </text>
          </clipPath>
        </defs>
      </svg>

      <div className="dining-hero-anim__masked">
        <div
          ref={clipRef}
          className="dining-hero-anim__clip"
          style={{
            clipPath: `url(#${clipId})`,
            WebkitClipPath: `url(#${clipId})`,
          }}
        >
          <video src="/videos/dining-hero.mp4" autoPlay muted loop playsInline />
        </div>
      </div>

      <h1 className="sr-only">Dining</h1>
      <a href="#dining-intro" className="dining-hero-anim__scroll">
        Scroll Down
      </a>
    </section>
  );
}

export function Dining() {
  const [hintHidden, setHintHidden] = useState(false);

  return (
    <div
      className="dining-page"
      onWheel={() => setHintHidden(true)}
      onTouchMove={() => setHintHidden(true)}
    >
      <DiningHero />
      <ScrollHint hidden={hintHidden} />

      <section id="dining-intro" className="section dining-intro">
        <Reveal>
          <p className="container">
            Our chefs prepare dishes with fresh, seasonal ingredients sourced locally,
            ensuring every meal is a perfect blend of tradition and flavor for your
            ultimate relaxation.
          </p>
        </Reveal>
      </section>

      <section className="section dining-visuals" aria-label="Culinary visuals">
        <div className="container--wide dining-visuals__grid">
          <ClipReveal>
            <img src="/images/dining/dining-20.webp" alt="Fine dining plated course" />
          </ClipReveal>
          <ClipReveal>
            <img src="/images/dining/dining-1.webp" alt="Signature dish presentation" />
          </ClipReveal>
        </div>
      </section>

      <section className="section dining-feature">
        <div className="container dining-feature__grid">
          <Reveal>
            <p className="eyebrow">The Dining Room</p>
            <h2 className="gold-text">A Vibrant Dining Ambiance</h2>
            <p>
              Step into a meticulously designed sanctuary where contemporary
              sophistication meets warm alpine comfort. Illuminated by custom spherical
              glass pendants and furnished with plush seating, our main dining room sets
              the perfect stage for an unforgettable culinary journey, whether it&apos;s
              an intimate dinner or a grand celebration.
            </p>
          </Reveal>
          <ClipReveal>
            <img src="/images/dining/dining-19.webp" alt="Warm upscale dining room" />
          </ClipReveal>
        </div>
      </section>

      <section className="section dining-feature dining-feature--reverse">
        <div className="container dining-feature__grid">
          <ClipReveal>
            <img
              src="/images/dining/dining-22.webp"
              alt="Lounge overlooking mountain sunset"
            />
          </ClipReveal>
          <Reveal>
            <p className="eyebrow">The Views</p>
            <h2 className="gold-text">Panoramic Views & Alpine Serenity</h2>
            <p>
              Gaze out at the breathtaking Himalayan peaks as the sky is painted in hues
              of amber and violet. Featuring floor-to-ceiling glass windows and luxurious
              lounge seating, our viewing gallery provides a tranquil space to sip premium
              spirits and share stories while watching the sun set over the spectacular
              alpine landscape.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="dining-mood">
        <video src="/videos/fire.mp4" autoPlay muted loop playsInline />
        <Reveal>
          <p className="container">
            Savor hand-crafted cocktails infused with local alpine botanicals, premium
            single malts, and fine international wines, each curated to elevate your
            spirits and complement your culinary journey.
          </p>
        </Reveal>
      </section>

      <section className="section dining-dishes">
        <div className="container dining-dishes__header">
          <Reveal>
            <h2 className="gold-text">Signature Dishes</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              Explore a curated selection of our finest culinary masterpieces. Blending
              wild alpine botanicals with refined culinary artistry, each plate is a
              celebration of pristine mountain flavors and modern sophistication.
            </p>
          </Reveal>
        </div>
        <div className="container dining-dishes__grid">
          {DISHES.map((src, i) => (
            <Reveal key={src} delay={i * 0.05}>
              <img src={src} alt={`Signature dish ${i + 1}`} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="dining-cta">
        <img src="/images/dining/dining-23.webp" alt="" />
        <Reveal className="dining-cta__content">
          <h2>
            Savor the Art of
            <br />
            Fine Dining.
          </h2>
          <p>
            Embark on a culinary journey where seasonal alpine ingredients meet modern
            gastronomic artistry, crafting unforgettable moments of taste and refinement.
          </p>
          <Button href={`mailto:${brand.email}`} variant="outline">
            Reserve a Table
          </Button>
        </Reveal>
      </section>
    </div>
  );
}
