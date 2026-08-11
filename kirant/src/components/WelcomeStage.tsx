import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "./Button";
import { brand } from "../data/brand";
import "./WelcomeStage.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cinematic welcome chapter: one full-bleed plate,
 * typography rides over it — no second stacked image.
 */
export function WelcomeStage() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const copy = section.querySelector<HTMLElement>(".welcome-stage__copy");
      const bgImg = section.querySelector<HTMLElement>(".welcome-stage__bg img");
      if (!copy || !bgImg) return;

      gsap.fromTo(
        bgImg,
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        copy,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: copy,
            start: "top 82%",
            end: "top 50%",
            scrub: 0.85,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="welcome"
      className="welcome-stage"
      aria-label="A legendary welcome"
    >
      <div className="welcome-stage__bg" aria-hidden="true">
        <img
          src="/images/ashvara/welcome-legendary.jpg"
          alt=""
          draggable={false}
        />
        <div className="welcome-stage__veil" />
      </div>

      <div className="welcome-stage__content">
        <div className="welcome-stage__copy">
          <p className="welcome-stage__eyebrow">Arrival</p>
          <h2>
            A Legendary Welcome
            <br />
            Every Time
          </h2>
          <p>
            Welcome to {brand.name} Hotel, where creativity meets functionality to craft
            spaces that inspire. With a passion for design and a commitment to excellence,
            we transform ordinary spaces into extraordinary experiences.
          </p>
          <p>
            From our architectural spaces that honor local craft to our meticulously
            designed culinary and wellness journeys, we invite you to immerse yourself in a
            legacy of warmth and unforgettable elegance.
          </p>
          <Button to="/about" variant="filled-strong">
            About Us
          </Button>
        </div>
      </div>
    </section>
  );
}
