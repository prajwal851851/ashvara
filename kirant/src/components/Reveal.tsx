import { motion, useInView, type MotionProps } from "framer-motion";
import { useRef, type ReactNode } from "react";
import "./Reveal.css";

const ease = [0.25, 1, 0.5, 1] as const;

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
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.8, delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Clip-path reveal that observes an unclipped wrapper.
 * Observing the clipped node itself never fires (intersection stays 0).
 */
export function ClipReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.15,
    margin: "0px 0px -6% 0px",
  });

  return (
    <div ref={ref} className={`clip-reveal ${className ?? ""}`.trim()}>
      <motion.div
        className="clip-reveal__inner"
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={
          isInView
            ? { clipPath: "inset(0% 0 0 0)" }
            : { clipPath: "inset(100% 0 0 0)" }
        }
        transition={{ duration: 1.05, ease }}
      >
        {children}
      </motion.div>
    </div>
  );
}
