import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./Button";
import "./RoomShowcase.css";

const ROOMS = [
  { title: "Double Room", image: "/images/ashvara/rooms/double.jpg" },
  { title: "Twin Room", image: "/images/ashvara/rooms/twin.jpg" },
  { title: "Single Room", image: "/images/ashvara/rooms/single.jpg" },
  { title: "King Queen Room", image: "/images/ashvara/rooms/king.jpg" },
  { title: "Double Bedroom Suite", image: "/images/ashvara/rooms/suite.jpg" },
  {
    title: "Double Bedroom Rooftop Suite",
    image: "/images/ashvara/rooms/rooftop.jpg",
  },
];

export function RoomShowcase() {
  const [index, setIndex] = useState(0);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const animating = useRef(false);

  useEffect(() => {
    slidesRef.current.forEach((slide, i) => {
      if (!slide) return;
      if (i === 0) {
        gsap.set(slide, {
          visibility: "visible",
          zIndex: 5,
          clipPath: "inset(0% 0% 0% 0%)",
        });
      } else {
        gsap.set(slide, {
          visibility: "hidden",
          zIndex: 1,
          clipPath: "inset(100% 0% 0% 0%)",
        });
      }
    });
  }, []);

  function goTo(next: number, direction: 1 | -1) {
    if (animating.current) return;
    const current = index;
    if (next === current) return;

    const from = slidesRef.current[current];
    const to = slidesRef.current[next];
    if (!from || !to) return;

    animating.current = true;

    gsap.set(to, {
      zIndex: 10,
      visibility: "visible",
      clipPath:
        direction > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
    });
    gsap.set(from, { zIndex: 5 });

    const img = to.querySelector("img");
    if (img) {
      gsap.set(img, { scale: 1.1 });
      gsap.to(img, { scale: 1, duration: 1.2, ease: "power3.inOut" });
    }

    gsap.to(to, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(from, { visibility: "hidden", zIndex: 1 });
        gsap.set(to, { zIndex: 5 });
        setIndex(next);
        animating.current = false;
      },
    });
  }

  const prev = () => goTo((index - 1 + ROOMS.length) % ROOMS.length, -1);
  const next = () => goTo((index + 1) % ROOMS.length, 1);
  const room = ROOMS[index];

  return (
    <section className="room-showcase" aria-label="Featured rooms">
      {ROOMS.map((item, i) => (
        <div
          key={item.title}
          ref={(el) => {
            slidesRef.current[i] = el;
          }}
          className="room-showcase__slide"
        >
          <img
            src={item.image}
            alt={item.title}
            draggable={false}
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="room-showcase__shade" />
        </div>
      ))}

      <div className="room-showcase__card">
        <AnimatePresence mode="wait">
          <motion.h3
            key={room.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {room.title}
          </motion.h3>
        </AnimatePresence>

        <div className="room-showcase__bar">
          <div className="room-showcase__nav">
            <button type="button" aria-label="Previous room" onClick={prev}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button type="button" aria-label="Next room" onClick={next}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <div className="room-showcase__dots" aria-hidden="true">
              {ROOMS.map((item, i) => (
                <span
                  key={item.title}
                  className={i === index ? "is-active" : undefined}
                />
              ))}
            </div>
          </div>
          <Button to="/rooms" variant="outline">
            Reserve Now
          </Button>
        </div>
      </div>

      <a href="#welcome" className="room-showcase__scroll">
        Scroll Down
      </a>
    </section>
  );
}
