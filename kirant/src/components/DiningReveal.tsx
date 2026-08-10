import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./DiningReveal.css";

gsap.registerPlugin(ScrollTrigger);

export function DiningReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const imageWrap = imageWrapRef.current;
      const line1 = line1Ref.current;
      const line2 = line2Ref.current;
      if (!section || !imageWrap || !line1 || !line2) return;

      gsap.set(imageWrap, { scale: 0 });
      gsap.set([line1, line2], { yPercent: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(line1, { yPercent: -120, ease: "power2.inOut" }, 0)
        .to(line2, { yPercent: 120, ease: "power2.inOut" }, 0)
        .to(imageWrap, { scale: 1, ease: "power2.inOut" }, 0.08);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="dining-reveal" aria-label="Exquisite Dining">
      <div className="dining-reveal__media">
        <div ref={imageWrapRef} className="dining-reveal__image-wrap">
          <img
            src="/images/ashvara/dining.jpg"
            alt="Exquisite Dining"
            draggable={false}
          />
        </div>
      </div>
      <div className="dining-reveal__copy">
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
      <h2 className="sr-only">Exquisite Dining</h2>
    </section>
  );
}
