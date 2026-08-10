import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand } from "../data/brand";
import "./Testimonials.css";

const REVIEWS = [
  {
    name: "Aarpana Shrestha",
    date: "Sep 2025",
    quote: `A Himalayan retreat like no other. Standing on the private rooftop terrace looking out at the panoramic peaks of the Annapurna range was pure magic. The attention to detail and authentic warmth of ${brand.name} sets a new standard for luxury in the hills.`,
    image: "/images/ashvara/guests/g1.jpg",
  },
  {
    name: "James Okonkwo",
    date: "Feb 2026",
    quote: `From the quiet luxury of the rooms to the soulful hospitality, every moment felt intentional. ${brand.name} is where the mountains teach you how to slow down.`,
    image: "/images/ashvara/guests/g2.jpg",
  },
  {
    name: "Sofia Alvarez",
    date: "Jan 2026",
    quote: `The organic dining and spa rituals gave us the perfect sanctuary after days of exploring the hills. We left rested, inspired, and already planning our return to ${brand.region}.`,
    image: "/images/ashvara/guests/g3.jpg",
  },
  {
    name: "Arjun Mehta",
    date: "Dec 2025",
    quote: `Sunrise from the suite balcony stopped me mid-sentence. Service was graceful without ever feeling formal — exactly the kind of quiet luxury I travel for.`,
    image: "/images/ashvara/guests/g4.jpg",
  },
  {
    name: "Elena Petrova",
    date: "Nov 2025",
    quote: `Every corridor smells of cedar and mountain air. The wellness team crafted a ritual that melted weeks of city tension in a single afternoon at ${brand.name}.`,
    image: "/images/ashvara/guests/g5.jpg",
  },
];

const AUTO_MS = 7000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startRef = useRef(performance.now());
  const review = REVIEWS[index];

  function goTo(next: number) {
    setIndex((next + REVIEWS.length) % REVIEWS.length);
    setProgress(0);
    startRef.current = performance.now();
  }

  useEffect(() => {
    if (paused) return;
    startRef.current = performance.now() - progress * AUTO_MS;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / AUTO_MS);
      setProgress(t);
      if (t >= 1) {
        goTo(index + 1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused]);

  return (
    <section
      className="testimonials section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="testimonials__title">
        What Our Guests
        <br />
        Are Saying
      </h2>

      <div className="container testimonials__grid">
        <div className="testimonials__media">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={index}
              className="testimonials__frame"
              initial={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={review.image} alt={review.name} />
            </motion.div>
          </AnimatePresence>
          <div className="testimonials__media-glow" aria-hidden="true" />
        </div>

        <div className="testimonials__copy">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={`q-${index}`}
              className="testimonials__quote"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <span className="testimonials__mark" aria-hidden="true">
                “
              </span>
              {review.quote}
              <span className="testimonials__mark testimonials__mark--end" aria-hidden="true">
                ”
              </span>
            </motion.blockquote>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`m-${index}`}
              className="testimonials__meta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
            >
              <cite>{review.name}</cite>
              <span>{review.date}</span>
            </motion.div>
          </AnimatePresence>

          <div className="testimonials__thumbs" role="tablist" aria-label="Guest photos">
            {REVIEWS.map((item, i) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show review by ${item.name}`}
                className={`testimonials__thumb ${i === index ? "is-active" : ""}`}
                onClick={() => goTo(i)}
              >
                <img src={item.image} alt="" />
              </button>
            ))}
          </div>

          <div className="testimonials__nav">
            <div className="testimonials__progress-wrap">
              <span className="testimonials__count">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(REVIEWS.length).padStart(2, "0")}
              </span>
              <div className="testimonials__track" aria-hidden="true">
                <span
                  className="testimonials__fill"
                  style={{ transform: `scaleX(${Math.max(progress, 0.02)})` }}
                />
                <span className="testimonials__shine" style={{ left: `${progress * 100}%` }} />
              </div>
            </div>

            <div className="testimonials__arrows">
              <button type="button" onClick={() => goTo(index - 1)} aria-label="Previous review">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path
                    d="M15 5 L8 12 L15 19"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  />
                </svg>
              </button>
              <button type="button" onClick={() => goTo(index + 1)} aria-label="Next review">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path
                    d="M9 5 L16 12 L9 19"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
