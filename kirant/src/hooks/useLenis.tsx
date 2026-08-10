import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type LenisContextValue = {
  lenis: Lenis | null;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: Record<string, unknown>
  ) => void;
};

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export function useLenis() {
  return useContext(LenisContext);
}

type Props = {
  children: ReactNode;
};

export function LenisProvider({ children }: Props) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    const setVh = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };
    setVh();
    window.addEventListener("resize", setVh);

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      orientation: "vertical",
      gestureOrientation: "vertical",
      lerp: 0.07,
      wheelMultiplier: 1.4,
      touchMultiplier: 2,
      infinite: false,
    });

    instance.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    lenisRef.current = instance;
    setLenis(instance);

    const ro = new ResizeObserver(() => {
      instance.resize();
      if (window.innerWidth > 1024) ScrollTrigger.refresh();
    });
    ro.observe(document.body);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("load", onLoad);
      ro.disconnect();
      gsap.ticker.remove(onTick);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  const value = useMemo(
    () => ({
      lenis,
      scrollTo: (
        target: number | string | HTMLElement,
        options?: Record<string, unknown>
      ) => {
        lenisRef.current?.scrollTo(target, options);
      },
    }),
    [lenis]
  );

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}
