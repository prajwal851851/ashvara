import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Preloader } from "./Preloader";
import { LenisProvider, useLenis } from "../hooks/useLenis";

const FOOTER_VARIANT: Record<string, "gold" | "water" | "solid"> = {
  "/": "gold",
  "/rooms": "gold",
  "/dining": "gold",
  "/about": "gold",
  "/history": "solid",
  "/wellness": "water",
  "/gallery": "gold",
};

function Shell() {
  const { pathname } = useLocation();
  const { lenis } = useLenis();
  // Preloader only on first home paint / hard refresh — not on client route changes
  const [introDone, setIntroDone] = useState(() => pathname !== "/");

  useEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => window.clearTimeout(t);
  }, [pathname, lenis]);

  useEffect(() => {
    if (!introDone) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
      window.setTimeout(() => ScrollTrigger.refresh(), 100);
    }
  }, [introDone, lenis]);

  return (
    <>
      {pathname === "/" && !introDone ? (
        <Preloader
          onComplete={() => {
            setIntroDone(true);
          }}
        />
      ) : null}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className={introDone || pathname !== "/" ? "is-ready" : "is-booting"}>
        <Outlet />
      </main>
      <Footer variant={FOOTER_VARIANT[pathname] ?? "gold"} />
    </>
  );
}

export function Layout() {
  return (
    <LenisProvider>
      <Shell />
    </LenisProvider>
  );
}
