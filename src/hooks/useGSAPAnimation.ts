"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export const useGSAPAnimation = () => {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero section parallax
    gsap.to(".hero-bg", {
      yPercent: 50,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Feature cards floating animation
    gsap.to(".feature-card", {
      y: 20,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
      stagger: 0.2,
    });

    // Download section slide-in
    gsap.from(".download-content", {
      x: -100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".download-section",
        start: "top center",
        end: "bottom center",
      },
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
};
