"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  animation: "fadeUp" | "fadeIn" | "slideIn" | "scale";
  delay?: number;
}

export const AnimatedWrapper = ({
  children,
  animation,
  delay = 0,
}: AnimatedWrapperProps) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;

    const animations = {
      fadeUp: {
        y: 50,
        opacity: 0,
        duration: 1,
        delay,
      },
      fadeIn: {
        opacity: 0,
        duration: 1,
        delay,
      },
      slideIn: {
        x: -50,
        opacity: 0,
        duration: 1,
        delay,
      },
      scale: {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        delay,
      },
    };

    gsap.from(element, animations[animation]);
  }, [animation, delay]);

  return <div ref={elementRef}>{children}</div>;
};
