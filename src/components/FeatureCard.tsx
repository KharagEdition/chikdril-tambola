"use client";

import Image from "next/image";
import { AnimatedWrapper } from "./AnimatedWrapper";

interface FeatureCardProps {
  imageUrl: string;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({
  imageUrl,
  title,
  description,
  delay,
}: FeatureCardProps) => {
  return (
    <AnimatedWrapper animation="scale" delay={delay / 1000}>
      <div className="feature-card bg-white/10 p-8 rounded-2xl backdrop-blur-lg">
        <Image
          src={imageUrl}
          alt={title}
          width={64}
          height={64}
          className="mb-4"
        />
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </AnimatedWrapper>
  );
};

export default FeatureCard;
