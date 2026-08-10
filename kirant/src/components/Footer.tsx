import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand } from "../data/brand";
import "./Footer.css";

type Props = {
  variant?: "gold" | "water" | "solid";
};

const VIDEO: Record<NonNullable<Props["variant"]>, string> = {
  gold: "/videos/golden.mp4",
  water: "/videos/water-3.mp4",
  solid: "/videos/fire.mp4",
};

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/history", label: "History" },
  { to: "/rooms", label: "Rooms & Suites" },
  { to: "/wellness", label: "Wellness & Spa" },
  { to: "/dining", label: "Dining" },
  { to: "/gallery", label: "Gallery" },
];

/**
 * Reveal footer that always fits in one viewport so nothing is clipped.
 * Fixed behind main; spacer unlocks the unveil on scroll.
 */
export function Footer({ variant = "gold" }: Props) {
  const { pathname } = useLocation();
  const footerRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState(0);
  const hidden = pathname === "/gallery";

  useEffect(() => {
    if (hidden) {
      setHeight(0);
      document.documentElement.classList.remove("footer-revealed");
      return;
    }

    const el = footerRef.current;
    if (!el) return;

    const measure = () => {
      // Footer is forced to one viewport tall — spacer matches that
      const next = Math.round(window.innerHeight);
      setHeight((h) => (Math.abs(h - next) > 2 ? next : h));
    };

    measure();
    window.addEventListener("resize", measure);

    const videos = el.querySelectorAll("video");
    videos.forEach((v) => {
      void v.play().catch(() => {});
    });

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const nearEnd = max > 0 && window.scrollY >= max - 24;
      doc.classList.toggle("footer-revealed", nearEnd);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const t = window.setTimeout(() => {
      measure();
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("footer-revealed");
      window.clearTimeout(t);
    };
  }, [pathname, variant, hidden]);

  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => window.clearTimeout(t);
  }, [height]);

  if (hidden) return null;

  return (
    <>
      <div
        className="site-footer-spacer"
        style={{ height: height || "100vh" }}
        aria-hidden="true"
      />
      <footer
        ref={footerRef}
        id="footer"
        className={`site-footer site-footer--reveal site-footer--${variant}`}
      >
        <div className="site-footer__inner">
          <div className="site-footer__grid">
            <div className="site-footer__cta">
              <h2>
                See how we can help your hotel grow.
                <br />
                Get in touch today.
              </h2>
              <Link to="/#contact" className="site-footer__contact-btn">
                <span>Contact Us</span>
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path
                    d="M7 17L17 7M17 7H9M17 7v8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </Link>
            </div>

            <nav className="site-footer__nav" aria-label="Footer">
              {NAV.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="site-footer__connect">
              <span className="site-footer__heading">Connect</span>
              <p>{brand.location}</p>
              <p>
                <a href={`mailto:${brand.email}`}>{brand.email}</a>
              </p>
              <p>
                <a href={brand.phoneHref}>{brand.phone}</a>
              </p>
            </div>
          </div>

          <div className="site-footer__legal">
            <p>
              © {brand.copyrightYear} <span>{brand.name}.</span> All rights reserved.
            </p>
          </div>
        </div>

        <div className="site-footer__marque" aria-hidden="true">
          <video
            key={variant}
            className="site-footer__marque-video"
            src={VIDEO[variant]}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="site-footer__marque-mask">
            <span className="site-footer__marque-word">{brand.nameUpper}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
