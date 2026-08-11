import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../components/Button";
import { HeroPin } from "../components/HeroPin";
import { RoomShowcase } from "../components/RoomShowcase";
import { DiningReveal } from "../components/DiningReveal";
import { BelongReveal } from "../components/BelongReveal";
import { WelcomeStage } from "../components/WelcomeStage";
import { StillnessInteract } from "../components/StillnessInteract";
import { Moments } from "../components/Moments";
import { Testimonials } from "../components/Testimonials";
import { ScrollHint } from "../components/ScrollHint";
import { Reveal } from "../components/Reveal";
import { brand } from "../data/brand";
import "./Home.css";

const STATS = [
  { value: "40", unit: "Keys", label: "Luxurious Rooms & Private Villas" },
  { value: "10", unit: "Acres", label: "Pristine Himalayan Foothills Sanctuary" },
  { value: "03", unit: "Venues", label: "Bespoke Organic Fine Dining Realms" },
  { value: "360°", unit: "Views", label: "Panoramic Himalayan Mountain Vistas" },
];

export function Home() {
  const [hintHidden, setHintHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHintHidden(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t1 = window.setTimeout(refresh, 300);
    const t2 = window.setTimeout(refresh, 1200);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", refresh);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div className="home">
      <HeroPin />
      <ScrollHint hidden={hintHidden} />
      <BelongReveal />

      <section id="intro" className="home-intro section">
        <Reveal className="container home-intro__text">
          <p>
            Nestled in the heart of the mountains,{" "}
            <em>{brand.name} Hotel</em> is a modern retreat where adventure and luxury
            exist in perfect harmony. Inspired by{" "}
            <em>the spirit of exploration</em>, the hotel offers a seamless blend of sleek
            design, breathtaking <em>alpine landscapes</em>, and{" "}
            <em>world-class comfort</em>.
          </p>
        </Reveal>
      </section>

      <RoomShowcase />

      <WelcomeStage />

      <section className="home-stats section" aria-label="Hotel highlights">
        <div className="container home-stats__grid">
          {STATS.map((stat, i) => (
            <motion.article
              key={stat.label}
              className="home-stats__card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] }}
            >
              <p className="home-stats__value">
                <span>{stat.value}</span>
                <span className="home-stats__unit">{stat.unit}</span>
              </p>
              <p className="home-stats__label">{stat.label}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <StillnessInteract />

      <DiningReveal />
      <Moments />
      <Testimonials />

      <section id="contact" className="home-cta section">
        <Reveal className="container home-cta__inner">
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
