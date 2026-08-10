import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "../components/Button";
import { Reveal, ClipReveal } from "../components/Reveal";
import { ScrollHint } from "../components/ScrollHint";
import { brand } from "../data/brand";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

function AboutKeyholeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const maskGroupRef = useRef<SVGGElement>(null);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 900px)").matches : false
  );
  const [view, setView] = useState({ width: 1778, height: 1000, centerX: 889 });

  useEffect(() => {
    setReady(true);
    const mq = window.matchMedia("(max-width: 900px)");
    const syncMobile = () => setIsMobile(mq.matches);
    syncMobile();
    mq.addEventListener("change", syncMobile);

    const measure = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const height = Math.max(rect.height || window.innerHeight, 1);
      const width = ((rect.width || window.innerWidth) / height) * 1000;
      setView({ width, height: 1000, centerX: width / 2 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      mq.removeEventListener("change", syncMobile);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useGSAP(
    () => {
      if (isMobile) return;
      const section = sectionRef.current;
      const maskGroup = maskGroupRef.current;
      if (!section || !maskGroup) return;

      const state = { maskScale: 0.1 };
      const applyMask = () => {
        maskGroup.setAttribute(
          "transform",
          `translate(${view.centerX}, 500) scale(${state.maskScale}) translate(${-view.centerX}, -500)`
        );
      };
      applyMask();
      gsap.set(".about-reveal-copy", { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: applyMask,
      });

      tl.to(state, { maskScale: 25, ease: "power2.inOut" }, 0);
      tl.to(".about-reveal-copy", { opacity: 1, y: 0, ease: "power2.out" }, 0.3);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [view.centerX, ready, isMobile] }
  );

  const cx = view.centerX;
  const keyholePath = `M ${cx - 60},490 A 100,100 0 1,1 ${cx + 60},490 L ${cx + 120},690 L ${cx - 120},690 Z`;

  const sideCopy = (
    <div
      className={`about-reveal-copy about-keyhole__side-copy${
        isMobile ? " about-keyhole__side-copy--mobile" : ""
      }`}
    >
      <div className="about-keyhole__side about-keyhole__side--left">
        <h3>
          Born from the
          <br />
          Spirit of the Hills
        </h3>
      </div>
      <div className="about-keyhole__side about-keyhole__side--right">
        <h3>
          Inspired by stillness
          <br />
          of ridge &amp; sky.
        </h3>
      </div>
    </div>
  );

  /* Mobile: static photo hero — SVG mask + pin breaks on iOS/Android */
  if (isMobile) {
    return (
      <section ref={sectionRef} className="about-keyhole about-keyhole--mobile">
        <div className="about-keyhole__fallback">
          <img
            src="/images/ashvara/about-hero.jpg"
            alt={`${brand.name} heritage`}
            draggable={false}
          />
          <div className="about-keyhole__fallback-shade" />
        </div>
        <div className="about-keyhole__titles about-keyhole__titles--on-photo">
          <h1>The Story of {brand.name}</h1>
          <p>Where Legacy Becomes Luxury</p>
        </div>
        {sideCopy}
        <a href="#about-intro" className="about-keyhole__scroll">
          Scroll Down
        </a>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="about-keyhole">
      <div className="about-keyhole__stage">
        <div className="about-keyhole__titles">
          <h1>The Story of {brand.name}</h1>
          <p>Where Legacy Becomes Luxury</p>
        </div>

        {ready ? (
          <div className="about-keyhole__mask-layer">
            <svg
              viewBox={`0 0 ${view.width} 1000`}
              preserveAspectRatio="xMidYMid slice"
              className="about-keyhole__svg"
            >
              <defs>
                <mask
                  id="about-keyhole-mask"
                  maskUnits="userSpaceOnUse"
                  maskContentUnits="userSpaceOnUse"
                >
                  <rect
                    x={-2000}
                    y={0}
                    width={view.width + 4000}
                    height={1000}
                    fill="black"
                  />
                  <g
                    ref={maskGroupRef}
                    transform={`translate(${cx}, 500) scale(0.1) translate(${-cx}, -500)`}
                  >
                    <path d={keyholePath} fill="white" />
                  </g>
                </mask>
                <linearGradient id="about-image-overlay-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="black" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="black" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="black" stopOpacity="1" />
                </linearGradient>
              </defs>
              <image
                href="/images/ashvara/about-hero.jpg"
                x={0}
                y={0}
                width={view.width}
                height={1000}
                preserveAspectRatio="xMidYMin slice"
                mask="url(#about-keyhole-mask)"
              />
              <rect
                x={0}
                y={0}
                width={view.width}
                height={1000}
                fill="url(#about-image-overlay-grad)"
                mask="url(#about-keyhole-mask)"
              />
            </svg>
          </div>
        ) : null}

        {sideCopy}
      </div>
      <a href="#about-intro" className="about-keyhole__scroll">
        Scroll Down
      </a>
    </section>
  );
}

function SplitSection({
  image,
  alt,
  imageFirst = true,
  children,
}: {
  image: string;
  alt: string;
  imageFirst?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`about-split-exact ${imageFirst ? "about-split-exact--image-first" : "about-split-exact--text-first"}`}
    >
      <ClipReveal className="about-split-exact__media">
        <img src={image} alt={alt} />
        <div className="about-split-exact__shade" />
      </ClipReveal>
      <Reveal className="about-split-exact__copy">{children}</Reveal>
    </section>
  );
}

export function About() {
  const [hintHidden, setHintHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHintHidden(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 200);
    const t2 = window.setTimeout(refresh, 800);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div className="about-page">
      <AboutKeyholeHero />
      <ScrollHint hidden={hintHidden} />

      {/* Intro + belong quote — matches original centered block */}
      <section id="about-intro" className="about-intro-exact">
        <Reveal className="about-intro-exact__inner">
          <p>
            High above the Kathmandu Valley, where dawn first touches the Himalayan
            silhouette, {brand.region} has long been a place of quiet arrival. Travelers
            came for the light on the ridges, the cool pine air, and a hospitality that
            asked nothing more than presence. That mountain ethic — patience, warmth, and
            an unspoken care for every guest — is the spirit from which {brand.name} was
            shaped: a sanctuary where the peaks teach you to linger.
          </p>
          <div className="about-intro-exact__rule" />
          <h2>
            {brand.name} is born from that mountain welcome.
            <br />
            This is not just a place to stay.
            <br />
            This is a place to belong.
          </h2>
        </Reveal>
      </section>

      {/* renaissance-painting + Heritage of Welcome */}
      <SplitSection
        image="/images/ashvara/about-heritage.jpg"
        alt={`Heritage painting inspired by ${brand.name} mountain legacy`}
        imageFirst
      >
        <h2>A Heritage of Welcome</h2>
        <p>
          In the hill villages around {brand.region}, welcoming someone was never hurried.
          Guests were greeted with warmth, offered the best of what the home had, and
          treated with quiet respect. There was no concept of excess — only authenticity.
        </p>
        <p>
          At {brand.name}, we have transformed that timeless philosophy into a modern luxury
          experience. From the moment you arrive, you are not received as a customer, but
          as a valued presence. Every detail from the gentle greeting to the curated
          ambiance echoes the mountain spirit of Himalayan hospitality.
        </p>
      </SplitSection>

      {/* Strength text + kirant-7 */}
      <SplitSection
        image="/images/ashvara/about-craft.jpg"
        alt="Mountain heritage and craft"
        imageFirst={false}
      >
        <h2>
          Strength, Simplicity,
          <br />
          and Soul.
        </h2>
        <p>
          The craft of the hills is one of exquisite artistry and profound dignity,
          captured in hand-worked ornament and protective amulets worn close to the heart.
          More than mere adornments, these details reflect a deep-rooted connection to the
          land, balancing strength with an inviting, simple grace.
        </p>
        <p>
          At {brand.name}, true luxury is not loud or showy — it is felt. We translate this
          heritage into the texture of our hospitality, the authenticity of our space, and
          a refined experience defined by strength, simplicity, and soul.
        </p>
      </SplitSection>

      {/* Mountain video */}
      <section className="about-mountain-exact">
        <video src="/videos/mountain-1.mp4" autoPlay muted loop playsInline />
        <div className="about-mountain-exact__veil" />
        <Reveal>
          <p>
            The people of these ridges lived in deep connection with forests, rivers, and
            mountains. They did not conquer nature, they coexisted with it.
          </p>
        </Reveal>
      </section>

      {/* Values */}
      <section className="about-values-exact">
        <Reveal>
          <p>Strength in our service</p>
        </Reveal>
        <Reveal delay={0.08}>
          <p>Simplicity in our design</p>
        </Reveal>
        <Reveal delay={0.16}>
          <p>Soul in every experience</p>
        </Reveal>
      </section>

      {/* kirant-8 + More Than a Stay */}
      <SplitSection
        image="/images/ashvara/about-portrait.jpg"
        alt="Cultural portrait of the hills"
        imageFirst
      >
        <h2>
          More Than a Stay,
          <br />
          A Living Experience
        </h2>
        <p>
          Every space, every curated detail, and every warm interaction at {brand.name} is
          crafted with intentionality. We believe that a true hospitality experience goes
          far beyond modern convenience; it is about creating moments of quiet beauty,
          where your stay becomes not just a simple resting place, but a deeply meaningful
          journey of discovery.
        </p>
        <p>
          These narratives of heritage and hospitality are told through the genuine warmth
          of our hosts, the serene calm of our architecturally design-focused spaces, and
          the quiet luxury of absolute authenticity. Here, you are invited to slow down,
          connect with the essence of {brand.region}&apos;s mountain tradition, and create
          your own unforgettable stories.
        </p>
      </SplitSection>

      {/* past and present + gorkhali-2 */}
      <SplitSection
        image="/images/ashvara/about-culture.jpg"
        alt="Gorkha spirit portrait"
        imageFirst={false}
      >
        <h2>
          Where past and present meet,
          <br />
          tradition evolves into experience.
        </h2>
        <p>
          The legacy of the Gorkhas is one of legendary courage, unwavering honor, and a
          timeless commitment to duty. Guided by the strength of the khukuri and a quiet,
          steadfast resilience, these guardians of history established a standard of
          loyalty and protection that resonates across generations.
        </p>
        <p>
          At {brand.name}, we honor this spirit through an absolute dedication to our guests.
          Our service is built on the same principles of integrity, meticulous care, and
          deep-seated respect. Here, tradition is not merely remembered, it is an active
          promise of comfort and warmth that stays with you long after you depart.
        </p>
      </SplitSection>

      <section className="about-close-exact">
        <Reveal>
          <p>
            This is where ancient spirit meets modern elegance.
            <br />
            This is where you don&apos;t just visit — you feel.
          </p>
        </Reveal>
      </section>

      <section className="about-cta-exact">
        <Reveal className="about-cta-exact__inner">
          <h2>
            See how we can help your hotel grow.
            <br />
            Get in touch today.
          </h2>
          <Button href={`mailto:${brand.email}`} variant="outline-gold">
            Contact Us
          </Button>
        </Reveal>
      </section>
    </div>
  );
}
