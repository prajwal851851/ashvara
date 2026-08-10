import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AudioToggle } from "./AudioToggle";
import { brand } from "../data/brand";
import "./Header.css";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/history", label: "History" },
  { to: "/rooms", label: "Rooms & Suites" },
  { to: "/wellness", label: "Wellness & Spa" },
  { to: "/dining", label: "Dining" },
  { to: "/gallery", label: "Gallery" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const menuId = useId();
  const { pathname } = useLocation();
  const light = pathname === "/wellness";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.classList.toggle("nav-open", open);
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("nav-open");
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let timer: number | undefined;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastY.current && y > 120 && !open) setHidden(true);
      else setHidden(false);
      lastY.current = y;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setHidden(false), 1200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [open]);

  return (
    <>
      <header
        className={`site-header ${scrolled ? "is-scrolled" : ""} ${light ? "is-light" : ""} ${hidden && !open ? "is-hidden" : ""} ${open ? "is-menu-open" : ""}`}
      >
        <div className="site-header__inner">
          <div className="site-header__audio">
            <AudioToggle imgClassName={light && scrolled && !open ? "" : "is-invert"} />
          </div>

          <Link to="/" className="site-header__logo" aria-label={`${brand.name} home`}>
            <svg viewBox="0 0 40 48" width="28" height="34" aria-hidden="true">
              <path
                d="M20 2 L34 10 V30 L20 46 L6 30 V10 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M14 16 V32 M18 16 V32 M22 16 V32 M26 16 V32"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </Link>

          <button
            type="button"
            className={`site-header__menu-btn ${open ? "is-open" : ""}`}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`site-nav-veil ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      />

      <nav
        id={menuId}
        className={`site-nav ${open ? "is-open" : ""}`}
        aria-label="Primary"
        hidden={!open}
      >
        <div className="site-nav__ornament" aria-hidden="true">
          <span />
          <em>{brand.nameUpper}</em>
          <span />
        </div>

        <ul className="site-nav__list">
          {NAV.map((item, i) => (
            <li
              key={item.to}
              style={{ "--i": i } as CSSProperties}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "site-nav__link is-active" : "site-nav__link"
                }
                onClick={() => setOpen(false)}
              >
                <span className="site-nav__index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="site-nav__label">{item.label}</span>
                <span className="site-nav__line" aria-hidden="true" />
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="site-nav__footer">
          <p>{brand.location}</p>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </div>
      </nav>

      {open ? (
        <button
          type="button"
          className="site-nav__backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
