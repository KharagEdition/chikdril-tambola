"use client";

import Image from "next/image";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";
import { AnimatedWrapper } from "./AnimatedWrapper";
import AppStoreButton from "./AppStoreButton";

const HeroSection = () => {
  useGSAPAnimation();

  return (
    <section className="hero-section min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="hero-bg absolute w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/50 to-black/50 z-10" />
        <Image
          src="/images/tambola-bg.jpg"
          alt="Tambola Background"
          fill
          className="object-cover"
        />
      </div>
      <div className="container mx-auto px-6 relative z-20">
        <AnimatedWrapper animation="fadeUp">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 heading-gradient">
              Play Tambola
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Experience the thrill of Indias favorite social game
            </p>
            <div className="flex justify-center space-x-4">
              <AnimatedWrapper animation="slideIn" delay={0.2}>
                <AppStoreButton
                  platform="ios"
                  imageUrl="https://img.icons8.com/color/48/apple-app-store--v3.png"
                  routeUrl="https://apps.apple.com/us/app/tibetan-calendar-app/id6741181925?platform=iphone"
                />
              </AnimatedWrapper>
              <AnimatedWrapper animation="slideIn" delay={0.4}>
                <AppStoreButton
                  platform="android"
                  imageUrl="https://img.icons8.com/color/48/google-play.png"
                  routeUrl="https://play.google.com/store/apps/details?id=com.kharagedition.tambola&hl=en"
                />
              </AnimatedWrapper>
            </div>
          </div>
        </AnimatedWrapper>
      </div>
    </section>
  );
};

export default HeroSection;
