"use client";

import Image from "next/image";
import { AnimatedWrapper } from "./AnimatedWrapper";

const DownloadSection = () => {
  return (
    <section className="download-section py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <AnimatedWrapper animation="slideIn">
            <div className="download-content md:w-1/2">
              <h2 className="text-4xl font-bold mb-6">Download Now</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of players worldwide and experience the
                excitement of Tambola.
              </p>
              <div className="flex space-x-4">
                <a href="https://apps.apple.com/us/app/tibetan-calendar-app/id6741181925?platform=iphone">
                  <Image
                    src="https://img.icons8.com/color/48/apple-app-store--v3.png"
                    alt="App Store"
                    width={60}
                    height={15}
                    className="cursor-pointer hover:scale-105 transition-transform"
                  />
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.kharagedition.tambola&hl=en">
                  <Image
                    src="https://img.icons8.com/color/48/google-play.png"
                    alt="Play Store"
                    width={60}
                    height={15}
                    className="cursor-pointer hover:scale-105 transition-transform"
                  />
                </a>
              </div>
            </div>
          </AnimatedWrapper>
          <AnimatedWrapper animation="fadeIn" delay={0.3}>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <Image
                src="https://play-lh.googleusercontent.com/RMkMBfhMMcEke-v8feMhwrGzmD8PpiLbcjv62UYLrfclBknz9NzznkuJucyt_aH1H54=w832-h470-rw"
                alt="App Preview"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </AnimatedWrapper>
        </div>
      </div>
    </section>
  );
};
export default DownloadSection;
