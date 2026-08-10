import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { brand } from "../data/brand";
import "./HeroPin.css";

gsap.registerPlugin(ScrollTrigger);

export function HeroPin() {
  const sectionRef = useRef<HTMLElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const front = frontRef.current;
      const back = backRef.current;
      if (!section || !front || !back) return;

      gsap.set(front, { scale: 1, transformOrigin: "50% 70%" });
      gsap.set(back, { yPercent: 100 });

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
        },
      });

      tl.to(
        front,
        {
          scale: 1.65,
          transformOrigin: "50% 70%",
          ease: "none",
        },
        0
      ).to(
        back,
        {
          yPercent: 0,
          ease: "none",
        },
        0.12
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="hero-pin" aria-label="Hotel arrival">
      <div ref={frontRef} className="hero-pin__layer">
        <img
          src="/images/ashvara/hero-second.png"
          alt={`${brand.name} grand courtyard at twilight`}
          draggable={false}
        />
        <div className="hero-pin__shade" />
        <div className="hero-pin__brand">
          <p className="hero-pin__welcome">Welcome to</p>
          <h1 className="hero-pin__name">{brand.nameUpper}</h1>
        </div>
      </div>
      <div ref={backRef} className="hero-pin__layer hero-pin__layer--second">
        <img
          src="/images/ashvara/hero-reception.jpg"
          alt={`${brand.name} hotel arrival`}
          draggable={false}
        />
      </div>
      <a href="#intro" className="hero-pin__scroll">
        Scroll Down
      </a>
    </section>
  );
}
