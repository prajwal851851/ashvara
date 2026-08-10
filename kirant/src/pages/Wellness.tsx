import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "../components/Button";
import { Reveal, ClipReveal } from "../components/Reveal";
import { brand } from "../data/brand";
import "./Wellness.css";

function ParallaxImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div ref={ref} className="wellness-parallax">
      {reduceMotion ? (
        <div className="wellness-parallax__inner wellness-parallax__inner--static">
          <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} />
        </div>
      ) : (
        <motion.div style={{ y }} className="wellness-parallax__inner">
          <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} />
        </motion.div>
      )}
    </div>
  );
}

function SpacesMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [loopWidth, setLoopWidth] = useState(0);

  const images = [
    "/images/wellness/wellness-1.webp",
    "/images/wellness/wellness-2.webp",
    "/images/wellness/wellness-3.webp",
    "/images/wellness/wellness-4.webp",
    "/images/wellness/wellness-image-16.webp",
    "/images/wellness/wellness-image-12.webp",
    "/images/wellness/spa-room-2.webp",
    "/images/wellness/wellness-image-15.webp",
  ];
  const loop = [...images, ...images, ...images];

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const width = trackRef.current.scrollWidth / 3;
      setLoopWidth(width);
      x.set(-width);
    };
    measure();
    const t = window.setTimeout(measure, 200);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [x]);

  useEffect(() => {
    if (!loopWidth) return;
    return x.on("change", (value) => {
      if (value > -loopWidth) x.set(value - loopWidth);
      else if (value < -2 * loopWidth) x.set(value + loopWidth);
    });
  }, [loopWidth, x]);

  useAnimationFrame((_, delta) => {
    if (!loopWidth) return;
    x.set(x.get() - delta * 0.045);
  });

  return (
    <section className="section wellness-spaces">
      <Reveal>
        <h2 className="wellness-spaces__title">Wellness Spaces</h2>
      </Reveal>
      <div className="wellness-spaces__viewport">
        <motion.div ref={trackRef} className="wellness-spaces__track" style={{ x }}>
          {loop.map((src, i) => (
            <figure key={`${src}-${i}`} className="wellness-spaces__item">
              <img src={src} alt={`Wellness space ${(i % images.length) + 1}`} />
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const SPLITS = [
  {
    title: "History",
    subTitle: "A lineage of healing and harmony",
    description: [
      `The history of ${brand.name} Wellness is woven into the very fabric of the ${brand.region} mountains. Long before our sanctuary opened, these high ridges served as a natural retreat for travelers seeking solace and restoration in the pure mountain breeze and clear highland air.`,
      "Drawing inspiration from centuries-old Nepalese herbal remedies and Himalayan mindfulness practices, we created a refuge that honors these timeless traditions. Over decades, our master practitioners have refined these local secrets, blending them with modern wellness to create body therapies and deep holistic rituals.",
      `Conceived as a tribute to the elements of nature, ${brand.name} is a space where time stops and the body, mind, and soul rediscover their natural balance. If you were waiting for a sign to take a moment just for yourself, this is it.`,
    ],
    image: "/images/wellness/wellness-image-10.webp",
    buttonLabel: "The History",
    buttonLink: "/about",
  },
  {
    title: "Wellbeing",
    subTitle: "Where calm and beauty form balance",
    description: [
      `At ${brand.name}, our private wellness treatment rooms are carefully positioned to capture the tranquil energy of ${brand.location}. Surrounded by lush hills and pristine forests, these spaces serve as a personal sanctuary of silence and organic beauty, inviting you to disconnect from the noise of the world.`,
      "Our therapies are deeply rooted in the healing wisdom of the Himalayas. By incorporating local medicinal herbs, hot stone rituals, and sound bath sessions with traditional Nepalese singing bowls, we offer a personalized journey that heals the body and clears the mind.",
    ],
    image: "/images/wellness/wellness-image-14.webp",
  },
];

export function Wellness() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  /** Skip walking/branding intro on the original wellness reel */
  const INTRO_SKIP_SEC = 7.5;

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    const jumpIntro = () => {
      if (video.currentTime < INTRO_SKIP_SEC) {
        video.currentTime = INTRO_SKIP_SEC;
      }
    };

    const onLoaded = () => {
      jumpIntro();
      void video.play().catch(() => {});
    };

    const onTimeUpdate = () => {
      // After natural loop reset to 0, skip branding again
      if (video.currentTime > 0 && video.currentTime < INTRO_SKIP_SEC - 0.35) {
        video.currentTime = INTRO_SKIP_SEC;
      }
    };

    const onEnded = () => {
      video.currentTime = INTRO_SKIP_SEC;
      void video.play().catch(() => {});
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    if (video.readyState >= 1) onLoaded();

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <div className="wellness-page">
      <section className="wellness-hero" aria-label="Spa treatment">
        <video
          ref={heroVideoRef}
          src="/videos/wellness-video-1.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
        />
        <motion.a
          href="#history"
          className="wellness-hero__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Scroll Down
        </motion.a>
      </section>

      {SPLITS.map((block, index) => {
        const textFirst = index % 2 === 0;
        return (
          <section
            key={block.title}
            id={index === 0 ? "history" : undefined}
            className="wellness-split"
          >
            <div className={`wellness-split__copy ${textFirst ? "is-first" : "is-second"}`}>
              <Reveal>
                <h2>{block.title}</h2>
                <p className="wellness-split__sub">{block.subTitle}</p>
                <div className="wellness-split__body">
                  {block.description.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
                {block.buttonLabel && block.buttonLink ? (
                  <Button
                    to={block.buttonLink}
                    variant="outline"
                    className="wellness-split__btn"
                  >
                    {block.buttonLabel}
                  </Button>
                ) : null}
              </Reveal>
            </div>
            <div className={textFirst ? "is-second" : "is-first"}>
              <ParallaxImage src={block.image} alt={block.title} priority={index === 0} />
            </div>
          </section>
        );
      })}

      <section className="section wellness-calm">
        <div className="container--wide wellness-calm__layout">
          <div className="wellness-calm__left">
            <Reveal className="wellness-calm__lead">
              <p>Let yourself be</p>
              <p>carried away by</p>
              <h2>The Calm</h2>
            </Reveal>
            <ClipReveal>
              <img
                src="/images/wellness/wellness-image-13.webp"
                alt={`Cold water therapy bucket shower at ${brand.name}`}
              />
            </ClipReveal>
          </div>

          <ClipReveal className="wellness-calm__center">
            <img
              src="/images/wellness/wellness-image-9.webp"
              alt={`Facial skincare massage treatment at ${brand.name} Spa`}
            />
          </ClipReveal>

          <div className="wellness-calm__right">
            <ClipReveal>
              <img
                src="/images/wellness/wellness-image-15.webp"
                alt="Luxury shower head water streams"
              />
            </ClipReveal>
            <Reveal className="wellness-calm__copy" delay={0.1}>
              <h3>Nourish your natural radiance</h3>
              <p>
                Our signature beauty rituals combine organic mountain botanicals with
                rejuvenating therapies to restore your skin&apos;s youthful glow. From
                moisturizing facial wraps infused with wild Nepalese honey and local herbs,
                to antioxidant rich scrubs, every treatment is tailored to pamper your
                senses and revitalize your cells in the pure Himalayan air.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section wellness-water">
        <video src="/videos/water-3.mp4" autoPlay muted loop playsInline />
        <Reveal>
          <p>Immerse yourself in stillness shaped by mountain water and light.</p>
        </Reveal>
      </section>

      <SpacesMarquee />
    </div>
  );
}
