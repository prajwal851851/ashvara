import { motion, useInView, type MotionProps } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import "./Reveal.css";

const ease = [0.25, 1, 0.5, 1] as const;

function useIsCoarseMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px), (hover: none) and (pointer: coarse)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return mobile;
}

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
} & MotionProps;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  ...rest
}: Props) {
  const mobile = useIsCoarseMobile();
  return (
    <motion.div
      className={className}
      initial={mobile ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: mobile ? 0.05 : 0.25, margin: "0px 0px -5% 0px" }}
      transition={{ duration: mobile ? 0.45 : 0.8, delay: mobile ? 0 : delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Clip-path reveal that observes an unclipped wrapper.
 * On mobile, skip the clip (Safari + Lenis often leave images stuck hidden).
 */
export function ClipReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mobile = useIsCoarseMobile();
  const isInView = useInView(ref, {
    once: true,
    amount: mobile ? 0.05 : 0.15,
    margin: "0px 0px -4% 0px",
  });

  return (
    <div ref={ref} className={`clip-reveal ${className ?? ""}`.trim()}>
      <motion.div
        className="clip-reveal__inner"
        initial={
          mobile
            ? { clipPath: "inset(0% 0 0 0)", opacity: 1 }
            : { clipPath: "inset(100% 0 0 0)" }
        }
        animate={
          mobile || isInView
            ? { clipPath: "inset(0% 0 0 0)", opacity: 1 }
            : { clipPath: "inset(100% 0 0 0)" }
        }
        transition={{ duration: mobile ? 0.35 : 1.05, ease }}
      >
        {children}
      </motion.div>
    </div>
  );
}
